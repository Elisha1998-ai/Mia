/**
 * useDigitalCustomers — SWR hook for digital product customers
 */
import useSWR from "swr";

export interface DigitalCustomer {
    id: string;
    email: string;
    name: string;
    total_spent: number;
    order_count: number;
    last_order_at: string;
    first_order_at: string;
}

const fetcher = (url: string) =>
    fetch(url).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
    });

export function useDigitalCustomers() {
    const { data, error, isLoading, mutate } = useSWR<{ customers: DigitalCustomer[] }>(
        "/api/digital/customers",
        fetcher,
        { revalidateOnFocus: false, dedupingInterval: 15_000 }
    );

    return {
        customers: data?.customers ?? [],
        isLoading,
        error,
        mutate,
    };
}
