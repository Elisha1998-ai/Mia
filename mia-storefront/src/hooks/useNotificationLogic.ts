import { useState, useEffect } from 'react';
import { useProducts, useOrders, useCustomers } from '@/hooks/useData';
import { NotificationData } from '@/lib/notifications';

export const useNotificationLogic = (userName?: string) => {
  const { products, fetchProducts, loading: productsLoading } = useProducts();
  const { orders, fetchOrders, loading: ordersLoading } = useOrders();
  const { customers, fetchCustomers, loading: customersLoading } = useCustomers();

  const [notifications, setNotifications] = useState<NotificationData[]>([]);
  const [dismissedIds, setDismissedIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

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

  useEffect(() => {
    if (productsLoading || ordersLoading || customersLoading) return;

    const all: NotificationData[] = [];
    const firstName = userName?.split(' ')[0] || '';

    // 1. Low stock / out of stock
    const lowStock = products.filter(p => p.stock_quantity < 5);
    lowStock.forEach(p => {
      const out = p.stock_quantity <= 0;
      all.push({
        id: `stock-${p.id}-${p.stock_quantity}`,
        scenario: 'LOW_STOCK',
        type: out ? 'alert' : 'warning',
        title: out
          ? `${firstName ? `${firstName}, ` : ''}'${p.name}' don finish! You're out of stock.`
          : `${firstName ? `${firstName}, ` : ''}'${p.name}' almost gone — only ${p.stock_quantity} left.`,
        timestamp: 'Now',
        actions: [
          {
            label: 'Restock now',
            actionId: 'restock',
            variant: 'primary',
            chatMessage: `I need to restock "${p.name}". How many units should I add?`
          }
        ]
      });
    });

    // 2. New orders (last 24h)
    const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const recentOrders = orders.filter(o => o.created_at && new Date(o.created_at) > oneDayAgo);
    recentOrders.slice(0, 2).forEach(o => {
      all.push({
        id: `order-${o.id}`,
        scenario: 'NEW_SALE',
        type: 'success',
        title: `Order #${o.order_number} just came in! 🎉 ₦${Number(o.total_amount).toLocaleString()}`,
        timestamp: 'Just now',
        actions: [
          {
            label: 'View order',
            actionId: 'view_order',
            variant: 'primary',
            chatMessage: `Show me order #${o.order_number}`
          }
        ]
      });
    });

    // 3. Today's summary
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todaysOrders = orders.filter(o => o.created_at && new Date(o.created_at) >= today);
    if (todaysOrders.length > 0) {
      const total = todaysOrders.reduce((sum, o) => sum + Number(o.total_amount), 0);
      all.push({
        id: 'daily-summary',
        scenario: 'DAILY_SUMMARY',
        type: 'info',
        title: `${firstName ? `${firstName}! ` : ''}${todaysOrders.length} order${todaysOrders.length > 1 ? 's' : ''} today — ₦${total.toLocaleString()} 💪`,
        timestamp: 'Today',
        actions: []
      });
    }

    // 4. Unfulfilled orders (48h+ pending)
    const twoDaysAgo = new Date(Date.now() - 48 * 60 * 60 * 1000);
    const unfulfilled = orders.filter(o =>
      (o.status === 'pending' || o.status === 'processing') &&
      o.created_at && new Date(o.created_at) < twoDaysAgo
    );
    unfulfilled.slice(0, 1).forEach(o => {
      all.push({
        id: `unfulfilled-${o.id}`,
        scenario: 'UNFULFILLED_ALERT',
        type: 'warning',
        title: `Order #${o.order_number} don wait 2 days. Abeg, follow up.`,
        timestamp: 'Reminder',
        actions: [
          {
            label: 'Chase payment',
            actionId: 'chase_payment',
            variant: 'primary',
            chatMessage: `Chase payment for order #${o.order_number} — the buyer hasn't paid in over 2 days.`
          },
          {
            label: 'Mark shipped',
            actionId: 'mark_shipped',
            variant: 'secondary',
            chatMessage: `Mark order #${o.order_number} as shipped.`
          }
        ]
      });
    });

    // 5. Revenue milestone
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.total_amount), 0);
    if (totalRevenue >= 100000) {
      all.push({
        id: 'revenue-100k',
        scenario: 'REVENUE_MILESTONE',
        type: 'success',
        title: `₦${(totalRevenue / 1000).toFixed(0)}k total sales! ${firstName ? `You dey do am, ${firstName}!` : 'You dey do am!'} 🚀`,
        timestamp: 'Today',
        actions: []
      });
    } else if (totalRevenue >= 50000) {
      all.push({
        id: 'revenue-50k',
        scenario: 'REVENUE_MILESTONE',
        type: 'success',
        title: `₦50k in the bag! ${firstName ? `${firstName}, e` : 'E'} dey hot out here 🔥`,
        timestamp: 'Today',
        actions: []
      });
    }

    // 6. Inactive customers (30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const inactive = customers.filter(c =>
      c.last_order_date && new Date(c.last_order_date) < thirtyDaysAgo
    );
    inactive.slice(0, 1).forEach(c => {
      const name = c.full_name?.split(' ')[0] || c.email;
      all.push({
        id: `customer-${c.id}`,
        scenario: 'CUSTOMER_INACTIVITY',
        type: 'info',
        title: `${name} hasn't ordered in 30 days. Send them a special offer?`,
        timestamp: 'Just now',
        actions: [
          {
            label: 'Send offer',
            actionId: 'send_offer',
            variant: 'primary',
            chatMessage: `Draft a special re-engagement offer message for my customer ${c.full_name || c.email} who hasn't ordered in 30 days.`
          }
        ]
      });
    });

    const active = all.filter(n => !dismissedIds.has(n.id));
    setNotifications(active);
  }, [products, orders, customers, productsLoading, ordersLoading, customersLoading, dismissedIds, userName]);

  const markAsRead = (id: string) => {
    setDismissedIds(prev => new Set(prev).add(id));
  };

  const handleAction = (id: string, actionId: string) => {
    markAsRead(id);
  };

  return { notifications, markAsRead, handleAction, isLoading };
};
