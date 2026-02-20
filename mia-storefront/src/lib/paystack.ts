
export const paystack = {
  initialize: async (email: string, amount: number, reference: string) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY is not configured");

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${secretKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: Math.round(amount * 100), // Convert to kobo/cents
        reference,
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/store/checkout/verify`,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Paystack initialization failed: ${error}`);
    }

    return response.json();
  },

  verify: async (reference: string) => {
    const secretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!secretKey) throw new Error("PAYSTACK_SECRET_KEY is not configured");

    const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${secretKey}`,
      },
    });

    if (!response.ok) {
      throw new Error("Paystack verification failed");
    }

    return response.json();
  },
};
