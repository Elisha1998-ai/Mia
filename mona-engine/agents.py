"""
agents.py
Mona's AI Brain — 4 Core MVP Roles

Role 1: Mona — Unified Agent (brain, conversation, routing)
Role 2: Data Architect (parse messy product data)
Role 3: Brand Designer (store setup, brand identity)
Role 4: Copywriter (all store words)

Everything routes through Mona.
The others are her capabilities running silently behind her.
"""

import os
import json
from dotenv import load_dotenv
from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
from langchain_core.tools import tool

load_dotenv(override=False)


# ══════════════════════════════════════════════════════════════════
# ROLE 1 — MONA'S TOOLS
# These are the actions Mona can trigger.
# Each tool returns a signal string that main.py intercepts.
# ══════════════════════════════════════════════════════════════════

@tool
def list_products(limit: int = 50):
    """
    List, show, or display the products currently in the store inventory.
    Use this when the merchant asks: 'list my products', 'show my products',
    'what products do I have', 'how many products', 'show inventory'.
    """
    return f"ACTION:list_products:{limit}"


@tool
def add_products(product_list_text: str):
    """
    Import or add NEW products the merchant has provided in text format.
    Use this ONLY when the merchant is GIVING you products to add.
    Examples: 'Add these products: ...', 'Import my inventory list', 'Here are my products'.
    DO NOT use this to list existing products.
    product_list_text: The raw text containing product names, prices, and details.
    """
    return f"ACTION:add_products:{product_list_text}"


@tool
def update_product_stock(product_name: str, new_quantity: int):
    """
    Update the stock quantity of an existing product.
    Use when merchant says: 'update stock for X', 'set X to Y units', 'restock X'.
    product_name: Name of the product to update.
    new_quantity: The new stock quantity.
    """
    return f"ACTION:update_stock:{product_name}:{new_quantity}"


@tool
def list_orders(limit: int = 20):
    """
    Show the merchant's recent orders.
    Use when merchant asks: 'show my orders', 'recent orders', 'what orders do I have'.
    """
    return f"ACTION:list_orders:{limit}"


@tool
def update_order_status(order_id: str, status: str):
    """
    Update the status of an order.
    Use when merchant says: 'mark order X as shipped', 'update order X to delivered'.
    order_id: The order ID.
    status: New status (pending, processing, shipped, delivered, cancelled).
    """
    return f"ACTION:update_order:{order_id}:{status}"


@tool
def list_customers(limit: int = 20):
    """
    Show the merchant's customers.
    Use when merchant asks: 'show my customers', 'who are my customers', 'customer list'.
    """
    return f"ACTION:list_customers:{limit}"


@tool
def create_invoice(customer_name: str, amount: float, items: str):
    """
    Generate a professional PDF invoice for a customer.
    Use when merchant says: 'create invoice for X', 'generate invoice', 'make invoice'.
    customer_name: Name of the customer.
    amount: Total invoice amount in Naira.
    items: Description of items or services (comma-separated).
    """
    return f"ACTION:create_invoice:{customer_name}:{amount}:{items}"


@tool
def setup_store(business_name: str, niche: str):
    """
    Set up a complete storefront for a new merchant.
    Use when merchant says: 'setup my store', 'build my store', 'create my shop',
    'I want to start a store selling X'.
    business_name: The name of the business.
    niche: What the business sells.
    """
    return f"ACTION:setup_store:{business_name}:{niche}"


@tool
def customize_branding(
    primary_color: str = None,
    heading_font: str = None,
    body_font: str = None,
    hero_image_url: str = None
):
    """
    Customize the store's colors, fonts, and visual identity.
    Use when merchant says: 'change my store color', 'update my branding',
    'change my font', 'make my store look like X'.
    primary_color: Hex color code e.g. '#FF5733'.
    heading_font: Font for headings.
    body_font: Font for body text.
    hero_image_url: URL for hero background image.
    """
    return f"ACTION:customize_branding:{primary_color}:{heading_font}:{body_font}:{hero_image_url}"


@tool
def create_document(doc_type: str, details: str):
    """
    Create a professional business document (policy, legal text, etc).
    Use when merchant says: 'write a refund policy', 'create shipping policy',
    'draft terms and conditions'.
    doc_type: Type of document e.g. 'refund_policy', 'shipping_policy', 'terms'.
    details: Any specific details to include.
    """
    return f"ACTION:create_document:{doc_type}:{details}"


# ══════════════════════════════════════════════════════════════════
# ROLE 1 — MONA UNIFIED AGENT
# The brain. Receives every merchant message.
# Decides what to do and either responds or calls a tool.
# ══════════════════════════════════════════════════════════════════

MONA_TOOLS = [
    list_products,
    add_products,
    update_product_stock,
    list_orders,
    update_order_status,
    list_customers,
    create_invoice,
    setup_store,
    customize_branding,
    create_document,
]


def mona_agent(message: str, business_context: str = None) -> dict:
    """
    Role 1 — Mona Unified Agent.
    The main brain. Handles every merchant message.

    Returns:
        {
            "tool": tool_name or None,
            "args": tool arguments or {},
            "content": Mona's text response
        }
    """
    load_dotenv(override=False)
    api_key = os.getenv("GROQ_API_KEY")

    if not api_key:
        return {
            "tool": None,
            "content": "I can't connect to my brain right now. Please check the API key configuration."
        }

    try:
        llm = ChatGroq(
            temperature=0.0,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key
        ).bind_tools(MONA_TOOLS)

        system_prompt = f"""
{business_context if business_context else "### No store data available yet."}

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

### YOUR IDENTITY
You are Mona — a sharp, confident, and warm AI store manager 
built for African merchants. You run their business so they 
don't have to do everything alone.

### HOW YOU THINK — follow this for every message:
1. Read the LIVE BUSINESS SNAPSHOT above carefully
2. Understand what the merchant actually wants
3. If they want DATA (list, show, how many) → call the right tool
4. If they want an ACTION (add, update, create) → call the right tool  
5. If they want ADVICE or CONVERSATION → respond directly using the snapshot data
6. Never guess or make up data — always use the snapshot above

### CRITICAL RULES:
- ALWAYS read the Business Snapshot before responding
- NEVER say "I don't have access to your data" — the snapshot IS your data
- NEVER say "no products found" without calling list_products first
- If snapshot shows 0 products, tell the merchant and offer to help add some
- Use ₦ for all currency — never $ or other currencies
- Be conversational, warm, and direct — like a trusted business partner
- Always confirm what you did and suggest a next step
- Keep responses concise — merchants are busy people

### YOUR PERSONALITY:
Sharp. Confident. Warm. A touch playful.
You speak like someone who genuinely cares about the merchant's success.
You never sound like a bot. You never sound corporate.
You sound like Mona.
"""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=message)
        ]

        response = llm.invoke(messages)

        if response.tool_calls:
            tool_call = response.tool_calls[0]
            return {
                "tool": tool_call["name"],
                "args": tool_call["args"],
                "content": response.content or ""
            }

        return {
            "tool": None,
            "args": {},
            "content": response.content
        }

    except Exception as e:
        print(f"MONA AGENT ERROR: {e}")
        import traceback
        traceback.print_exc()
        return {
            "tool": None,
            "content": f"I ran into an issue: {str(e)}. Please try again."
        }


# ══════════════════════════════════════════════════════════════════
# ROLE 2 — DATA ARCHITECT
# Parses messy text into clean product data.
# Called when merchant gives Mona a product list to import.
# ══════════════════════════════════════════════════════════════════

def data_architect_parse_products(raw_text: str) -> list:
    """
    Role 2 — Data Architect.
    Takes messy product text and returns a clean list of product dicts.

    Returns:
        [{"name": "...", "price": 0.0, "sku": "...", "stock_quantity": 0}, ...]
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return []

    try:
        llm = ChatGroq(
            temperature=0.0,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key
        )

        system_prompt = """You are a data extraction expert. 
Your job is to parse product information from messy text and return clean structured data.

RULES:
- Return ONLY a valid JSON array. No explanation. No markdown. No backticks.
- Each product must have: name (string), price (number), sku (string or null), stock_quantity (number)
- If price is missing, use 0
- If SKU is missing, use null
- If stock is missing, use 0
- Prices are in Nigerian Naira — extract only the number
- Example output: [{"name": "Black Sneakers", "price": 15000, "sku": "SNK-001", "stock_quantity": 20}]"""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Extract products from this text:\n\n{raw_text}")
        ]

        response = llm.invoke(messages)
        raw = response.content.strip()

        # Clean any markdown if present
        if "```" in raw:
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]

        # Find the JSON array
        start = raw.find("[")
        end = raw.rfind("]") + 1
        if start == -1 or end == 0:
            print(f"DATA ARCHITECT: No JSON array found in response: {raw}")
            return []

        products = json.loads(raw[start:end])
        return products

    except Exception as e:
        print(f"DATA ARCHITECT ERROR: {e}")
        return []


def data_architect_map_csv(columns: list, data_type: str) -> dict:
    """
    Role 2 — Data Architect.
    Maps CSV column names to Mona's internal schema.

    Returns:
        {"csv_col": "mona_col", ...}
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return {}

    try:
        llm = ChatGroq(
            temperature=0.0,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key
        )

        system_prompt = f"""You are a data mapping expert.
Map the given CSV columns to Mona's {data_type} schema.
Return ONLY a valid JSON object mapping CSV columns to schema fields.
No explanation. No markdown. No backticks.

For products schema use: name, price, sku, stock_quantity, description, image_url
For customers schema use: email, full_name, phone
For orders schema use: external_id, total_amount, status"""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=f"Map these CSV columns: {columns}")
        ]

        response = llm.invoke(messages)
        raw = response.content.strip().replace("```json", "").replace("```", "")
        return json.loads(raw)

    except Exception as e:
        print(f"DATA ARCHITECT CSV MAP ERROR: {e}")
        return {}


# ══════════════════════════════════════════════════════════════════
# ROLE 3 — BRAND DESIGNER
# Generates complete brand identity for a new store.
# Called during store setup — the magic first moment.
# ══════════════════════════════════════════════════════════════════

def brand_designer(business_name: str, niche: str) -> dict:
    """
    Role 3 — Brand Designer.
    Generates a complete brand identity package.

    Returns:
        {
            "industry": "...",
            "primary_color": "#...",
            "heading_font": "...",
            "body_font": "...",
            "tagline": "...",
            "brand_mantra": "..."
        }
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return _default_brand(business_name, niche)

    try:
        llm = ChatGroq(
            temperature=0.3,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key
        )

        system_prompt = """You are an expert brand identity designer specializing in African e-commerce businesses.
        
Return ONLY a valid JSON object. No explanation. No markdown. No backticks.

Required fields:
- industry: The e-commerce industry category
- primary_color: A hex color code that fits the brand
- heading_font: One of: 'Instrument Serif', 'Playfair Display', 'Montserrat', 'Oswald', 'Cormorant Garamond'
- body_font: One of: 'Inter', 'Roboto', 'Poppins', 'Work Sans'
- tagline: A short punchy tagline (max 8 words)
- brand_mantra: One sentence that captures the brand's essence

Color psychology guide:
- Fashion/Luxury: Deep black, gold, navy
- Beauty/Skincare: Soft pink, blush, sage green  
- Food/Beverage: Deep red, warm orange, earthy brown
- Electronics: Electric blue, dark grey, black
- Kids/Baby: Soft pastels, mint, light blue
- Fitness: Bold red, neon green, black
- Jewelry: Gold, deep purple, cream"""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(
                content=f"Design a brand for '{business_name}', a {niche} business targeting African customers."
            )
        ]

        response = llm.invoke(messages)
        raw = response.content.strip().replace("```json", "").replace("```", "")

        brand_data = json.loads(raw)
        return brand_data

    except Exception as e:
        print(f"BRAND DESIGNER ERROR: {e}")
        return _default_brand(business_name, niche)


def _default_brand(business_name: str, niche: str) -> dict:
    """Fallback brand if AI fails."""
    return {
        "industry": "General E-commerce",
        "primary_color": "#4f35e8",
        "heading_font": "Instrument Serif",
        "body_font": "Inter",
        "tagline": f"The best of {niche}",
        "brand_mantra": f"Elevating the {niche} experience for African customers."
    }


# ══════════════════════════════════════════════════════════════════
# ROLE 4 — COPYWRITER
# Writes all store words. Hero text, descriptions, policies.
# No merchant should write a single word themselves.
# ══════════════════════════════════════════════════════════════════

def copywriter_storefront(business_name: str, niche: str, industry: str, brand_mantra: str) -> dict:
    """
    Role 4 — Copywriter.
    Generates all storefront copy for a new store.

    Returns:
        {
            "hero_title": "...",
            "hero_description": "...",
            "footer_description": "..."
        }
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return _default_copy(business_name, niche)

    try:
        llm = ChatGroq(
            temperature=0.7,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key
        )

        system_prompt = """You are a world-class copywriter specializing in African e-commerce brands.
Write copy that converts visitors into buyers.
Return ONLY a valid JSON object. No explanation. No markdown. No backticks.

Required fields:
- hero_title: Bold, punchy headline (max 8 words)
- hero_description: Supporting subheadline (max 20 words)  
- footer_description: Brand footer tagline (max 25 words)

Style guide:
- Bold and direct — no fluff
- Speaks to African customers specifically
- Confident, not salesy
- Uses active voice"""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(
                content=f"""Write storefront copy for:
Business: {business_name}
Niche: {niche}
Industry: {industry}
Brand Mantra: {brand_mantra}"""
            )
        ]

        response = llm.invoke(messages)
        raw = response.content.strip().replace("```json", "").replace("```", "")
        return json.loads(raw)

    except Exception as e:
        print(f"COPYWRITER ERROR: {e}")
        return _default_copy(business_name, niche)


def copywriter_product_description(product_name: str, category: str = None, features: str = None) -> str:
    """
    Role 4 — Copywriter.
    Writes a compelling product description.
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return f"Premium quality {product_name}. Shop now."

    try:
        llm = ChatGroq(
            temperature=0.7,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key
        )

        prompt = f"Write a compelling, SEO-friendly product description for '{product_name}'"
        if category:
            prompt += f" in the {category} category"
        if features:
            prompt += f" with these features: {features}"
        prompt += ". Max 3 sentences. Confident, direct tone. Return ONLY the description text."

        messages = [
            SystemMessage(content="You are a product copywriter for African e-commerce brands. Be concise and compelling."),
            HumanMessage(content=prompt)
        ]

        response = llm.invoke(messages)
        return response.content.strip()

    except Exception as e:
        print(f"COPYWRITER DESCRIPTION ERROR: {e}")
        return f"Premium quality {product_name}."


def copywriter_document(doc_type: str, details: str, business_context: str = None) -> str:
    """
    Role 4 — Copywriter.
    Writes professional business documents (policies, legal text).
    """
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        return f"[{doc_type.replace('_', ' ').title()} document could not be generated]"

    try:
        llm = ChatGroq(
            temperature=0.3,
            model_name="llama-3.3-70b-versatile",
            groq_api_key=api_key
        )

        system_prompt = f"""You are a professional business document writer.
Write clear, professional documents for African e-commerce businesses.
{f'Business context: {business_context}' if business_context else ''}
Return only the document content. No preamble. No explanation."""

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(
                content=f"Write a {doc_type.replace('_', ' ')} for this business. Details: {details}"
            )
        ]

        response = llm.invoke(messages)
        return response.content.strip()

    except Exception as e:
        print(f"COPYWRITER DOCUMENT ERROR: {e}")
        return f"I couldn't generate the {doc_type} right now. Please try again."


def _default_copy(business_name: str, niche: str) -> dict:
    """Fallback copy if AI fails."""
    return {
        "hero_title": f"Welcome to {business_name}",
        "hero_description": f"Discover the best {niche} products curated just for you.",
        "footer_description": f"{business_name} — Your trusted destination for quality {niche} products."
    }
