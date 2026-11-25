const User = require('../models/User');
const Design = require('../models/Design');
const Product = require('../models/Product');

const furnitureSeeds = [
  {
    name: 'Kumo Boucle Low-Profile Sofa',
    department: 'furniture',
    category: 'Seating',
    style: 'Japandi',
    price: 2150,
    description:
      'Deep sculptural lounge sofa upholstered in tactile Belgian oat boucle over a kiln-dried white oak plinth.',
    image:
      'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=900&q=80',
    dimensions: '92" W × 38" D × 29" H',
    material: 'Belgian Boucle & Solid White Oak',
    rating: 4.9,
    numReviews: 2,
    reviews: [
      {
        userName: 'Claire Bennett',
        rating: 5,
        comment: 'Impossibly comfortable and anchors our living room with quiet warmth.',
      },
      {
        userName: 'Marcus Chen',
        rating: 5,
        comment: 'The oak base craftsmanship and boucle texture look museum-grade.',
      },
    ],
  },
  {
    name: 'Toscana Fluted Travertine Coffee Table',
    department: 'furniture',
    category: 'Tables',
    style: 'Modern Minimalist',
    price: 1290,
    description:
      'Monolithic honed Italian travertine drum coffee table featuring hand-fluted architectural column supports.',
    image:
      'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?auto=format&fit=crop&w=900&q=80',
    dimensions: '44" Dia × 14.5" H',
    material: 'Honed Roman Travertine',
    rating: 4.8,
    numReviews: 2,
    reviews: [
      {
        userName: 'Nadia Patel',
        rating: 5,
        comment: 'Natural veining is breathtaking in morning sunlight.',
      },
      {
        userName: 'Liam O’Connor',
        rating: 4,
        comment: 'Substantial stone weight and zero wobble—worth every penny.',
      },
    ],
  },
  {
    name: 'Eames-Era Cognac Leather Lounge Chair',
    department: 'furniture',
    category: 'Seating',
    style: 'Mid-Century',
    price: 1480,
    description:
      'Supple full-grain saddle cognac leather slung over a bent walnut shell frame with matte brass hardware.',
    image:
      'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=900&q=80',
    dimensions: '31" W × 33" D × 31.5" H',
    material: 'Aniline Saddle Leather & American Walnut',
    rating: 4.9,
    numReviews: 2,
    reviews: [
      {
        userName: 'Rohan Kapoor',
        rating: 5,
        comment: 'My favorite reading and vinyl listening chair. Ages wonderfully.',
      },
      {
        userName: 'Hannah Brooks',
        rating: 5,
        comment: 'Rich leather aroma and perfect ergonomic recline angle.',
      },
    ],
  },
  {
    name: 'Kyoto Slatted Walnut Media Credenza',
    department: 'furniture',
    category: 'Storage',
    style: 'Mid-Century',
    price: 1640,
    description:
      'Low architectural sideboard with acoustic-friendly vertical walnut slats, soft-close drawers, and hidden cable channels.',
    image:
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=900&q=80',
    dimensions: '72" W × 18" D × 24" H',
    material: 'Oiled American Black Walnut',
    rating: 4.9,
    numReviews: 1,
    reviews: [
      {
        userName: 'Devon Mercer',
        rating: 5,
        comment: 'Fits my turntable, amplifier, and vinyl collection effortlessly.',
      },
    ],
  },
  {
    name: 'Oslo Upholstered Linen Platform Bed',
    department: 'furniture',
    category: 'Bedroom',
    style: 'Japandi',
    price: 1890,
    description:
      'Serene king platform bed wrapped in unbleached French flax linen with tapered solid oak legs.',
    image:
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=900&q=80',
    dimensions: '81" W × 86" D × 42" H (King)',
    material: 'French Flax Linen & European Oak',
    rating: 5.0,
    numReviews: 2,
    reviews: [
      {
        userName: 'Sofia Alvarez',
        rating: 5,
        comment: 'Turned our primary bedroom into a Nordic spa sanctuary.',
      },
      {
        userName: 'Jonas Berg',
        rating: 5,
        comment: 'Sturdy silent slats and gorgeous matte linen finish.',
      },
    ],
  },
  {
    name: 'Milanese Carrara Marble Dining Table',
    department: 'furniture',
    category: 'Dining',
    style: 'Modern Minimalist',
    price: 2650,
    description:
      'Eight-seat architectural dining table featuring a chamfered Carrara marble slab on twin sculptural pedestals.',
    image:
      'https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=900&q=80',
    dimensions: '84" L × 40" W × 30" H',
    material: 'Sealed Carrara Marble',
    rating: 4.8,
    numReviews: 1,
    reviews: [
      {
        userName: 'Giulia Romano',
        rating: 5,
        comment: 'A true gallery centerpiece for dinner gatherings.',
      },
    ],
  },
  {
    name: 'SoHo Smoked Oak & Blackened Steel Bench',
    department: 'furniture',
    category: 'Seating',
    style: 'Warm Industrial',
    price: 780,
    description:
      'Hand-brushed smoked oak seat suspended on raw blackened-steel architectural hairpin trestles.',
    image:
      'https://images.unsplash.com/photo-1538688525198-9b88f6f53126?auto=format&fit=crop&w=900&q=80',
    dimensions: '60" W × 16" D × 18" H',
    material: 'Smoked European Oak & Matte Steel',
    rating: 4.7,
    numReviews: 1,
    reviews: [
      {
        userName: 'Ethan Cole',
        rating: 5,
        comment: 'Balances raw loft character with genuine wood warmth.',
      },
    ],
  },
  {
    name: 'Vienna Curved Cane & Oak Dining Chair (Set of 2)',
    department: 'furniture',
    category: 'Dining',
    style: 'Modern Minimalist',
    price: 690,
    description:
      'Steam-bent oak frame paired with hand-woven natural rattan cane backrest and oatmeal bouclé cushion.',
    image:
      'https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&w=900&q=80',
    dimensions: '21" W × 22" D × 31" H',
    material: 'Steam-Bent Oak & Natural Rattan Cane',
    rating: 4.8,
    numReviews: 1,
    reviews: [
      {
        userName: 'Amara Vance',
        rating: 5,
        comment: 'Lightweight, breathable, and surprisingly supportive for long dinners.',
      },
    ],
  },
];

const applianceSeeds = [
  {
    name: 'Akari Washi Paper Sphere Pendant',
    department: 'appliance',
    category: 'Chandeliers',
    style: 'Japandi',
    price: 420,
    description:
      'Hand-crafted mulberry washi paper diffuser delivering glare-free ambient glow with stepless smart dimming.',
    image:
      'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80',
    dimensions: '22" Dia × 20" H (Adjustable 60" Cord)',
    material: 'Mulberry Washi Paper & Bamboo Ribs',
    specs: {
      wattage: '15W LED',
      kelvin: '2400K–3000K Tunable',
      lumens: '1450 lm',
      smartSupport: 'Matter / Apple HomeKit / Alexa',
    },
    rating: 4.9,
    numReviews: 2,
    reviews: [
      {
        userName: 'Mei Takahashi',
        rating: 5,
        comment: 'Casts the softest evening serenity across our entire living room.',
      },
      {
        userName: 'Daniel Park',
        rating: 5,
        comment: 'Paired seamlessly with HomeKit adaptive lighting scenes.',
      },
    ],
  },
  {
    name: 'Brass Atelier Arc Floor Lamp',
    department: 'appliance',
    category: 'Floor Lamps',
    style: 'Mid-Century',
    price: 640,
    description:
      'Sweeping brushed-brass arc anchored by a solid Nero Marquina marble cylinder base with warm dimmable LED.',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    dimensions: '46" Reach × 78" H',
    material: 'Brushed Brass & Nero Marquina Marble',
    specs: {
      wattage: '18W LED',
      kelvin: '2700K Warm White',
      lumens: '1600 lm',
      smartSupport: 'Wi-Fi / Matter / Foot Dimmer',
    },
    rating: 4.9,
    numReviews: 2,
    reviews: [
      {
        userName: 'Aarav Mehta',
        rating: 5,
        comment: 'A sculptural reading arc that elevates any walnut listening corner.',
      },
      {
        userName: 'Olivia Ward',
        rating: 5,
        comment: 'Heavy marble base feels rock solid and the brass finish is refined.',
      },
    ],
  },
  {
    name: 'Halo Linear Brass Cove Light System',
    department: 'appliance',
    category: 'Smart Lighting',
    style: 'Modern Minimalist',
    price: 530,
    description:
      'Architectural recessed & suspended linear aluminum-brass light bar engineered for warm cove and atrium illumination.',
    image:
      'https://images.unsplash.com/photo-1565814329452-e1efa11c5b89?auto=format&fit=crop&w=900&q=80',
    dimensions: '48" L × 1.8" W × 2.2" H',
    material: 'Anodized Warm Brass & Frosted Polycarbonate',
    specs: {
      wattage: '24W LED',
      kelvin: '2200K–4000K Circadian',
      lumens: '2400 lm',
      smartSupport: 'Matter / Zigbee / Google Home',
    },
    rating: 4.8,
    numReviews: 1,
    reviews: [
      {
        userName: 'Julian Vance',
        rating: 5,
        comment: 'Zero flicker and extraordinary CRI 97 color accuracy on stone walls.',
      },
    ],
  },
  {
    name: 'Edison Smoked-Glass Cluster Chandelier',
    department: 'appliance',
    category: 'Chandeliers',
    style: 'Warm Industrial',
    price: 890,
    description:
      'Seven hand-blown smoked amber glass globes suspended from a matte-black architectural canopy with filament LEDs.',
    image:
      'https://images.unsplash.com/photo-1540932239986-30128078f3c5?auto=format&fit=crop&w=900&q=80',
    dimensions: '30" Dia × 38" Drop',
    material: 'Smoked Amber Glass & Matte Blackened Brass',
    specs: {
      wattage: '28W Total (7 × 4W)',
      kelvin: '2200K Candlelight Amber',
      lumens: '2100 lm',
      smartSupport: 'ELV Dimmer / Smart Bridge Ready',
    },
    rating: 4.8,
    numReviews: 1,
    reviews: [
      {
        userName: 'Lucas Meyer',
        rating: 5,
        comment: 'Warm amber glow transforms double-height loft ceilings at night.',
      },
    ],
  },
  {
    name: 'Alabaster Dome Bedside Sconce (Pair)',
    department: 'appliance',
    category: 'Wall Sconces',
    style: 'Japandi',
    price: 460,
    description:
      'Carved Spanish alabaster stone wall sconces emitting natural veined translucency with touch-dimming control.',
    image:
      'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=900&q=80',
    dimensions: '9" Dia × 4.5" Projection',
    material: 'Natural Spanish Alabaster & Aged Brass',
    specs: {
      wattage: '9W LED (Each)',
      kelvin: '2500K Sunset Warm',
      lumens: '850 lm',
      smartSupport: 'Touch Dim / Matter Thread',
    },
    rating: 5.0,
    numReviews: 2,
    reviews: [
      {
        userName: 'Elena Rostova',
        rating: 5,
        comment: 'Every alabaster dome has one-of-a-kind mineral marbling.',
      },
      {
        userName: 'Priya Nair',
        rating: 5,
        comment: 'Perfect bedtime wind-down warmth without harsh blue light.',
      },
    ],
  },
  {
    name: 'AeroPure Whisper Architectural Air Purifier',
    department: 'appliance',
    category: 'Climate & Air',
    style: 'Modern Minimalist',
    price: 580,
    description:
      'Sculptural brushed-sand cylindrical HEPA-13 air purifier & ambient night-glow lamp operating at whisper-quiet 21 dB.',
    image:
      'https://images.unsplash.com/photo-1585771724684-38269d6639fd?auto=format&fit=crop&w=900&q=80',
    dimensions: '12.5" Dia × 22" H',
    material: 'Matte Recycled Aluminum & Acoustic Linen Grille',
    specs: {
      wattage: '32W Eco Inverter',
      kelvin: '2700K Ring Glow',
      lumens: '350 lm (Ambient)',
      smartSupport: 'Apple HomeKit / Alexa / Air Quality App',
    },
    rating: 4.8,
    numReviews: 1,
    reviews: [
      {
        userName: 'Maya Lin',
        rating: 5,
        comment: 'Looks like a sculptural ceramic vessel rather than an appliance.',
      },
    ],
  },
];

async function seedDatabase({ force = false } = {}) {
  const existingDesigns = await Design.countDocuments();
  const existingProducts = await Product.countDocuments();

  if (!force && existingDesigns > 0 && existingProducts > 0) {
    return { skipped: true, designs: existingDesigns, products: existingProducts };
  }

  await Design.deleteMany({});
  await Product.deleteMany({});

  const insertedProducts = await Product.insertMany([...furnitureSeeds, ...applianceSeeds]);

  const byName = new Map(insertedProducts.map((p) => [p.name, p._id]));

  const designSeeds = [
    {
      title: 'Kyoto Warm Minimalist Sanctuary',
      style: 'Japandi',
      description:
        'Sun-drenched living pavilion pairing tactile boucle lounge seating with sculptural travertine tables and diffused paper-lantern warmth.',
      image:
        'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=85',
      designerName: 'Elena Rostova',
      designerRole: 'Principal Japandi Architect',
      designerAvatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      designerEmail: 'elena.rostova@shinehome.studio',
      designerPhone: '+1 (415) 890-4112',
      rating: 4.9,
      numReviews: 2,
      featured: true,
      hotspots: [
        {
          product: byName.get('Kumo Boucle Low-Profile Sofa'),
          x: 68,
          y: 62,
          label: 'Kumo Boucle Sofa',
        },
        {
          product: byName.get('Toscana Fluted Travertine Coffee Table'),
          x: 47,
          y: 72,
          label: 'Travertine Coffee Table',
        },
        {
          product: byName.get('Akari Washi Paper Sphere Pendant'),
          x: 52,
          y: 22,
          label: 'Akari Washi Pendant',
        },
      ],
      reviews: [
        {
          userName: 'Camille Laurent',
          rating: 5,
          comment: 'The natural light balance and boucle-travertine pairing feels timeless.',
        },
        {
          userName: 'Kenji Sato',
          rating: 5,
          comment: 'Ordered the sofa and washi pendant directly from the customizer—perfection.',
        },
      ],
    },
    {
      title: 'Terracotta & Travertine Atrium',
      style: 'Modern Minimalist',
      description:
        'Earthy ochre accents meet monolithic stone surfaces and recessed warm LED cove illumination for serene evening entertaining.',
      image:
        'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=85',
      designerName: 'Julian Vance',
      designerRole: 'Director of Spatial Architecture',
      designerAvatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      designerEmail: 'julian.vance@shinehome.studio',
      designerPhone: '+1 (415) 890-4208',
      rating: 4.8,
      numReviews: 2,
      featured: false,
      hotspots: [
        {
          product: byName.get('Toscana Fluted Travertine Coffee Table'),
          x: 50,
          y: 70,
          label: 'Fluted Travertine Table',
        },
        {
          product: byName.get('Halo Linear Brass Cove Light System'),
          x: 62,
          y: 20,
          label: 'Halo Linear Cove Light',
        },
        {
          product: byName.get('AeroPure Whisper Architectural Air Purifier'),
          x: 24,
          y: 66,
          label: 'AeroPure Air Purifier',
        },
      ],
      reviews: [
        {
          userName: 'Sienna Ross',
          rating: 5,
          comment: 'Julian helped us adapt the recessed cove lighting for our concrete loft.',
        },
        {
          userName: 'Arthur Pendelton',
          rating: 5,
          comment: 'Warm minimalism without feeling sterile or cold.',
        },
      ],
    },
    {
      title: 'Mid-Century Walnut Listening Lounge',
      style: 'Mid-Century',
      description:
        'Rich walnut paneling, cognac saddle-leather armchair, and brushed brass floor illumination tailored for vinyl listening sessions.',
      image:
        'https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=1200&q=85',
      designerName: 'Aarav Mehta',
      designerRole: 'Senior Acoustic & Interior Lead',
      designerAvatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
      designerEmail: 'aarav.mehta@shinehome.studio',
      designerPhone: '+1 (415) 890-4390',
      rating: 4.9,
      numReviews: 2,
      featured: false,
      hotspots: [
        {
          product: byName.get('Eames-Era Cognac Leather Lounge Chair'),
          x: 27,
          y: 64,
          label: 'Cognac Lounge Chair',
        },
        {
          product: byName.get('Kyoto Slatted Walnut Media Credenza'),
          x: 55,
          y: 66,
          label: 'Walnut Media Credenza',
        },
        {
          product: byName.get('Brass Atelier Arc Floor Lamp'),
          x: 78,
          y: 35,
          label: 'Brass Arc Floor Lamp',
        },
      ],
      reviews: [
        {
          userName: 'Vikram Desai',
          rating: 5,
          comment: 'Acoustic walnut slats look amazing and tame room echo effortlessly.',
        },
        {
          userName: 'Natalie Moore',
          rating: 5,
          comment: 'The brass arc lamp creates the coziest twilight listening corner.',
        },
      ],
    },
    {
      title: 'SoHo Loft Warm Industrial Suite',
      style: 'Warm Industrial',
      description:
        'Architectural steel-framed glazing balanced by oversized linen sectionals, smoked oak tables, and warm Edison cluster pendants.',
      image:
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=85',
      designerName: 'Sophia Lindqvist',
      designerRole: 'Loft & Adaptive Reuse Specialist',
      designerAvatar:
        'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80',
      designerEmail: 'sophia.lindqvist@shinehome.studio',
      designerPhone: '+1 (415) 890-4455',
      rating: 4.7,
      numReviews: 2,
      featured: false,
      hotspots: [
        {
          product: byName.get('SoHo Smoked Oak & Blackened Steel Bench'),
          x: 42,
          y: 72,
          label: 'Smoked Oak Bench',
        },
        {
          product: byName.get('Edison Smoked-Glass Cluster Chandelier'),
          x: 54,
          y: 20,
          label: 'Edison Cluster Chandelier',
        },
        {
          product: byName.get('Kumo Boucle Low-Profile Sofa'),
          x: 28,
          y: 60,
          label: 'Oversized Boucle Sectional',
        },
      ],
      reviews: [
        {
          userName: 'Grant Holloway',
          rating: 5,
          comment: 'Finally an industrial concept that still feels inviting and residential.',
        },
        {
          userName: 'Chloe Martin',
          rating: 4,
          comment: 'Love the smoked-glass cluster chandelier against warm timber walls.',
        },
      ],
    },
    {
      title: 'Oslo Linen & Oak Bedroom Retreat',
      style: 'Japandi',
      description:
        'Restorative primary suite featuring a platform white-oak bedframe, Belgian flax drapery, and dimmable bedside alabaster sconces.',
      image:
        'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=85',
      designerName: 'Elena Rostova',
      designerRole: 'Principal Japandi Architect',
      designerAvatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80',
      designerEmail: 'elena.rostova@shinehome.studio',
      designerPhone: '+1 (415) 890-4112',
      rating: 5.0,
      numReviews: 2,
      featured: false,
      hotspots: [
        {
          product: byName.get('Oslo Upholstered Linen Platform Bed'),
          x: 46,
          y: 62,
          label: 'Oslo Linen Platform Bed',
        },
        {
          product: byName.get('Alabaster Dome Bedside Sconce (Pair)'),
          x: 24,
          y: 44,
          label: 'Alabaster Bedside Sconce',
        },
        {
          product: byName.get('AeroPure Whisper Architectural Air Purifier'),
          x: 78,
          y: 68,
          label: 'AeroPure Air Purifier',
        },
      ],
      reviews: [
        {
          userName: 'Freya Lind',
          rating: 5,
          comment: 'Our sleep quality noticeably improved with the 2500K alabaster sconces.',
        },
        {
          userName: 'Noah Sterling',
          rating: 5,
          comment: 'Clean lines, soft textiles, and zero visual clutter.',
        },
      ],
    },
    {
      title: 'Milanese Gallery Dining Salon',
      style: 'Modern Minimalist',
      description:
        'Sculptural dining room anchored by a bullnose marble table, curved cane chairs, and an asymmetric brass halo chandelier.',
      image:
        'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1200&q=85',
      designerName: 'Julian Vance',
      designerRole: 'Director of Spatial Architecture',
      designerAvatar:
        'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80',
      designerEmail: 'julian.vance@shinehome.studio',
      designerPhone: '+1 (415) 890-4208',
      rating: 4.8,
      numReviews: 2,
      featured: false,
      hotspots: [
        {
          product: byName.get('Milanese Carrara Marble Dining Table'),
          x: 50,
          y: 64,
          label: 'Carrara Marble Dining Table',
        },
        {
          product: byName.get('Vienna Curved Cane & Oak Dining Chair (Set of 2)'),
          x: 34,
          y: 67,
          label: 'Curved Cane Dining Chairs',
        },
        {
          product: byName.get('Halo Linear Brass Cove Light System'),
          x: 52,
          y: 22,
          label: 'Asymmetric Brass Halo Light',
        },
      ],
      reviews: [
        {
          userName: 'Lorenzo Conti',
          rating: 5,
          comment: 'Effortless Milanese elegance—friends ask about this room every visit.',
        },
        {
          userName: 'Isabella Cruz',
          rating: 5,
          comment: 'The marble table and cane chairs balance structure with warmth.',
        },
      ],
    },
  ];

  const insertedDesigns = await Design.insertMany(designSeeds);

  // Seed demo user if none exists
  let demoUser = await User.findOne({ email: 'demo@shinehome.studio' });
  if (!demoUser) {
    demoUser = await User.create({
      name: 'Aria Sterling',
      email: 'demo@shinehome.studio',
      password: 'shinehome123',
      role: 'user',
      favorites: [insertedDesigns[0]._id, insertedDesigns[2]._id],
    });
  }

  return {
    skipped: false,
    designs: insertedDesigns.length,
    products: insertedProducts.length,
    demoEmail: demoUser.email,
  };
}

module.exports = { seedDatabase };
