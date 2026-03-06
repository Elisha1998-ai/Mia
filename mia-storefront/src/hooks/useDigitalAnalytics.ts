/**
 * useDigitalAnalytics — SWR hook for the analytics tab
 */
import useSWR from "swr";

export interface DigitalAnalytics {
    overview: {
        total_revenue: number;
        total_orders: number;
        unique_customers: number;
        total_downloads: number;
        published_products: number;
        draft_products: number;
        archived_products: number;
    };
    last_30_days: {
        revenue: number;
        orders: number;
    };
    weekly_chart: { day: string; revenue: number; orders: number }[];
    top_products: {
        id: string;
        title: string;
        product_type: string;
        price: number;
        sales_count: number;
        revenue: number;
        status: string;
    }[];
    revenue_by_type: { product_type: string; revenue: number; orders: number }[];
}

const fetcher = (url: string) =>
    fetch(url).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
    });

export function useDigitalAnalytics() {
    const { data, error, isLoading, mutate } = useSWR<DigitalAnalytics>(
        "/api/digital/analytics",
        fetcher,
        { revalidateOnFocus: false, dedupingInterval: 30_000 }
    );

    return {
        analytics: data ?? null,
        isLoading,
        error,
        mutate,
    };
}
