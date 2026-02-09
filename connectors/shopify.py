import requests
from typing import List, Dict
from .base import BaseConnector

class ShopifyConnector(BaseConnector):
    def __init__(self, shop_url: str, access_token: str):
        self.shop_url = shop_url.rstrip('/')
        if not self.shop_url.startswith('http'):
            self.shop_url = f"https://{self.shop_url}"
        self.access_token = access_token
        self.api_version = "2023-10"
        self.headers = {
            "X-Shopify-Access-Token": self.access_token,
            "Content-Type": "application/json"
        }

    def get_platform_name(self) -> str:
        return "shopify"

    def fetch_products(self) -> List[Dict]:
        """Fetches products and normalizes them to Mia's Standard Format"""
        endpoint = f"{self.shop_url}/admin/api/{self.api_version}/products.json"
        try:
            response = requests.get(endpoint, headers=self.headers)
            if response.status_code == 200:
                raw_products = response.json().get('products', [])
                return [self._normalize_product(p) for p in raw_products]
            else:
                print(f"Error fetching products: {response.status_code} - {response.text}")
                return []
        except Exception as e:
            print(f"Exception fetching products: {e}")
            return []

    def fetch_orders(self) -> List[Dict]:
        """Fetches orders and normalizes them to Mia's Standard Format"""
        endpoint = f"{self.shop_url}/admin/api/{self.api_version}/orders.json?status=any"
        try:
            response = requests.get(endpoint, headers=self.headers)
            if response.status_code == 200:
                raw_orders = response.json().get('orders', [])
                return [self._normalize_order(o) for o in raw_orders]
            else:
                print(f"Error fetching orders: {response.status_code} - {response.text}")
                return []
        except Exception as e:
            print(f"Exception fetching orders: {e}")
            return []

    def _normalize_product(self, p: Dict) -> Dict:
        """Translates Shopify product format to Mia's Standard Product format"""
        variant = p.get('variants', [{}])[0]
        return {
            "external_id": str(p.get('id')),
            "name": p.get('title'),
            "description": p.get('body_html'),
            "price": float(variant.get('price', 0)) if variant.get('price') else 0.0,
            "cost_of_goods": None, # Shopify requires a separate InventoryItem API call for this
            "sku": variant.get('sku'),
            "stock_quantity": float(variant.get('inventory_quantity', 0)) if variant.get('inventory_quantity') else 0.0,
            "image_url": p.get('image', {}).get('src') if p.get('image') else None,
            "platform": "shopify",
            "ai_notes": None # To be populated by Mia's agents later
        }

    def _normalize_order(self, o: Dict) -> Dict:
        """Translates Shopify order format to Mia's Standard Order format"""
        return {
            "external_id": str(o.get('id')),
            "customer_email": o.get('email'),
            "total_amount": float(o.get('total_price', 0)),
            "profit_margin": None, # Calculated by Mia after subtracting COGS
            "status": o.get('financial_status'),
            "created_at": o.get('created_at'),
            "platform": "shopify",
            "ai_notes": f"Shopify Order Tags: {o.get('tags', '')}"
        }
