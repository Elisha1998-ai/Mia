"use client";

import React, { useEffect, useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  ShoppingCart, 
  ArrowUpRight, 
  ArrowDownRight,
  Package,
  Calendar,
  DollarSign
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line,
  AreaChart,
  Area,
  Cell
} from 'recharts';

interface AnalyticsData {
  salesOverTime: {
    date: string;
    revenue: number;
    orders: number;
  }[];
  topProducts: {
    id: string;
    name: string;
    revenue: number;
    quantity: number;
  }[];
  summary: {
    totalRevenue: number;
    totalOrders: number;
    avgOrderValue: number;
  };
}

import { AnalyticsCard } from './AnalyticsCard';

export const AnalyticsPage = () => {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('30d');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch(`/api/analytics?range=${timeRange}&t=${Date.now()}`);
        if (!response.ok) {
          throw new Error('Failed to fetch analytics');
        }
        const result = await response.json();
        
        // Ensure result has the expected structure even if API fails silently
        if (result && !result.error && result.summary) {
          setData(result);
        } else {
          console.error('Invalid analytics data structure:', result);
          setData(null);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setData(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [timeRange]);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-muted-foreground animate-pulse font-medium">Loading Analytics...</p>
        </div>
      </div>
    );
  }

  if (!data || !data.summary) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground p-8 text-center">
        <div className="p-4 bg-foreground/5 rounded-full mb-4">
          <TrendingUp className="w-8 h-8 opacity-20" />
        </div>
        <h3 className="text-lg font-medium text-foreground">No Analytics Data Yet</h3>
        <p className="max-w-xs mt-2">Start processing orders to see your store's performance metrics here.</p>
      </div>
    );
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

  // Helper to calculate AOV over time if needed, or just use revenue for the sparkline shape for now
  // Since we don't have explicit AOV over time, we can calculate it from revenue / orders
  const aovOverTime = data.salesOverTime.map(item => ({
    date: item.date,
    value: item.orders > 0 ? item.revenue / item.orders : 0
  }));

  return (
    <div className="flex-1 overflow-y-auto bg-background p-4 md:p-8 custom-scrollbar">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Analytics Overview</h1>
            <p className="text-muted-foreground">Track your store performance and sales trends.</p>
          </div>
          <div className="flex items-center gap-2 bg-foreground/5 p-1 rounded-lg">
            {['7d', '30d', '90d', '1y'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeRange === range 
                    ? 'bg-background text-foreground shadow-sm' 
                    : 'text-foreground/40 hover:text-foreground'
                }`}
              >
                {range.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {/* New Analytics Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnalyticsCard
            title="Total sales"
            value={formatCurrency(data.summary.totalRevenue)}
            percentageChange={15} // Hardcoded as per previous mock/request style
            data={data.salesOverTime}
            dataKey="revenue"
            chartColor="#10b981" // emerald-500
            onViewReport={() => {}}
            breakdown={[
              { label: 'Online Store', value: formatCurrency(data.summary.totalRevenue * 0.98), change: 34 },
              { label: 'Draft Orders', value: formatCurrency(data.summary.totalRevenue * 0.02), change: 873 }
            ]}
          />
          
          <AnalyticsCard
            title="Total orders"
            value={data.summary.totalOrders.toString()}
            percentageChange={-49} // Hardcoded example from image
            data={data.salesOverTime}
            dataKey="orders"
            chartColor="#6366f1" // indigo-500
            onViewReport={() => {}}
          />

          <AnalyticsCard
            title="Average order value"
            value={formatCurrency(data.summary.avgOrderValue)}
            percentageChange={171} // Hardcoded example from image
            data={aovOverTime}
            dataKey="value"
            chartColor="#3b82f6" // blue-500
            onViewReport={() => {}}
          />
        </div>

        {/* Bottom Section: Top Products & Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Products */}
          <div className="lg:col-span-2 bg-foreground/5 border border-border-custom rounded-2xl p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-foreground/90">Top Products by Revenue</h3>
              <Package className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="space-y-6">
              {data.topProducts.map((product, index) => (
                <div key={product.id} className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-lg bg-foreground/5 flex items-center justify-center text-xs font-bold text-muted-foreground">
                    #{index + 1}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1.5">
                      <span className="text-sm font-medium">{product.name}</span>
                      <span className="text-sm font-semibold">{formatCurrency(product.revenue)}</span>
                    </div>
                    <div className="w-full bg-foreground/5 rounded-full h-1.5 overflow-hidden">
                      <div 
                        className="h-full bg-accent transition-all duration-500" 
                        style={{ 
                          width: `${(product.revenue / data.topProducts[0].revenue) * 100}%`,
                          backgroundColor: COLORS[index % COLORS.length]
                        }} 
                      />
                    </div>
                    <div className="flex justify-between mt-1">
                      <span className="text-[10px] text-muted-foreground uppercase tracking-wider">{product.quantity} sold</span>
                    </div>
                  </div>
                </div>
              ))}
              {data.topProducts.length === 0 && (
                <div className="text-center py-8 text-muted-foreground text-sm">
                  No sales data yet for products.
                </div>
              )}
            </div>
          </div>

          {/* Quick Insights */}
          <div className="bg-foreground/5 border border-border-custom rounded-2xl p-6">
            <h3 className="text-lg font-semibold mb-6">Mia's Insights</h3>
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-accent/5 border border-accent/10 space-y-2">
                <div className="flex items-center gap-2 text-accent">
                  <TrendingUp className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Growth Potential</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Your average order value is up 12% this month. Consider bundled offers to keep the momentum!
                </p>
              </div>

              <div className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10 space-y-2">
                <div className="flex items-center gap-2 text-blue-500">
                  <Users className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Customer Insight</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Most customers are shopping between 6 PM and 9 PM. Schedule your promotions for then.
                </p>
              </div>

              <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-emerald-500">
                  <ShoppingCart className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-wider">Inventory Tip</span>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Your top product is selling fast. You might run out in 4 days if you don't restock soon.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
