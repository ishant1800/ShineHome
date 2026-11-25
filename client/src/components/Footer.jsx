import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-charcoal text-cream/85">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div>
            <Link to="/" className="inline-flex items-center gap-2.5">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-terracotta text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-serif text-xl font-bold text-white">ShineHome</span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-cream/65">
              Curating architectural living spaces, warm ambient lighting, and heirloom furniture—connecting
              homeowners directly with visionary interior designers.
            </p>
          </div>

          {/* Explore Pages */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Explore Pages
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
              <li>
                <Link to="/" className="transition hover:text-white">
                  Design Gallery
                </Link>
              </li>
              <li>
                <Link to="/customize" className="transition hover:text-white">
                  Room Customization
                </Link>
              </li>
              <li>
                <Link to="/furniture" className="transition hover:text-white">
                  Curated Furniture
                </Link>
              </li>
              <li>
                <Link to="/appliances" className="transition hover:text-white">
                  Smart Appliances & Lighting
                </Link>
              </li>
            </ul>
          </div>

          {/* Studio & Account */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Studio & Account
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm text-cream/70">
              <li>
                <Link to="/about" className="transition hover:text-white">
                  About ShineHome
                </Link>
              </li>
              <li>
                <Link to="/cart" className="transition hover:text-white">
                  Shopping Cart
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="transition hover:text-white">
                  Checkout & Payment
                </Link>
              </li>
              <li>
                <Link to="/login" className="transition hover:text-white">
                  Designer & Client Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Design Concierge */}
          <div>
            <h3 className="font-sans text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
              Design Concierge
            </h3>
            <p className="mt-4 text-sm text-cream/65">
              Need bespoke space planning or lighting advice?
            </p>
            <div className="mt-4 space-y-2 text-sm">
              <a
                href="mailto:concierge@shinehome.studio"
                className="flex items-center gap-2 font-medium text-white transition hover:text-terracotta"
              >
                <Mail className="h-4 w-4 text-terracotta" />
                concierge@shinehome.studio
              </a>
              <a
                href="tel:+14158904321"
                className="flex items-center gap-2 text-cream/75 transition hover:text-white"
              >
                <Phone className="h-4 w-4 text-terracotta" />
                +1 (415) 890-4321
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-cream/50 sm:flex-row">
          <p>&copy; 2026 ShineHome Interior Designing Platform. All rights reserved.</p>
          <p>Built on the MERN Stack &bull; React &bull; Node.js &bull; MongoDB</p>
        </div>
      </div>
    </footer>
  );
}
