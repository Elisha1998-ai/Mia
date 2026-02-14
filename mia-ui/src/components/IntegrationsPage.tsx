"use client";

import React, { useEffect, useState } from 'react';
import { 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  Settings2,
  ChevronRight,
  Database,
  Globe,
  Plus,
  Loader2
} from 'lucide-react';
import { useSession } from 'next-auth/react';
import { apiService } from '@/lib/api';

interface Integration {
  id: string;
  name: string;
  description: string;
  status: 'Connected' | 'Disconnected' | 'Syncing' | 'Error';
  lastSync?: string;
  type: 'Marketplace' | 'Shipping' | 'Marketing' | 'Payments';
  logo: string;
  platform?: string;
  storeUrl?: string;
}

export const IntegrationsPage = () => {
  const { data: session } = useSession();
  const [integrations, setIntegrations] = useState<Integration[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [connectingId, setConnectingId] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);

  const fetchIntegrations = async () => {
    try {
      setIsLoading(true);
      const response = await apiService.getIntegrations();
      
      // Merge with some default placeholders if no integrations found
      const dbIntegrations = response.integrations || [];
      
      const displayIntegrations: Integration[] = [
        ...dbIntegrations.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: `Connected to ${item.platform} at ${item.storeUrl}`,
          status: item.isActive ? 'Connected' : 'Disconnected',
          type: 'Marketplace',
          logo: item.logo,
          platform: item.platform,
          storeUrl: item.storeUrl
        })),
        // Add placeholders for others if they don't exist
        ...(dbIntegrations.find((i: any) => i.platform.toLowerCase() === 'amazon') ? [] : [{
          id: 'amazon-placeholder',
          name: 'Amazon',
          description: 'Manage your Amazon Seller Central listings and fulfillment.',
          status: 'Disconnected' as const,
          type: 'Marketplace' as const,
          logo: 'https://upload.wikimedia.org/wikipedia/commons/a/a9/Amazon_logo.svg'
        }]),
        { 
          id: 'ig-placeholder', 
          name: 'Instagram Shopping', 
          description: 'Tag products in your posts and stories automatically.',
          status: 'Disconnected' as const, 
          type: 'Marketing' as const,
          logo: 'https://upload.wikimedia.org/wikipedia/commons/e/e7/Instagram_logo_2016.svg'
        }
      ];

      setIntegrations(displayIntegrations);
    } catch (error) {
      console.error('Failed to fetch integrations:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIntegrations();
  }, []);

  const handleConnect = async (id: string, name: string) => {
    if (name.toLowerCase() === 'shopify') {
      const shopUrl = prompt('Enter your Shopify Shop URL (e.g. mia-test-store.myshopify.com):');
      const accessToken = prompt('Enter your Shopify Admin API Access Token:');
      
      if (shopUrl && accessToken) {
        try {
          setConnectingId(id);
          await apiService.connectShopify(shopUrl, accessToken, session?.user?.id);
          alert('Shopify store connected successfully!');
          fetchIntegrations();
        } catch (error) {
          console.error('Failed to connect Shopify:', error);
          alert('Failed to connect Shopify store.');
        } finally {
          setConnectingId(null);
        }
      }
    } else {
      alert(`Connecting to ${name} is not yet implemented in this demo.`);
    }
  };

  const handleSync = async (id: string) => {
    try {
      setSyncingId(id);
      await apiService.syncStore(id);
      alert('Sync completed successfully!');
    } catch (error) {
      console.error('Sync failed:', error);
      alert('Failed to sync store. Please try again.');
    } finally {
      setSyncingId(null);
    }
  };

  const handleSyncAll = async () => {
    const connected = integrations.filter(i => i.status === 'Connected');
    if (connected.length === 0) {
      alert('No connected stores to sync.');
      return;
    }

    setIsLoading(true);
    try {
      for (const item of connected) {
        await apiService.syncStore(item.id);
      }
      alert('All stores synced successfully!');
    } catch (error) {
      console.error('Sync all failed:', error);
      alert('One or more stores failed to sync.');
    } finally {
      setIsLoading(false);
      fetchIntegrations();
    }
  };

  return (
    <div className="flex flex-col h-full bg-background animate-in fade-in duration-500">
      <header className="px-8 py-6 border-b border-border-custom flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-30">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Integration Hub</h1>
          <p className="text-sm text-foreground/40 font-medium mt-1">Connect and manage external platforms and services</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleSyncAll}
            className="flex items-center justify-center gap-2 bg-foreground/5 hover:bg-foreground/10 text-foreground px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
          >
            <RefreshCw className="w-4 h-4" />
            Sync All
          </button>
          <button className="flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20 active:scale-95">
            <Plus className="w-4 h-4" />
            Add Integration
          </button>
        </div>
      </header>

      <div className="p-8 space-y-8 overflow-y-auto">
        {/* Status Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-3xl bg-emerald-500/5 border border-emerald-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-emerald-500">2</div>
              <div className="text-[12px] font-bold text-emerald-500/60 uppercase tracking-wider">Active Syncs</div>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-orange-500/5 border border-orange-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-orange-500/10 text-orange-500 flex items-center justify-center">
              <RefreshCw className="w-6 h-6 animate-spin-slow" />
            </div>
            <div>
              <div className="text-2xl font-black text-orange-500">1</div>
              <div className="text-[12px] font-bold text-orange-500/60 uppercase tracking-wider">Processing</div>
            </div>
          </div>
          <div className="p-6 rounded-3xl bg-red-500/5 border border-red-500/10 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-red-500/10 text-red-500 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <div className="text-2xl font-black text-red-500">1</div>
              <div className="text-[12px] font-bold text-red-500/60 uppercase tracking-wider">Attention Needed</div>
            </div>
          </div>
        </div>

        {/* Categories */}
        <div className="flex gap-2 p-1 bg-foreground/[0.03] rounded-2xl w-fit">
          {['All', 'Marketplaces', 'Marketing', 'Shipping', 'Payments'].map((cat) => (
            <button 
              key={cat}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all ${cat === 'All' ? 'bg-background text-foreground shadow-sm' : 'text-foreground/40 hover:text-foreground'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Integration Cards */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {integrations.map((item) => (
            <div key={item.id} className="group bg-foreground/[0.01] border border-border-custom rounded-3xl p-6 hover:border-foreground/20 transition-all">
              <div className="flex items-start justify-between mb-6">
                <div className="flex gap-5">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-border-custom p-3 flex items-center justify-center shadow-sm">
                    <img src={item.logo} alt={item.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-bold text-foreground">{item.name}</h3>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-black uppercase tracking-tighter ${
                        item.status === 'Connected' ? 'bg-emerald-500/10 text-emerald-500' :
                        item.status === 'Syncing' ? 'bg-orange-500/10 text-orange-500' :
                        item.status === 'Error' ? 'bg-red-500/10 text-red-500' :
                        'bg-foreground/10 text-foreground/40'
                      }`}>
                        {item.status}
                      </span>
                    </div>
                    <p className="text-[13px] text-foreground/40 font-medium leading-relaxed max-w-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
                <button className="p-2.5 rounded-xl bg-foreground/[0.03] text-foreground/40 hover:text-foreground transition-all">
                  <Settings2 className="w-5 h-5" />
                </button>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-border-custom">
                <div className="flex items-center gap-4">
                  {item.lastSync && (
                    <div className="flex items-center gap-2 text-[11px] font-bold text-foreground/30 uppercase tracking-wider">
                      <RefreshCw className={`w-3 h-3 ${item.status === 'Syncing' ? 'animate-spin' : ''}`} />
                      Last Sync: {item.lastSync}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  {item.status === 'Disconnected' || item.status === 'Error' ? (
                    <button 
                      onClick={() => handleConnect(item.id, item.name)}
                      disabled={connectingId === item.id}
                      className="bg-accent hover:bg-accent/90 text-white px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-accent/20 disabled:opacity-50 flex items-center gap-2"
                    >
                      {connectingId === item.id && <RefreshCw className="w-4 h-4 animate-spin" />}
                      {connectingId === item.id ? 'Connecting...' : 'Connect'}
                    </button>
                  ) : (
                    <>
                      <button 
                        onClick={() => handleSync(item.id)}
                        disabled={syncingId === item.id}
                        className="text-[13px] font-bold text-accent hover:text-accent/80 flex items-center gap-2 transition-all disabled:opacity-50"
                      >
                        {syncingId === item.id ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <RefreshCw className="w-4 h-4" />
                        )}
                        {syncingId === item.id ? 'Syncing...' : 'Sync Now'}
                      </button>
                      <button className="text-[13px] font-bold text-foreground/40 hover:text-foreground flex items-center gap-2 transition-all">
                        View Logs
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}

          {/* Add New Mock */}
          <div className="border-2 border-dashed border-border-custom rounded-3xl p-6 flex flex-col items-center justify-center text-center space-y-3 group hover:border-accent/30 hover:bg-accent/[0.02] transition-all cursor-pointer">
            <div className="w-12 h-12 rounded-2xl bg-foreground/5 text-foreground/20 group-hover:bg-accent/10 group-hover:text-accent flex items-center justify-center transition-all">
              <Plus className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-foreground">Explore More Integrations</h4>
              <p className="text-[12px] text-foreground/40 font-medium">Browse 50+ available connections</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
