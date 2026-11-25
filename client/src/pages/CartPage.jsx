import { Link } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function CartPage() {
  const { items, subtotal, shipping, tax, total, updateQuantity, removeFromCart } = useCart();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="border-b border-charcoal/10 pb-6">
        <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
          Your Selection
        </span>
        <h1 className="mt-2 font-serif text-3xl font-bold text-charcoal sm:text-4xl">
          Shopping Cart
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="mt-10 rounded-3xl border border-charcoal/10 bg-white px-6 py-16 text-center shadow-card">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-sand text-terracotta">
            <ShoppingBag className="h-7 w-7" />
          </div>
          <h2 className="mt-5 font-serif text-2xl font-bold text-charcoal">
            Your shopping bag is currently empty
          </h2>
          <p className="mx-auto mt-2 max-w-md text-sm text-charcoal/65">
            Explore our interactive room customizer, curated furniture pieces, or ambient lighting
            collection to begin building your space.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Link
              to="/furniture"
              className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta"
            >
              Browse Furniture
            </Link>
            <Link
              to="/appliances"
              className="rounded-full border border-charcoal/20 bg-white px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-sand"
            >
              Explore Lighting
            </Link>
          </div>
        </div>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Itemized Cart List */}
          <div className="space-y-4 lg:col-span-8">
            {items.map((item) => (
              <div
                key={item._id}
                className="flex flex-col gap-4 rounded-3xl border border-charcoal/10 bg-white p-4 shadow-card sm:flex-row sm:items-center sm:p-5"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="h-28 w-full rounded-2xl object-cover sm:w-32"
                />

                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-terracotta">
                    <span>{item.category}</span>
                    {item.style && (
                      <>
                        <span>&bull;</span>
                        <span className="text-charcoal/60">{item.style}</span>
                      </>
                    )}
                  </div>
                  <h3 className="mt-1 font-serif text-lg font-bold text-charcoal">{item.name}</h3>
                  <p className="mt-1 text-sm font-semibold text-charcoal/70">
                    ${Number(item.price).toLocaleString()} each
                  </p>
                </div>

                <div className="flex items-center justify-between gap-5 sm:justify-end">
                  {/* Stepper */}
                  <div className="flex items-center rounded-full border border-charcoal/15 bg-cream px-1.5 py-1">
                    <button
                      type="button"
                      aria-label={`Decrease quantity of ${item.name}`}
                      onClick={() => updateQuantity(item._id, -1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal transition hover:bg-sand"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold text-charcoal">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label={`Increase quantity of ${item.name}`}
                      onClick={() => updateQuantity(item._id, 1)}
                      className="flex h-8 w-8 items-center justify-center rounded-full text-charcoal transition hover:bg-sand"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>

                  <div className="text-right">
                    <p className="font-serif text-lg font-bold text-charcoal">
                      ${(item.price * item.quantity).toLocaleString()}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(item._id)}
                      className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-charcoal/50 transition hover:text-terracotta"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Sticky Order Summary */}
          <aside className="lg:col-span-4">
            <div className="sticky top-24 rounded-3xl border border-charcoal/10 bg-sand/75 p-6 shadow-card">
              <h2 className="font-serif text-2xl font-bold text-charcoal">Order Summary</h2>

              <div className="mt-5 space-y-3 border-b border-charcoal/10 pb-5 text-sm">
                <div className="flex justify-between text-charcoal/75">
                  <span>Subtotal</span>
                  <span className="font-semibold text-charcoal">${subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-charcoal/75">
                  <span>White-Glove Shipping</span>
                  <span className="font-semibold text-charcoal">
                    {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                  </span>
                </div>
                <div className="flex justify-between text-charcoal/75">
                  <span>Estimated Tax (8%)</span>
                  <span className="font-semibold text-charcoal">${tax.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-5 flex items-baseline justify-between">
                <span className="text-sm font-semibold uppercase tracking-wider text-charcoal/70">
                  Total
                </span>
                <span className="font-serif text-3xl font-bold text-charcoal">
                  ${total.toLocaleString()}
                </span>
              </div>

              <Link
                to="/checkout"
                className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-3.5 text-sm font-semibold text-cream transition hover:bg-terracotta"
              >
                Proceed to Checkout <ArrowRight className="h-4 w-4" />
              </Link>

              <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-charcoal/60">
                <ShieldCheck className="h-4 w-4 text-terracotta" />
                Complimentary delivery on orders over $1,000
              </p>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
