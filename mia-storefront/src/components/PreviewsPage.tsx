"use client";

import React from 'react';
import { ProductDetailTemplate1 } from './ProductDetailTemplate1';
import { Layout, ArrowLeft, Eye, Smartphone, Monitor } from 'lucide-react';

export const PreviewsPage = () => {
  const [selectedPreview, setSelectedPreview] = React.useState<string | null>('product-detail-1');
  const [viewMode, setViewMode] = React.useState<'desktop' | 'mobile'>('desktop');

  const previews = [
    {
      id: 'product-detail-1',
      name: 'Modern Atelier Product Page',
      category: 'Product Detail',
      component: <ProductDetailTemplate1 />,
      description: 'A clean, high-contrast product detail page inspired by the Bonfire design.'
    }
  ];

  if (selectedPreview) {
    const preview = previews.find(p => p.id === selectedPreview);
    return (
      <div className="flex-1 flex flex-col h-full bg-[#f0f0f0]">
        {/* Preview Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between z-10">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setSelectedPreview(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
              title="Back to gallery"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h2 className="font-semibold text-sm">{preview?.name}</h2>
              <p className="text-[11px] text-gray-400 uppercase tracking-widest">{preview?.category}</p>
            </div>
          </div>

          <div className="flex items-center bg-gray-100 rounded-lg p-1">
            <button 
              onClick={() => setViewMode('desktop')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Monitor className="w-4 h-4" />
            </button>
            <button 
              onClick={() => setViewMode('mobile')}
              className={`p-1.5 rounded-md transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-400 hover:text-gray-600'}`}
            >
              <Smartphone className="w-4 h-4" />
            </button>
          </div>

          <button className="px-4 py-2 bg-gray-900 text-white text-xs font-medium rounded-lg hover:bg-black transition-colors">
            Use Template
          </button>
        </div>

        {/* Preview Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-12 flex justify-center bg-[#f5f5f5]">
          <div className={`bg-white transition-all duration-500 mb-12 h-fit ${viewMode === 'mobile' ? 'max-w-[375px] w-full min-h-[667px]' : 'w-full max-w-7xl'}`}>
            {preview?.component}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-full bg-background overflow-y-auto">
      <div className="p-8 max-w-6xl mx-auto w-full">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Design Previews</h1>
          <p className="text-muted-foreground">Preview and test the ecommerce page templates Mia is designing for you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {previews.map((preview) => (
            <div 
              key={preview.id} 
              className="group relative flex flex-col rounded-2xl bg-card overflow-hidden transition-all cursor-pointer"
              onClick={() => setSelectedPreview(preview.id)}
            >
              <div className="aspect-video bg-gray-100 relative overflow-hidden">
                {/* Mockup of the template */}
                <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                  <Layout className="w-12 h-12" />
                </div>
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-center justify-center">
                  <div className="px-4 py-2 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-medium opacity-0 group-hover:opacity-100 transition-all transform translate-y-2 group-hover:translate-y-0 flex items-center gap-2 text-gray-900">
                    <Eye className="w-4 h-4" /> Preview Template
                  </div>
                </div>
              </div>
              <div className="p-5">
                <div className="text-[10px] uppercase tracking-widest text-accent font-semibold mb-2">{preview.category}</div>
                <h3 className="font-semibold text-lg mb-1">{preview.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-2">{preview.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
