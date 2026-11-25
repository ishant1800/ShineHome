import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Sparkles,
  ShoppingBag,
  Eye,
  Star,
  MapPin,
  Layers,
  Zap,
  Thermometer,
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import ProductDetailModal from '../components/ProductDetailModal';

export default function CustomizationPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { addToCart } = useCart();

  const [designs, setDesigns] = useState([]);
  const [activeDesign, setActiveDesign] = useState(null);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [modalProduct, setModalProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  const requestedId = searchParams.get('design');

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getDesigns()
      .then(({ designs: list }) => {
        if (!active || list.length === 0) return;
        setDesigns(list);
        const matched = requestedId ? list.find((d) => d._id === requestedId) : list[0];
        const chosen = matched || list[0];
        setActiveDesign(chosen);
        setActiveHotspot(chosen.hotspots?.[0] || null);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [requestedId]);

  function selectRoom(design) {
    setActiveDesign(design);
    setActiveHotspot(design.hotspots?.[0] || null);
    setSearchParams({ design: design._id });
  }

  const selectedProduct = activeHotspot?.product;

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/15 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-terracotta">
            <Sparkles className="h-3.5 w-3.5" />
            Interactive Room Studio
          </span>
          <h1 className="mt-3 font-serif text-3xl font-bold text-charcoal sm:text-4xl">
            Customize &amp; Shop Every Corner
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-charcoal/70">
            Click any pulsing terracotta pin inside the room canvas to inspect matching furniture,
            smart lighting, technical specifications, and add pieces directly to your cart.
          </p>
        </div>
      </div>

      {/* Room Switcher Strip */}
      <div className="mt-6 flex gap-2.5 overflow-x-auto pb-2">
        {designs.map((design) => (
          <button
            key={design._id}
            type="button"
            onClick={() => selectRoom(design)}
            className={`shrink-0 rounded-full px-4 py-2 text-xs font-semibold transition ${
              activeDesign?._id === design._id
                ? 'bg-charcoal text-cream shadow-sm'
                : 'border border-charcoal/15 bg-white text-charcoal/75 hover:bg-sand'
            }`}
          >
            {design.title}
          </button>
        ))}
      </div>

      {loading || !activeDesign ? (
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="h-[480px] animate-pulse rounded-3xl bg-sand/70 lg:col-span-8" />
          <div className="h-[480px] animate-pulse rounded-3xl bg-sand/70 lg:col-span-4" />
        </div>
      ) : (
        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Interactive Room Canvas */}
          <div className="lg:col-span-8">
            <div className="relative overflow-hidden rounded-[28px] border border-charcoal/10 bg-sand shadow-editorial">
              <img
                src={activeDesign.image}
                alt={activeDesign.title}
                className="aspect-[16/10] w-full object-cover"
              />

              {/* Pulsing Hotspot Pins */}
              {(activeDesign.hotspots || []).map((spot, index) => {
                const isSelected = activeHotspot?._id === spot._id;
                return (
                  <button
                    key={spot._id || index}
                    type="button"
                    onClick={() => setActiveHotspot(spot)}
                    style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                    aria-label={`Inspect ${spot.label}`}
                    className="group absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none"
                  >
                    <span
                      className={`hotspot-pulse flex h-9 w-9 items-center justify-center rounded-full border-2 border-white text-xs font-bold shadow-lg transition-transform ${
                        isSelected
                          ? 'scale-125 bg-charcoal text-cream'
                          : 'bg-terracotta text-white hover:scale-110'
                      }`}
                    >
                      {index + 1}
                    </span>

                    <span
                      className={`pointer-events-none absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold shadow-md transition ${
                        isSelected
                          ? 'bg-charcoal text-cream opacity-100'
                          : 'bg-white/95 text-charcoal opacity-0 group-hover:opacity-100'
                      }`}
                    >
                      {spot.label}
                    </span>
                  </button>
                );
              })}

              {/* Bottom Caption */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-charcoal/10 bg-white/95 px-6 py-4 backdrop-blur-sm">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta">
                    {activeDesign.style} &bull; Designed by {activeDesign.designerName}
                  </span>
                  <h2 className="font-serif text-lg font-bold text-charcoal">
                    {activeDesign.title}
                  </h2>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sand px-3 py-1.5 text-xs font-semibold text-charcoal">
                  <MapPin className="h-3.5 w-3.5 text-terracotta" />
                  {activeDesign.hotspots?.length || 0} Interactive Pieces
                </span>
              </div>
            </div>
          </div>

          {/* Live Product Inspector Panel */}
          <aside className="flex flex-col gap-5 lg:col-span-4">
            {selectedProduct ? (
              <div className="overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-editorial">
                <div className="relative aspect-[16/10] bg-sand">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-full w-full object-cover"
                  />
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-charcoal/85 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-white">
                    {selectedProduct.department === 'appliance'
                      ? 'Lighting & Appliance'
                      : 'Curated Furniture'}
                  </span>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold uppercase tracking-wider text-terracotta">
                      {selectedProduct.category}
                    </span>
                    <span className="inline-flex items-center gap-1 font-semibold text-charcoal">
                      <Star className="h-3.5 w-3.5 fill-brass text-brass" />
                      {selectedProduct.rating}
                    </span>
                  </div>

                  <h3 className="mt-2 font-serif text-2xl font-bold text-charcoal">
                    {selectedProduct.name}
                  </h3>

                  <p className="mt-1 font-serif text-xl font-bold text-terracotta">
                    ${Number(selectedProduct.price).toLocaleString()}
                  </p>

                  <p className="mt-3 text-xs leading-relaxed text-charcoal/70">
                    {selectedProduct.description}
                  </p>

                  <div className="mt-4 space-y-1.5 rounded-2xl bg-sand/75 p-3.5 text-xs text-charcoal/85">
                    {selectedProduct.material && (
                      <div className="flex items-center gap-2">
                        <Layers className="h-3.5 w-3.5 text-terracotta" />
                        <span>{selectedProduct.material}</span>
                      </div>
                    )}
                    {selectedProduct.specs?.wattage && (
                      <div className="flex items-center gap-2">
                        <Zap className="h-3.5 w-3.5 text-terracotta" />
                        <span>
                          {selectedProduct.specs.wattage} &bull; {selectedProduct.specs.lumens}
                        </span>
                      </div>
                    )}
                    {selectedProduct.specs?.kelvin && (
                      <div className="flex items-center gap-2">
                        <Thermometer className="h-3.5 w-3.5 text-brass" />
                        <span>{selectedProduct.specs.kelvin}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex flex-col gap-2.5">
                    <button
                      type="button"
                      onClick={() => addToCart(selectedProduct, 1)}
                      className="flex w-full items-center justify-center gap-2 rounded-full bg-charcoal py-3 text-sm font-semibold text-cream transition hover:bg-terracotta"
                    >
                      <ShoppingBag className="h-4 w-4" />
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => setModalProduct(selectedProduct)}
                      className="flex w-full items-center justify-center gap-2 rounded-full border border-charcoal/15 bg-white py-2.5 text-xs font-semibold text-charcoal transition hover:bg-sand"
                    >
                      <Eye className="h-4 w-4" />
                      View Full Details
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-charcoal/10 bg-white p-6 text-center text-sm text-charcoal/65">
                Select a pin in the room to inspect product details.
              </div>
            )}

            {/* Quick List of Room Hotspots */}
            <div className="rounded-3xl border border-charcoal/10 bg-sand/65 p-5">
              <h4 className="text-xs font-bold uppercase tracking-[0.16em] text-charcoal/65">
                Pieces Featured In This Room
              </h4>
              <div className="mt-3 space-y-2">
                {(activeDesign.hotspots || []).map((spot, idx) => (
                  <button
                    key={spot._id || idx}
                    type="button"
                    onClick={() => setActiveHotspot(spot)}
                    className={`flex w-full items-center justify-between rounded-2xl px-3.5 py-2.5 text-left text-xs transition ${
                      activeHotspot?._id === spot._id
                        ? 'bg-charcoal text-cream'
                        : 'bg-white text-charcoal hover:bg-white/80'
                    }`}
                  >
                    <span className="flex items-center gap-2.5 font-semibold">
                      <span
                        className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] ${
                          activeHotspot?._id === spot._id
                            ? 'bg-terracotta text-white'
                            : 'bg-sand text-charcoal'
                        }`}
                      >
                        {idx + 1}
                      </span>
                      {spot.product?.name || spot.label}
                    </span>
                    <span className="font-bold">
                      ${Number(spot.product?.price || 0).toLocaleString()}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      <ProductDetailModal
        product={modalProduct}
        onClose={() => setModalProduct(null)}
        onProductUpdated={(updated) => {
          setModalProduct(updated);
          if (activeHotspot?.product?._id === updated._id) {
            setActiveHotspot({ ...activeHotspot, product: updated });
          }
        }}
      />
    </div>
  );
}
