import { Link } from 'react-router-dom';
import { Compass, Sliders, ShoppingBag, Sparkles, Award, Users, ShieldCheck } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Compass,
    title: 'Explore Curated Concepts',
    description:
      'Browse real-world architectural rooms across Japandi, Modern Minimalist, Mid-Century, and Warm Industrial aesthetics—vetted by principal designers.',
  },
  {
    number: '02',
    icon: Sliders,
    title: 'Customize Rooms Live',
    description:
      'Launch the Interactive Room Customizer to inspect pulsing hotspots for every sofa, travertine table, and warm Kelvin light fixture in context.',
  },
  {
    number: '03',
    icon: ShoppingBag,
    title: 'Shop & Connect Directly',
    description:
      'Order heirloom furniture and smart ambient lighting in one checkout, or message the room’s lead architect directly for bespoke space planning.',
  },
];

const HIGHLIGHTS = [
  { icon: Award, value: '120+', label: 'Curated Architectural Rooms' },
  { icon: Users, value: '45', label: 'Vetted Interior Studios' },
  { icon: Sparkles, value: '2700K', label: 'Calibrated Ambient Warmth' },
  { icon: ShieldCheck, value: '100%', label: 'Direct Designer Transparency' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Mission Hero */}
      <section className="border-b border-charcoal/10 bg-sand/65">
        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-10 px-4 py-14 sm:px-6 lg:grid-cols-12 lg:px-8">
          <div className="lg:col-span-6">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-terracotta/15 px-3.5 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] text-terracotta">
              Our Philosophy
            </span>
            <h1 className="mt-4 font-serif text-4xl font-bold leading-tight text-charcoal sm:text-5xl">
              Bridging visionary interior architecture with effortless living.
            </h1>
            <p className="mt-5 text-base leading-relaxed text-charcoal/75">
              ShineHome was founded on a simple observation: homeowners fall in love with finished
              rooms, yet struggle to source the exact lighting warmth, proportions, and furniture
              that make a space feel calm and cohesive. We unite architectural inspiration, live
              room customization, and direct designer access in one warm editorial studio.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/"
                className="rounded-full bg-charcoal px-6 py-3 text-sm font-semibold text-cream transition hover:bg-terracotta"
              >
                Explore Design Gallery
              </Link>
              <Link
                to="/customize"
                className="rounded-full border border-charcoal/20 bg-white px-6 py-3 text-sm font-semibold text-charcoal transition hover:bg-sand"
              >
                Try Room Customizer
              </Link>
            </div>
          </div>

          <div className="lg:col-span-6">
            <img
              src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=85"
              alt="ShineHome Architectural Studio"
              className="aspect-[4/3] w-full rounded-[28px] object-cover shadow-editorial"
            />
          </div>
        </div>
      </section>

      {/* 3-Step Workflow */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-terracotta">
            Workflow
          </span>
          <h2 className="mt-2 font-serif text-3xl font-bold text-charcoal sm:text-4xl">
            How ShineHome Works
          </h2>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-7 md:grid-cols-3">
          {STEPS.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="rounded-3xl border border-charcoal/10 bg-white p-7 shadow-card"
              >
                <div className="flex items-center justify-between">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-sand text-terracotta">
                    <Icon className="h-6 w-6" />
                  </div>
                  <span className="font-serif text-3xl font-bold text-charcoal/15">
                    {step.number}
                  </span>
                </div>
                <h3 className="mt-5 font-serif text-xl font-bold text-charcoal">{step.title}</h3>
                <p className="mt-2.5 text-sm leading-relaxed text-charcoal/70">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-4 rounded-[30px] bg-charcoal p-8 text-cream sm:p-10 lg:grid-cols-4">
          {HIGHLIGHTS.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="text-center">
                <Icon className="mx-auto h-6 w-6 text-terracotta" />
                <p className="mt-3 font-serif text-3xl font-bold text-white">{item.value}</p>
                <p className="mt-1 text-xs text-cream/65">{item.label}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
