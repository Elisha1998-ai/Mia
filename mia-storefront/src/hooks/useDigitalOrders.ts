/**
 * useDigitalOrders — SWR hook for digital orders + record sale
 */
import useSWR from "swr";

export interface DigitalOrder {
    id: string;
    order_number: string;
    product_id: string;
    product_title: string;
    product_type: string;
    customer_name: string;
    customer_email: string;
    amount_paid: number;
    currency: string;
    payment_method: string;
    payment_reference?: string;
    status: "completed" | "refunded" | "disputed";
    note?: string;
    source: "manual" | "paystack" | "flutterwave";
    createdAt: string;
}

export interface RecordSalePayload {
    product_id: string;
    customer_name: string;
    customer_email: string;
    amount_paid: number;
    payment_method?: string;
    payment_reference?: string;
    note?: string;
}

const BASE = "/api/digital/orders";

const fetcher = (url: string) =>
    fetch(url).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
    });

export function useDigitalOrders() {
    const { data, error, isLoading, mutate } = useSWR<{ orders: DigitalOrder[] }>(BASE, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10_000,
    });

    const recordSale = async (payload: RecordSalePayload) => {
        const res = await fetch(BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (!res.ok) {
            const err = await res.json();
            throw new Error(err.error ?? "Failed to record sale");
        }
        await mutate();
        return res.json() as Promise<DigitalOrder & { download_token: string }>;
    };

    return {
        orders: data?.orders ?? [],
        isLoading,
        error,
        mutate,
        recordSale,
    };
}
