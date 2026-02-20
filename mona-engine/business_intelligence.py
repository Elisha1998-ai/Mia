"""
business_intelligence.py
Role 5 — Business Intelligence Engine

Builds a deep, rich snapshot of the merchant's business.
This is injected into Mona's context before every single response.
Mona always knows the full state of the business before she speaks.
"""

from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from models import Product, Order, Customer, StoreSettings


def get_business_intelligence(db: Session, user_id: str = None) -> str:
    """
    Returns a rich, structured business snapshot as a string.
    Injected into Mona's system prompt before every response.
    """
    try:
        # ── PRODUCTS ──────────────────────────────────────────────
        product_query = db.query(Product)
        if user_id:
            product_query = product_query.filter(Product.user_id == user_id)

        all_products = product_query.all()
        total_products = len(all_products)
        low_stock = [p for p in all_products if p.stock_quantity and 0 < p.stock_quantity < 10]
        out_of_stock = [p for p in all_products if not p.stock_quantity or p.stock_quantity <= 0]
        in_stock = total_products - len(out_of_stock)

        # Format product list for Mona (max 20 to keep context lean)
        product_lines = []
        for p in all_products[:20]:
            stock_note = ""
            if not p.stock_quantity or p.stock_quantity <= 0:
                stock_note = " [OUT OF STOCK]"
            elif p.stock_quantity < 10:
                stock_note = f" [LOW: {int(p.stock_quantity)} left]"
            else:
                stock_note = f" [Stock: {int(p.stock_quantity)}]"
            product_lines.append(
                f"  • {p.name} — ₦{p.price:,.2f}{stock_note}"
            )

        if total_products > 20:
            product_lines.append(f"  ... and {total_products - 20} more products")

        # ── ORDERS ────────────────────────────────────────────────
        order_query = db.query(Order)
        if user_id:
            order_query = order_query.filter(Order.user_id == user_id)

        all_orders = order_query.all()
        total_orders = len(all_orders)

        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)
        last_week_start = now - timedelta(days=14)

        orders_today = [o for o in all_orders if o.created_at and o.created_at >= today_start]
        orders_this_week = [o for o in all_orders if o.created_at and o.created_at >= week_start]
        orders_last_week = [
            o for o in all_orders
            if o.created_at and last_week_start <= o.created_at < week_start
        ]

        # Last order details
        last_order = order_query.order_by(desc(Order.created_at)).first()
        last_order_text = "No orders yet"
        if last_order:
            time_ago = _time_ago(last_order.created_at)
            customer_name = "Unknown customer"
            if last_order.customer:
                customer_name = last_order.customer.full_name or last_order.customer.email or "Unknown"
            last_order_text = f"{customer_name} — ₦{last_order.total_amount:,.2f} ({time_ago})"

        # ── REVENUE ───────────────────────────────────────────────
        total_revenue = sum(o.total_amount for o in all_orders if o.total_amount) or 0
        revenue_today = sum(o.total_amount for o in orders_today if o.total_amount) or 0
        revenue_this_week = sum(o.total_amount for o in orders_this_week if o.total_amount) or 0
        revenue_last_week = sum(o.total_amount for o in orders_last_week if o.total_amount) or 0

        # Revenue trend
        if revenue_last_week > 0:
            trend_pct = ((revenue_this_week - revenue_last_week) / revenue_last_week) * 100
            if trend_pct > 0:
                trend_text = f"↑ {trend_pct:.1f}% vs last week 🔥"
            elif trend_pct < 0:
                trend_text = f"↓ {abs(trend_pct):.1f}% vs last week"
            else:
                trend_text = "→ Same as last week"
        elif revenue_this_week > 0:
            trend_text = "↑ First sales this week!"
        else:
            trend_text = "No sales yet this week"

        # ── CUSTOMERS ─────────────────────────────────────────────
        customer_query = db.query(Customer)
        if user_id:
            customer_query = customer_query.filter(Customer.user_id == user_id)

        total_customers = customer_query.count()
        new_customers_this_week = customer_query.filter(
            Customer.created_at >= week_start
        ).count() if hasattr(Customer, 'created_at') else 0

        last_customer = customer_query.order_by(desc(Customer.created_at)).first()
        last_customer_text = "No customers yet"
        if last_customer:
            name = last_customer.full_name or last_customer.email or "Unknown"
            last_customer_text = f"{name}"

        # ── STORE SETTINGS ────────────────────────────────────────
        store_name = "Your Store"
        store_niche = "general"
        if user_id:
            settings = db.query(StoreSettings).filter(
                StoreSettings.user_id == user_id
            ).first()
            if settings:
                store_name = settings.store_name or "Your Store"
                store_niche = settings.niche or "general"

        # ── ALERTS ────────────────────────────────────────────────
        alerts = []
        if low_stock:
            names = ", ".join([p.name for p in low_stock[:3]])
            alerts.append(f"⚠️ Low stock: {names}")
        if out_of_stock:
            names = ", ".join([p.name for p in out_of_stock[:3]])
            alerts.append(f"🚨 Out of stock: {names}")
        if total_orders == 0:
            alerts.append("📦 No orders yet — store needs first sale")
        if len(orders_this_week) == 0 and total_orders > 0:
            alerts.append("📉 No orders this week yet")

        alerts_text = "\n".join(alerts) if alerts else "✅ No critical alerts"

        # ── BUILD THE SNAPSHOT STRING ─────────────────────────────
        products_text = "\n".join(product_lines) if product_lines else "  No products added yet"

        snapshot = f"""
### LIVE BUSINESS SNAPSHOT — {store_name.upper()}
### Generated: {now.strftime("%Y-%m-%d %H:%M UTC")}

━━━ STORE INFO ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Store Name: {store_name}
Niche: {store_niche}

━━━ PRODUCTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Products: {total_products}
In Stock: {in_stock} | Low Stock: {len(low_stock)} | Out of Stock: {len(out_of_stock)}

Product List:
{products_text}

━━━ ORDERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Orders: {total_orders}
Today: {len(orders_today)} orders | This Week: {len(orders_this_week)} orders
Last Order: {last_order_text}

━━━ REVENUE ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Revenue: ₦{total_revenue:,.2f}
Today: ₦{revenue_today:,.2f}
This Week: ₦{revenue_this_week:,.2f}
Trend: {trend_text}

━━━ CUSTOMERS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Total Customers: {total_customers}
New This Week: {new_customers_this_week}
Last Customer: {last_customer_text}

━━━ ALERTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
{alerts_text}

### END OF BUSINESS SNAPSHOT
"""
        return snapshot.strip()

    except Exception as e:
        print(f"BUSINESS INTELLIGENCE ERROR: {e}")
        import traceback
        traceback.print_exc()
        return "### LIVE BUSINESS SNAPSHOT\nUnable to load store data at this time."


def get_notifications(db: Session, user_id: str = None) -> list:
    """
    Returns a list of proactive notifications for the merchant.
    Called by the background notification engine.
    """
    notifications = []

    try:
        now = datetime.utcnow()
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)
        week_start = now - timedelta(days=7)
        last_48h = now - timedelta(hours=48)

        # ── Products ──────────────────────────────────────────────
        product_query = db.query(Product)
        if user_id:
            product_query = product_query.filter(Product.user_id == user_id)

        low_stock_products = product_query.filter(
            Product.stock_quantity > 0,
            Product.stock_quantity < 10
        ).all()

        out_of_stock_products = product_query.filter(
            Product.stock_quantity <= 0
        ).all()

        for p in low_stock_products:
            notifications.append({
                "type": "low_stock",
                "severity": "high",
                "message": f"⚠️ {p.name} is running low — only {int(p.stock_quantity)} left.",
                "action": f"Restock {p.name}"
            })

        for p in out_of_stock_products[:3]:
            notifications.append({
                "type": "out_of_stock",
                "severity": "critical",
                "message": f"🚨 {p.name} is completely out of stock.",
                "action": f"Restock {p.name} immediately"
            })

        # ── Orders ────────────────────────────────────────────────
        order_query = db.query(Order)
        if user_id:
            order_query = order_query.filter(Order.user_id == user_id)

        orders_today = order_query.filter(Order.created_at >= today_start).all()
        orders_this_week = order_query.filter(Order.created_at >= week_start).all()
        orders_last_48h = order_query.filter(Order.created_at >= last_48h).all()
        total_orders = order_query.count()

        if orders_today:
            revenue_today = sum(o.total_amount for o in orders_today if o.total_amount) or 0
            notifications.append({
                "type": "daily_summary",
                "severity": "info",
                "message": f"🔥 You've had {len(orders_today)} order(s) today — ₦{revenue_today:,.2f} in revenue.",
                "action": "View orders"
            })

        # No orders in 48 hours but store has had orders before
        if len(orders_last_48h) == 0 and total_orders > 0:
            notifications.append({
                "type": "no_recent_orders",
                "severity": "medium",
                "message": "📉 No orders in the last 48 hours. Want me to suggest a quick promo?",
                "action": "Get promo ideas"
            })

        # ── Revenue ───────────────────────────────────────────────
        last_week_start = now - timedelta(days=14)
        revenue_this_week = sum(
            o.total_amount for o in orders_this_week if o.total_amount
        ) or 0
        orders_last_week = order_query.filter(
            Order.created_at >= last_week_start,
            Order.created_at < week_start
        ).all()
        revenue_last_week = sum(
            o.total_amount for o in orders_last_week if o.total_amount
        ) or 0

        if revenue_last_week > 0 and revenue_this_week > revenue_last_week:
            pct = ((revenue_this_week - revenue_last_week) / revenue_last_week) * 100
            notifications.append({
                "type": "revenue_milestone",
                "severity": "success",
                "message": f"🎉 You're up {pct:.0f}% in revenue compared to last week. Keep it up!",
                "action": "View analytics"
            })

        # ── Customers ─────────────────────────────────────────────
        customer_query = db.query(Customer)
        if user_id:
            customer_query = customer_query.filter(Customer.user_id == user_id)

        new_customers = customer_query.filter(
            Customer.created_at >= week_start
        ).count() if hasattr(Customer, 'created_at') else 0

        if new_customers > 0:
            notifications.append({
                "type": "new_customers",
                "severity": "info",
                "message": f"👥 {new_customers} new customer(s) joined your store this week.",
                "action": "View customers"
            })

        return notifications

    except Exception as e:
        print(f"NOTIFICATIONS ERROR: {e}")
        return []


def get_morning_briefing(db: Session, user_id: str = None) -> str:
    """
    Generates a warm, conversational morning briefing for the merchant.
    Called every morning at 8am by the background task.
    """
    try:
        now = datetime.utcnow()
        yesterday_start = (now - timedelta(days=1)).replace(
            hour=0, minute=0, second=0, microsecond=0
        )
        today_start = now.replace(hour=0, minute=0, second=0, microsecond=0)

        order_query = db.query(Order)
        if user_id:
            order_query = order_query.filter(Order.user_id == user_id)

        orders_yesterday = order_query.filter(
            Order.created_at >= yesterday_start,
            Order.created_at < today_start
        ).all()

        revenue_yesterday = sum(
            o.total_amount for o in orders_yesterday if o.total_amount
        ) or 0

        hour = now.hour
        if hour < 12:
            greeting = "Good morning"
        elif hour < 17:
            greeting = "Good afternoon"
        else:
            greeting = "Good evening"

        if orders_yesterday:
            return (
                f"{greeting}! ☀️ Here's your update:\n\n"
                f"Yesterday you had **{len(orders_yesterday)} order(s)** "
                f"totalling **₦{revenue_yesterday:,.2f}**.\n\n"
                f"I'm watching your store. Ask me anything."
            )
        else:
            return (
                f"{greeting}! ☀️ No orders came in yesterday, "
                f"but today is a new day.\n\n"
                f"Want me to suggest something to drive sales today?"
            )

    except Exception as e:
        print(f"MORNING BRIEFING ERROR: {e}")
        return "Good morning! I'm here and watching your store. How can I help today?"


# ── HELPER ────────────────────────────────────────────────────────────────────

def _time_ago(dt: datetime) -> str:
    """Returns a human-readable time difference."""
    if not dt:
        return "unknown time"
    diff = datetime.utcnow() - dt
    if diff.seconds < 60:
        return "just now"
    elif diff.seconds < 3600:
        return f"{diff.seconds // 60}m ago"
    elif diff.days == 0:
        return f"{diff.seconds // 3600}h ago"
    elif diff.days == 1:
        return "yesterday"
    else:
        return f"{diff.days} days ago"
