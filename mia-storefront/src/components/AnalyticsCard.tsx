"use client";

import React from 'react';
import { ArrowUp, ArrowDown, ChevronRight } from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip
} from 'recharts';

interface AnalyticsCardProps {
  title: string;
  value: string;
  percentageChange?: number;
  data: any[];
  dataKey: string;
  previousDataKey?: string; // Optional for comparison
  dateKey?: string;
  onViewReport?: () => void;
  breakdown?: {
    label: string;
    value: string;
    change?: number;
  }[];
  chartColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export const AnalyticsCard = ({
  title,
  value,
  percentageChange,
  data,
  dataKey,
  previousDataKey,
  dateKey = "date",
  onViewReport,
  breakdown,
  chartColor = "#2563eb",
  valuePrefix = "",
  valueSuffix = ""
}: AnalyticsCardProps) => {
  const isPositive = percentageChange ? percentageChange >= 0 : true;

  // Format date for axis
  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    } catch (e) {
      return dateStr;
    }
  };

  return (
    <div className="bg-background border border-border-custom rounded-xl p-6 shadow-none flex flex-col h-full hover:shadow-sm transition-shadow">
      {/* Header */}
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-sm font-semibold text-foreground/80">{title}</h3>
        {onViewReport && (
          <button 
            onClick={onViewReport}
            className="text-xs font-medium text-accent hover:text-accent/80 transition-colors flex items-center gap-1"
          >
            View report
          </button>
        )}
      </div>

      {/* Main Metric */}
      <div className="flex items-baseline gap-3 mb-6">
        <h2 className="text-3xl font-bold text-foreground tracking-tight">
          {value}
        </h2>
        {percentageChange !== undefined && (
          <div className={`flex items-center text-sm font-medium ${isPositive ? 'text-emerald-500' : 'text-rose-500'}`}>
            {isPositive ? <ArrowUp className="w-4 h-4" /> : <ArrowDown className="w-4 h-4" />}
            {Math.abs(percentageChange)}%
          </div>
        )}
      </div>

      {/* Breakdown (Optional) */}
      {breakdown && breakdown.length > 0 && (
        <div className="space-y-3 mb-6">
          {breakdown.map((item, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{item.label}</span>
              <div className="flex items-center gap-4">
                <span className="font-medium text-foreground">{item.value}</span>
                {item.change !== undefined && (
                  <span className={`text-xs w-12 text-right ${item.change >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                    {item.change >= 0 ? '↑' : '↓'} {Math.abs(item.change)}%
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Chart Section */}
      <div className="mt-auto">
        <div className="mb-2">
          <h4 className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">
            {title.toUpperCase()} OVER TIME
          </h4>
        </div>
        <div className="h-[200px] w-full -ml-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id={`gradient-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={chartColor} stopOpacity={0.1}/>
                  <stop offset="95%" stopColor={chartColor} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(128,128,128,0.1)" />
              <XAxis 
                dataKey={dateKey} 
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                minTickGap={30}
                dy={10}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(val) => `${valuePrefix}${val >= 1000 ? (val/1000).toFixed(1) + 'k' : val}${valueSuffix}`}
                width={40}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--background))',
                  borderColor: 'hsl(var(--border-custom))',
                  borderRadius: '8px',
                  fontSize: '12px',
                  boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                }}
                itemStyle={{ color: 'hsl(var(--foreground))' }}
                formatter={(val: number) => [`${valuePrefix}${val.toLocaleString()}${valueSuffix}`, title]}
                labelFormatter={formatDate}
              />
              <Area
                type="monotone"
                dataKey={dataKey}
                stroke={chartColor}
                strokeWidth={2}
                fill={`url(#gradient-${dataKey})`}
                activeDot={{ r: 4, strokeWidth: 0 }}
              />
              {previousDataKey && (
                <Area
                  type="monotone"
                  dataKey={previousDataKey}
                  stroke={chartColor}
                  strokeWidth={2}
                  strokeDasharray="5 5"
                  fill="transparent"
                  activeDot={false}
                  opacity={0.5}
                />
              )}
            </AreaChart>
          </ResponsiveContainer>
        </div>
        
        {/* Legend */}
        {/* <div className="flex items-center justify-center gap-6 mt-2 text-[10px] text-muted-foreground">
           <div className="flex items-center gap-2">
             <div className="w-2 h-2 rounded-full" style={{ backgroundColor: chartColor }}></div>
             <span>Current period</span>
           </div>
           {previousDataKey && (
             <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full border border-current opacity-50"></div>
               <span>Previous period</span>
             </div>
           )}
        </div> */}
      </div>
    </div>
  );
};
