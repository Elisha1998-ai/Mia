// API Service for connecting to the backend
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface ProductVariant {
  id?: string;
  name: string;
  sku: string;
  price?: number;
  stock_quantity: number;
  image_url?: string;
}

interface Product {
  id: string;
  name: string;
  sku: string;
  price: number;
  stock_quantity: number;
  description?: string;
  image_url?: string;
  platform?: string;
  created_at?: string;
  variants?: ProductVariant[];
}

interface OrderItem {
  id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  order_number: string;
  external_id?: string;
  customer_id?: string;
  store_id?: string;
  total_amount: number;
  profit_margin?: number;
  status: string;
  shipping_address?: string;
  shipping_method?: string;
  payment_method?: string;
  created_at?: string;
  customer?: {
    id: string;
    email: string;
    full_name?: string;
    phone?: string;
  };
  items?: OrderItem[];
}

interface Customer {
  id: string;
  email: string;
  full_name?: string;
  phone?: string;
  lifetime_value: number;
  created_at?: string;
  orders_count: number;
  last_order_date?: string | null;
}

interface DashboardStats {
  total_products: number;
  total_orders: number;
  total_customers: number;
  total_revenue: number;
  recent_orders: number;
  low_stock_products: number;
}

export interface Discount {
  id: string;
  code: string;
  type: 'percentage' | 'fixed';
  value: number;
  status: 'Active' | 'Scheduled' | 'Expired';
  usageCount: number;
  startDate: string;
  endDate?: string;
  createdAt: string;
}

interface StoreSettings {
  id: string;
  userId: string;
  storeName: string;
  storeDomain: string;
  niche?: string;
  storeAddress?: string;
  storePhone?: string;
  bankName?: string;
  accountName?: string;
  accountNumber?: string;
  socialInstagram?: string;
  socialTwitter?: string;
  socialFacebook?: string;
  socialTiktok?: string;
  socialYoutube?: string;
  socialSnapchat?: string;
  currency: string;
  location: string;
  aiTone: string;
  adminName: string;
  adminEmail: string;
  adminRole: string;
  primaryColor: string;
  headingFont: string;
  bodyFont: string;
  heroTitle?: string;
  heroDescription?: string;
  footerDescription?: string;
}

class APIService {
  private async request(endpoint: string, options: RequestInit & { useInternal?: boolean } = {}) {
    const { useInternal, ...fetchOptions } = options;
    const baseUrl = useInternal ? '' : API_BASE_URL;
    const url = `${baseUrl}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...fetchOptions.headers,
      },
      ...fetchOptions,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Products
  async getProducts(skip = 0, limit = 100) {
    return this.request(`/api/products?skip=${skip}&limit=${limit}`, { useInternal: true });
  }

  async getProduct(id: string) {
    return this.request(`/api/products/${id}`, { useInternal: true });
  }

  async createProduct(data: Partial<Product>) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  async updateProduct(id: string, data: Partial<Product>) {
    return this.request(`/api/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/api/products/${id}`, {
      method: 'DELETE',
      useInternal: true,
    });
  }

  // Orders
  async getOrders(skip = 0, limit = 100) {
    return this.request(`/api/orders?skip=${skip}&limit=${limit}`, { useInternal: true });
  }

  async getOrder(id: string) {
    return this.request(`/api/orders/${id}`, { useInternal: true });
  }

  async createOrder(data: any) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  async updateOrder(id: string, data: any) {
    return this.request(`/api/orders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  async deleteOrder(id: string) {
    return this.request(`/api/orders/${id}`, {
      method: 'DELETE',
      useInternal: true,
    });
  }

  // Customers
  async getCustomers(skip = 0, limit = 100) {
    return this.request(`/api/customers?skip=${skip}&limit=${limit}`, { useInternal: true });
  }

  async getCustomer(id: string) {
    return this.request(`/api/customers/${id}`, { useInternal: true });
  }

  async createCustomer(data: Partial<Customer>) {
    return this.request('/api/customers', {
      method: 'POST',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  async updateCustomer(id: string, data: Partial<Customer>) {
    return this.request(`/api/customers/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  async deleteCustomer(id: string) {
    return this.request(`/api/customers/${id}`, {
      method: 'DELETE',
      useInternal: true,
    });
  }

  // Discounts
  async getDiscounts(skip = 0, limit = 100) {
    return this.request(`/api/discounts?skip=${skip}&limit=${limit}`, { useInternal: true });
  }

  async createDiscount(data: Partial<Discount>) {
    return this.request('/api/discounts', {
      method: 'POST',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  async updateDiscount(id: string, data: Partial<Discount>) {
    return this.request(`/api/discounts/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  async deleteDiscount(id: string) {
    return this.request(`/api/discounts/${id}`, {
      method: 'DELETE',
      useInternal: true,
    });
  }

  // Dashboard
  async getDashboardStats() {
    return this.request('/api/dashboard/stats', { useInternal: true });
  }

  // Settings
  async getSettings() {
    return this.request('/api/settings', { useInternal: true });
  }

  async updateSettings(data: Partial<StoreSettings>) {
    return this.request('/api/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
      useInternal: true,
    });
  }

  // Integrations & Sync (FastAPI)
  async getIntegrations() {
    return this.request('/api/integrations', { useInternal: true });
  }

  async connectShopify(shopUrl: string, accessToken: string, userId?: string) {
    return this.request('/chat-api/connect/shopify', {
      method: 'POST',
      body: JSON.stringify({ 
        shop_url: shopUrl, 
        access_token: accessToken,
        user_id: userId 
      }),
    });
  }

  async syncStore(storeId: string) {
    return this.request(`/chat-api/sync/${storeId}`);
  }
}

export const apiService = new APIService();
export type { Product, Order, Customer, DashboardStats, StoreSettings };