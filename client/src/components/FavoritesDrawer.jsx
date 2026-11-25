import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Heart, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

export default function FavoritesDrawer({ open, onClose }) {
  const { favorites, toggleFavorite } = useAuth();
  const [designs, setDesigns] = useState([]);

  useEffect(() => {
    if (!open) return;
    api
      .getDesigns()
      .then(({ designs: list }) => setDesigns(list))
      .catch(() => {});
  }, [open]);

  if (!open) return null;

  const savedDesigns = designs.filter((d) => favorites.includes(String(d._id)));

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-charcoal/50 backdrop-blur-sm">
      <div className="flex h-full w-full max-w-md flex-col bg-cream shadow-2xl">
        <div className="flex items-center justify-between border-b border-charcoal/10 px-6 py-5">
          <div className="flex items-center gap-2.5">
            <Heart className="h-5 w-5 fill-terracotta text-terracotta" />
            <h2 className="font-serif text-xl font-bold text-charcoal">
              Saved Moodboard ({favorites.length})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-charcoal/60 transition hover:bg-sand hover:text-charcoal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {savedDesigns.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-sand text-terracotta">
                <Sparkles className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-serif text-lg font-semibold text-charcoal">
                No saved concepts yet
              </h3>
              <p className="mt-2 max-w-xs text-sm text-charcoal/65">
                Tap the heart icon on any architectural room concept in the Design Gallery to save it here.
              </p>
              <Link
                to="/"
                onClick={onClose}
                className="mt-5 rounded-full bg-charcoal px-5 py-2.5 text-sm font-medium text-cream transition hover:bg-terracotta"
              >
                Explore Gallery
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {savedDesigns.map((design) => (
                <div
                  key={design._id}
                  className="flex gap-4 rounded-2xl border border-charcoal/10 bg-white p-3.5 shadow-sm"
                >
                  <img
                    src={design.image}
                    alt={design.title}
                    className="h-24 w-24 shrink-0 rounded-xl object-cover"
                  />
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-terracotta">
                        {design.style}
                      </span>
                      <h4 className="font-serif text-base font-bold leading-snug text-charcoal">
                        {design.title}
                      </h4>
                      <p className="text-xs text-charcoal/60">by {design.designerName}</p>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <Link
                        to={`/customize?design=${design._id}`}
                        onClick={onClose}
                        className="inline-flex items-center gap-1 text-xs font-semibold text-charcoal hover:text-terracotta"
                      >
                        Customize Room <ArrowRight className="h-3.5 w-3.5" />
                      </Link>
                      <button
                        type="button"
                        onClick={() => toggleFavorite(design._id)}
                        className="text-xs font-medium text-charcoal/50 hover:text-terracotta"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
