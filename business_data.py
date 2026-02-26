from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from models import Product, Order, Customer, Shipment, Store, StoreSettings, User
from datetime import datetime, timedelta

def get_business_summary(db: Session, user_id: str = None):
    """
    Returns a comprehensive summary of the business state for the AI to understand.
    """
    try:
        # 0. Store & User Info from Onboarding
        query_settings = db.query(StoreSettings)
        if user_id:
            query_settings = query_settings.filter(StoreSettings.user_id == user_id)
        settings = query_settings.order_by(desc(StoreSettings.updated_at)).first()
        
        user = None
        if user_id:
            user = db.query(User).filter(User.id == user_id).first()
        elif settings and settings.user_id:
            user = db.query(User).filter(User.id == settings.user_id).first()

        store_name = settings.store_name if settings and settings.store_name else "Your Store"
        user_first_name = user.first_name if user and user.first_name else "there"
        niche = settings.niche if settings and settings.niche else "Ecommerce"
        location = settings.location if settings and settings.location else "Nigeria"
        
        # 1. Sales Overview
        query_orders = db.query(Order)
        if user_id:
            query_orders = query_orders.filter(Order.user_id == user_id)
            
        total_orders = query_orders.count()
        total_revenue = 0.0
        unpaid_orders_count = 0
        try:
            total_revenue_scalar = query_orders.with_entities(func.sum(Order.total_amount)).scalar()
            total_revenue = float(total_revenue_scalar) if total_revenue_scalar is not None else 0.0
            unpaid_orders_count = query_orders.filter(Order.status == 'pending').count()
        except Exception as sales_error:
            print(f"DEBUG: Sales overview query failed: {sales_error}")
        
        # 2. Inventory Stats
        query_products = db.query(Product)
        if user_id:
            query_products = query_products.filter(Product.user_id == user_id)
            
        total_products = query_products.count()
        low_stock_threshold = 10
        low_stock_products = query_products.filter(Product.stock_quantity < low_stock_threshold).all()
        # Top selling products (by frequency in orders - simplified)
        top_products = query_products.order_by(desc(Product.stock_quantity)).limit(5).all()
        
        # 3. Customer Overview
        query_customers = db.query(Customer)
        if user_id:
            query_customers = query_customers.filter(Customer.user_id == user_id)
            
        total_customers = query_customers.count()
        
        # Customers buying the most (Top 5 by lifetime value)
        top_customers = query_customers.order_by(desc(Customer.lifetime_value)).limit(5).all()
        
        last_order = None
        try:
            last_order = query_orders.order_by(desc(Order.created_at)).first()
        except Exception as order_error:
            print(f"DEBUG: Recent activity query failed: {order_error}")
            
        last_customer = None
        if last_order and last_order.customer_id:
            last_customer = db.query(Customer).filter(Customer.id == last_order.customer_id).first()
            
        # 4. Logistics
        # Note: Shipment might also need user_id if we want full isolation
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
