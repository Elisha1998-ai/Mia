import React, { useState } from 'react';
import { X, AlertCircle, TrendingUp, Package, ShoppingBag, DollarSign, ChevronDown, ChevronUp } from 'lucide-react';

export type NotificationType = 'warning' | 'info' | 'success' | 'alert';

interface NotificationAction {
  label: string;
  onClick: () => void;
  variant?: 'primary' | 'secondary';
}

interface NotificationCardProps {
  type: NotificationType;
  title: string;
  description: string;
  timestamp?: string;
  onClose: () => void;
  actions?: NotificationAction[];
  isVisible: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  showViewMore?: boolean;
  onViewMore?: () => void;
  isExpanded?: boolean;
  isPartOfStack?: boolean;
  isFirst?: boolean;
  isLast?: boolean;
}

export const NotificationCard = ({
  type,
  title,
  description,
  timestamp,
  onClose,
  actions,
  isVisible,
  isCollapsed = false,
  onToggleCollapse,
  showViewMore = false,
  onViewMore,
  isExpanded = false,
  isPartOfStack = false,
  isFirst = true,
  isLast = true
}: NotificationCardProps) => {
  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-amber-500" />;
      case 'success':
        return <TrendingUp className="w-5 h-5 text-emerald-500" />;
      case 'alert':
        return <Package className="w-5 h-5 text-rose-500" />;
      default:
        return <ShoppingBag className="w-5 h-5 text-accent" />;
    }
  };

  const containerClasses = isPartOfStack 
    ? `bg-transparent flex items-center gap-3 relative overflow-hidden group cursor-pointer transition-colors ${!isLast ? 'border-b border-border-custom/50' : ''} p-3`
    : `bg-foreground/[0.08] dark:bg-foreground/[0.15] border-x border-t border-border-custom rounded-t-2xl p-3 flex items-center gap-3 relative overflow-hidden group cursor-pointer transition-colors ${isCollapsed ? 'border-b rounded-b-2xl mb-2' : 'border-b-0 pb-3'}`;

  return (
    <div className={isPartOfStack ? "w-full" : "w-full animate-in slide-in-from-bottom-2 fade-in duration-300"}>
      <div 
        className={containerClasses}
        onClick={onToggleCollapse}
      >
        
        {/* Content */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 flex items-center gap-2 pl-1 py-0.5">
            <h3 className="text-xs font-bold text-foreground/90 leading-tight">
              {title}
            </h3>
            {timestamp && <span className="text-[10px] text-foreground/40 font-normal flex-shrink-0">• {timestamp}</span>}
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            <div className="flex items-center gap-1">
               {showViewMore && (
                 <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onViewMore?.();
                  }}
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-lg transition-all ${isExpanded ? 'bg-accent/10 text-accent' : 'text-foreground/40 hover:text-foreground hover:bg-foreground/5'}`}
                >
                  {isExpanded ? 'Show Less' : 'View More'}
                </button>
               )}
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onClose();
                }}
                className="text-foreground/40 hover:text-foreground p-1 rounded-lg hover:bg-foreground/5 transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
