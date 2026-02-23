import React from 'react';
import { ShoppingBag, ArrowRight, Trash2, Minus, Plus, Check } from 'lucide-react';

export interface CartWireframeProps {
  cart?: any[];
  storeSettings?: any;
}

const DEFAULT_CART = [
  {
    id: '1',
    name: 'Classic Heavyweight Cotton T-Shirt',
    price: 60.00,
    quantity: 1,
    image: null,
    variant: 'Black / L'
  },
  {
    id: '2',
    name: 'Minimalist Canvas Backpack',
    price: 120.00,
    quantity: 1,
    image: null,
    variant: 'Grey'
  }
];

export default function CartWireframe({ cart, storeSettings }: CartWireframeProps) {
  const displayCart = cart && cart.length > 0 ? cart : DEFAULT_CART;
  const currency = storeSettings?.currency || 'USD';
  const currencySymbol = currency.includes('Naira') ? '₦' : '$';

  // State for quantities (local to wireframe for interactivity)
  const [items, setItems] = React.useState(displayCart);

  // Update items when props change
  React.useEffect(() => {
    if (cart && cart.length > 0) {
      setItems(cart);
    }
  }, [cart]);

  const updateQuantity = (id: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = subtotal > 50000 ? 0 : 2500;
  const total = subtotal + shipping;

  if (items.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center bg-white px-4 py-24">
        <div className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-50">
            <ShoppingBag className="h-10 w-10 text-gray-300" />
          </div>
          <h1 className="mt-6 text-2xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your cart is empty
          </h1>
          <p className="mt-4 text-gray-500">
            Looks like you haven't added anything to your collection yet.
          </p>
          <button className="mt-8 inline-flex items-center gap-2 rounded-full bg-black px-8 py-3 text-sm font-medium text-white transition hover:bg-gray-800">
            Start Shopping <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white h-full overflow-y-auto">
      <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
        <header className="flex items-center justify-between border-b border-gray-100 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">Shopping Cart</h1>
            <p className="mt-2 text-gray-500">{items.length} items in your bag</p>
          </div>
        </header>

        <div className="mt-8 lg:grid lg:grid-cols-12 lg:items-start lg:gap-x-12 xl:gap-x-16">
          <div className="lg:col-span-8">
            <ul className="divide-y divide-gray-100">
              {items.map((item) => (
                <li key={item.id} className="flex py-6 sm:py-10">
                  <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-xl border border-gray-100 sm:h-32 sm:w-32 bg-gray-50">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-gray-300 text-xs uppercase">
                        No Image
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                    <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                      <div>
                        <div className="flex justify-between">
                          <h3 className="text-lg font-medium text-gray-900 hover:text-gray-700">
                            <a href="#">{item.name}</a>
                          </h3>
                        </div>
                        {item.variant && (
                          <div className="mt-1 flex text-sm text-gray-500">
                            <p>{item.variant}</p>
                          </div>
                        )}
                        <p className="mt-2 text-lg font-medium text-gray-900">
                          {currencySymbol}{item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="mt-4 sm:mt-0 sm:pr-9">
                        <div className="flex items-center rounded border border-gray-200 w-max">
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, -1)}
                            className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="h-8 w-10 flex items-center justify-center text-sm font-medium border-x border-gray-200">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => updateQuantity(item.id, 1)}
                            className="h-8 w-8 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="absolute right-0 top-0">
                          <button
                            type="button"
                            onClick={() => removeItem(item.id)}
                            className="-m-2 inline-flex p-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <span className="sr-only">Remove</span>
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2 text-sm text-green-600">
                      <Check className="h-4 w-4" />
                      <span>In stock and ready to ship</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-4 mt-16 lg:mt-0">
            <div className="rounded-2xl border border-gray-100 bg-gray-50/50 p-6 sm:p-8">
              <h2 className="text-lg font-medium text-gray-900">Order Summary</h2>

              <dl className="mt-6 space-y-4">
                <div className="flex items-center justify-between">
                  <dt className="text-sm text-gray-600">Subtotal</dt>
                  <dd className="text-sm font-medium text-gray-900">{currencySymbol}{subtotal.toLocaleString()}</dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="flex items-center text-sm text-gray-600">
                    <span>Shipping estimate</span>
                  </dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {shipping === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `${currencySymbol}${shipping.toLocaleString()}`
                    )}
                  </dd>
                </div>
                <div className="flex items-center justify-between border-t border-gray-200 pt-4">
                  <dt className="text-base font-medium text-gray-900">Order Total</dt>
                  <dd className="text-xl font-bold text-gray-900">{currencySymbol}{total.toLocaleString()}</dd>
                </div>
              </dl>

              <div className="mt-6">
                <button
                  className="w-full flex items-center justify-center gap-2 rounded-xl border border-transparent bg-black px-6 py-4 text-base font-medium text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </button>
              </div>
              
              <div className="mt-6 flex justify-center space-x-4 text-gray-400 opacity-75">
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-8 w-12 bg-gray-200 rounded animate-pulse"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
