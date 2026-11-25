import { useState } from 'react';
import { X, Star, ShoppingBag, Ruler, Layers, Zap, Thermometer, Wifi } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function ProductDetailModal({ product, onClose, onProductUpdated }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [rating, setRating] = useState(5);
  const [userName, setUserName] = useState(user?.name || '');
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!product) return null;

  async function handleReviewSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const { product: updated } = await api.addProductReview(product._id, {
        userName: userName || 'Guest Homeowner',
        rating,
        comment,
      });
      setComment('');
      if (onProductUpdated) onProductUpdated(updated);
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm">
      <div className="relative max-h-[92vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-cream shadow-2xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-charcoal shadow-sm transition hover:bg-charcoal hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="bg-sand">
            <img
              src={product.image}
              alt={product.name}
              className="h-72 w-full object-cover md:h-full"
            />
          </div>

          <div className="p-6 sm:p-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-terracotta/15 px-3 py-1 text-xs font-semibold text-terracotta">
                {product.category}
              </span>
              <span className="rounded-full bg-sand px-3 py-1 text-xs font-medium text-charcoal/80">
                {product.style}
              </span>
            </div>

            <h2 className="mt-3 font-serif text-2xl font-bold text-charcoal sm:text-3xl">
              {product.name}
            </h2>

            <div className="mt-2 flex items-center justify-between">
              <span className="font-serif text-2xl font-bold text-charcoal">
                ${Number(product.price).toLocaleString()}
              </span>
              <div className="flex items-center gap-1 text-sm font-medium text-charcoal">
                <Star className="h-4 w-4 fill-brass text-brass" />
                <span>{product.rating}</span>
                <span className="text-charcoal/50">({product.numReviews || product.reviews?.length || 0} reviews)</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-charcoal/75">{product.description}</p>

            {/* Dimensions & Material */}
            <div className="mt-5 space-y-2.5 rounded-2xl bg-sand/70 p-4 text-xs">
              {product.dimensions && (
                <div className="flex items-center gap-2.5 text-charcoal/85">
                  <Ruler className="h-4 w-4 shrink-0 text-terracotta" />
                  <span>
                    <strong className="font-semibold">Dimensions:</strong> {product.dimensions}
                  </span>
                </div>
              )}
              {product.material && (
                <div className="flex items-center gap-2.5 text-charcoal/85">
                  <Layers className="h-4 w-4 shrink-0 text-terracotta" />
                  <span>
                    <strong className="font-semibold">Materials:</strong> {product.material}
                  </span>
                </div>
              )}
              {product.specs?.wattage && (
                <div className="flex items-center gap-2.5 text-charcoal/85">
                  <Zap className="h-4 w-4 shrink-0 text-terracotta" />
                  <span>
                    <strong className="font-semibold">Output:</strong> {product.specs.wattage}
                    {product.specs.lumens ? ` • ${product.specs.lumens}` : ''}
                  </span>
                </div>
              )}
              {product.specs?.kelvin && (
                <div className="flex items-center gap-2.5 text-charcoal/85">
                  <Thermometer className="h-4 w-4 shrink-0 text-terracotta" />
                  <span>
                    <strong className="font-semibold">Color Temperature:</strong> {product.specs.kelvin}
                  </span>
                </div>
              )}
              {product.specs?.smartSupport && (
                <div className="flex items-center gap-2.5 text-charcoal/85">
                  <Wifi className="h-4 w-4 shrink-0 text-terracotta" />
                  <span>
                    <strong className="font-semibold">Smart Integration:</strong> {product.specs.smartSupport}
                  </span>
                </div>
              )}
            </div>

            {/* Add to Cart Row */}
            <div className="mt-6 flex items-center gap-3">
              <div className="flex items-center rounded-full border border-charcoal/15 bg-white px-2 py-1">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="h-8 w-8 rounded-full text-base font-semibold text-charcoal hover:bg-sand"
                >
                  -
                </button>
                <span className="w-8 text-center text-sm font-semibold">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  className="h-8 w-8 rounded-full text-base font-semibold text-charcoal hover:bg-sand"
                >
                  +
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  addToCart(product, quantity);
                  onClose();
                }}
                className="flex flex-1 items-center justify-center gap-2 rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta"
              >
                <ShoppingBag className="h-4 w-4" />
                Add to Cart — ${(Number(product.price) * quantity).toLocaleString()}
              </button>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="border-t border-charcoal/10 bg-white/70 p-6 sm:p-8">
          <h3 className="font-serif text-xl font-bold text-charcoal">
            Customer Reviews ({product.reviews?.length || 0})
          </h3>

          <div className="mt-4 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <div className="space-y-3 max-h-60 overflow-y-auto pr-1">
              {(product.reviews || []).length === 0 ? (
                <p className="text-sm text-charcoal/60">No reviews yet. Share your experience!</p>
              ) : (
                product.reviews.map((rev, idx) => (
                  <div key={rev._id || idx} className="rounded-2xl border border-charcoal/10 bg-cream p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-semibold text-charcoal">{rev.userName}</span>
                      <div className="flex items-center gap-0.5 text-brass">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="h-3.5 w-3.5 fill-brass" />
                        ))}
                      </div>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-charcoal/75">{rev.comment}</p>
                  </div>
                ))
              )}
            </div>

            <form onSubmit={handleReviewSubmit} className="rounded-2xl bg-sand/70 p-4 space-y-3">
              <h4 className="text-sm font-semibold text-charcoal">Leave a Product Review</h4>
              {error && <p className="text-xs font-medium text-red-600">{error}</p>}
              {!user && (
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-3.5 py-2 text-sm focus:border-terracotta focus:outline-none"
                />
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-charcoal/70">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-0.5"
                  >
                    <Star
                      className={`h-4 w-4 ${
                        star <= rating ? 'fill-brass text-brass' : 'text-charcoal/25'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                required
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share quality, finish, or installation feedback..."
                className="w-full rounded-xl border border-charcoal/15 bg-white px-3.5 py-2 text-sm focus:border-terracotta focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="rounded-full bg-terracotta px-5 py-2 text-xs font-semibold text-white transition hover:bg-charcoal disabled:opacity-60"
              >
                {submitting ? 'Submitting...' : 'Submit Review'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
