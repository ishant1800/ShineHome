import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Star,
  Search,
  Sparkles,
  Phone,
  Mail,
  MessageSquare,
  Sliders,
  ArrowRight,
  X,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

const STYLE_FILTERS = ['All', 'Japandi', 'Modern Minimalist', 'Mid-Century', 'Warm Industrial'];

export default function DesignGalleryPage() {
  const { isFavorited, toggleFavorite, user } = useAuth();
  const navigate = useNavigate();

  const [designs, setDesigns] = useState([]);
  const [featuredDesign, setFeaturedDesign] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStyle, setActiveStyle] = useState('All');
  const [search, setSearch] = useState('');

  // Modals
  const [contactDesign, setContactDesign] = useState(null);
  const [inquiryForm, setInquiryForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    message: '',
  });
  const [inquiryResult, setInquiryResult] = useState('');
  const [inquiryLoading, setInquiryLoading] = useState(false);

  const [reviewsDesign, setReviewsDesign] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    userName: user?.name || '',
    rating: 5,
    comment: '',
  });
  const [reviewError, setReviewError] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    api
      .getDesigns({ style: activeStyle, search })
      .then(({ designs: list }) => {
        if (!active) return;
        setDesigns(list);
        if (!featuredDesign && list.length > 0) {
          setFeaturedDesign(list.find((d) => d.featured) || list[0]);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [activeStyle, search]);

  async function handleInquirySubmit(e) {
    e.preventDefault();
    if (!contactDesign) return;
    setInquiryLoading(true);
    try {
      const res = await api.inquireDesigner(contactDesign._id, inquiryForm);
      setInquiryResult(res.message);
      setInquiryForm({ name: user?.name || '', email: user?.email || '', phone: '', message: '' });
    } catch (err) {
      setInquiryResult(err.message);
    } finally {
      setInquiryLoading(false);
    }
  }

  async function handleReviewSubmit(e) {
    e.preventDefault();
    if (!reviewsDesign) return;
    setReviewError('');
    setReviewSubmitting(true);
    try {
      const { design: updated } = await api.addDesignReview(reviewsDesign._id, {
        userName: user?.name || reviewForm.userName || 'Guest Homeowner',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
      });
      setDesigns((prev) => prev.map((d) => (d._id === updated._id ? updated : d)));
      setReviewsDesign(updated);
      setReviewForm((prev) => ({ ...prev, comment: '' }));
    } catch (err) {
      setReviewError(err.message);
    } finally {
      setReviewSubmitting(false);
    }
  }

  const heroRoom = featuredDesign || designs[0];

  return (
    <div>
      {/* Hero Section */}
      <section className="border-b border-charcoal/8 bg-gradient-to-b from-sand/65 to-cream">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-12 sm:px-6 lg:grid-cols-12 lg:py-16 lg:px-8">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/12 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              <Sparkles className="h-3.5 w-3.5" />
              Curated Architectural Living
            </span>

            <h1 className="mt-5 font-serif text-4xl font-bold leading-[1.12] tracking-tight text-charcoal sm:text-5xl lg:text-[54px]">
              Spaces crafted for{' '}
              <span className="italic font-semibold text-terracotta">warmth</span> &amp; quiet
              living.
            </h1>

            <p className="mt-5 max-w-xl text-base leading-relaxed text-charcoal/70">
              Explore completed interior concepts by vetted architects, save ideas to your moodboard,
              contact designers directly, and shop matching furniture and ambient lighting.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Link
                to={heroRoom ? `/customize?design=${heroRoom._id}` : '/customize'}
                className="inline-flex items-center gap-2 rounded-full bg-charcoal px-6 py-3.5 text-sm font-semibold text-cream shadow-sm transition hover:bg-terracotta"
              >
                <Sliders className="h-4 w-4" />
                Interactive Room Customizer
              </Link>
              <Link
                to="/furniture"
                className="inline-flex items-center gap-2 rounded-full border border-charcoal/20 bg-white px-6 py-3.5 text-sm font-semibold text-charcoal transition hover:border-charcoal hover:bg-sand"
              >
                Shop Curated Furniture
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <div className="relative overflow-hidden rounded-[28px] bg-sand shadow-editorial">
              <img
                src={
                  heroRoom?.image ||
                  'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85'
                }
                alt={heroRoom?.title || 'Kyoto Warm Minimalist Sanctuary'}
                className="aspect-[16/11] w-full object-cover"
              />
              <div className="absolute inset-x-4 bottom-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/90 px-5 py-3.5 backdrop-blur-md shadow-lg">
                <div>
                  <span className="block text-[10px] font-bold uppercase tracking-[0.18em] text-terracotta">
                    Featured Concept
                  </span>
                  <h2 className="font-serif text-lg font-bold text-charcoal">
                    {heroRoom?.title || 'Kyoto Warm Minimalist Sanctuary'}
                  </h2>
                </div>
                <Link
                  to={heroRoom ? `/customize?design=${heroRoom._id}` : '/customize'}
                  className="inline-flex items-center gap-1.5 rounded-full bg-terracotta px-4 py-2 text-xs font-semibold text-white transition hover:bg-charcoal"
                >
                  Shop This Room <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Pills + Search */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {STYLE_FILTERS.map((style) => (
              <button
                key={style}
                type="button"
                onClick={() => setActiveStyle(style)}
                className={`rounded-full px-4 py-2 text-xs font-semibold transition ${
                  activeStyle === style
                    ? 'bg-terracotta text-white shadow-sm'
                    : 'border border-charcoal/12 bg-white text-charcoal/75 hover:border-charcoal/30 hover:text-charcoal'
                }`}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal/45" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search designs or designers..."
              className="w-full rounded-full border border-charcoal/15 bg-white py-2.5 pl-11 pr-4 text-sm text-charcoal placeholder:text-charcoal/45 focus:border-terracotta focus:outline-none"
            />
          </div>
        </div>

        {/* 3-Column Design Gallery Grid */}
        <div className="mt-8 pb-16">
          {loading ? (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-[430px] animate-pulse rounded-3xl bg-sand/70" />
              ))}
            </div>
          ) : designs.length === 0 ? (
            <div className="rounded-3xl border border-charcoal/10 bg-white p-12 text-center">
              <h3 className="font-serif text-xl font-bold text-charcoal">No matching design concepts</h3>
              <p className="mt-2 text-sm text-charcoal/65">
                Try another architectural style or clear your search query.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {designs.map((design) => {
                const fav = isFavorited(design._id);
                return (
                  <article
                    key={design._id}
                    className="group flex flex-col overflow-hidden rounded-3xl border border-charcoal/10 bg-white shadow-card transition duration-300 hover:-translate-y-1 hover:shadow-editorial"
                  >
                    <div
                      className="relative aspect-[16/10] cursor-pointer overflow-hidden bg-sand"
                      onClick={() => navigate(`/customize?design=${design._id}`)}
                    >
                      <img
                        src={design.image}
                        alt={design.title}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                      <span className="absolute left-3.5 top-3.5 rounded-full bg-charcoal/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
                        {design.style}
                      </span>

                      <button
                        type="button"
                        aria-label={fav ? 'Remove from favorites' : 'Save to favorites'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(design._id);
                        }}
                        className="absolute right-3.5 top-3.5 flex h-9 w-9 items-center justify-center rounded-full bg-white/95 text-charcoal shadow-sm transition hover:scale-105"
                      >
                        <Heart
                          className={`h-4 w-4 transition ${
                            fav ? 'fill-terracotta text-terracotta' : 'text-charcoal/70'
                          }`}
                        />
                      </button>

                      <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between bg-gradient-to-t from-charcoal/70 to-transparent px-4 py-2.5 opacity-0 transition-opacity group-hover:opacity-100">
                        <span className="text-xs font-medium text-white">
                          {design.hotspots?.length || 0} shoppable hotspots
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-white">
                          Customize <ArrowRight className="h-3.5 w-3.5" />
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={design.designerAvatar}
                            alt={design.designerName}
                            className="h-7 w-7 rounded-full object-cover ring-1 ring-charcoal/10"
                          />
                          <span className="text-xs font-semibold text-charcoal/80">
                            {design.designerName}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs font-semibold text-charcoal">
                          <Star className="h-3.5 w-3.5 fill-brass text-brass" />
                          <span>{design.rating}</span>
                          <span className="text-charcoal/50">
                            ({design.numReviews || design.reviews?.length || 0})
                          </span>
                        </div>
                      </div>

                      <h3
                        onClick={() => navigate(`/customize?design=${design._id}`)}
                        className="mt-3 cursor-pointer font-serif text-xl font-bold leading-snug text-charcoal transition group-hover:text-terracotta"
                      >
                        {design.title}
                      </h3>

                      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-charcoal/65">
                        {design.description}
                      </p>

                      <div className="mt-auto flex items-center gap-2.5 pt-5">
                        <button
                          type="button"
                          onClick={() => {
                            setInquiryResult('');
                            setContactDesign(design);
                          }}
                          className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-charcoal px-4 py-2.5 text-xs font-semibold text-cream transition hover:bg-terracotta"
                        >
                          <Phone className="h-3.5 w-3.5" />
                          Contact Designer
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setReviewError('');
                            setReviewsDesign(design);
                          }}
                          className="inline-flex items-center justify-center gap-1.5 rounded-full border border-charcoal/15 px-4 py-2.5 text-xs font-semibold text-charcoal transition hover:bg-sand"
                        >
                          <MessageSquare className="h-3.5 w-3.5" />
                          Reviews
                        </button>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Contact Designer Modal */}
      {contactDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm">
          <div className="relative w-full max-w-lg rounded-3xl bg-cream p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setContactDesign(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal/60 hover:bg-sand hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="flex items-center gap-3.5">
              <img
                src={contactDesign.designerAvatar}
                alt={contactDesign.designerName}
                className="h-14 w-14 rounded-2xl object-cover"
              />
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta">
                  {contactDesign.designerRole || 'Lead Architect'}
                </span>
                <h2 className="font-serif text-2xl font-bold text-charcoal">
                  {contactDesign.designerName}
                </h2>
                <p className="text-xs text-charcoal/65">Re: {contactDesign.title}</p>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-2.5 rounded-2xl bg-sand/80 p-4 text-xs sm:grid-cols-2">
              <a
                href={`tel:${contactDesign.designerPhone}`}
                className="flex items-center gap-2 font-semibold text-charcoal hover:text-terracotta"
              >
                <Phone className="h-4 w-4 text-terracotta" />
                {contactDesign.designerPhone}
              </a>
              <a
                href={`mailto:${contactDesign.designerEmail}`}
                className="flex items-center gap-2 font-semibold text-charcoal hover:text-terracotta"
              >
                <Mail className="h-4 w-4 text-terracotta" />
                <span className="truncate">{contactDesign.designerEmail}</span>
              </a>
            </div>

            {inquiryResult ? (
              <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-5 text-center">
                <CheckCircle2 className="mx-auto h-8 w-8 text-emerald-600" />
                <p className="mt-2 text-sm font-semibold text-charcoal">{inquiryResult}</p>
                <button
                  type="button"
                  onClick={() => setContactDesign(null)}
                  className="mt-4 rounded-full bg-charcoal px-5 py-2 text-xs font-semibold text-cream"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="mt-5 space-y-3.5">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    value={inquiryForm.name}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                    placeholder="Your full name"
                    className="rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                  />
                  <input
                    type="email"
                    required
                    value={inquiryForm.email}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                    placeholder="Email address"
                    className="rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                  />
                </div>
                <input
                  type="tel"
                  value={inquiryForm.phone}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                  placeholder="Phone number (optional)"
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                />
                <textarea
                  rows={3}
                  required
                  value={inquiryForm.message}
                  onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                  placeholder="Tell the designer about your room dimensions, timeline, and budget..."
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
                />
                <button
                  type="submit"
                  disabled={inquiryLoading}
                  className="w-full rounded-full bg-terracotta py-3 text-sm font-semibold text-white transition hover:bg-charcoal disabled:opacity-60"
                >
                  {inquiryLoading ? 'Sending Inquiry...' : 'Send Direct Inquiry'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Design Reviews Modal */}
      {reviewsDesign && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-charcoal/60 p-4 backdrop-blur-sm">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-cream p-6 shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setReviewsDesign(null)}
              className="absolute right-5 top-5 rounded-full p-2 text-charcoal/60 hover:bg-sand hover:text-charcoal"
            >
              <X className="h-5 w-5" />
            </button>

            <span className="text-[11px] font-semibold uppercase tracking-widest text-terracotta">
              Client Feedback
            </span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-charcoal">
              {reviewsDesign.title}
            </h2>
            <div className="mt-2 flex items-center gap-2 text-sm">
              <Star className="h-4 w-4 fill-brass text-brass" />
              <span className="font-bold">{reviewsDesign.rating}</span>
              <span className="text-charcoal/60">
                ({reviewsDesign.reviews?.length || 0} verified reviews) &bull; Designed by{' '}
                {reviewsDesign.designerName}
              </span>
            </div>

            <div className="mt-5 max-h-60 space-y-3 overflow-y-auto pr-1">
              {(reviewsDesign.reviews || []).map((rev, idx) => (
                <div key={rev._id || idx} className="rounded-2xl border border-charcoal/10 bg-white p-4">
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
              ))}
            </div>

            <form onSubmit={handleReviewSubmit} className="mt-6 space-y-3 rounded-2xl bg-sand/80 p-5">
              <h3 className="text-sm font-bold text-charcoal">Leave Feedback for This Concept</h3>
              {reviewError && <p className="text-xs font-medium text-red-600">{reviewError}</p>}
              {!user && (
                <input
                  type="text"
                  value={reviewForm.userName}
                  onChange={(e) => setReviewForm({ ...reviewForm, userName: e.target.value })}
                  placeholder="Your name"
                  className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2 text-sm focus:border-terracotta focus:outline-none"
                />
              )}
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-charcoal/70">Rating:</span>
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setReviewForm({ ...reviewForm, rating: star })}
                  >
                    <Star
                      className={`h-4 w-4 ${
                        star <= reviewForm.rating ? 'fill-brass text-brass' : 'text-charcoal/25'
                      }`}
                    />
                  </button>
                ))}
              </div>
              <textarea
                rows={2}
                required
                value={reviewForm.comment}
                onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                placeholder="Share your thoughts on the spatial layout, lighting, or materials..."
                className="w-full rounded-xl border border-charcoal/15 bg-white px-4 py-2.5 text-sm focus:border-terracotta focus:outline-none"
              />
              <button
                type="submit"
                disabled={reviewSubmitting}
                className="rounded-full bg-charcoal px-6 py-2.5 text-xs font-semibold text-cream transition hover:bg-terracotta disabled:opacity-60"
              >
                {reviewSubmitting ? 'Publishing...' : 'Post Review'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
