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
    },
    {
        type: 'function',
        function: {
            name: 'report_earnings',
            description: 'Report earnings and revenue for a specific period. Call this when the seller wants to know how much they made or their revenue today, this week, or this month.',
            parameters: {
                type: 'object',
                properties: {
                    period: {
                        type: 'string',
                        description: 'The time period: "today", "week", "month", or "all"'
                    }
                },
                required: ['period'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_profit_and_loss',
            description: 'Generate a profit and loss (P&L) summary. Call this when the seller wants to track expenses against revenue, or see their gross profit.',
            parameters: {
                type: 'object',
                properties: {
                    period: {
                        type: 'string',
                        description: 'The time period: "week", "month", or "all"'
                    }
                },
                required: ['period'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'calculate_tax_liability',
            description: 'Calculate VAT, taxable income, or tax liability for a given period. Call this when the seller asks to calculate VAT or tax.',
            parameters: {
                type: 'object',
                properties: {
                    period: {
                        type: 'string',
                        description: 'The time period: "month", "year", or "all"'
                    },
                    rate: {
                        type: 'number',
                        description: 'The tax rate percentage (e.g., 7.5 for 7.5% VAT)',
                    }
                },
                required: ['period', 'rate'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'export_store_data',
            description: 'Export all orders or customers to a downloadable format (CSV or Google Sheets). Call this when the seller requests to export, sync, or download their orders or customers.',
            parameters: {
                type: 'object',
                properties: {
                    data_type: {
                        type: 'string',
                        description: 'The type of data to export: "orders", "customers", or "all"'
                    }
                },
                required: ['data_type'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_low_stock_products',
            description: 'Check which products are low on stock. Call this when the seller asks what products are running low or out of stock.',
            parameters: {
                type: 'object',
                properties: {
                    threshold: {
                        type: 'number',
                        description: 'The stock threshold below which a product is considered low. Default is 5.'
                    }
                },
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_best_selling_time',
            description: 'Identify the best selling day of the week and time of day based on past orders.',
            parameters: {
                type: 'object',
                properties: {},
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'suggest_price_adjustments',
            description: 'Suggest price adjustments for products that are not selling well.',
            parameters: {
                type: 'object',
                properties: {},
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'segment_customers',
            description: 'Segment customers into big spenders, frequent buyers, and one-time buyers.',
            parameters: {
                type: 'object',
                properties: {},
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_top_customers',
            description: 'Identify the most loyal and most valuable customers based on lifetime value.',
            parameters: {
                type: 'object',
                properties: {
                    limit: {
                        type: 'number',
                        description: 'Number of top customers to return. Default is 5.'
                    }
                },
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'forecast_revenue',
            description: 'Forecast next week or next month revenue based on recent trends.',
            parameters: {
                type: 'object',
                properties: {
                    period: {
                        type: 'string',
                        description: '"week" or "month"'
                    }
                },
                required: ['period'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_store_performance',
            description: 'Summarize overall store performance including total orders, revenue, and active customers.',
            parameters: {
                type: 'object',
                properties: {},
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_idle_customers',
            description: 'Report customers who have not made a purchase in a while. Call this when the seller asks who has not bought recently, or wants to know who to nudge or re-engage.',
            parameters: {
                type: 'object',
                properties: {
                    days: {
                        type: 'number',
                        description: 'How many days of inactivity counts as idle. Default is 30.'
                    }
                },
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_orders_needing_reviews',
            description: 'List delivered orders that are old enough to request a product review from the buyer. Call this when the seller asks about reviews, or which customers to follow up with.',
            parameters: {
                type: 'object',
                properties: {
                    days_since_delivery: {
                        type: 'number',
                        description: 'How many days after delivery before requesting a review. Default is 7.'
                    }
                },
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_unconfirmed_deliveries',
            description: 'List orders that were shipped several days ago but have not yet been marked as delivered. Call this when the seller wants to follow up on outstanding shipments or confirm receipt.',
            parameters: {
                type: 'object',
                properties: {
                    days_since_shipped: {
                        type: 'number',
                        description: 'How many days after shipping before flagging as overdue. Default is 5.'
                    }
                },
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'get_abandoned_carts',
            description: 'Report orders or checkout sessions that were started but never completed (abandoned carts). Call this when the seller asks about abandoned carts, dropped checkouts, or buyers who did not complete a purchase.',
            parameters: {
                type: 'object',
                properties: {
                    hours: {
                        type: 'number',
                        description: 'How many hours ago the order was created to count as abandoned. Default is 1.'
                    }
                },
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'generate_social_caption',
            description: 'Write a creative Instagram or TikTok caption for a product. Call this when the seller asks for a caption, social post, or marketing copy for a product.',
            parameters: {
                type: 'object',
                properties: {
                    product_name: {
                        type: 'string',
                        description: 'The name of the product to write a caption for.'
                    },
                    platform: {
                        type: 'string',
                        description: 'The platform: "instagram" or "tiktok". Default is "instagram".'
                    },
                    tone: {
                        type: 'string',
                        description: 'The tone of the caption: "hype", "luxury", "funny", "minimal". Default is "hype".'
                    }
                },
                required: ['product_name'],
                additionalProperties: false
            }
        }
    },
    {
        type: 'function',
        function: {
            name: 'generate_invoice',
            description: 'Generate a downloadable PDF invoice for an order. Call this when the seller asks to generate, create, or download an invoice for a specific order reference.',
            parameters: {
                type: 'object',
                properties: {
                    order_reference: {
                        type: 'string',
                        description: 'The order number or reference (e.g. ORD-7052) to generate an invoice for.'
                    }
                },
                required: ['order_reference'],
                additionalProperties: false
            }
        }
    }
];
