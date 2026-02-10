from fastapi import FastAPI, UploadFile, File, Request, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import pandas as pd
import io
import os
import json
from sqlalchemy.orm import Session
from sqlalchemy import func
from datetime import datetime, timedelta
from agents import (
    data_architect_task, 
    brand_designer_task, 
    accountant_task, 
    copywriter_task, 
    support_agent_task, 
    marketing_agent_task, 
    logistics_agent_task,
    intent_classifier_task,
    parameter_extractor_task,
    general_advisor_task
)
from modules.creative import generate_marketing_asset
from modules.finance import create_invoice_pdf
from database import get_db, init_db
from models import Product, Store, Customer, Order, SupportTicket, Campaign, Shipment, KnowledgeBase
from connectors.shopify import ShopifyConnector
from fastapi.responses import StreamingResponse

load_dotenv()

# Explicitly load the .env from the project root
project_root = os.path.dirname(os.path.abspath(__file__))
dotenv_path = os.path.join(project_root, '.env')
load_dotenv(dotenv_path=dotenv_path)

app = FastAPI(title="Mia AI Core")

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
                    name=row.get(mapping.get('name', 'name')),
                    price=float(row.get(mapping.get('price', 'price'), 0)),
                    sku=str(row.get(mapping.get('sku', 'sku'))),
                    stock_quantity=float(row.get(mapping.get('stock', 'stock_quantity'), 0)),
                    platform="csv_import"
                )
                db.add(product)
            elif type == "customers":
                customer = Customer(
                    email=row.get(mapping.get('email', 'email')),
                    name=row.get(mapping.get('name', 'name')),
                    phone=row.get(mapping.get('phone', 'phone')),
                    platform="csv_import"
                )
                db.add(customer)
            elif type == "orders":
                order = Order(
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

@app.post("/chat")
async def unified_chat(request: ChatRequest, db: Session = Depends(get_db)):
    message = request.message
    
    try:
        # Intent classification
        intent_raw = intent_classifier_task(message).strip().lower()
        
        valid_intents = ['greeting', 'brand_generation', 'store_setup', 'product_extraction', 'insight_request', 'general_query']
        intent = 'general_query'
        for v in valid_intents:
            if v in intent_raw:
                intent = v
                break
        
        response_data = {
            "content": "",
            "steps": [],
            "intent": intent
        }

        # Route based on intent
        if intent == "greeting":
            # Use an agent to generate a dynamic greeting
            task = f"User said '{message}'. Respond with a short, friendly greeting as Mia. Mention only ONE thing you can do today. Max 2 sentences."
            response_data["content"] = support_agent_task(task)
        elif intent == "brand_generation":
            # Extract params
            params_json = parameter_extractor_task(message)
            try:
                # Clean JSON string
                clean_json = params_json.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_json:
                    clean_json = clean_json.split("```")[1].split("```")[0].strip()
                
                # Handle single quotes from AI
                if "'" in clean_json and '"' not in clean_json:
                    clean_json = clean_json.replace("'", '"')
                    
                params = json.loads(clean_json)
                b_name = params.get('business_name', 'your brand')
                niche = params.get('niche', 'ecommerce')
                if b_name == "Unknown": b_name = "your brand"
                if niche == "Unknown": niche = "ecommerce"
            except Exception:
                # Fallback regex if JSON fails
                import re
                name_match = re.search(r"['\"]business_name['\"]:\s*['\"](.*?)['\"]", params_json)
                niche_match = re.search(r"['\"]niche['\"]:\s*['\"](.*?)['\"]", params_json)
                b_name = name_match.group(1) if name_match else "your brand"
                niche = niche_match.group(1) if niche_match else "ecommerce"

            brand_data = await brand_request(b_name, niche)
            response_data["content"] = brand_data["description"]
            
        elif intent == "store_setup":
            response_data["steps"] = ["Choosing layout", "Writing copy", "Setting up pages"]
            
            # Extract params
            params_json = parameter_extractor_task(message)
            try:
                # Clean JSON string
                clean_json = params_json.strip()
                if "```json" in clean_json:
                    clean_json = clean_json.split("```json")[1].split("```")[0].strip()
                elif "```" in clean_json:
                    clean_json = clean_json.split("```")[1].split("```")[0].strip()
                
                # Handle single quotes from AI
                if "'" in clean_json and '"' not in clean_json:
                    clean_json = clean_json.replace("'", '"')
                    
                params = json.loads(clean_json)
                b_name = params.get('business_name', 'your store')
                niche = params.get('niche', 'ecommerce')
                if b_name == "Unknown": b_name = "your store"
                if niche == "Unknown": niche = "ecommerce"
            except Exception:
                # Fallback regex if JSON fails
                import re
                name_match = re.search(r"['\"]business_name['\"]:\s*['\"](.*?)['\"]", params_json)
                niche_match = re.search(r"['\"]niche['\"]:\s*['\"](.*?)['\"]", params_json)
                b_name = name_match.group(1) if name_match else "your store"
                niche = niche_match.group(1) if niche_match else "ecommerce"

            try:
                setup_data = await setup_storefront(b_name, niche)
                if "error" in setup_data:
                    response_data["content"] = f"I ran into an issue: {setup_data['error']}"
                else:
                    response_data["content"] = f"I've set up your storefront for {b_name}. You can preview it here: http://localhost:3000/preview/{setup_data['template_used']}"
                    response_data["template_data"] = {
                        "name": setup_data["template_used"],
                        "copy_fields": setup_data["custom_copy"]
                    }
                    # Fetch actual products to show in wireframe if available
                    products = db.query(Product).limit(4).all()
                    response_data["products"] = [{"name": p.name, "price": p.price} for p in products]
            except Exception as e:
                print(f"Store setup error: {e}")
                response_data["content"] = "I had some trouble setting up the storefront. Could you try again with more details?"
            
        elif intent == "product_extraction":
            response_data["steps"] = ["Parsing text", "Extracting product details", "Mapping to database"]
            # Bulk product extraction logic
            task = f"Extract a list of products from this text: '{message}'. For each product, find name, price, and sku if available. Return ONLY a JSON list of objects like [{{'name': '...', 'price': 10.0, 'sku': '...'}}]. No extra text, no code blocks, just the raw JSON list."
            extracted_json = data_architect_task(task)
            try:
                # More aggressive cleaning
                cleaned_json = extracted_json.strip()
                if "```" in cleaned_json:
                    cleaned_json = cleaned_json.split("```")[1]
                    if cleaned_json.startswith("json"):
                        cleaned_json = cleaned_json[4:]
                
                # Find the first '[' and last ']' to extract just the JSON array
                start = cleaned_json.find('[')
                end = cleaned_json.rfind(']') + 1
                if start != -1 and end != -1:
                    cleaned_json = cleaned_json[start:end]

                products = json.loads(cleaned_json)
                for p_data in products:
                    product = Product(
                        name=p_data.get('name'),
                        price=float(p_data.get('price', 0)),
                        sku=p_data.get('sku'),
                        platform="ai_extraction"
                    )
                    db.add(product)
                db.commit()
                response_data["content"] = f"Successfully extracted and saved {len(products)} products to your inventory."
            except Exception as e:
                print(f"Error extracting products: {e}")
                print(f"Raw AI Output: {extracted_json}")
                response_data["content"] = "I found some products but had trouble saving them. Could you provide them in a clearer list?"
                
        elif intent == "insight_request":
            # Data-driven insights
            total_sales = db.query(Order).count()
            total_customers = db.query(Customer).count()
            
            stats_context = f"Store Stats: {total_sales} orders, {total_customers} customers."
            task = f"{stats_context}\nUser Question: {message}\nProvide a concise, data-informed answer. If the question is general ecommerce advice, ignore the 0 stats and give high-level strategic advice."
            response_data["content"] = general_advisor_task(task)

        else:
            # Default to a general query
            # Fetch relevant knowledge from KB if available
            knowledge_entries = db.query(KnowledgeBase).all()
            context = "\n".join([f"{k.title}: {k.content}" for k in knowledge_entries])
            
            task = f"Context: {context}\nQuestion: {message}\nProvide a helpful, concise answer for an ecommerce business owner. Focus on actionable advice."
            response_data["content"] = general_advisor_task(task)

        return response_data

    except Exception as e:
        return {
            "content": "I'm having a bit of trouble thinking clearly right now. This usually happens if my AI connection is unstable. Could you try again in a moment?",
            "steps": [],
            "intent": "general_query",
            "error": str(e)
        }

@app.post("/mia/generate-brand")
async def brand_request(business_name: str, niche: str):
    # Mia uses the creative module to build a starter pack
    # Removed logo and flier generation as per user request
    
    # Also generate a description using the Brand Designer agent
    desc_task = f"Write a 2-sentence brand description and a 3-point strategic plan for a business named {business_name} in the {niche} niche."
    brand_description = brand_designer_task(desc_task)
    
    return {
        "brand": business_name,
        "description": brand_description,
        "assets": []
    }

@app.post("/mia/setup-storefront")
async def setup_storefront(business_name: str, niche: str, template_id: str = "minimal_modern"):
    # 1. Fetch the template from our library
    try:
        with open("templates/library.json", "r") as f:
            library = json.load(f)
    except FileNotFoundError:
        return {"error": "Template library not found"}
    
    template = next((t for t in library["templates"] if t["id"] == template_id), library["templates"][0])
    
    # 2. Use AI Copywriter to rewrite the copy for the specific business
    task_desc = f"Rewrite the following storefront copy for a business named '{business_name}' in the '{niche}' niche. Keep the tone professional but engaging. Original Copy: {json.dumps(template['copy_fields'])}. Return only the updated JSON."
    
    ai_copy_json = copywriter_task(task_desc)
    
    # Try to parse the AI response as JSON, fallback to original if it fails
    try:
        # Clean the response if AI adds markdown backticks
        cleaned_json = ai_copy_json.strip().replace("```json", "").replace("```", "")
        custom_copy = json.loads(cleaned_json)
    except Exception as e:
        print(f"Error parsing AI copy: {e}")
        custom_copy = template['copy_fields']

    return {
        "status": "Storefront setup complete",
        "template_used": template["name"],
        "custom_copy": custom_copy,
        "note": "Mia has tailored the storefront copy to your brand's unique voice."
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
    context = "\n".join([f"{k.title}: {k.content}" for k in knowledge_entries])
    
    # 2. Use Data Architect (or a general "Business Intelligence" agent) to answer
    task = f"Context: {context}\nQuestion: {question}\nAnswer the question based on the business context provided."
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
