import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Heart, ShoppingBag, User, LogOut, Menu, X, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const navLinks = [
  { to: '/', label: 'Design Gallery', end: true },
  { to: '/customize', label: 'Customization', dot: true },
  { to: '/furniture', label: 'Furniture' },
  { to: '/appliances', label: 'Appliances & Lights' },
  { to: '/about', label: 'About Us' },
];

export default function Navbar({ onOpenFavorites }) {
  const { user, favorites, logout } = useAuth();
  const { cartCount } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-charcoal/10 bg-cream/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
        {/* Brand Wordmark */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-charcoal text-cream shadow-sm transition-transform group-hover:scale-105">
            <Sparkles className="h-5 w-5 text-terracotta" />
          </div>
          <div>
            <span className="block font-serif text-xl font-bold leading-none tracking-tight text-charcoal">
              ShineHome
            </span>
            <span className="mt-0.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-charcoal/55">
              Interior Studio
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="Main navigation">
          {navLinks.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-charcoal text-cream shadow-sm'
                    : 'text-charcoal/75 hover:bg-sand hover:text-charcoal'
                }`
              }
            >
              {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />}
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Right Utility Actions */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={onOpenFavorites}
            aria-label="Open saved designs"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/12 bg-white/80 text-charcoal transition hover:border-terracotta/50 hover:text-terracotta"
          >
            <Heart className={`h-4 w-4 ${favorites.length > 0 ? 'fill-terracotta text-terracotta' : ''}`} />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-terracotta px-1 text-[11px] font-bold text-white">
              {favorites.length}
            </span>
          </button>

          <Link
            to="/cart"
            aria-label="Shopping cart"
            className="relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/12 bg-white/80 text-charcoal transition hover:border-charcoal"
          >
            <ShoppingBag className="h-4 w-4" />
            <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-charcoal px-1 text-[11px] font-bold text-cream">
              {cartCount}
            </span>
          </Link>

          {user ? (
            <div className="hidden items-center gap-2 sm:flex">
              <span className="inline-flex items-center gap-2 rounded-full border border-charcoal/12 bg-sand px-3.5 py-2 text-xs font-semibold text-charcoal">
                <User className="h-3.5 w-3.5 text-terracotta" />
                {user.name.split(' ')[0]}
              </span>
              <button
                type="button"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                title="Sign out"
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-charcoal/12 bg-white text-charcoal/70 transition hover:border-terracotta hover:text-terracotta"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="hidden items-center gap-2 rounded-full border border-charcoal/15 bg-white px-4 py-2 text-sm font-medium text-charcoal transition hover:border-charcoal hover:bg-sand sm:inline-flex"
            >
              <User className="h-4 w-4" />
              Sign In
            </Link>
          )}

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-charcoal/12 bg-white text-charcoal lg:hidden"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileOpen && (
        <div className="border-t border-charcoal/10 bg-cream px-4 py-4 lg:hidden">
          <div className="flex flex-col gap-1.5">
            {navLinks.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium ${
                    isActive ? 'bg-charcoal text-cream' : 'text-charcoal/80 hover:bg-sand'
                  }`
                }
              >
                {item.dot && <span className="h-1.5 w-1.5 rounded-full bg-terracotta" />}
                {item.label}
              </NavLink>
            ))}
            <div className="mt-2 border-t border-charcoal/10 pt-3">
              {user ? (
                <button
                  type="button"
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-sand px-4 py-2.5 text-sm font-semibold text-charcoal"
                >
                  <LogOut className="h-4 w-4" /> Sign Out ({user.name})
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-charcoal px-4 py-2.5 text-sm font-semibold text-cream"
                >
                  <User className="h-4 w-4" /> Sign In / Create Account
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
