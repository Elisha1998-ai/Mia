import React from 'react';

interface OrderReceiptEmailProps {
    storeName: string;
    orderNumber: string;
    customerName: string;
    totalAmount: number;
    currency: string;
    paymentMethod: string;
    items: Array<{
        name: string;
        quantity: number;
        price: number;
    }>;
}

export const OrderReceiptEmail: React.FC<Readonly<OrderReceiptEmailProps>> = ({
    storeName,
    orderNumber,
    customerName,
    totalAmount,
    currency,
    paymentMethod,
    items,
}) => {
    return (
        <div style={{ fontFamily: 'sans-serif', padding: '40px 20px', backgroundColor: '#f9fafb', color: '#111827' }}>
            <div style={{ maxWidth: '600px', margin: '0 auto', backgroundColor: '#ffffff', borderRadius: '8px', padding: '40px', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold', borderBottom: '2px solid #f3f4f6', paddingBottom: '20px', marginBottom: '30px', textAlign: 'center' }}>
                    {storeName}
                </h1>

                <p style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '20px' }}>
                    Hi {customerName},
                </p>
                <p style={{ fontSize: '16px', lineHeight: '24px', marginBottom: '30px' }}>
                    Thank you for your order! We've received it and are setting it up for you.
                    {paymentMethod === 'whatsapp' || paymentMethod === 'bank_transfer'
                        ? " Please note that your order is currently PENDING until payment is confirmed via direct bank transfer."
                        : " Your payment was successful."}
                </p>

                <div style={{ backgroundColor: '#f9fafb', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                    <h2 style={{ fontSize: '14px', textTransform: 'uppercase', letterSpacing: '1px', color: '#6b7280', marginBottom: '15px' }}>
                        Order Summary (#{orderNumber})
                    </h2>

                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={index} style={{ borderBottom: index < items.length - 1 ? '1px solid #e5e7eb' : 'none' }}>
                                    <td style={{ padding: '12px 0', fontSize: '14px' }}>
                                        <strong>{item.name}</strong> <span style={{ color: '#6b7280' }}>x{item.quantity}</span>
                                    </td>
                                    <td style={{ padding: '12px 0', fontSize: '14px', textAlign: 'right' }}>
                                        {currency}{(item.price * item.quantity).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td style={{ paddingTop: '20px', fontSize: '16px', fontWeight: 'bold' }}>Total</td>
                                <td style={{ paddingTop: '20px', fontSize: '16px', fontWeight: 'bold', textAlign: 'right' }}>
                                    {currency}{totalAmount.toLocaleString('en-US', { minimumFractionDigits: 2 })}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {(paymentMethod === 'whatsapp' || paymentMethod === 'bank_transfer') && (
                    <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '20px', marginBottom: '30px' }}>
                        <h3 style={{ fontSize: '14px', color: '#1e3a8a', marginTop: 0, marginBottom: '10px' }}>Payment Instructions</h3>
                        <p style={{ fontSize: '14px', color: '#1e40af', margin: 0 }}>
                            To complete your order, please transfer the total amount to the store's bank account. You can chat with the seller on WhatsApp to get the account details or send your payment receipt.
                        </p>
                    </div>
                )}

                <p style={{ fontSize: '14px', color: '#6b7280', textAlign: 'center', marginTop: '40px' }}>
                    If you have any questions, please reply to this email or contact {storeName} directly.
                </p>
            </div>
        </div>
    );
};
