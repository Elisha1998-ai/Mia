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
  onToggleCollapse
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

  return (
    <div className="w-full animate-in slide-in-from-bottom-2 fade-in duration-300">
      <div 
        className={`bg-foreground/[0.08] dark:bg-foreground/[0.15] border-x border-t border-border-custom rounded-t-2xl p-3 flex items-center gap-3 relative overflow-hidden group cursor-pointer transition-colors ${isCollapsed ? 'border-b rounded-b-2xl mb-2' : 'border-b-0 pb-2'}`}
        onClick={onToggleCollapse}
      >
        
        {/* Icon */}
        <div className="p-1.5 rounded-xl bg-foreground/5 flex-shrink-0 self-start mt-0.5">
          {getIcon()}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 flex items-center justify-between gap-4">
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <h3 className="text-xs font-bold text-foreground/90 leading-none truncate">
              {title}
            </h3>
            {timestamp && <span className="text-[10px] text-foreground/40 font-normal flex-shrink-0">• {timestamp}</span>}
          </div>
          
          <div className="flex items-center gap-3 flex-shrink-0">
            {/* Actions */}
            {!isCollapsed && actions && actions.length > 0 && (
              <div className="flex items-center gap-2 animate-in fade-in slide-in-from-right-2 duration-300">
                {actions.map((action, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap ${
                      action.variant === 'primary'
                        ? 'bg-foreground text-background hover:opacity-90'
                        : 'bg-foreground/5 text-foreground/70 hover:bg-foreground/10 hover:text-foreground'
                    }`}
                  >
                    {action.label}
                  </button>
                ))}
              </div>
            )}

            <div className="flex items-center gap-1">
               <button 
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleCollapse?.();
                }}
                className="text-foreground/40 hover:text-foreground p-1 rounded-lg hover:bg-foreground/5 transition-colors"
              >
                {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
              </button>
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
