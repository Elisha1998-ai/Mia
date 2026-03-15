"use client";

import React from 'react';
import { Smartphone, Monitor, RefreshCw, ExternalLink } from 'lucide-react';

interface LiveStorefrontPreviewProps {
  storeDomain?: string;
  containerWidth?: number;
}

export const LiveStorefrontPreview = ({ storeDomain, containerWidth }: LiveStorefrontPreviewProps) => {
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');
  const [iframeKey, setIframeKey] = React.useState(0);

  // Auto-switch view mode based on container width if provided
  React.useEffect(() => {
    if (containerWidth) {
      if (containerWidth < 500) {
        setViewMode('mobile');
      } else if (containerWidth < 900) {
        // We can treat this as "mobile" or "tablet" style, but for now we just toggle desktop/mobile
        // If we want a specific tablet mode we can add it, but for now we'll just keep the iframe responsive
        setViewMode('desktop'); 
      } else {
        setViewMode('desktop');
      }
    }
  }, [containerWidth]);

  const baseUrl = React.useMemo(() => {
    if (typeof window === 'undefined') return '';
    const isLocal = window.location.hostname === 'localhost';
    if (isLocal) {
      return `http://${storeDomain}.localhost:3000`;
    }
    return `https://${storeDomain}.bloume.shop`;
  }, [storeDomain]);

  if (!storeDomain) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-background">
        <div className="w-16 h-16 rounded-2xl bg-foreground/5 flex items-center justify-center mb-4">
          <Smartphone className="w-8 h-8 text-foreground/20" />
        </div>
        <h3 className="text-sm font-semibold text-foreground/60">No store domain configured</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-xs">
          Please set your store domain in the settings to preview your live shop.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-[#f0f0f0] overflow-hidden">
      {/* Toolbar */}
      <div className="bg-white border-b border-border-custom px-6 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
            <Smartphone className="w-4 h-4 text-accent" />
          </div>
          <div>
            <h2 className="font-bold text-sm text-foreground">Live Storefront</h2>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-widest">
              {storeDomain}.bloume.shop
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex items-center bg-foreground/5 rounded-xl p-1">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-foreground' : 'text-foreground/40 hover:text-foreground'}`}
              title="Desktop View"
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-foreground' : 'text-foreground/40 hover:text-foreground'}`}
              title="Mobile View"
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <div className="h-4 w-px bg-border-custom" />

          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIframeKey(k => k + 1)}
              className="p-2 hover:bg-foreground/5 rounded-xl transition-colors text-foreground/40 hover:text-foreground"
              title="Refresh"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
            <a 
              href={baseUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 hover:bg-foreground/5 rounded-xl transition-colors text-foreground/40 hover:text-foreground"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* Preview Container */}
      <div className="flex-1 overflow-hidden flex justify-center bg-background">
        <div 
          className={`bg-white transition-all duration-500 overflow-hidden ${
            viewMode === 'mobile' ? 'max-w-[375px] w-full aspect-[9/19.5] my-auto shadow-2xl rounded-2xl border border-border-custom' : 'w-full h-full'
          }`}
        >
          <iframe 
            key={iframeKey}
            src={baseUrl}
            className="w-full h-full border-none"
            title="Live Storefront Preview"
          />
        </div>
      </div>
    </div>
  );
};
