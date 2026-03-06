/**
 * useDigitalDownloads — SWR hook for download records
 */
import useSWR from "swr";

export interface DigitalDownload {
    id: string;
    token: string;
    customer_email: string;
    customer_name?: string;
    product_id?: string;
    product_title: string;
    product_type: string;
    product_file_name?: string;
    order_id?: string;
    order_number?: string;
    amount_paid?: number;
    download_count: number;
    max_downloads: number;
    expires_at: string | null;
    last_downloaded_at: string | null;
    status: "active" | "expired" | "exhausted";
    createdAt: string;
    download_url: string;
}

const fetcher = (url: string) =>
    fetch(url).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
    });

export function useDigitalDownloads() {
    const { data, error, isLoading, mutate } = useSWR<{ downloads: DigitalDownload[] }>(
        "/api/digital/downloads",
        fetcher,
        { revalidateOnFocus: false, dedupingInterval: 15_000 }
    );

    return {
        downloads: data?.downloads ?? [],
        isLoading,
        error,
        mutate,
    };
}
