"""
data_agent.py
Role 7 — Read/Write Data Agent

Every database operation in Mona goes through here.
Clean, centralized, testable.
Nobody talks to the database directly except this file.
"""

from sqlalchemy.orm import Session
from sqlalchemy import desc
from datetime import datetime
from typing import Optional, List, Dict
from models import Product, Order, Customer, StoreSettings


# ══════════════════════════════════════════════════════════════════
# PRODUCTS — READ
# ══════════════════════════════════════════════════════════════════

def read_products(db: Session, user_id: str = None, limit: int = 50) -> List[Dict]:
    """Fetch all products for a merchant."""
    query = db.query(Product)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    products = query.limit(limit).all()
    return [_serialize_product(p) for p in products]


def read_product_by_id(db: Session, product_id: str, user_id: str = None) -> Optional[Dict]:
    """Fetch a single product by ID."""
    query = db.query(Product).filter(Product.id == product_id)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    product = query.first()
    return _serialize_product(product) if product else None


def read_product_by_name(db: Session, name: str, user_id: str = None) -> Optional[Dict]:
    """Fetch a product by name (case-insensitive partial match)."""
    query = db.query(Product).filter(Product.name.ilike(f"%{name}%"))
    if user_id:
        query = query.filter(Product.user_id == user_id)
    product = query.first()
    return _serialize_product(product) if product else None


def read_low_stock_products(db: Session, user_id: str = None, threshold: int = 10) -> List[Dict]:
    """Fetch products with low stock."""
    query = db.query(Product).filter(Product.stock_quantity < threshold)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    return [_serialize_product(p) for p in query.all()]


# ══════════════════════════════════════════════════════════════════
# PRODUCTS — WRITE
# ══════════════════════════════════════════════════════════════════

def write_product(db: Session, product_data: Dict, user_id: str = None) -> Dict:
    """Create a new product."""
    product = Product(
        user_id=user_id,
        name=product_data.get("name"),
        description=product_data.get("description"),
        price=float(product_data.get("price", 0)),
        sku=product_data.get("sku"),
        stock_quantity=float(product_data.get("stock_quantity", 0)),
        image_url=product_data.get("image_url"),
        platform=product_data.get("platform", "manual")
    )
    db.add(product)
    db.commit()
    db.refresh(product)
    return _serialize_product(product)


def write_products_bulk(db: Session, products_data: List[Dict], user_id: str = None) -> int:
    """Bulk create products. Returns count of created products."""
    count = 0
    for p_data in products_data:
        try:
            product = Product(
                user_id=user_id,
                name=p_data.get("name"),
                description=p_data.get("description"),
                price=float(p_data.get("price", 0)),
                sku=p_data.get("sku"),
                stock_quantity=float(p_data.get("stock_quantity", 0)),
                platform=p_data.get("platform", "ai_extraction")
            )
            db.add(product)
            count += 1
        except Exception as e:
            print(f"Error adding product {p_data.get('name')}: {e}")
            continue
    db.commit()
    return count


def update_product(db: Session, product_id: str, updates: Dict, user_id: str = None) -> Optional[Dict]:
    """Update an existing product."""
    query = db.query(Product).filter(Product.id == product_id)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    product = query.first()

    if not product:
        return None

    allowed_fields = ["name", "description", "price", "sku", "stock_quantity", "image_url"]
    for field in allowed_fields:
        if field in updates:
            setattr(product, field, updates[field])

    db.commit()
    db.refresh(product)
    return _serialize_product(product)


def delete_product(db: Session, product_id: str, user_id: str = None) -> bool:
    """Delete a product. Returns True if deleted."""
    query = db.query(Product).filter(Product.id == product_id)
    if user_id:
        query = query.filter(Product.user_id == user_id)
    product = query.first()

    if not product:
        return False

    db.delete(product)
    db.commit()
    return True


# ══════════════════════════════════════════════════════════════════
# ORDERS — READ
# ══════════════════════════════════════════════════════════════════

def read_orders(db: Session, user_id: str = None, limit: int = 50) -> List[Dict]:
    """Fetch all orders for a merchant."""
    query = db.query(Order).order_by(desc(Order.created_at))
    if user_id:
        query = query.filter(Order.user_id == user_id)
    return [_serialize_order(o) for o in query.limit(limit).all()]


def read_order_by_id(db: Session, order_id: str, user_id: str = None) -> Optional[Dict]:
    """Fetch a single order by ID."""
    query = db.query(Order).filter(Order.id == order_id)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    order = query.first()
    return _serialize_order(order) if order else None


def read_last_order(db: Session, user_id: str = None) -> Optional[Dict]:
    """Fetch the most recent order."""
    query = db.query(Order).order_by(desc(Order.created_at))
    if user_id:
        query = query.filter(Order.user_id == user_id)
    order = query.first()
    return _serialize_order(order) if order else None


# ══════════════════════════════════════════════════════════════════
# ORDERS — WRITE
# ══════════════════════════════════════════════════════════════════

def update_order_status(db: Session, order_id: str, status: str, user_id: str = None) -> Optional[Dict]:
    """Update an order's status."""
    query = db.query(Order).filter(Order.id == order_id)
    if user_id:
        query = query.filter(Order.user_id == user_id)
    order = query.first()

    if not order:
        return None

    order.status = status
    db.commit()
    db.refresh(order)
    return _serialize_order(order)


# ══════════════════════════════════════════════════════════════════
# CUSTOMERS — READ
# ══════════════════════════════════════════════════════════════════

def read_customers(db: Session, user_id: str = None, limit: int = 50) -> List[Dict]:
    """Fetch all customers for a merchant."""
    query = db.query(Customer)
    if user_id:
        query = query.filter(Customer.user_id == user_id)
    return [_serialize_customer(c) for c in query.limit(limit).all()]


def read_customer_by_email(db: Session, email: str, user_id: str = None) -> Optional[Dict]:
    """Fetch a customer by email."""
    query = db.query(Customer).filter(Customer.email == email)
    if user_id:
        query = query.filter(Customer.user_id == user_id)
    customer = query.first()
    return _serialize_customer(customer) if customer else None


def read_customer_by_name(db: Session, name: str, user_id: str = None) -> Optional[Dict]:
    """Fetch a customer by name (partial match)."""
    query = db.query(Customer).filter(Customer.full_name.ilike(f"%{name}%"))
    if user_id:
        query = query.filter(Customer.user_id == user_id)
    customer = query.first()
    return _serialize_customer(customer) if customer else None


def read_last_customer(db: Session, user_id: str = None) -> Optional[Dict]:
    """Fetch the most recently added customer."""
    query = db.query(Customer).order_by(desc(Customer.created_at))
    if user_id:
        query = query.filter(Customer.user_id == user_id)
    customer = query.first()
    return _serialize_customer(customer) if customer else None


# ══════════════════════════════════════════════════════════════════
# CUSTOMERS — WRITE
# ══════════════════════════════════════════════════════════════════

def write_customer(db: Session, customer_data: Dict, user_id: str = None) -> Dict:
    """Create or update a customer."""
    existing = None
    if customer_data.get("email"):
        existing = db.query(Customer).filter(
            Customer.email == customer_data["email"]
        ).first()

    if existing:
        if customer_data.get("full_name"):
            existing.full_name = customer_data["full_name"]
        if customer_data.get("phone"):
            existing.phone = customer_data["phone"]
        db.commit()
        db.refresh(existing)
        return _serialize_customer(existing)

    customer = Customer(
        user_id=user_id,
        email=customer_data.get("email"),
        full_name=customer_data.get("full_name"),
        phone=customer_data.get("phone"),
        platform=customer_data.get("platform", "manual")
    )
    db.add(customer)
    db.commit()
    db.refresh(customer)
    return _serialize_customer(customer)


# ══════════════════════════════════════════════════════════════════
# STORE SETTINGS — READ/WRITE
# ══════════════════════════════════════════════════════════════════

def read_store_settings(db: Session, user_id: str) -> Optional[Dict]:
    """Fetch store settings for a merchant."""
    settings = db.query(StoreSettings).filter(
        StoreSettings.user_id == user_id
    ).first()
    if not settings:
        return None
    return {
        "store_name": settings.store_name,
        "niche": settings.niche,
        "primary_color": settings.primary_color,
        "heading_font": settings.heading_font,
        "body_font": settings.body_font,
        "hero_title": settings.hero_title,
        "hero_description": settings.hero_description,
        "onboarding_completed": settings.onboarding_completed
    }


def write_store_settings(db: Session, user_id: str, updates: Dict) -> Dict:
    """Create or update store settings."""
    settings = db.query(StoreSettings).filter(
        StoreSettings.user_id == user_id
    ).first()

    if not settings:
        settings = StoreSettings(user_id=user_id)
        db.add(settings)

    allowed_fields = [
        "store_name", "store_domain", "niche", "primary_color",
        "heading_font", "body_font", "hero_title", "hero_description",
        "footer_description", "hero_image", "onboarding_completed"
    ]

    for field in allowed_fields:
        if field in updates and updates[field] is not None:
            setattr(settings, field, updates[field])

    db.commit()
    db.refresh(settings)
    return read_store_settings(db, user_id)


# ══════════════════════════════════════════════════════════════════
# SERIALIZERS — private helpers
# ══════════════════════════════════════════════════════════════════

def _serialize_product(p: Product) -> Dict:
    if not p:
        return {}
    return {
        "id": str(p.id),
        "name": p.name,
        "description": p.description,
        "price": float(p.price) if p.price else 0.0,
        "sku": p.sku,
        "stock_quantity": float(p.stock_quantity) if p.stock_quantity else 0.0,
        "image_url": p.image_url,
        "platform": p.platform,
        "created_at": p.created_at.isoformat() if p.created_at else None
    }


def _serialize_order(o: Order) -> Dict:
    if not o:
        return {}
    customer_name = None
    if o.customer:
        customer_name = o.customer.full_name or o.customer.email
    return {
        "id": str(o.id),
        "external_id": o.external_id,
        "customer_name": customer_name,
        "customer_email": o.customer.email if o.customer else None,
        "total_amount": float(o.total_amount) if o.total_amount else 0.0,
        "status": o.status,
        "platform": o.platform,
        "created_at": o.created_at.isoformat() if o.created_at else None
    }


def _serialize_customer(c: Customer) -> Dict:
    if not c:
        return {}
    return {
        "id": str(c.id),
        "email": c.email,
        "full_name": c.full_name,
        "phone": c.phone,
        "lifetime_value": float(c.lifetime_value) if c.lifetime_value else 0.0,
        "orders_count": len(c.orders) if hasattr(c, "orders") and c.orders else 0,
        "created_at": c.created_at.isoformat() if c.created_at else None
    }
