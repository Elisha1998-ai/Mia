from sqlalchemy import Column, String, Float, Boolean, DateTime, ForeignKey, Text, DECIMAL, Integer
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
import uuid

Base = declarative_base()

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = 'user'
    id = Column(String, primary_key=True, default=generate_uuid)
    name = Column(String)
    first_name = Column(String, name='firstName')
    last_name = Column(String, name='lastName')
    email = Column(String, unique=True, nullable=False)
    image = Column(Text)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), name='createdAt')

class StoreSettings(Base):
    __tablename__ = 'storeSettings'
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey('user.id'), name='userId')
    store_name = Column(String, default='Mia Electronics', name='storeName')
    store_domain = Column(String, default='mia-electronics', name='storeDomain')
    niche = Column(String)
    store_address = Column(Text, name='storeAddress')
    store_phone = Column(String, name='storePhone')
    bank_name = Column(String, name='bankName')
    account_name = Column(String, name='accountName')
    account_number = Column(String, name='accountNumber')
    social_instagram = Column(String, name='socialInstagram')
    social_twitter = Column(String, name='socialTwitter')
    social_facebook = Column(String, name='socialFacebook')
    currency = Column(String, default='USD ($)')
    location = Column(String, default='United States of America')
    ai_tone = Column(String, default='Professional & Helpful', name='aiTone')
    admin_name = Column(String, name='adminName')
    admin_email = Column(String, name='adminEmail')
    admin_role = Column(String, default='Store Owner', name='adminRole')
    primary_color = Column(String, default='#000000', name='primaryColor')
    heading_font = Column(String, default='Instrument Serif', name='headingFont')
    body_font = Column(String, default='Inter', name='bodyFont')
    hero_title = Column(Text, name='heroTitle')
    hero_description = Column(Text, name='heroDescription')
    hero_image = Column(Text, name='heroImage')
    footer_description = Column(Text, name='footerDescription')
    onboarding_completed = Column(Boolean, default=False, name='onboardingCompleted')
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), name='updatedAt')

class Product(Base):
    __tablename__ = 'product'
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey('user.id'), name='userId')
    external_id = Column(String, unique=True, name='externalId') # ID from platform (Shopify/Amazon)
    name = Column(String, nullable=False)
    description = Column(Text)
    price = Column(Float)
    cost_of_goods = Column(Float, name='costOfGoods') # New: Track margins
    sku = Column(String, unique=True)
    stock_quantity = Column(Float, default=0, name='stockQuantity')
    image_url = Column(Text, name='imageUrl')
    platform = Column(String) # e.g., 'shopify'
    ai_notes = Column(Text, name='aiNotes') # New: AI agent insights
    created_at = Column(DateTime(timezone=True), server_default=func.now(), name='createdAt')

    variants = relationship("ProductVariant", back_populates="product", cascade="all, delete-orphan")

class Customer(Base):
    __tablename__ = 'customer'
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey('user.id'), name='userId')
    email = Column(String, unique=True, nullable=False)
    full_name = Column(String, name='fullName')
    phone = Column(String)
    lifetime_value = Column(Float, default=0.0, name='lifetimeValue') # New: Calculated LTV
    ai_notes = Column(Text, name='aiNotes') # New: AI agent insights
    created_at = Column(DateTime(timezone=True), server_default=func.now(), name='createdAt')

class Store(Base):
    __tablename__ = 'store'
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey('user.id'), name='userId')
    name = Column(String, nullable=False)
    platform = Column(String, nullable=False) # 'shopify', 'amazon', etc.
    store_url = Column(String, unique=True, nullable=False, name='storeUrl')
    access_token = Column(String, name='accessToken')
    api_key = Column(String)
    api_secret = Column(String)
    is_active = Column(Boolean, default=True, name='isActive')
    last_sync = Column(DateTime(timezone=True))
    created_at = Column(DateTime(timezone=True), server_default=func.now(), name='createdAt')

class Order(Base):
    __tablename__ = 'order'
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey('user.id'), name='userId')
    order_number = Column(String, unique=True, nullable=False, name='orderNumber')
    external_id = Column(String, unique=True, name='externalId')
    customer_id = Column(String, ForeignKey('customer.id'), name='customerId')
    store_id = Column(String, ForeignKey('store.id'), name='storeId')
    total_amount = Column(DECIMAL(10, 2), name='totalAmount')
    profit_margin = Column(DECIMAL(10, 2), name='profitMargin')
    status = Column(String, nullable=False, default='pending')
    created_at = Column(DateTime(timezone=True), server_default=func.now(), name='createdAt')
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), name='updatedAt')
    
    customer = relationship("Customer")
    store = relationship("Store")
    items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")

class OrderItem(Base):
    __tablename__ = 'orderItem'
    id = Column(String, primary_key=True, default=generate_uuid)
    order_id = Column(String, ForeignKey('order.id'), nullable=False, name='orderId')
    product_id = Column(String, ForeignKey('product.id'), nullable=False, name='productId')
    quantity = Column(Integer, nullable=False)
    price = Column(DECIMAL(10, 2), nullable=False)

    order = relationship("Order", back_populates="items")
    product = relationship("Product")

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
    customer_id = Column(String, ForeignKey('customer.id'))
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
    order_id = Column(String, ForeignKey('order.id'), nullable=True)
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
    order_id = Column(String, ForeignKey('order.id'))
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
    __tablename__ = 'inventoryLog'
    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey('product.id'), name='productId')
    change = Column(Integer, nullable=False) # Positive for restock, negative for sale
    reason = Column(String, nullable=False) # 'sale', 'restock', 'return', 'adjustment'
    created_at = Column(DateTime(timezone=True), server_default=func.now(), name='createdAt')
    
    product = relationship("Product")

class ProductVariant(Base):
    __tablename__ = 'productVariant'
    id = Column(String, primary_key=True, default=generate_uuid)
    product_id = Column(String, ForeignKey('product.id'), name='productId')
    name = Column(String, nullable=False) # e.g. "Red / Large"
    sku = Column(String, unique=True, nullable=False)
    price = Column(Float) # Override base product price if set
    stock_quantity = Column(Integer, default=0, name='stockQuantity')
    image_url = Column(Text, name='imageUrl')
    created_at = Column(DateTime(timezone=True), server_default=func.now(), name='createdAt')
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), name='updatedAt')

    product = relationship("Product", back_populates="variants")

class Discount(Base):
    __tablename__ = 'discount'
    id = Column(String, primary_key=True, default=generate_uuid)
    user_id = Column(String, ForeignKey('user.id'), name='userId')
    code = Column(String, nullable=False)
    type = Column(String, nullable=False) # 'percentage', 'fixed'
    value = Column(Float, nullable=False)
    status = Column(String, nullable=False) # 'Active', 'Scheduled', 'Expired'
    usage_count = Column(Integer, default=0, name='usageCount')
    start_date = Column(DateTime(timezone=True), nullable=False, name='startDate')
    end_date = Column(DateTime(timezone=True), name='endDate')
    created_at = Column(DateTime(timezone=True), server_default=func.now(), name='createdAt')
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now(), name='updatedAt')

# Update Product class to include relationship
# We need to find the Product class and add the relationship
