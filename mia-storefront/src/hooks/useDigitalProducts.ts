/**
 * useDigitalProducts — SWR hook with optimistic CRUD
 * Provides: products list, loading, error, create, update, delete
 */
import useSWR from "swr";
import type { DigitalProduct } from "@/components/DigitalProductsPage";

const BASE = "/api/digital/products";

const fetcher = (url: string) =>
    fetch(url).then((r) => {
        if (!r.ok) throw new Error("Failed to fetch");
        return r.json();
    });

export function useDigitalProducts() {
    const { data, error, isLoading, mutate } = useSWR<{ products: DigitalProduct[] }>(BASE, fetcher, {
        revalidateOnFocus: false,
        dedupingInterval: 10_000,
    });

    const createProduct = async (payload: Omit<DigitalProduct, "id" | "sales_count" | "revenue" | "createdAt">) => {
        const body = {
            title: payload.title,
            slug: payload.slug,
            product_type: payload.product_type,
            price: payload.price,
            compare_at_price: payload.compare_at_price,
            cover_image_url: payload.cover_image_url,
            file_name: payload.file_name,
            file_type: payload.file_type,
            file_url: payload.file_url,
            file_size_bytes: payload.file_size_bytes,
            status: payload.status,
        };

        // Optimistic add
        const tempId = `temp-${Date.now()}`;
        const optimistic: DigitalProduct = {
            ...body,
            id: tempId,
            currency: "NGN",
            sales_count: 0,
            revenue: 0,
            createdAt: new Date().toISOString(),
        };
        await mutate(
            (prev) => prev ? { products: [optimistic, ...prev.products] } : { products: [optimistic] },
            false
        );

        const res = await fetch(BASE, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            await mutate(); // revert on error
            const err = await res.json();
            throw new Error(err.error ?? "Failed to create product");
        }
        await mutate(); // refresh from server
        return res.json() as Promise<DigitalProduct>;
    };

    const updateProduct = async (id: string, payload: Partial<DigitalProduct>) => {
        const body = {
            title: payload.title,
            slug: payload.slug,
            product_type: payload.product_type,
            price: payload.price,
            compare_at_price: payload.compare_at_price,
            cover_image_url: payload.cover_image_url,
            file_name: payload.file_name,
            file_type: payload.file_type,
            file_url: payload.file_url,
            file_size_bytes: payload.file_size_bytes,
            status: payload.status,
        };

        // Optimistic update
        await mutate(
            (prev) =>
                prev
                    ? { products: prev.products.map((p) => (p.id === id ? { ...p, ...payload } : p)) }
                    : prev,
            false
        );

        const res = await fetch(`${BASE}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        if (!res.ok) {
            await mutate();
            const err = await res.json();
            throw new Error(err.error ?? "Failed to update product");
        }
        await mutate();
        return res.json() as Promise<DigitalProduct>;
    };

    const deleteProduct = async (id: string) => {
        // Optimistic remove
        await mutate(
            (prev) => prev ? { products: prev.products.filter((p) => p.id !== id) } : prev,
            false
        );

        const res = await fetch(`${BASE}/${id}`, { method: "DELETE" });
        if (!res.ok) {
            await mutate();
            throw new Error("Failed to delete product");
        }
    };

    return {
        products: data?.products ?? [],
        isLoading,
        error,
        mutate,
        createProduct,
        updateProduct,
        deleteProduct,
    };
}
