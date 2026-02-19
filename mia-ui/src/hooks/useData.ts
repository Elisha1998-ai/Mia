// Custom hooks for data fetching
import { useState, useEffect } from 'react';
import { apiService, type Product, type Order, type Customer, type DashboardStats, type StoreSettings, type Discount } from '@/lib/api';

// Hook for products data
export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchProducts = async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getProducts(skip, limit);
      setProducts(response.products);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: Partial<Product>) => {
    try {
      const newProduct = await apiService.createProduct(productData);
      setProducts(prev => [newProduct, ...prev]);
      setTotal(prev => prev + 1);
      return newProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create product');
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const updatedProduct = await apiService.updateProduct(id, productData);
      setProducts(prev => prev.map(p => p.id === id ? updatedProduct : p));
      return updatedProduct;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update product');
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      await apiService.deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete product');
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    total,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteProduct
  };
};

// Hook for orders data
export const useOrders = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchOrders = async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getOrders(skip, limit);
      setOrders(response.orders);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch orders');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: any) => {
    try {
      const newOrder = await apiService.createOrder(orderData);
      setOrders(prev => [newOrder, ...prev]);
      setTotal(prev => prev + 1);
      return newOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    }
  };

  const updateOrder = async (id: string, orderData: any) => {
    try {
      const updatedOrder = await apiService.updateOrder(id, orderData);
      setOrders(prev => prev.map(o => o.id === id ? updatedOrder : o));
      return updatedOrder;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order');
      throw err;
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      await apiService.deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete order');
      throw err;
    }
  };

  const getOrder = async (id: string) => {
    try {
      return await apiService.getOrder(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch order details');
      throw err;
    }
  };

  return {
    orders,
    loading,
    error,
    total,
    fetchOrders,
    getOrder,
    createOrder,
    updateOrder,
    deleteOrder
  };
};

// Hook for customers data
export const useCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchCustomers = async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCustomers(skip, limit);
      setCustomers(response.customers);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customers');
      console.error('Error fetching customers:', err);
    } finally {
      setLoading(false);
    }
  };

  const createCustomer = async (customerData: Partial<Customer>) => {
    try {
      const newCustomer = await apiService.createCustomer(customerData);
      setCustomers(prev => [newCustomer, ...prev]);
      setTotal(prev => prev + 1);
      return newCustomer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create customer');
      throw err;
    }
  };

  const updateCustomer = async (id: string, customerData: Partial<Customer>) => {
    try {
      const updatedCustomer = await apiService.updateCustomer(id, customerData);
      setCustomers(prev => prev.map(c => c.id === id ? updatedCustomer : c));
      return updatedCustomer;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update customer');
      throw err;
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      await apiService.deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete customer');
      throw err;
    }
  };

  const getCustomer = async (id: string) => {
    try {
      return await apiService.getCustomer(id);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch customer details');
      throw err;
    }
  };

  return {
    customers,
    loading,
    error,
    total,
    fetchCustomers,
    getCustomer,
    createCustomer,
    deleteCustomer
  };
};

// Hook for dashboard stats
export const useDashboardStats = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const dashboardStats = await apiService.getDashboardStats();
      setStats(dashboardStats);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch dashboard stats');
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  return {
    stats,
    loading,
    error,
    fetchStats
  };
};

// Hook for store settings
export const useSettings = () => {
  const [settings, setSettings] = useState<StoreSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await apiService.getSettings();
      setSettings(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch settings');
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (data: Partial<StoreSettings>) => {
    try {
      setLoading(true);
      const updated = await apiService.updateSettings(data);
      setSettings(updated);
      return updated;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update settings');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    settings,
    loading,
    error,
    fetchSettings,
    updateSettings
  };
};

// Hook for discounts data
export const useDiscounts = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  const fetchDiscounts = async (skip = 0, limit = 100) => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getDiscounts(skip, limit);
      setDiscounts(response.discounts);
      setTotal(response.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch discounts');
      console.error('Error fetching discounts:', err);
    } finally {
      setLoading(false);
    }
  };

  const createDiscount = async (discountData: Partial<Discount>) => {
    try {
      const newDiscount = await apiService.createDiscount(discountData);
      setDiscounts(prev => [newDiscount, ...prev]);
      setTotal(prev => prev + 1);
      return newDiscount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create discount');
      throw err;
    }
  };

  const updateDiscount = async (id: string, discountData: Partial<Discount>) => {
    try {
      const updatedDiscount = await apiService.updateDiscount(id, discountData);
      setDiscounts(prev => prev.map(d => d.id === id ? updatedDiscount : d));
      return updatedDiscount;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update discount');
      throw err;
    }
  };

  const deleteDiscount = async (id: string) => {
    try {
      await apiService.deleteDiscount(id);
      setDiscounts(prev => prev.filter(d => d.id !== id));
      setTotal(prev => prev - 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete discount');
      throw err;
    }
  };

  return {
    discounts,
    loading,
    error,
    total,
    fetchDiscounts,
    createDiscount,
    updateDiscount,
    deleteDiscount
  };
};
