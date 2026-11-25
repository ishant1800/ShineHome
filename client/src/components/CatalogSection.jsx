import { useEffect, useState } from 'react';
import { Search, Star, ShoppingBag, SlidersHorizontal, Eye, Zap, Thermometer, Wifi } from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductDetailModal from './ProductDetailModal';

const STYLES = ['All', 'Japandi', 'Modern Minimalist', 'Mid-Century', 'Warm Industrial'];
const PRICE_BUCKETS = [
  { id: 'all', label: 'All Prices', min: '', max: '' },
  { id: 'under600', label: 'Under $600', min: 0, max: 600 },
  { id: '600to1500', label: '$600 – $1,500', min: 600, max: 1500 },
  { id: 'over1500', label: '$1,500+', min: 1500, max: '' },
];

export default function CatalogSection({
  department,
  badge,
  title,
  subtitle,
  showTechSpecs = false,
}) {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [style, setStyle] = useState('All');
  const [priceBucket, setPriceBucket] = useState('all');
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    const bucket = PRICE_BUCKETS.find((b) => b.id === priceBucket) || PRICE_BUCKETS[0];

    api
      .getProducts({
        department,
        category,
        style,
        minPrice: bucket.min,
        maxPrice: bucket.max,
        search,
      })
      .then(({ products: list, categories: cats }) => {
        if (!active) return;
        setProducts(list);
        setCategories(['All', ...cats]);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [department, category, style, priceBucket, search]);

  function handleProductUpdated(updated) {
    setProducts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)));
    setSelectedProduct(updated);
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header Banner */}
      <div className="rounded-3xl bg-sand/75 px-6 py-8 sm:px-10">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
          {badge}
        </span>
        <h1 className="mt-3 font-serif text-3xl font-bold text-charcoal sm:text-4xl">{title}</h1>
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-charcoal/70">{subtitle}</p>
      </div>

      {/* Main Sidebar + Grid */}
      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-4">
        {/* Filter Sidebar */}
        <aside className="h-fit rounded-3xl border border-charcoal/10 bg-sand/60 p-5 lg:sticky lg:top-24">
          <div className="flex items-center justify-between border-b border-charcoal/10 pb-3">
            <span className="inline-flex items-center gap-2 text-sm font-bold text-charcoal">
              <SlidersHorizontal className="h-4 w-4 text-terracotta" />
              Filter Catalog
            </span>
            <button
              type="button"
              onClick={() => {
                setSearch('');
                setCategory('All');
                setStyle('All');
                setPriceBucket('all');
              }}
              className="text-xs font-semibold text-terracotta hover:underline"
            >
              Reset
            </button>
          </div>

          {/* Search */}
          <div className="mt-4">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
              Search
            </label>
            <div className="relative mt-1.5">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Name, material, style..."
                className="w-full rounded-full border border-charcoal/15 bg-white py-2 pl-10 pr-4 text-sm focus:border-terracotta focus:outline-none"
              />
            </div>
          </div>

          {/* Categories */}
          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
              Category
            </label>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setCategory(cat)}
                  className={`rounded-full px-3 py-1.5 text-xs font-medium transition ${
                    category === cat
                      ? 'bg-terracotta text-white shadow-sm'
                      : 'bg-white text-charcoal/80 hover:bg-charcoal/10'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Styles */}
          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
              Architectural Style
            </label>
            <div className="mt-2 space-y-1.5">
              {STYLES.map((st) => (
                <button
                  key={st}
                  type="button"
                  onClick={() => setStyle(st)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                    style === st
                      ? 'bg-charcoal text-cream'
                      : 'bg-white/75 text-charcoal/80 hover:bg-white'
                  }`}
                >
                  <span>{st}</span>
                  {style === st && <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="mt-5">
            <label className="text-xs font-semibold uppercase tracking-wider text-charcoal/60">
              Price Range
            </label>
            <div className="mt-2 space-y-1.5">
              {PRICE_BUCKETS.map((bucket) => (
                <button
                  key={bucket.id}
                  type="button"
                  onClick={() => setPriceBucket(bucket.id)}
                  className={`flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-xs font-medium transition ${
                    priceBucket === bucket.id
                      ? 'bg-terracotta text-white'
                      : 'bg-white/75 text-charcoal/80 hover:bg-white'
                  }`}
                >
                  <span>{bucket.label}</span>
                </button>
              ))}
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between text-xs text-charcoal/65">
            <span>
              Showing <strong className="text-charcoal">{products.length}</strong> curated pieces
            </span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {[1, 2, 3].map((n) => (
                <div key={n} className="h-96 animate-pulse rounded-3xl bg-sand/70" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-12 text-center">
              <h3 className="font-serif text-xl font-bold text-charcoal">No matching pieces found</h3>
              <p className="mt-2 text-sm text-charcoal/65">
                Try clearing one of your active style, category, or price filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {products.map((product) => (
                <article
                  key={product._id}
                  className="group flex flex-col overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-card transition hover:-translate-y-1 hover:shadow-editorial"
                >
                  <div
                    className="relative aspect-[4/3] cursor-pointer overflow-hidden bg-sand"
                    onClick={() => setSelectedProduct(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                    <span className="absolute left-3.5 top-3.5 rounded-full bg-charcoal/85 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                      {product.style}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-bold text-charcoal shadow-sm">
                      ${Number(product.price).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold uppercase tracking-wider text-terracotta">
                        {product.category}
                      </span>
                      <span className="inline-flex items-center gap-1 font-semibold text-charcoal">
                        <Star className="h-3.5 w-3.5 fill-brass text-brass" />
                        {product.rating} ({product.numReviews || product.reviews?.length || 0})
                      </span>
                    </div>

                    <h3
                      onClick={() => setSelectedProduct(product)}
                      className="mt-2 cursor-pointer font-serif text-lg font-bold leading-snug text-charcoal group-hover:text-terracotta"
                    >
                      {product.name}
                    </h3>

                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-charcoal/65">
                      {product.description}
                    </p>

                    {/* Technical Spec Badges for Appliances & Lighting */}
                    {showTechSpecs && product.specs && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {product.specs.wattage && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-charcoal">
                            <Zap className="h-3 w-3 text-terracotta" />
                            {product.specs.wattage}
                          </span>
                        )}
                        {product.specs.kelvin && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sand px-2.5 py-1 text-[11px] font-semibold text-charcoal">
                            <Thermometer className="h-3 w-3 text-brass" />
                            {product.specs.kelvin}
                          </span>
                        )}
                        {product.specs.smartSupport && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-terracotta/12 px-2.5 py-1 text-[11px] font-semibold text-terracotta">
                            <Wifi className="h-3 w-3" />
                            {product.specs.smartSupport.split('/')[0].trim()}
                          </span>
                        )}
                      </div>
                    )}

                    <div className="mt-auto flex items-center gap-2 pt-4">
                      <button
                        type="button"
                        onClick={() => addToCart(product, 1)}
                        className="flex flex-1 items-center justify-center gap-1.5 rounded-full bg-charcoal px-4 py-2.5 text-xs font-semibold text-cream transition hover:bg-terracotta"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" />
                        Add to Cart
                      </button>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="inline-flex items-center justify-center gap-1 rounded-full border border-charcoal/15 px-3.5 py-2.5 text-xs font-semibold text-charcoal transition hover:bg-sand"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Details
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </div>

      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onProductUpdated={handleProductUpdated}
      />
    </div>
  );
}
