from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, DECIMAL, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class Product(Base):
    __tablename__ = 'products'
    id = Column(String, primary_key=True, default=generate_uuid)
    external_id = Column(String, unique=True) # ID from platform (Shopify/Amazon)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float)
    cost_of_goods = Column(Float) # New: Track margins
    sku = Column(String, unique=True)
    stock_quantity = Column(Float, default=0)
    image_url = Column(Text)
    platform = Column(String) # e.g., 'shopify'
    ai_notes = Column(Text) # New: AI agent insights
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Customer(Base):
    __tablename__ = 'customers'
    id = Column(String, primary_key=True, default=generate_uuid)
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String)
    phone = Column(String)
    lifetime_value = Column(Float, default=0.0) # New: Calculated LTV
    ai_notes = Column(Text) # New: AI agent insights
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Store(Base):
    __tablename__ = 'stores'
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    platform = Column(String, nullable=False) # 'shopify', 'amazon', etc.
    store_url = Column(String, unique=True, nullable=False)
    access_token = Column(String)
    api_key = Column(String)
    api_secret = Column(String)
    is_active = Column(Boolean, default=True)
    last_sync = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Order(Base):
    __tablename__ = 'orders'
    id = Column(String, primary_key=True, default=generate_uuid)
    external_id = Column(String, unique=True)
    customer_id = Column(String, ForeignKey('customers.id'))
    store_id = Column(String, ForeignKey('stores.id'))
    total_amount = Column(DECIMAL(10, 2))
    profit_margin = Column(Float) # New: Calculated profit for this order
    status = Column(String, default='pending')
    ai_notes = Column(Text) # New: AI agent insights
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    customer = relationship("Customer")
    store = relationship("Store")

class MarketingAsset(Base):
    __tablename__ = 'marketing_assets'
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    type = Column(String) # 'logo', 'flier', 'style_guide'
    url = Column(String)
    prompt_used = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class SupportTicket(Base):
    __tablename__ = 'support_tickets'
    id = Column(String, primary_key=True, default=generate_uuid)
    customer_id = Column(String, ForeignKey('customers.id'))
    subject = Column(String)
    content = Column(Text)
    status = Column(String, default='open') # 'open', 'resolved', 'closed'
    sentiment = Column(String) # 'positive', 'neutral', 'negative'
    ai_response = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    customer = relationship("Customer")

class StorefrontSetup(Base):
    __tablename__ = 'storefront_setups'
    id = Column(String, primary_key=True, default=generate_uuid)
    business_name = Column(String)
    niche = Column(String)
    template_id = Column(String)
    copy_fields = Column(Text) # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class FinancialLedger(Base):
    __tablename__ = 'financial_ledger'
    id = Column(String, primary_key=True, default=generate_uuid)
    type = Column(String) # 'income', 'expense'
    category = Column(String) # 'ads', 'logistics', 'software', 'sale'
    amount = Column(DECIMAL(10, 2))
    description = Column(Text)
    order_id = Column(String, ForeignKey('orders.id'), nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class KnowledgeBase(Base):
    __tablename__ = 'knowledge_base'
    id = Column(String, primary_key=True, default=generate_uuid)
    title = Column(String, nullable=False)
    content = Column(Text, nullable=False)
    category = Column(String) # 'faq', 'business_rule', 'internal_doc'
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class Shipment(Base):
    __tablename__ = 'shipments'
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey('orders.id'))
    tracking_number = Column(String)
    carrier = Column(String) # 'fedex', 'ups', 'dhl'
    status = Column(String) # 'shipped', 'in_transit', 'delivered'
    estimated_delivery = Column(DateTime)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    order = relationship("Order")

class Campaign(Base):
    __tablename__ = 'campaigns'
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String, nullable=False)
    platform = Column(String) # 'email', 'facebook', 'google'
    status = Column(String) # 'draft', 'active', 'paused', 'completed'
    budget = Column(DECIMAL(10, 2))
    spend = Column(DECIMAL(10, 2), default=0.0)
    conversions = Column(Integer, default=0)
    ai_strategy = Column(Text) # AI generated strategy
    created_at = Column(DateTime(timezone=True), server_default=func.now())

class InventoryLog(Base):
    __tablename__ = 'inventory_logs'
    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey('products.id'))
    change_amount = Column(Float) # Positive for restock, negative for sale
    reason = Column(String) # 'sale', 'restock', 'return', 'adjustment'
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    
    product = relationship("Product")
