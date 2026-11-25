import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  CreditCard,
  Smartphone,
  ShieldCheck,
  CheckCircle2,
  ArrowLeft,
  Lock,
  PackageCheck,
} from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

const PAYMENT_TABS = [
  { id: 'UPI', label: 'UPI', icon: Smartphone },
  { id: 'Credit Card', label: 'Credit Card', icon: CreditCard },
  { id: 'Debit Card', label: 'Debit Card', icon: CreditCard },
];

export default function CheckoutPage() {
  const { items, subtotal, shipping, tax, total, clearCart } = useCart();
  const { user } = useAuth();

  const [shippingForm, setShippingForm] = useState({
    fullName: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });
  const [sameAsShipping, setSameAsShipping] = useState(true);
  const [billingForm, setBillingForm] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'United States',
  });

  const [paymentMethod, setPaymentMethod] = useState('UPI');
  const [upiId, setUpiId] = useState('');
  const [cardForm, setCardForm] = useState({
    number: '',
    name: user?.name || '',
    expiry: '',
    cvv: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [confirmedOrder, setConfirmedOrder] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (items.length === 0) {
      setError('Your cart is empty. Please add an item before checking out.');
      return;
    }

    if (paymentMethod === 'UPI' && !upiId.includes('@')) {
      setError('Please enter a valid UPI ID (e.g., name@okaxis).');
      return;
    }

    if (paymentMethod !== 'UPI' && cardForm.number.replace(/\s+/g, '').length < 12) {
      setError('Please enter a valid 16-digit card number.');
      return;
    }

    setError('');
    setSubmitting(true);

    try {
      const cleanCardDigits = cardForm.number.replace(/\D/g, '');
      const payload = {
        items: items.map((item) => ({
          product: item._id,
          name: item.name,
          image: item.image,
          price: item.price,
          quantity: item.quantity,
        })),
        shippingAddress: shippingForm,
        billingAddress: sameAsShipping ? undefined : billingForm,
        paymentMethod,
        paymentDetails:
          paymentMethod === 'UPI'
            ? { upiId }
            : {
                cardLast4: cleanCardDigits.slice(-4) || '4242',
                cardBrand: paymentMethod === 'Credit Card' ? 'Visa / Mastercard' : 'Debit Network',
              },
      };

      const { order } = await api.createOrder(payload);
      setConfirmedOrder(order);
      clearCart();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (confirmedOrder) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-14 sm:px-6">
        <div className="rounded-[28px] border border-charcoal/10 bg-white p-8 shadow-editorial sm:p-10">
          <div className="flex flex-col items-center text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
              <CheckCircle2 className="h-9 w-9" />
            </div>
            <span className="mt-4 text-xs font-semibold uppercase tracking-[0.2em] text-terracotta">
              Order Confirmation Receipt
            </span>
            <h1 className="mt-2 font-serif text-3xl font-bold text-charcoal">
              Thank you, {confirmedOrder.shippingAddress.fullName}!
            </h1>
            <p className="mt-2 text-sm text-charcoal/65">
              Your curated pieces are scheduled for white-glove dispatch. Receipt{' '}
              <strong className="text-charcoal">{confirmedOrder.orderNumber}</strong> has been
              sent to {confirmedOrder.shippingAddress.email}.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 rounded-2xl bg-sand/70 p-5 text-xs sm:grid-cols-3">
            <div>
              <span className="block font-semibold uppercase tracking-wider text-charcoal/55">
                Order Number
              </span>
              <span className="mt-1 block text-sm font-bold text-charcoal">
                {confirmedOrder.orderNumber}
              </span>
            </div>
            <div>
              <span className="block font-semibold uppercase tracking-wider text-charcoal/55">
                Payment Method
              </span>
              <span className="mt-1 block text-sm font-bold text-charcoal">
                {confirmedOrder.paymentMethod}
                {confirmedOrder.paymentDetails?.upiId
                  ? ` (${confirmedOrder.paymentDetails.upiId})`
                  : confirmedOrder.paymentDetails?.cardLast4
                  ? ` (•••• ${confirmedOrder.paymentDetails.cardLast4})`
                  : ''}
              </span>
            </div>
            <div>
              <span className="block font-semibold uppercase tracking-wider text-charcoal/55">
                Shipping To
              </span>
              <span className="mt-1 block text-sm font-bold text-charcoal">
                {confirmedOrder.shippingAddress.city}, {confirmedOrder.shippingAddress.state}
              </span>
            </div>
          </div>

          <div className="mt-6 space-y-3 border-t border-charcoal/10 pt-5">
            {confirmedOrder.items.map((item, idx) => (
              <div key={idx} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-12 w-12 rounded-xl object-cover"
                  />
                  <div>
                    <p className="font-semibold text-charcoal">{item.name}</p>
                    <p className="text-xs text-charcoal/60">Qty {item.quantity}</p>
                  </div>
                </div>
                <span className="font-semibold text-charcoal">
                  ${(item.price * item.quantity).toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          <div className="mt-6 space-y-1.5 border-t border-charcoal/10 pt-4 text-sm">
            <div className="flex justify-between text-charcoal/70">
              <span>Subtotal</span>
              <span>${confirmedOrder.subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-charcoal/70">
              <span>Shipping</span>
              <span>
                {confirmedOrder.shippingCost === 0
                  ? 'Complimentary'
                  : `$${confirmedOrder.shippingCost}`}
              </span>
            </div>
            <div className="flex justify-between text-charcoal/70">
              <span>Tax (8%)</span>
              <span>${confirmedOrder.tax.toLocaleString()}</span>
            </div>
            <div className="flex justify-between pt-2 font-serif text-xl font-bold text-charcoal">
              <span>Total Paid</span>
              <span>${confirmedOrder.totalAmount.toLocaleString()}</span>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              to="/"
              className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta"
            >
              Return to Design Gallery
            </Link>
            <Link
              to="/furniture"
              className="rounded-full border border-charcoal/20 px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-sand"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link
        to="/cart"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-charcoal/70 hover:text-terracotta"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to Shopping Cart
      </Link>

      <h1 className="mt-3 font-serif text-3xl font-bold text-charcoal sm:text-4xl">
        Checkout &amp; Payment
      </h1>

      <form onSubmit={handleSubmit} className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
        {/* Left Column: Shipping, Billing & Payment Tabs */}
        <div className="space-y-6 lg:col-span-8">
          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-3.5 text-sm font-medium text-red-700">
              {error}
            </div>
          )}

          {/* Shipping Details */}
          <section className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-card sm:p-8">
            <h2 className="font-serif text-2xl font-bold text-charcoal">Shipping Details</h2>
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-charcoal/70">Full Name</label>
                <input
                  type="text"
                  required
                  value={shippingForm.fullName}
                  onChange={(e) => setShippingForm({ ...shippingForm, fullName: e.target.value })}
                  placeholder="Aria Sterling"
                  className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/70">Email Address</label>
                <input
                  type="email"
                  required
                  value={shippingForm.email}
                  onChange={(e) => setShippingForm({ ...shippingForm, email: e.target.value })}
                  placeholder="aria@example.com"
                  className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/70">Phone Number</label>
                <input
                  type="tel"
                  required
                  value={shippingForm.phone}
                  onChange={(e) => setShippingForm({ ...shippingForm, phone: e.target.value })}
                  placeholder="+1 (415) 555-0192"
                  className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                />
              </div>
              <div className="sm:col-span-2">
                <label className="text-xs font-semibold text-charcoal/70">Street Address</label>
                <input
                  type="text"
                  required
                  value={shippingForm.address}
                  onChange={(e) => setShippingForm({ ...shippingForm, address: e.target.value })}
                  placeholder="742 Hayes Valley Lane, Apt 4B"
                  className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-charcoal/70">City</label>
                <input
                  type="text"
                  required
                  value={shippingForm.city}
                  onChange={(e) => setShippingForm({ ...shippingForm, city: e.target.value })}
                  placeholder="San Francisco"
                  className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-charcoal/70">State</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.state}
                    onChange={(e) => setShippingForm({ ...shippingForm, state: e.target.value })}
                    placeholder="CA"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal/70">Postal Code</label>
                  <input
                    type="text"
                    required
                    value={shippingForm.postalCode}
                    onChange={(e) =>
                      setShippingForm({ ...shippingForm, postalCode: e.target.value })
                    }
                    placeholder="94102"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                  />
                </div>
              </div>
            </div>

            <label className="mt-5 inline-flex cursor-pointer items-center gap-2.5 text-xs font-medium text-charcoal/80">
              <input
                type="checkbox"
                checked={sameAsShipping}
                onChange={(e) => setSameAsShipping(e.target.checked)}
                className="h-4 w-4 rounded accent-terracotta"
              />
              Billing address is the same as shipping address
            </label>

            {!sameAsShipping && (
              <div className="mt-5 grid grid-cols-1 gap-4 border-t border-charcoal/10 pt-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-charcoal/70">Billing Full Name</label>
                  <input
                    type="text"
                    required
                    value={billingForm.fullName}
                    onChange={(e) => setBillingForm({ ...billingForm, fullName: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-charcoal/70">Billing Street</label>
                  <input
                    type="text"
                    required
                    value={billingForm.address}
                    onChange={(e) => setBillingForm({ ...billingForm, address: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal/70">City</label>
                  <input
                    type="text"
                    required
                    value={billingForm.city}
                    onChange={(e) => setBillingForm({ ...billingForm, city: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    type="text"
                    required
                    placeholder="State"
                    value={billingForm.state}
                    onChange={(e) => setBillingForm({ ...billingForm, state: e.target.value })}
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Postal Code"
                    value={billingForm.postalCode}
                    onChange={(e) =>
                      setBillingForm({ ...billingForm, postalCode: e.target.value })
                    }
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-2.5 text-sm"
                  />
                </div>
              </div>
            )}
          </section>

          {/* Tabbed Payment Methods */}
          <section className="rounded-3xl border border-charcoal/10 bg-white p-6 shadow-card sm:p-8">
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold text-charcoal">Payment Method</h2>
              <span className="inline-flex items-center gap-1 text-xs font-medium text-charcoal/60">
                <Lock className="h-3.5 w-3.5 text-terracotta" />
                256-Bit Encrypted
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-2.5">
              {PAYMENT_TABS.map((tab) => {
                const Icon = tab.icon;
                const active = paymentMethod === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setPaymentMethod(tab.id)}
                    className={`flex items-center justify-center gap-2 rounded-2xl border px-3 py-3 text-xs font-semibold transition sm:text-sm ${
                      active
                        ? 'border-charcoal bg-charcoal text-cream shadow-sm'
                        : 'border-charcoal/15 bg-cream/50 text-charcoal hover:bg-sand'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${active ? 'text-terracotta' : ''}`} />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {paymentMethod === 'UPI' ? (
              <div className="mt-6 rounded-2xl bg-sand/65 p-5">
                <label className="text-xs font-semibold text-charcoal/75">
                  Enter UPI ID / VPA
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="aria.sterling@okicici"
                  className="mt-2 w-full rounded-xl border border-charcoal/15 bg-white px-4 py-3 text-sm focus:border-terracotta focus:outline-none"
                />
                <div className="mt-3 flex flex-wrap gap-2">
                  {['Google Pay', 'PhonePe', 'Paytm', 'BHIM UPI'].map((app) => (
                    <span
                      key={app}
                      className="rounded-full border border-charcoal/10 bg-white px-3 py-1 text-[11px] font-semibold text-charcoal/75"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            ) : (
              <div className="mt-6 grid grid-cols-1 gap-4 rounded-2xl bg-sand/65 p-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-charcoal/75">
                    {paymentMethod} Number
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={19}
                    value={cardForm.number}
                    onChange={(e) => setCardForm({ ...cardForm, number: e.target.value })}
                    placeholder="4532 8910 2345 6789"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-xs font-semibold text-charcoal/75">
                    Cardholder Name
                  </label>
                  <input
                    type="text"
                    required
                    value={cardForm.name}
                    onChange={(e) => setCardForm({ ...cardForm, name: e.target.value })}
                    placeholder="Aria Sterling"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal/75">Expiry (MM/YY)</label>
                  <input
                    type="text"
                    required
                    maxLength={5}
                    value={cardForm.expiry}
                    onChange={(e) => setCardForm({ ...cardForm, expiry: e.target.value })}
                    placeholder="08/29"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-charcoal/75">CVV</label>
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cardForm.cvv}
                    onChange={(e) => setCardForm({ ...cardForm, cvv: e.target.value })}
                    placeholder="***"
                    className="mt-1.5 w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                  />
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Right Column: Order Summary */}
        <aside className="lg:col-span-4">
          <div className="sticky top-24 rounded-3xl border border-charcoal/10 bg-sand/75 p-6 shadow-card">
            <h2 className="font-serif text-2xl font-bold text-charcoal">Order Summary</h2>

            {items.length === 0 ? (
              <p className="mt-4 text-sm text-charcoal/65">
                Your bag is empty. Add furniture or lighting to complete an order.
              </p>
            ) : (
              <div className="mt-4 max-h-56 space-y-3 overflow-y-auto border-b border-charcoal/10 pb-4">
                {items.map((item) => (
                  <div key={item._id} className="flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-2.5">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-11 w-11 rounded-lg object-cover"
                      />
                      <div>
                        <p className="font-semibold text-charcoal">{item.name}</p>
                        <p className="text-charcoal/60">Qty {item.quantity}</p>
                      </div>
                    </div>
                    <span className="font-bold text-charcoal">
                      ${(item.price * item.quantity).toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 space-y-2.5 border-b border-charcoal/10 pb-4 text-sm">
              <div className="flex justify-between text-charcoal/75">
                <span>Subtotal</span>
                <span className="font-semibold text-charcoal">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-charcoal/75">
                <span>Shipping</span>
                <span className="font-semibold text-charcoal">
                  {shipping === 0 ? 'Complimentary' : `$${shipping}`}
                </span>
              </div>
              <div className="flex justify-between text-charcoal/75">
                <span>Tax (8%)</span>
                <span className="font-semibold text-charcoal">${tax.toLocaleString()}</span>
              </div>
            </div>

            <div className="mt-4 flex items-baseline justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-charcoal/70">
                Total Due
              </span>
              <span className="font-serif text-3xl font-bold text-charcoal">
                ${total.toLocaleString()}
              </span>
            </div>

            <button
              type="submit"
              disabled={submitting || items.length === 0}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-terracotta py-3.5 text-sm font-semibold text-white transition hover:bg-charcoal disabled:cursor-not-allowed disabled:opacity-50"
            >
              <PackageCheck className="h-4 w-4" />
              {submitting ? 'Confirming Order...' : `Complete Purchase ($${total.toLocaleString()})`}
            </button>

            <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-charcoal/60">
              <ShieldCheck className="h-4 w-4 text-terracotta" />
              30-day architectural satisfaction guarantee
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
