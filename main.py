from fastapi import FastAPI, UploadFile, File, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
load_dotenv(override=True)
import pandas as pd
import io
import os
import json
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from agents import (
    mia_unified_agent,
    run_agent_task,
    data_architect_task,
    accountant_task,
    copywriter_task,
    support_agent_task,
    marketing_agent_task,
    logistics_agent_task,
    intent_classifier_task,
    parameter_extractor_task,
    general_advisor_task,
    document_specialist_task
)
from modules.creative import generate_marketing_asset
from modules.finance import create_invoice_pdf
from database import get_db, init_db
from models import Product, Store, Customer, Order, SupportTicket, Campaign, Shipment, KnowledgeBase, StoreSettings
from connectors.shopify import ShopifyConnector
from business_data import get_business_summary
from fastapi.responses import StreamingResponse, JSONResponse

load_dotenv()

# Explicitly load the .env from the project root
project_root = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI(title="Mia AI Core")

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"GLOBAL ERROR caught: {exc}")
    import traceback
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": str(type(exc))}
    )

# Initialize DB on startup
@app.on_event("startup")
def startup_event():
    init_db()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, restrict this.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Mia AI Agent is Online"}

@app.post("/mia/settings")
async def update_settings(settings: dict):
    for key, value in settings.items():
        os.environ[key] = value
    return {"status": "Settings updated"}

@app.post("/mia/ingest-csv")
async def ingest_csv(
    file: UploadFile = File(...), 
    type: str = "products", # "products", "orders", "customers"
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # 1. Read CSV
    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))
    
    # 2. Use Data Architect to map columns
    mapping_task = f"Map these CSV columns: {df.columns.tolist()} to Mia's '{type}' schema. Return only a JSON mapping like {{'csv_col': 'mia_col'}}."
    mapping_json = data_architect_task(mapping_task)
    
    try:
        # Clean the response if AI adds markdown backticks
        cleaned_json = mapping_json.strip().replace("```json", "").replace("```", "")
        mapping = json.loads(cleaned_json)
    except:
        return {"error": "AI could not map columns automatically. Please map manually."}

    # 3. Process records based on type
    count = 0
    for _, row in df.iterrows():
        try:
            if type == "products":
                product = Product(
                    user_id=user_id,
                    name=row.get(mapping.get('name', 'name')),
                    price=float(row.get(mapping.get('price', 'price'), 0)),
                    sku=str(row.get(mapping.get('sku', 'sku'))),
                    stock_quantity=float(row.get(mapping.get('stock', 'stock_quantity'), 0)),
                    platform="csv_import"
                )
                db.add(product)
            elif type == "customers":
                customer = Customer(
                    user_id=user_id,
                    email=row.get(mapping.get('email', 'email')),
                    name=row.get(mapping.get('name', 'name')),
                    phone=row.get(mapping.get('phone', 'phone')),
                    platform="csv_import"
                )
                db.add(customer)
            elif type == "orders":
                order = Order(
                    user_id=user_id,
                    external_id=str(row.get(mapping.get('order_id', 'id'))),
                    total_amount=float(row.get(mapping.get('total', 'total_amount'), 0)),
                    status=row.get(mapping.get('status', 'status'), 'completed'),
                    platform="csv_import"
                )
                db.add(order)
            count += 1
        except Exception as e:
            print(f"Error ingesting row: {e}")
            continue

    db.commit()
    return {"status": "success", "imported_count": count, "type": type}

from pydantic import BaseModel

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None

@app.post("/chat")
async def unified_chat(request: ChatRequest, db: Session = Depends(get_db)):
    print(f"\n--- NEW CHAT REQUEST (UNIFIED) ---")
    print(f"DEBUG: Received message: {request.message} from user: {request.user_id}")
    try:
        message = request.message
        user_id = request.user_id
        
        # 1. Get business context for Mia
        business_context = get_business_summary(db, user_id=user_id)
        # Force a print to the console so we can see the TRUTH
        print("\n" + "="*50)
        print("CRITICAL DEBUG: DATA INJECTED INTO AI")
        print(business_context)
        print("="*50 + "\n")
        
        # 2. Call the Unified Mia Agent (Function Calling)
        mia_response = mia_unified_agent(message, business_context)
        
        response_data = {
            "content": mia_response.get("content", ""),
            "steps": [],
            "intent": "general_query",
            "widget": None
        }

        # 3. Handle Tool Calls
        tool_name = mia_response.get("tool")
        tool_args = mia_response.get("args", {})

        if not tool_name:
            # Direct response from AI
            print(f"DEBUG: AI responded directly: {response_data['content'][:50]}...")
            return response_data

        # If a tool was called, handle the logic
        print(f"DEBUG: AI called tool: {tool_name} with args: {tool_args}")
        
        if tool_name == "create_document":
            # ... existing logic ...
            response_data["intent"] = "document_generation"
            response_data["steps"] = ["Analyzing requirements", "Drafting document structure", "Polishing final text"]
            doc_type = tool_args.get("doc_type", "policy")
            details = tool_args.get("details", message)
            
            doc_content = document_specialist_task(f"Create a {doc_type} with these details: {details}", business_context)
            response_data["content"] = f"I've drafted the {doc_type.replace('_', ' ')} for you. You can review it below."
            response_data["widget"] = {
                "type": "document",
                "title": doc_type.replace("_", " ").title(),
                "content": doc_content,
                "actions": ["download", "copy", "edit"]
            }

        elif tool_name == "import_products":
            # ... existing logic ...
            response_data["intent"] = "product_extraction"
            response_data["steps"] = ["Parsing text", "Extracting product details", "Saving to inventory"]
            product_text = tool_args.get("product_list_text", message)
            
            task = f"Extract products from: '{product_text}'. Return ONLY a JSON list of [{{'name': '...', 'price': 10.0, 'sku': '...'}}]."
            extracted_json = data_architect_task(task, business_context)
            try:
                # Clean and parse JSON
                cleaned_json = extracted_json.strip()
                if "```" in cleaned_json:
                    cleaned_json = cleaned_json.split("```")[1]
                    if cleaned_json.startswith("json"): cleaned_json = cleaned_json[4:]
                
                start = cleaned_json.find('[')
                end = cleaned_json.rfind(']') + 1
                if start != -1 and end != -1:
                    products = json.loads(cleaned_json[start:end])
                    for p_data in products:
                        product = Product(
                            user_id=user_id,
                            name=p_data.get('name'),
                            price=float(p_data.get('price', 0)),
                            sku=p_data.get('sku'),
                            platform="ai_extraction"
                        )
                        db.add(product)
                    db.commit()
                    response_data["content"] = f"Successfully imported {len(products)} products to your inventory."
                else:
                    response_data["content"] = "I couldn't find a valid product list to import. Could you provide the list more clearly?"
            except Exception as e:
                response_data["content"] = f"I found some products but had trouble saving them: {str(e)}"

        elif tool_name == "generate_brand_assets":
            response_data["intent"] = "brand_generation"
            b_name = tool_args.get("business_name", "your brand")
            niche = tool_args.get("niche", "ecommerce")
            brand_data = await brand_request(b_name, niche)
            response_data["content"] = brand_data["description"]

        elif tool_name == "setup_storefront":
            response_data["intent"] = "store_setup"
            response_data["steps"] = [
                "Analyzing niche and market trends",
                "Personalizing storefront architecture",
                "Generating brand-aligned copy",
                "Configuring dynamic product grid",
                "Finalizing storefront design"
            ]
            b_name = tool_args.get("business_name", "your store")
            niche = tool_args.get("niche", "ecommerce")
            
            setup_data = await setup_storefront(b_name, niche, user_id, db)
            if "error" in setup_data:
                response_data["content"] = f"I ran into an issue: {setup_data['error']}"
            else:
                response_data["content"] = f"I've successfully built your storefront for **{b_name}**! I've personalized the layout and copy to match your {niche} brand.\n\n" + \
                    f"You can preview your new store here: **[http://localhost:3000/store](http://localhost:3000/store)**\n\n" + \
                    "**Next Steps:**\n" + \
                    "1. **Add Products**: Your store is currently empty. You can give me a list of products to import, or I can help you create some.\n" + \
                    "2. **Branding**: We can further customize your colors and fonts to perfectly match your brand identity.\n\n" + \
                    "Would you like me to help you with the branding setup now?"
                
                response_data["widget"] = {
                    "type": "store_preview",
                    "url": "http://localhost:3000/store",
                    "storeName": b_name
                }

        elif tool_name == "customize_branding":
            response_data["intent"] = "branding_customization"
            response_data["steps"] = ["Updating color palette", "Configuring typography", "Refreshing storefront style", "Optimizing hero imagery"]
            
            primary_color = tool_args.get("primary_color")
            heading_font = tool_args.get("heading_font")
            body_font = tool_args.get("body_font")
            hero_image = tool_args.get("hero_image_url")
            
            settings = db.query(StoreSettings).filter(StoreSettings.user_id == user_id).first()
            if not settings:
                settings = StoreSettings(user_id=user_id)
                db.add(settings)
            
            if primary_color: settings.primary_color = primary_color
            if heading_font: settings.heading_font = heading_font
            if body_font: settings.body_font = body_font
            if hero_image: settings.hero_image = hero_image
            
            db.commit()
            
            response_data["content"] = "I've updated your store's branding! The new colors and fonts are now live on your storefront.\n\n" + \
                "Check out the changes here: **[http://localhost:3000/store](http://localhost:3000/store)**"
            
            response_data["widget"] = {
                "type": "store_preview",
                "url": "http://localhost:3000/store",
                "storeName": settings.store_name
            }
        
        else:
            # Fallback if AI calls an unknown tool or a tool we didn't explicitly handle here
            print(f"DEBUG: Fallback for unknown tool: {tool_name}")
            if response_data["content"]:
                return response_data
            else:
                response_data["content"] = "I understood your request but I'm having trouble executing that specific action right now. How else can I help?"

        return response_data

    except Exception as e:
        print(f"CRITICAL ERROR in /chat: {e}")
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/mia/generate-brand")
async def brand_request(business_name: str, niche: str):
    # Mia uses the creative module to build a starter pack
    # Removed logo and flier generation as per user request
    
    # Also generate a description using the Brand Designer agent
    # Updated to use the correct function signature (business_name, niche)
    brand_data_json = brand_designer_task(business_name, niche)
    try:
        cleaned_brand = brand_data_json.strip().replace("```json", "").replace("```", "")
        brand_data = json.loads(cleaned_brand)
        brand_description = brand_data.get("brandMantra", f"Elevating the {niche} experience.")
    except Exception:
        brand_description = f"Elevating the {niche} experience."
    
    return {
        "brand": business_name,
        "description": brand_description,
        "assets": []
    }

def brand_designer_task(business_name, niche):
    print(f"DEBUG: Executing brand_designer_task for '{business_name}' in '{niche}'")
    load_dotenv(override=True)
    api_key = os.getenv("GROQ_API_KEY")
    from langchain_groq import ChatGroq
    llm = ChatGroq(temperature=0.0, model_name="llama-3.3-70b-versatile", groq_api_key=api_key)
    
    prompt = f"""
    You are an expert E-commerce Brand Identity Designer.
    Analyze the business: '{business_name}' in the niche: '{niche}'.
    
    1. Map this niche to one of the Top 20 E-commerce Industries:
       - Fashion & Apparel (Black/White/Silver, Serif/Sans)
       - Health & Beauty (Soft Pink/Teal/White, Serif)
       - Electronics & Gadgets (Blue/Dark Gray, Sans)
       - Home & Decor (Beige/Sage Green/Terracotta, Geometric)
       - Jewelry & Luxury (Gold/Deep Purple/Cream, Serif)
       - Fitness & Sports Gear (Red/Neon Green/Black, Bold Sans)
       - Food & Beverage (Deep Red/Gold/Charcoal, Serif/Sans)
       - Pet Supplies (Orange/Sky Blue/Grass Green, Rounded Sans)
       - Toys & Games (Yellow/Bright Blue/Red, Playful Sans)
       - Baby & Kids (Pastel Blue/Pink/Mint, Soft Sans)
       - Automotive (Red/Silver/Black, Industrial Sans)
       - Books & Stationery (Deep Blue/Cream/Forest Green, Serif)
       - Outdoor & Adventure (Olive/Burnt Orange/Brown, Rugged Sans)
       - Footwear (Black/White/Electric Blue, Performance Sans)
       - Groceries (Bright Green/White/Yellow, Clean Sans)
       - Arts & Crafts (Purple/Yellow/Multi, Creative Sans)
       - Health Supplements (White/Medical Blue/Leaf Green, Clean Sans)
       - Office Supplies (Slate Blue/Gray/Navy, Professional Sans)
       - Musical Instruments (Wood/Amber/Black/Gold, Serif)
       - Cosmetics (Rose Gold/Black/Nude, Glamour Serif)

    2. Choose a primary brand color (Hex code) based on the industry color psychology above.
    3. Select a Heading Font and Body Font from this expanded curated list:
       - Elegant Serifs: 'Instrument Serif', 'Playfair Display', 'Lora', 'Libre Baskerville', 'Cormorant Garamond'
       - Modern Sans: 'Inter', 'Roboto', 'Poppins', 'Raleway', 'Work Sans'
       - Bold/Display: 'Bebas Neue', 'Oswald', 'Cinzel', 'Space Grotesk'
       - Friendly/Soft: 'Quicksand', 'Montserrat'
    4. Provide a 1-sentence brand mantra.

    Return the response ONLY as a JSON object with these keys:
    'industry', 'primaryColor', 'headingFont', 'bodyFont', 'brandMantra'
    """
    
    response = llm.invoke(prompt)
    return response.content

@app.post("/mia/setup-storefront")
async def setup_storefront(business_name: str, niche: str, user_id: Optional[str] = None, db: Session = Depends(get_db)):
    # 1. Industry Branding Phase - Mia maps niche to industry standards
    brand_json = brand_designer_task(business_name, niche)
    try:
        cleaned_brand = brand_json.strip().replace("```json", "").replace("```", "")
        brand_data = json.loads(cleaned_brand)
    except Exception:
        brand_data = {
            "industry": "General E-commerce",
            "primaryColor": "#000000",
            "headingFont": "Instrument Serif",
            "bodyFont": "Inter",
            "brandMantra": f"Elevating the {niche} experience."
        }

    # 2. Use AI Copywriter to generate copy based on industry standards
    task_desc = f"""Generate compelling storefront copy for a business named '{business_name}' in the '{niche}' niche.
    The industry vertical is '{brand_data.get('industry')}' and the brand mantra is '{brand_data.get('brandMantra')}'.
    
    I need:
    1. A hero title (maximum 10 words). Align the tone with the {brand_data.get('industry')} industry.
    2. A hero description (maximum 20 words).
    3. A footer description (maximum 30 words).
    
    Return the response as a JSON object with keys: 'heroTitle', 'heroDescription', 'footerDescription'."""

    ai_copy_json = copywriter_task(task_desc)
    try:
        cleaned_json = ai_copy_json.strip().replace("```json", "").replace("```", "")
        custom_copy = json.loads(cleaned_json)
    except Exception:
        custom_copy = {
            "heroTitle": f"Welcome to {business_name}",
            "heroDescription": f"Discover the best {niche} products curated just for you.",
            "footerDescription": f"{business_name} - Your trusted destination for quality {niche}."
        }

    # 3. Update the store settings in the database
    settings = db.query(StoreSettings).filter(StoreSettings.user_id == user_id).first()
    if not settings:
        settings = StoreSettings(user_id=user_id)
        db.add(settings)

    settings.store_name = business_name
    settings.store_domain = business_name.lower().replace(" ", "-")
    settings.niche = niche
    settings.hero_title = custom_copy.get("heroTitle")
    settings.hero_description = custom_copy.get("heroDescription")
    settings.footer_description = custom_copy.get("footerDescription")
    
    # Set AI-determined branding
    settings.primary_color = brand_data.get("primaryColor")
    settings.heading_font = brand_data.get("headingFont")
    settings.body_font = brand_data.get("bodyFont")
    
    # Auto-pick a high-quality background image based on niche
    settings.hero_image = f"https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=2000" if "skin" in niche.lower() else "https://images.unsplash.com/photo-1441986300917-64674bd600d8?q=80&w=2000"
    
    settings.onboarding_completed = True
    db.commit()

    return {
        "status": "Storefront setup complete",
        "industry": brand_data.get("industry"),
        "branding": {
            "primaryColor": settings.primary_color,
            "headingFont": settings.heading_font,
            "bodyFont": settings.body_font
        },
        "custom_copy": custom_copy,
        "note": f"Mia has designed {business_name} using {brand_data.get('industry')} industry standards for maximum conversion."
    }

@app.post("/mia/support/handle-complaint")
async def handle_complaint(customer_email: str, complaint: str, db: Session = Depends(get_db)):
    # 1. Fetch customer
    customer = db.query(Customer).filter(Customer.email == customer_email).first()
    if not customer:
        customer = Customer(email=customer_email)
        db.add(customer)
        db.flush()
    
    # 2. Support Agent analyzes and generates response
    task = f"Analyze this customer complaint: '{complaint}'. Generate a empathetic response and determine the sentiment (positive/neutral/negative)."
    ai_response_text = support_agent_task(task)
    
    # Simple sentiment extraction (AI usually follows instructions but let's be safe)
    sentiment = "neutral"
    if "negative" in ai_response_text.lower(): sentiment = "negative"
    elif "positive" in ai_response_text.lower(): sentiment = "positive"
    
    # 3. Log to DB
    ticket = SupportTicket(
        customer_id=customer.id,
        subject="Customer Complaint",
        content=complaint,
        sentiment=sentiment,
        ai_response=ai_response_text
    )
    db.add(ticket)
    db.commit()
    
    return {"response": ai_response_text, "sentiment": sentiment}

@app.post("/mia/marketing/upsell")
async def generate_upsell(customer_email: str, db: Session = Depends(get_db)):
    # 1. Get customer and order history
    customer = db.query(Customer).filter(Customer.email == customer_email).first()
    if not customer or not customer.orders:
        return {"error": "No order history found for this customer."}
    
    order_history = [f"{o.total_amount} on {o.created_at}" for o in customer.orders]
    
    # 2. Marketing Agent generates upsell offer
    task = f"Based on this customer's order history: {order_history}, generate a personalized upsell email offer."
    upsell_offer = marketing_agent_task(task)
    
    # 3. Log as a campaign
    campaign = Campaign(
        name=f"Upsell for {customer_email}",
        platform="email",
        status="active",
        ai_strategy=upsell_offer
    )
    db.add(campaign)
    db.commit()
    
    return {"upsell_email": upsell_offer}

@app.post("/mia/logistics/track")
async def track_shipment(order_id: str, db: Session = Depends(get_db)):
    order = db.query(Order).filter(Order.external_id == order_id).first()
    if not order:
        return {"error": "Order not found"}
    
    # 1. Logistics Agent "checks" status (mocked for now)
    task = f"Track shipment for order {order_id}. Current status is {order.status}."
    tracking_update = logistics_agent_task(task)
    
    # 2. Update Shipment table
    shipment = db.query(Shipment).filter(Shipment.order_id == order.id).first()
    if not shipment:
        shipment = Shipment(order_id=order.id, status="shipped", tracking_number="MIA-TRK-123")
        db.add(shipment)
    
    db.commit()
    return {"status": tracking_update}

@app.get("/mia/notifications")
async def get_notifications(db: Session = Depends(get_db)):
    notifications = []
    
    # 1. Check Low Stock
    low_stock_products = db.query(Product).filter(Product.stock_quantity < 10).all()
    for p in low_stock_products:
        notifications.append({
            "type": "low_stock",
            "message": f"Low stock alert: {p.name} has only {p.stock_quantity} left.",
            "severity": "high"
        })
        
    # 2. Check New Sales (last 24h)
    from datetime import datetime, timedelta
    yesterday = datetime.now() - timedelta(days=1)
    new_sales = db.query(Order).filter(Order.created_at >= yesterday).all()
    if new_sales:
        notifications.append({
            "type": "new_sales",
            "message": f"You've had {len(new_sales)} new sales in the last 24 hours!",
            "severity": "medium"
        })
        
    # 3. Check "Long Gone" Customers (no orders in 90 days)
    three_months_ago = datetime.now() - timedelta(days=90)
    churned_customers = db.query(Customer).filter(
        ~Customer.orders.any(Order.created_at >= three_months_ago)
    ).all()
    for c in churned_customers[:5]: # Limit to top 5
        notifications.append({
            "type": "churn_risk",
            "message": f"Customer {c.name or c.email} hasn't ordered in over 3 months.",
            "severity": "low"
        })
        
    return {"notifications": notifications}

@app.post("/mia/knowledge/add")
async def add_knowledge(title: str, content: str, category: str = "business_rule", db: Session = Depends(get_db)):
    kb = KnowledgeBase(title=title, content=content, category=category)
    db.add(kb)
    db.commit()
    return {"status": "Knowledge added to Mia's brain."}

@app.post("/mia/ask")
async def ask_mia(question: str, db: Session = Depends(get_db)):
    # 1. Fetch relevant knowledge from KB
    knowledge_entries = db.query(KnowledgeBase).all()
    kb_context = "\n".join([f"{k.title}: {k.content}" for k in knowledge_entries])
    
    # 2. Fetch Live Business Summary
    from business_data import get_business_summary
    live_summary = get_business_summary(db)
    
    # 3. Combine contexts
    full_context = f"{live_summary}\n\nKNOWLEDGE BASE CONTEXT:\n{kb_context}"
    
    # 4. Use Data Architect to answer
    task = f"Context: {full_context}\nQuestion: {question}\nAnswer the question based on the live business context and knowledge base provided."
    answer = data_architect_task(task)
    
    return {"answer": answer}

@app.post("/webhook/shopify")
async def shopify_webhook(request: Request):
    data = await request.json()
    # Placeholder for logic
    return {"status": "Mia is processing the order"}

@app.post("/connect/shopify")
async def connect_shopify(shop_url: str, access_token: str, db: Session = Depends(get_db)):
    # Save the store connection details using SQLAlchemy
    store = db.query(Store).filter(Store.store_url == shop_url).first()
    if not store:
        store = Store(
            name=shop_url.split('.')[0],
            platform="shopify",
            store_url=shop_url,
            access_token=access_token,
            is_active=True
        )
        db.add(store)
    else:
        store.access_token = access_token
        store.is_active = True
    
    db.commit()
    db.refresh(store)
    return {"status": "Store connected", "store_id": store.id}

# --- DASHBOARD API ENDPOINTS ---

@app.get("/api/products")
async def get_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all products with pagination"""
    products = db.query(Product).offset(skip).limit(limit).all()
    total = db.query(Product).count()
    return {
        "products": [{
            "id": p.id,
            "name": p.name,
            "sku": p.sku,
            "price": float(p.price) if p.price else 0,
            "stock_quantity": float(p.stock_quantity) if p.stock_quantity else 0,
            "description": p.description,
            "image_url": p.image_url,
            "platform": p.platform,
            "created_at": p.created_at.isoformat() if p.created_at else None
        } for p in products],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@app.get("/api/products/{product_id}")
async def get_product(product_id: str, db: Session = Depends(get_db)):
    """Get a specific product by ID"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return {
        "id": product.id,
        "name": product.name,
        "sku": product.sku,
        "price": float(product.price) if product.price else 0,
        "stock_quantity": float(product.stock_quantity) if product.stock_quantity else 0,
        "description": product.description,
        "image_url": product.image_url,
        "platform": product.platform,
        "created_at": product.created_at.isoformat() if product.created_at else None
    }

@app.post("/api/products")
async def create_product(product_data: dict, db: Session = Depends(get_db)):
    """Create a new product"""
    product = Product(
        name=product_data.get("name"),
        sku=product_data.get("sku"),
        price=float(product_data.get("price", 0)),
        stock_quantity=float(product_data.get("stock_quantity", 0)),
        description=product_data.get("description"),
        image_url=product_data.get("image_url"),
        platform=product_data.get("platform", "manual")
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return {
        "id": product.id,
        "name": product.name,
        "sku": product.sku,
        "price": float(product.price),
        "stock_quantity": float(product.stock_quantity),
        "description": product.description,
        "image_url": product.image_url,
        "platform": product.platform,
        "created_at": product.created_at.isoformat()
    }

@app.put("/api/products/{product_id}")
async def update_product(product_id: str, product_data: dict, db: Session = Depends(get_db)):
    """Update an existing product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    # Update fields if provided
    if "name" in product_data:
        product.name = product_data["name"]
    if "sku" in product_data:
        product.sku = product_data["sku"]
    if "price" in product_data:
        product.price = float(product_data["price"])
    if "stock_quantity" in product_data:
        product.stock_quantity = float(product_data["stock_quantity"])
    if "description" in product_data:
        product.description = product_data["description"]
    if "image_url" in product_data:
        product.image_url = product_data["image_url"]
    if "platform" in product_data:
        product.platform = product_data["platform"]
    
    db.commit()
    db.refresh(product)
    return {
        "id": product.id,
        "name": product.name,
        "sku": product.sku,
        "price": float(product.price),
        "stock_quantity": float(product.stock_quantity),
        "description": product.description,
        "image_url": product.image_url,
        "platform": product.platform,
        "created_at": product.created_at.isoformat()
    }

@app.delete("/api/products/{product_id}")
async def delete_product(product_id: str, db: Session = Depends(get_db)):
    """Delete a product"""
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    
    db.delete(product)
    db.commit()
    return {"message": "Product deleted successfully"}

@app.get("/api/orders")
async def get_orders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all orders with pagination"""
    orders = db.query(Order).offset(skip).limit(limit).all()
    total = db.query(Order).count()
    return {
        "orders": [{
            "id": o.id,
            "external_id": o.external_id,
            "customer_id": o.customer_id,
            "store_id": o.store_id,
            "total_amount": float(o.total_amount) if o.total_amount else 0,
            "profit_margin": float(o.profit_margin) if o.profit_margin else 0,
            "status": o.status,
            "created_at": o.created_at.isoformat() if o.created_at else None,
            "customer": {
                "id": o.customer.id,
                "email": o.customer.email,
                "full_name": o.customer.full_name
            } if o.customer else None
        } for o in orders],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@app.get("/api/customers")
async def get_customers(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    """Get all customers with pagination"""
    customers = db.query(Customer).offset(skip).limit(limit).all()
    total = db.query(Customer).count()
    return {
        "customers": [{
            "id": c.id,
            "email": c.email,
            "full_name": c.full_name,
            "phone": c.phone,
            "lifetime_value": float(c.lifetime_value) if c.lifetime_value else 0,
            "created_at": c.created_at.isoformat() if c.created_at else None,
            "orders_count": len(c.orders) if hasattr(c, 'orders') else 0
        } for c in customers],
        "total": total,
        "skip": skip,
        "limit": limit
    }

@app.get("/api/dashboard/stats")
async def get_dashboard_stats(db: Session = Depends(get_db)):
    """Get dashboard statistics"""
    total_products = db.query(Product).count()
    total_orders = db.query(Order).count()
    total_customers = db.query(Customer).count()
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    
    # Recent orders (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_orders = db.query(Order).filter(Order.created_at >= thirty_days_ago).count()
    
    # Low stock products
    low_stock_products = db.query(Product).filter(Product.stock_quantity < 10).count()
    
    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_revenue": float(total_revenue),
        "recent_orders": recent_orders,
        "low_stock_products": low_stock_products
    }

@app.get("/sync/{store_id}")
async def sync_store(store_id: str, db: Session = Depends(get_db)):
    # 1. Get store credentials
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        return {"error": "Store not found"}
    
    # Use the connector (Universal Adapter pattern)
    connector = ShopifyConnector(store.store_url, store.access_token)
    
    # 2. Fetch normalized products
    normalized_products = connector.fetch_products()
    
    # 3. Fetch normalized orders
    normalized_orders = connector.fetch_orders()
    
    # 4. Use AI to analyze the sync (Data Architect Agent)
    task_desc = f"I have fetched {len(normalized_products)} products and {len(normalized_orders)} orders from {connector.get_platform_name()}. Prepare them for database insertion."
    ai_status = data_architect_task(task_desc)
    
    # 5. Save Products
    for p_data in normalized_products:
        product = db.query(Product).filter(Product.external_id == p_data['external_id']).first()
        if not product:
            product = Product(**p_data)
            db.add(product)
        else:
            for key, value in p_data.items():
                setattr(product, key, value)
    
    # 6. Save Orders & Customers
    for o_data in normalized_orders:
        # a. Handle Customer first
        email = o_data.get('customer_email')
        customer = db.query(Customer).filter(Customer.email == email).first()
        if not customer and email:
            customer = Customer(email=email)
            db.add(customer)
            db.flush() # Get ID for customer
        
        # b. Handle Order
        order = db.query(Order).filter(Order.external_id == o_data['external_id']).first()
        if not order:
            order_data = o_data.copy()
            order_data.pop('customer_email', None) # Remove email from order data
            order = Order(**order_data, store_id=store.id, customer_id=customer.id if customer else None)
            db.add(order)
        else:
            # Update order status if it changed
            order.status = o_data.get('status', order.status)
    
    db.commit()
    return {
        "status": "Sync complete", 
        "ai_notes": ai_status, 
        "products_synced": len(normalized_products),
        "orders_synced": len(normalized_orders)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
