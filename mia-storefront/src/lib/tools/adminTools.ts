import { ChatCompletionTool } from 'groq-sdk/resources/chat/completions';

export const adminTools: ChatCompletionTool[] = [
    {
        type: 'function',
        function: {
            name: 'add_product',
            description: 'Add a new product to the seller store. Call this when the seller says they want to add, create, or list a new product.',
            parameters: {
                type: 'object',
                properties: {
                    name: {
                        type: 'string',
                        description: 'The product name'
                    },
                    description: {
                        type: 'string',
                        description: 'A short product description. Use empty string if not provided.'
                    },
                    price: {
                        type: 'number',
                        description: 'The product price in naira'
                    },
                    total_stock: {
                        type: 'number',
                        description: 'How many units are available'
                    },
                    delivery_cost: {
                        type: 'number',
                        description: 'Delivery cost in naira. Use 0 if not specified.'
                    },
                    variants: {
                        type: 'string',
                        description: 'JSON string of variants e.g. {"sizes":["S","M","L"]}. Use empty string if no variants.'
                    }
                },
                required: ['name', 'description', 'price', 'total_stock', 'delivery_cost', 'variants'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'update_product_price',
            description: 'Update the price of an existing product. Call this when the seller wants to change or update a product price.',
            parameters: {
                type: 'object',
                properties: {
                    product_id: {
                        type: 'string',
                        description: 'The ID of the product to update'
                    },
                    new_price: {
                        type: 'string',
                        description: 'The new price in naira (as a number e.g. "5000")'
                    }
                },
                required: ['product_id', 'new_price'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'update_product_stock',
            description: 'Update the stock count of a product. Call this when the seller says they have restocked or want to change available quantity.',
            parameters: {
                type: 'object',
                properties: {
                    product_id: {
                        type: 'string',
                        description: 'The ID of the product to update'
                    },
                    new_stock: {
                        type: 'string',
                        description: 'The new stock count (as a number e.g. "20")'
                    }
                },
                required: ['product_id', 'new_stock'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'remove_product',
            description: 'Deactivate a product so it no longer shows to buyers. Call this when the seller wants to remove, hide, or delete a product.',
            parameters: {
                type: 'object',
                properties: {
                    product_id: {
                        type: 'string',
                        description: 'The ID of the product to remove'
                    }
                },
                required: ['product_id'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'confirm_payment',
            description: 'Confirm a buyer payment and release their order. Call this when the seller says they have confirmed or verified a payment using an order reference.',
            parameters: {
                type: 'object',
                properties: {
                    order_reference: {
                        type: 'string',
                        description: 'The order reference code e.g. PN-A3F2'
                    }
                },
                required: ['order_reference'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'update_order_status',
            description: 'Update the fulfillment status of an order. Call this when the seller wants to mark an order as processing, shipped, or delivered.',
            parameters: {
                type: 'object',
                properties: {
                    order_reference: {
                        type: 'string',
                        description: 'The order reference code (e.g., ORD-1234)'
                    },
                    new_status: {
                        type: 'string',
                        description: 'The new status: "processing", "shipped", or "delivered"'
                    },
                    tracking_info: {
                        type: 'string',
                        description: 'Optional tracking number or courier name (relevant if status is "shipped"). Use empty string if not provided.'
                    }
                },
                required: ['order_reference', 'new_status'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'list_orders',
            description: 'List orders from the store. Use this when the seller asks to see orders — pending, shipped, delivered, cancelled, or all. Also use when they search by buyer name or order reference.',
            parameters: {
                type: 'object',
                properties: {
                    status: {
                        type: 'string',
                        description: 'Filter by order status: "pending", "processing", "shipped", "delivered", "cancelled", "paid", or "all" for everything. Default to "all" if not specified.',
                    },
                    search: {
                        type: 'string',
                        description: 'Optional. Search by buyer name, email, or order reference/number.',
                    },
                    limit: {
                        type: 'string',
                        description: 'Max number of orders to return. Default 10. Accepts a number as string e.g. "10".',
                    }
                },
                required: ['status'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'cancel_order',
            description: 'Cancel an order. Call this when the seller says they want to cancel an order. Always confirm the order reference before cancelling.',
            parameters: {
                type: 'object',
                properties: {
                    order_reference: {
                        type: 'string',
                        description: 'The order number or reference to cancel (e.g., ORD-1234)'
                    },
                    reason: {
                        type: 'string',
                        description: 'Reason for cancellation. Use empty string if not provided.'
                    }
                },
                required: ['order_reference', 'reason'],
                additionalProperties: false
            }
        }
    }
];
