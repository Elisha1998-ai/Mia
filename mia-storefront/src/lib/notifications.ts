import { NotificationType } from '../components/NotificationCard';

export interface NotificationAction {
  label: string;
  actionId: string; // Identifier for the action to handle in UI
  variant?: 'primary' | 'secondary';
}

export interface NotificationData {
  id: string;
  scenario: 'LOW_STOCK' | 'CUSTOMER_INACTIVITY' | 'NEW_SALE' | 'REVENUE_MILESTONE' | 'ABANDONED_CART';
  type: NotificationType;
  title: string;
  timestamp: string;
  actions: NotificationAction[];
}

export const MOCK_NOTIFICATIONS: NotificationData[] = [
  {
    id: '1',
    scenario: 'LOW_STOCK',
    type: 'alert',
    title: "Urgent: 'Summer Breeze Linen Shirt' is down to 2 units. Restock now to avoid stockouts.",
    timestamp: '2m ago',
    actions: [
      { label: 'Restock', actionId: 'restock', variant: 'primary' },
      { label: 'View Product', actionId: 'view_product', variant: 'secondary' }
    ]
  },
  {
    id: '2',
    scenario: 'CUSTOMER_INACTIVITY',
    type: 'info',
    title: "Miss you! Loyal customer Sarah J. hasn't visited in 30 days. Reach out?",
    timestamp: '15m ago',
    actions: [
      { label: 'Send Offer', actionId: 'send_offer', variant: 'primary' },
      { label: 'View Profile', actionId: 'view_profile', variant: 'secondary' }
    ]
  },
  {
    id: '3',
    scenario: 'NEW_SALE',
    type: 'success',
    title: "Cha-ching! New order #1234 received from Mike. 🎉",
    timestamp: 'Just now',
    actions: [
      { label: 'View Order', actionId: 'view_order', variant: 'primary' }
    ]
  },
  {
    id: '4',
    scenario: 'REVENUE_MILESTONE',
    type: 'success',
    title: "High Five! You just hit ₦10k in sales this month! 🚀",
    timestamp: '1h ago',
    actions: [] // No resolution needed, just celebration
  },
  {
    id: '5',
    scenario: 'ABANDONED_CART',
    type: 'warning',
    title: "So close! Alex left 3 items in their cart. Nudge them?",
    timestamp: '5m ago',
    actions: [
      { label: 'Send Reminder', actionId: 'send_reminder', variant: 'primary' }
    ]
  }
];
