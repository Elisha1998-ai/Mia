from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import Product, Order, Customer, Shipment, Store, StoreSettings, User
from datetime import datetime, timedelta

def get_business_summary(db: Session):
    """
    Returns a comprehensive summary of the business state for the AI to understand.
    """
    try:
        # 0. Store & User Info from Onboarding
        settings = db.query(StoreSettings).order_by(desc(StoreSettings.updated_at)).first()
        user = None
        if settings and settings.user_id:
            user = db.query(User).filter(User.id == settings.user_id).first()

        store_name = settings.store_name if settings and settings.store_name else "Your Store"
        user_first_name = user.first_name if user and user.first_name else "there"
        niche = settings.niche if settings and settings.niche else "Ecommerce"
        location = settings.location if settings and settings.location else "Nigeria"
        
        # 1. Sales Overview
        total_orders = db.query(Order).count()
        # Handle decimal total_amount from Postgres
        total_revenue_scalar = db.query(func.sum(Order.total_amount)).scalar()
        total_revenue = float(total_revenue_scalar) if total_revenue_scalar is not None else 0.0
        unpaid_orders_count = db.query(Order).filter(Order.status == 'pending').count()
        
        # 2. Inventory Stats
        total_products = db.query(Product).count()
        low_stock_threshold = 10
        low_stock_products = db.query(Product).filter(Product.stock_quantity < low_stock_threshold).all()
        # Top selling products (by frequency in orders - simplified)
        # Note: In a real app, we'd join with OrderItems, but here we can use stock_quantity as a proxy for 'most stocked' or query recent orders
        top_products = db.query(Product).order_by(desc(Product.stock_quantity)).limit(5).all()
        
        # 3. Customer Overview
        total_customers = db.query(Customer).count()
        
        # Customers buying the most (Top 5 by lifetime value)
        top_customers = db.query(Customer).order_by(desc(Customer.lifetime_value)).limit(5).all()
        
        last_order = db.query(Order).order_by(desc(Order.created_at)).first()
        last_customer = None
        if last_order and last_order.customer_id:
            last_customer = db.query(Customer).filter(Customer.id == last_order.customer_id).first()
            
        # 4. Logistics
        pending_shipments = db.query(Shipment).filter(Shipment.status != 'delivered').count()

        summary = f"""
AI SYSTEM CONTEXT: You are Mia, a highly intelligent Business Manager for {store_name}. 
You have direct access to the store's database. Use the data below to answer the user's questions accurately.

USER PROFILE:
- User: {user_first_name}
- Store: {store_name}
- Niche: {niche}
- Primary Market: {location}

LIVE STORE DATA SUMMARY (Fetched at {datetime.now().strftime("%Y-%m-%d %H:%M")}):

1. KEY METRICS:
- Total Revenue: ₦{total_revenue:,.2f}
- Total Orders: {total_orders}
- Total Customers: {total_customers}
- Total Products: {total_products}
- Unpaid/Pending Orders: {unpaid_orders_count}

2. TOP CUSTOMERS (By Lifetime Value):
{chr(10).join([f"- {c.full_name} (₦{float(c.lifetime_value):,.2f})" for c in top_customers]) if top_customers else "No customer data available yet."}

3. INVENTORY STATUS:
- Low Stock Alerts: {len(low_stock_products)} products are below {low_stock_threshold} units.
{chr(10).join([f"  * {p.name}: {p.stock_quantity} left" for p in low_stock_products[:5]]) if low_stock_products else "  * All products are well stocked."}
- Most Stocked Products: {', '.join([p.name for p in top_products]) if top_products else "No product data."}

4. RECENT ACTIVITY:
- Latest Order: {f'₦{float(last_order.total_amount):,.2f} on {last_order.created_at.strftime("%Y-%m-%d %H:%M")}' if last_order else 'No orders recorded yet.'}
- Latest Customer: {last_customer.full_name if last_customer else 'N/A'}

5. LOGISTICS:
- Pending Shipments: {pending_shipments} shipments currently in transit or processing.
"""
        return summary
    except Exception as e:
        return f"Error gathering business overview: {str(e)}"
