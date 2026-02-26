"""
main.py
Mona AI — FastAPI Backend

All 7 AI roles wired and working:
Role 1: Mona Unified Agent
Role 2: Data Architect
Role 3: Brand Designer
Role 4: Copywriter
Role 5: Business Intelligence Engine
Role 6: Proactive Notification Engine (background task)
Role 7: Read/Write Data Agent
"""

import os
import io
import json
import time
import asyncio
import traceback
from datetime import datetime
from typing import Optional

from fastapi import FastAPI, UploadFile, File, Request, Depends, HTTPException, Security
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.security import APIKeyHeader
from pydantic import BaseModel
from sqlalchemy.orm import Session
from dotenv import load_dotenv

load_dotenv(override=False)

# ── Optional imports ───────────────────────────────────────────────────────────
try:
    import pandas as pd
except ImportError:
    print("WARNING: pandas not found. CSV ingestion disabled.")
    pd = None

# ── Internal imports ───────────────────────────────────────────────────────────
from database import get_db, init_db
from models import Product, Store, Customer, Order, StoreSettings

from agents import (
    mona_agent,
    data_architect_parse_products,
    data_architect_map_csv,
    brand_designer,
    copywriter_storefront,
    copywriter_product_description,
    copywriter_document,
)

from data_agent import (
    read_products,
    read_orders,
    read_customers,
    read_last_order,
    read_last_customer,
    write_product,
    write_products_bulk,
    update_product,
    update_order_status,
    write_customer,
    write_store_settings,
    read_store_settings,
)

from business_intelligence import (
    get_business_intelligence,
    get_notifications,
    get_morning_briefing,
)

try:
    from modules.finance import create_invoice_pdf
except ImportError:
    print("WARNING: modules.finance not found. Invoice generation disabled.")
    def create_invoice_pdf(*args, **kwargs):
        return None

from connectors.shopify import ShopifyConnector


# ══════════════════════════════════════════════════════════════════
# APP SETUP
# ══════════════════════════════════════════════════════════════════

app = FastAPI(title="Mona AI")

# ── CORS ──────────────────────────────────────────────────────────
origins_str = os.getenv("ALLOWED_ORIGINS", "")
origins = [o.strip() for o in origins_str.split(",")] if origins_str else ["http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ── API KEY AUTH ──────────────────────────────────────────────────
api_key_header = APIKeyHeader(name="X-API-Key", auto_error=False)

async def get_api_key(key: str = Security(api_key_header)):
    expected = os.getenv("MIA_API_KEY")
    if not expected:
        raise HTTPException(status_code=500, detail="Server misconfiguration: MIA_API_KEY not set")
    if key == expected:
        return key
    raise HTTPException(status_code=403, detail="Invalid API key")

# ── GLOBAL ERROR HANDLER ──────────────────────────────────────────
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print(f"GLOBAL ERROR: {exc}")
    traceback.print_exc()
    return JSONResponse(
        status_code=500,
        content={"detail": str(exc), "type": str(type(exc))}
    )


# ══════════════════════════════════════════════════════════════════
# ROLE 6 — PROACTIVE NOTIFICATION ENGINE (Background Task)
# Runs independently on a schedule.
# Makes Mona feel alive even when the merchant isn't chatting.
# ══════════════════════════════════════════════════════════════════

notification_store: dict = {}  # In-memory store keyed by user_id

async def notification_engine():
    """
    Background task — runs every 30 minutes.
    Checks store health and queues notifications for each merchant.
    """
    print("🔔 Notification Engine started")
    while True:
        try:
            # Get a fresh DB session
            from database import SessionLocal
            db = SessionLocal()
            try:
                # Get all active users from StoreSettings
                all_settings = db.query(StoreSettings).filter(
                    StoreSettings.onboarding_completed == True
                ).all()

                for settings in all_settings:
                    user_id = settings.user_id
                    if not user_id:
                        continue

                    notifications = get_notifications(db, user_id=user_id)

                    # Check if it's morning briefing time (8am UTC)
                    now = datetime.utcnow()
                    if now.hour == 8 and now.minute < 30:
                        morning = get_morning_briefing(db, user_id=user_id)
                        notifications.insert(0, {
                            "type": "morning_briefing",
                            "severity": "info",
                            "message": morning,
                            "action": None
                        })

                    if notifications:
                        if user_id not in notification_store:
                            notification_store[user_id] = []
                        # Add new notifications, avoid duplicates by type
                        existing_types = {n["type"] for n in notification_store[user_id]}
                        for n in notifications:
                            if n["type"] not in existing_types:
                                notification_store[user_id].append(n)

                print(f"🔔 Notification check complete — {len(all_settings)} stores checked")
            finally:
                db.close()

        except Exception as e:
            print(f"NOTIFICATION ENGINE ERROR: {e}")
            traceback.print_exc()

        # Run every 30 minutes
        await asyncio.sleep(30 * 60)


@app.on_event("startup")
async def startup_event():
    """Start background tasks on app startup."""
    init_db()
    asyncio.create_task(notification_engine())
    print("✅ Mona AI is online")


# ══════════════════════════════════════════════════════════════════
# HEALTH CHECK
# ══════════════════════════════════════════════════════════════════

@app.get("/")
async def root():
    return {"message": "Mona AI is online", "status": "healthy"}


# ══════════════════════════════════════════════════════════════════
# ROLE 1 — MAIN CHAT ENDPOINT
# Every merchant message comes through here.
# ══════════════════════════════════════════════════════════════════

class ChatRequest(BaseModel):
    message: str
    user_id: Optional[str] = None


@app.post("/chat")
async def chat(
    request: ChatRequest,
    db: Session = Depends(get_db),
    api_key: str = Security(get_api_key)
):
    print(f"\n{'='*60}")
    print(f"CHAT | user: {request.user_id} | message: {request.message}")
    print(f"{'='*60}")

    message = request.message
    user_id = request.user_id

    # ── Step 1: Build rich business context (Role 5) ──────────────
    business_context = get_business_intelligence(db, user_id=user_id)
    print(f"\nBUSINESS CONTEXT INJECTED:\n{business_context}\n")

    # ── Step 2: Call Mona (Role 1) ─────────────────────────────────
    mona_response = mona_agent(message, business_context)

    response_data = {
        "content": mona_response.get("content", ""),
        "tool": mona_response.get("tool"),
        "widget": None,
        "steps": [],
        "notifications": []
    }

    # ── Step 3: Check for pending notifications ────────────────────
    if user_id and user_id in notification_store:
        pending = notification_store.pop(user_id, [])
        if pending:
            response_data["notifications"] = pending

    # ── Step 4: No tool called — direct response ───────────────────
    tool_name = mona_response.get("tool")
    if not tool_name:
        print(f"MONA: Direct response — {response_data['content'][:80]}...")
        return response_data

    # ── Step 5: Handle tool calls (Role 7) ────────────────────────
    tool_args = mona_response.get("args", {})
    print(f"TOOL CALLED: {tool_name} | args: {tool_args}")

    try:

        # ─── LIST PRODUCTS ───────────────────────────────────────
        if tool_name == "list_products":
            limit = tool_args.get("limit", 50)
            products = read_products(db, user_id=user_id, limit=limit)

            if not products:
                response_data["content"] = (
                    "Your store doesn't have any products yet. "
                    "Want me to help you add some? Just send me a list!"
                )
            else:
                lines = []
                for p in products:
                    stock = p.get("stock_quantity", 0)
                    if stock <= 0:
                        stock_note = " 🚨 [OUT OF STOCK]"
                    elif stock < 10:
                        stock_note = f" ⚠️ [LOW: {int(stock)} left]"
                    else:
                        stock_note = f" [Stock: {int(stock)}]"
                    lines.append(f"• **{p['name']}** — ₦{p['price']:,.2f}{stock_note}")

                response_data["content"] = (
                    f"Here are your {len(products)} product(s):\n\n"
                    + "\n".join(lines)
                    + "\n\nWant me to update any of these or add new ones?"
                )
                response_data["widget"] = {
                    "type": "product_list",
                    "products": products
                }

        # ─── ADD PRODUCTS ─────────────────────────────────────────
        elif tool_name == "add_products":
            raw_text = tool_args.get("product_list_text", message)
            response_data["steps"] = [
                "Reading your product list",
                "Extracting product details",
                "Saving to your store"
            ]

            # Role 2 — Data Architect parses the text
            parsed_products = data_architect_parse_products(raw_text)

            if not parsed_products:
                response_data["content"] = (
                    "I couldn't read a clear product list from that. "
                    "Try sending it like this:\n\n"
                    "Black Sneakers, size 40-45, ₦15,000, stock: 20\n"
                    "White T-shirt, S-XL, ₦5,000, stock: 50"
                )
            else:
                # Role 7 — Write Agent saves to DB
                count = write_products_bulk(db, parsed_products, user_id=user_id)
                response_data["content"] = (
                    f"Done! I've added **{count} product(s)** to your store. 🎉\n\n"
                    f"Want me to write product descriptions for any of them?"
                )
                response_data["widget"] = {
                    "type": "product_import",
                    "count": count,
                    "products": parsed_products
                }

        # ─── UPDATE STOCK ─────────────────────────────────────────
        elif tool_name == "update_product_stock":
            product_name = tool_args.get("product_name", "")
            new_quantity = tool_args.get("new_quantity", 0)

            # Find product by name
            from data_agent import read_product_by_name
            product = read_product_by_name(db, name=product_name, user_id=user_id)

            if not product:
                response_data["content"] = (
                    f"I couldn't find a product called '{product_name}'. "
                    f"Can you check the name and try again?"
                )
            else:
                updated = update_product(
                    db,
                    product_id=product["id"],
                    updates={"stock_quantity": new_quantity},
                    user_id=user_id
                )
                response_data["content"] = (
                    f"Done! I've updated **{updated['name']}** stock to "
                    f"**{new_quantity} units**. ✅"
                )

        # ─── LIST ORDERS ──────────────────────────────────────────
        elif tool_name == "list_orders":
            limit = tool_args.get("limit", 20)
            orders = read_orders(db, user_id=user_id, limit=limit)

            if not orders:
                response_data["content"] = (
                    "No orders yet. Once customers start buying, "
                    "I'll track everything here for you."
                )
            else:
                lines = []
                for o in orders:
                    customer = o.get("customer_name") or o.get("customer_email") or "Unknown"
                    lines.append(
                        f"• **{customer}** — ₦{o['total_amount']:,.2f} "
                        f"[{o['status'].upper()}]"
                    )

                response_data["content"] = (
                    f"Here are your last {len(orders)} order(s):\n\n"
                    + "\n".join(lines)
                    + "\n\nWant me to update any order status?"
                )
                response_data["widget"] = {
                    "type": "order_list",
                    "orders": orders
                }

        # ─── UPDATE ORDER STATUS ──────────────────────────────────
        elif tool_name == "update_order_status":
            order_id = tool_args.get("order_id", "")
            status = tool_args.get("status", "")

            updated = update_order_status(db, order_id=order_id, status=status, user_id=user_id)

            if not updated:
                response_data["content"] = (
                    f"I couldn't find order #{order_id}. "
                    f"Can you double-check the order ID?"
                )
            else:
                customer = updated.get("customer_name") or "Customer"
                response_data["content"] = (
                    f"Done! Order for **{customer}** has been updated to "
                    f"**{status.upper()}**. ✅"
                )

        # ─── LIST CUSTOMERS ───────────────────────────────────────
        elif tool_name == "list_customers":
            limit = tool_args.get("limit", 20)
            customers = read_customers(db, user_id=user_id, limit=limit)

            if not customers:
                response_data["content"] = (
                    "No customers yet. They'll appear here once orders come in."
                )
            else:
                lines = []
                for c in customers:
                    name = c.get("full_name") or c.get("email") or "Unknown"
                    orders = c.get("orders_count", 0)
                    value = c.get("lifetime_value", 0)
                    lines.append(f"• **{name}** — {orders} order(s), ₦{value:,.2f} total")

                response_data["content"] = (
                    f"You have **{len(customers)} customer(s)**:\n\n"
                    + "\n".join(lines)
                )
                response_data["widget"] = {
                    "type": "customer_list",
                    "customers": customers
                }

        # ─── CREATE INVOICE ───────────────────────────────────────
        elif tool_name == "create_invoice":
            customer_name = tool_args.get("customer_name", "Customer")
            amount = float(tool_args.get("amount", 0.0))
            items_str = tool_args.get("items", "Services")

            response_data["steps"] = [
                "Calculating totals",
                "Generating PDF invoice",
                "Saving to your store"
            ]

            items = [{"name": item.strip(), "price": amount} for item in items_str.split(",")]
            if len(items) > 1:
                for i in range(1, len(items)):
                    items[i]["price"] = 0

            order_data = {
                "customer_name": customer_name,
                "order_id": f"INV-{int(time.time())}",
                "items": items,
                "total": amount
            }

            try:
                pdf_buffer = create_invoice_pdf(order_data)
                filename = f"invoice_{order_data['order_id']}.pdf"
                public_dir = os.path.join(os.getcwd(), "mia-ui", "public", "invoices")
                os.makedirs(public_dir, exist_ok=True)
                filepath = os.path.join(public_dir, filename)

                with open(filepath, "wb") as f:
                    f.write(pdf_buffer.read())

                pdf_url = f"http://localhost:3000/invoices/{filename}"

                response_data["content"] = (
                    f"Invoice **#{order_data['order_id']}** for **{customer_name}** "
                    f"totalling **₦{amount:,.2f}** is ready. ✅"
                )
                response_data["widget"] = {
                    "type": "invoice",
                    "title": f"Invoice #{order_data['order_id']}",
                    "description": f"Billed to {customer_name}",
                    "url": pdf_url
                }

            except Exception as e:
                print(f"INVOICE ERROR: {e}")
                response_data["content"] = f"I had trouble generating the invoice: {str(e)}"

        # ─── SETUP STORE ──────────────────────────────────────────
        elif tool_name == "setup_store":
            business_name = tool_args.get("business_name", "Your Store")
            niche = tool_args.get("niche", "general")

            response_data["steps"] = [
                "Understanding your business",
                "Designing your brand identity",
                "Writing your store copy",
                "Building your storefront"
            ]

            # Role 3 — Brand Designer
            brand = brand_designer(business_name, niche)

            # Role 4 — Copywriter
            copy = copywriter_storefront(
                business_name=business_name,
                niche=niche,
                industry=brand.get("industry", niche),
                brand_mantra=brand.get("brand_mantra", "")
            )

            # Role 7 — Write Agent saves settings
            if user_id:
                write_store_settings(db, user_id=user_id, updates={
                    "store_name": business_name,
                    "store_domain": business_name.lower().replace(" ", "-"),
                    "niche": niche,
                    "primary_color": brand.get("primary_color", "#4f35e8"),
                    "heading_font": brand.get("heading_font", "Instrument Serif"),
                    "body_font": brand.get("body_font", "Inter"),
                    "hero_title": copy.get("hero_title"),
                    "hero_description": copy.get("hero_description"),
                    "footer_description": copy.get("footer_description"),
                    "onboarding_completed": True
                })

            response_data["content"] = (
                f"Your store **{business_name}** is live! 🎉\n\n"
                f"_{brand.get('tagline', '')}_\n\n"
                f"I've set up your branding, colors, and copy based on "
                f"your {niche} niche.\n\n"
                f"**Next steps:**\n"
                f"1. Add your products — just send me a list\n"
                f"2. Preview your store at your store URL\n"
                f"3. Connect Paystack to start accepting payments\n\n"
                f"What would you like to do first?"
            )
            response_data["widget"] = {
                "type": "store_preview",
                "store_name": business_name,
                "branding": {
                    "primary_color": brand.get("primary_color"),
                    "heading_font": brand.get("heading_font"),
                    "body_font": brand.get("body_font"),
                    "tagline": brand.get("tagline")
                },
                "copy": copy
            }

        # ─── CUSTOMIZE BRANDING ───────────────────────────────────
        elif tool_name == "customize_branding":
            primary_color = tool_args.get("primary_color")
            heading_font = tool_args.get("heading_font")
            body_font = tool_args.get("body_font")
            hero_image = tool_args.get("hero_image_url")

            updates = {}
            if primary_color:
                updates["primary_color"] = primary_color
            if heading_font:
                updates["heading_font"] = heading_font
            if body_font:
                updates["body_font"] = body_font
            if hero_image:
                updates["hero_image"] = hero_image

            if user_id and updates:
                write_store_settings(db, user_id=user_id, updates=updates)

            changes = ", ".join([
                k.replace("_", " ").title()
                for k in updates.keys()
            ])
            response_data["content"] = (
                f"Done! I've updated your store's **{changes}**. "
                f"The changes are live on your storefront. ✅"
            )
            response_data["widget"] = {
                "type": "store_preview",
                "branding": updates
            }

        # ─── CREATE DOCUMENT ──────────────────────────────────────
        elif tool_name == "create_document":
            doc_type = tool_args.get("doc_type", "policy")
            details = tool_args.get("details", message)

            response_data["steps"] = [
                "Analysing your business",
                "Drafting document",
                "Polishing final text"
            ]

            # Role 4 — Copywriter handles document creation
            doc_content = copywriter_document(
                doc_type=doc_type,
                details=details,
                business_context=business_context
            )

            response_data["content"] = (
                f"I've drafted your **{doc_type.replace('_', ' ').title()}**. "
                f"Review it below and let me know if you need changes."
            )
            response_data["widget"] = {
                "type": "document",
                "title": doc_type.replace("_", " ").title(),
                "content": doc_content,
                "actions": ["download", "copy", "edit"]
            }

        # ─── UNKNOWN TOOL FALLBACK ────────────────────────────────
        else:
            print(f"UNKNOWN TOOL: {tool_name}")
            if not response_data["content"]:
                response_data["content"] = (
                    "I understood what you want but hit a snag executing it. "
                    "Can you try rephrasing?"
                )

    except Exception as e:
        print(f"TOOL HANDLER ERROR [{tool_name}]: {e}")
        traceback.print_exc()
        response_data["content"] = (
            f"I ran into an issue with that request: {str(e)}. "
            f"Please try again."
        )

    return response_data


# ══════════════════════════════════════════════════════════════════
# ROLE 6 — NOTIFICATIONS ENDPOINT
# Frontend polls this to get pending notifications.
# ══════════════════════════════════════════════════════════════════

@app.get("/notifications/{user_id}")
async def get_pending_notifications(user_id: str, db: Session = Depends(get_db)):
    """
    Returns and clears pending notifications for a merchant.
    Frontend should poll this every 60 seconds.
    """
    # Also generate fresh notifications on demand
    fresh = get_notifications(db, user_id=user_id)

    # Merge with any queued from background task
    queued = notification_store.pop(user_id, [])

    # Deduplicate by type
    all_notifications = queued + fresh
    seen_types = set()
    unique = []
    for n in all_notifications:
        if n["type"] not in seen_types:
            unique.append(n)
            seen_types.add(n["type"])

    return {"notifications": unique, "count": len(unique)}


@app.get("/morning-briefing/{user_id}")
async def morning_briefing(user_id: str, db: Session = Depends(get_db)):
    """Returns the morning briefing for a merchant."""
    briefing = get_morning_briefing(db, user_id=user_id)
    return {"message": briefing}


# ══════════════════════════════════════════════════════════════════
# PRODUCT DESCRIPTION GENERATOR
# ══════════════════════════════════════════════════════════════════

class DescriptionRequest(BaseModel):
    name: str
    category: Optional[str] = None
    features: Optional[str] = None


@app.post("/generate-description")
async def generate_description(request: DescriptionRequest):
    """Generate a product description using Role 4 — Copywriter."""
    description = copywriter_product_description(
        product_name=request.name,
        category=request.category,
        features=request.features
    )
    return {"description": description}


# ══════════════════════════════════════════════════════════════════
# CSV INGESTION
# ══════════════════════════════════════════════════════════════════

@app.post("/ingest-csv")
async def ingest_csv(
    file: UploadFile = File(...),
    type: str = "products",
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Ingest a CSV file using Role 2 — Data Architect for column mapping."""
    if pd is None:
        raise HTTPException(status_code=501, detail="CSV ingestion disabled (pandas not installed).")

    contents = await file.read()
    df = pd.read_csv(io.BytesIO(contents))

    # Role 2 — Data Architect maps columns
    mapping = data_architect_map_csv(df.columns.tolist(), type)

    if not mapping:
        return {"error": "Could not map CSV columns automatically. Please map manually."}

    count = 0
    for _, row in df.iterrows():
        try:
            if type == "products":
                write_product(db, {
                    "name": row.get(mapping.get("name", "name")),
                    "price": float(row.get(mapping.get("price", "price"), 0)),
                    "sku": str(row.get(mapping.get("sku", "sku"), "")),
                    "stock_quantity": float(row.get(mapping.get("stock_quantity", "stock"), 0)),
                    "platform": "csv_import"
                }, user_id=user_id)
                count += 1
            elif type == "customers":
                write_customer(db, {
                    "email": row.get(mapping.get("email", "email")),
                    "full_name": row.get(mapping.get("full_name", "name")),
                    "phone": row.get(mapping.get("phone", "phone")),
                    "platform": "csv_import"
                }, user_id=user_id)
                count += 1
        except Exception as e:
            print(f"CSV ROW ERROR: {e}")
            continue

    return {"status": "success", "imported_count": count, "type": type}


# ══════════════════════════════════════════════════════════════════
# DASHBOARD API ENDPOINTS
# Direct data access for the frontend dashboard.
# All reads go through Role 7 — Data Agent.
# ══════════════════════════════════════════════════════════════════

@app.get("/api/products")
async def api_get_products(
    skip: int = 0,
    limit: int = 100,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    products = read_products(db, user_id=user_id, limit=limit)
    return {"products": products, "total": len(products)}


@app.post("/api/products")
async def api_create_product(
    product_data: dict,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    product = write_product(db, product_data, user_id=user_id)
    return product


@app.put("/api/products/{product_id}")
async def api_update_product(
    product_id: str,
    product_data: dict,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    updated = update_product(db, product_id=product_id, updates=product_data, user_id=user_id)
    if not updated:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated


@app.get("/api/orders")
async def api_get_orders(
    limit: int = 100,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    orders = read_orders(db, user_id=user_id, limit=limit)
    return {"orders": orders, "total": len(orders)}


@app.get("/api/customers")
async def api_get_customers(
    limit: int = 100,
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    customers = read_customers(db, user_id=user_id, limit=limit)
    return {"customers": customers, "total": len(customers)}


@app.get("/api/dashboard/stats")
async def api_dashboard_stats(
    user_id: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Dashboard stats — powered by Business Intelligence Engine."""
    from sqlalchemy import func
    from datetime import timedelta

    product_query = db.query(Product)
    order_query = db.query(Order)
    customer_query = db.query(Customer)

    if user_id:
        product_query = product_query.filter(Product.user_id == user_id)
        order_query = order_query.filter(Order.user_id == user_id)
        customer_query = customer_query.filter(Customer.user_id == user_id)

    total_products = product_query.count()
    total_orders = order_query.count()
    total_customers = customer_query.count()
    total_revenue = db.query(func.sum(Order.total_amount)).scalar() or 0
    low_stock = product_query.filter(Product.stock_quantity < 10).count()

    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    recent_orders = order_query.filter(Order.created_at >= thirty_days_ago).count()

    return {
        "total_products": total_products,
        "total_orders": total_orders,
        "total_customers": total_customers,
        "total_revenue": float(total_revenue),
        "recent_orders": recent_orders,
        "low_stock_products": low_stock
    }


@app.get("/api/intelligence/{user_id}")
async def api_business_intelligence(user_id: str, db: Session = Depends(get_db)):
    """Returns the full business intelligence snapshot for a merchant."""
    snapshot = get_business_intelligence(db, user_id=user_id)
    return {"snapshot": snapshot}


# ══════════════════════════════════════════════════════════════════
# SHOPIFY INTEGRATION
# ══════════════════════════════════════════════════════════════════

class ConnectRequest(BaseModel):
    shop_url: str
    access_token: str
    user_id: Optional[str] = None


@app.post("/connect/shopify")
async def connect_shopify(request: ConnectRequest, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.store_url == request.shop_url).first()
    if not store:
        store = Store(
            name=request.shop_url.split(".")[0],
            platform="shopify",
            store_url=request.shop_url,
            access_token=request.access_token,
            user_id=request.user_id,
            is_active=True
        )
        db.add(store)
    else:
        store.access_token = request.access_token
        store.user_id = request.user_id or store.user_id
        store.is_active = True

    db.commit()
    db.refresh(store)
    return {"status": "Store connected", "store_id": store.id}


@app.get("/sync/{store_id}")
async def sync_store(store_id: str, db: Session = Depends(get_db)):
    store = db.query(Store).filter(Store.id == store_id).first()
    if not store:
        return {"error": "Store not found"}

    connector = ShopifyConnector(store.store_url, store.access_token)
    normalized_products = connector.fetch_products()
    normalized_orders = connector.fetch_orders()

    # Save products via Role 7
    for p_data in normalized_products:
        existing = db.query(Product).filter(
            Product.external_id == p_data.get("external_id")
        ).first()
        if not existing:
            write_product(db, {**p_data, "platform": "shopify"}, user_id=store.user_id)

    # Save orders and customers via Role 7
    for o_data in normalized_orders:
        email = o_data.get("customer_email")
        customer = None
        if email:
            customer_dict = write_customer(db, {
                "email": email,
                "platform": "shopify"
            }, user_id=store.user_id)
            customer = db.query(Customer).filter(Customer.id == customer_dict["id"]).first()

        existing_order = db.query(Order).filter(
            Order.external_id == o_data.get("external_id")
        ).first()

        if not existing_order:
            order_data = {k: v for k, v in o_data.items() if k != "customer_email"}
            order = Order(
                **order_data,
                store_id=store.id,
                user_id=store.user_id,
                customer_id=customer.id if customer else None
            )
            db.add(order)

    db.commit()

    return {
        "status": "Sync complete",
        "products_synced": len(normalized_products),
        "orders_synced": len(normalized_orders)
    }


@app.post("/webhook/shopify")
async def shopify_webhook(request: Request):
    data = await request.json()
    print(f"SHOPIFY WEBHOOK: {data}")
    return {"status": "received"}


# ══════════════════════════════════════════════════════════════════
# SETTINGS
# ══════════════════════════════════════════════════════════════════

@app.post("/settings")
async def update_settings(settings: dict):
    for key, value in settings.items():
        os.environ[key] = str(value)
    return {"status": "Settings updated"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
