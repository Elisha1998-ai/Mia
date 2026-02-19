import { useState, useEffect } from 'react';
import { useProducts, useOrders, useCustomers } from '@/hooks/useData';
import { NotificationData } from '@/lib/notifications';

export const useNotificationLogic = () => {
  const { products, fetchProducts, loading: productsLoading } = useProducts();
  const { orders, fetchOrders, loading: ordersLoading } = useOrders();
  const { customers, fetchCustomers, loading: customersLoading } = useCustomers();
  
  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch all data on mount
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await Promise.all([
        fetchProducts(0, 50),
        fetchOrders(0, 20),
        fetchCustomers(0, 20)
      ]);
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  // Generate notifications based on data state
  useEffect(() => {
    // Wait until data is loaded
    if (productsLoading || ordersLoading || customersLoading) return;

    const newNotifications: NotificationData[] = [];
    
    // 1. Low Stock Logic
    const lowStockProducts = products.filter(p => p.stock_quantity < 5);
    lowStockProducts.slice(0, 2).forEach(p => {
      newNotifications.push({
        id: `stock-${p.id}`,
        scenario: 'LOW_STOCK',
        type: 'alert',
        title: `Urgent: '${p.name}' is down to ${p.stock_quantity} units. Restock now?`,
        timestamp: 'Now',
        actions: [
          { label: 'Restock', actionId: `restock-${p.id}`, variant: 'primary' },
          { label: 'View', actionId: `view-${p.id}`, variant: 'secondary' }
        ]
      });
    });

    // 2. New Sale Logic (orders from last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(o => o.created_at && new Date(o.created_at) > oneDayAgo);
    
    recentOrders.slice(0, 1).forEach(o => {
      newNotifications.push({
        id: `order-${o.id}`,
        scenario: 'NEW_SALE',
        type: 'success',
        title: `Cha-ching! New order #${o.order_number} received for ₦${o.total_amount}. 🎉`,
        timestamp: 'Recently',
        actions: [
          { label: 'View Order', actionId: `order-${o.id}`, variant: 'primary' }
        ]
      });
    });

    // 3. Customer Inactivity Logic (no order in 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const inactiveCustomers = customers.filter(c => 
      c.last_order_date && new Date(c.last_order_date) < thirtyDaysAgo
    );
    
    inactiveCustomers.slice(0, 1).forEach(c => {
      newNotifications.push({
        id: `customer-${c.id}`,
        scenario: 'CUSTOMER_INACTIVITY',
        type: 'info',
        title: `Miss you! ${c.full_name || c.email} hasn't visited in 30+ days. Reach out?`,
        timestamp: 'Just now',
        actions: [
          { label: 'Send Offer', actionId: `email-${c.id}`, variant: 'primary' }
        ]
      });
    });

    // 4. Revenue Milestone Logic
    // Calculate total revenue from loaded orders
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    if (totalRevenue > 10000 && totalRevenue < 10500) { // Just hit 10k recently-ish
       newNotifications.push({
        id: 'revenue-10k',
        scenario: 'REVENUE_MILESTONE',
        type: 'success',
        title: "High Five! You just crossed ₦10k in total revenue! 🚀",
        timestamp: 'Today',
        actions: []
      });
    }

    // 5. Fallback logic - REMOVED
    // We should NOT show a "Connect Store" notification if the user is already authenticated/onboarded.
    // The notification area should only appear if there is an ACTUAL event (Low Stock, New Sale, etc.)
    // If newNotifications is empty, the UI will correctly hide the notification area.
    
    setNotifications(newNotifications);
  }, [products, orders, customers, productsLoading, ordersLoading, customersLoading]);

  return { notifications, isLoading };
};
