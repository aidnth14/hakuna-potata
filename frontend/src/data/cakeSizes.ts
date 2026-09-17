export type TierCategory = 'single' | 'tower';

export interface CakeOptionInfo {
  id: string;
  category: TierCategory;
  name: string;
  badge?: string;
  tagline: string;
  servings: string;
  sliceCount: string;
  diameterSpec: string;
  diameterCm?: number;
  tiers: string;
  topTierInches?: number;
  bottomTierInches?: number;
  inches?: number;
  standardHeight: string;
  idealFor: string;
  description: string;
  imageSrc: string;
  relativeScale: number;
}

export const SINGLE_TIER_SIZES: CakeOptionInfo[] = [
  {
    id: '4',
    category: 'single',
    inches: 4,
    diameterCm: 10,
    name: '4" Petite Bento',
    badge: 'Personal',
    tagline: 'Intimate & Bento Style',
    servings: '2 – 4 Servings',
    sliceCount: '2-4 generous slices',
    diameterSpec: '⌀ 4.0″ (10.2 cm)',
    tiers: '1 Tier (Single)',
    standardHeight: '4.0" (10 cm)',
    idealFor: 'Date nights, birthdays for two, personal gifting, smash cakes',
    description: 'Our most darling size. Perfect for intimate moments, smash cakes, or sending an edible love note.',
    imageSrc: '/cake-tier-centered.webp',
    relativeScale: 0.44,
  },
  {
    id: '6',
    category: 'single',
    inches: 6,
    diameterCm: 15,
    name: '6" Classic Gathering',
    badge: 'Popular',
    tagline: 'Small Family & Gatherings',
    servings: '6 – 8 Servings',
    sliceCount: '6-8 dessert slices',
    diameterSpec: '⌀ 6.0″ (15.2 cm)',
    tiers: '1 Tier (Single)',
    standardHeight: '4.5" (11.5 cm)',
    idealFor: 'Family dinners, birthdays with close friends, casual celebrations',
    description: 'The golden standard for boutique celebrations. Strikes the perfect balance of height and presence on any table.',
    imageSrc: '/cake-tier-centered.webp',
    relativeScale: 0.62,
  },
  {
    id: '8',
    category: 'single',
    inches: 8,
    diameterCm: 20,
    name: '8" Celebration Grand',
    badge: 'Best Value',
    tagline: 'Parties & Milestone Events',
    servings: '12 – 16 Servings',
    sliceCount: '12-16 party portions',
    diameterSpec: '⌀ 8.0″ (20.3 cm)',
    tiers: '1 Tier (Single)',
    standardHeight: '4.5" (11.5 cm)',
    idealFor: 'Medium parties, office celebrations, milestone birthdays, anniversaries',
    description: 'A show-stopping centerpiece designed to feed a lively crowd without ever compromising on artisanal aesthetics.',
    imageSrc: '/cake-tier-centered.webp',
    relativeScale: 0.82,
  },
  {
    id: '10',
    category: 'single',
    inches: 10,
    diameterCm: 25,
    name: '10" Royal Banquet',
    badge: 'Feast Size',
    tagline: 'Grand Receptions & Large Crowds',
    servings: '20 – 26 Servings',
    sliceCount: '20-26 event servings',
    diameterSpec: '⌀ 10.0″ (25.4 cm)',
    tiers: '1 Tier (Single)',
    standardHeight: '5.0" (12.7 cm)',
    idealFor: 'Large parties, corporate galas, engagements, multiple group celebrations',
    description: 'Our largest single-tier statement piece. Substantial volume and diameter tailored for memorable grand gatherings.',
    imageSrc: '/cake-tier-centered.webp',
    relativeScale: 1.0,
  },
];

export const TOWER_TIER_SIZES: CakeOptionInfo[] = [
  {
    id: 'tower-4-6',
    category: 'tower',
    topTierInches: 4,
    bottomTierInches: 6,
    name: '4″ on 6″ Petite Tower',
    badge: '2-Layer Tower',
    tagline: '4″ Top Tier over 6″ Base',
    servings: '10 – 14 Servings',
    sliceCount: '10-14 tiered servings',
    diameterSpec: 'Top: 4″ (10 cm) · Base: 6″ (15 cm)',
    tiers: '2 Layers (Stacked Tower)',
    standardHeight: '9.0" (23 cm) total',
    idealFor: 'Boutique weddings, bridal showers, baby showers, 1st birthday milestone',
    description: 'A delicate two-layer architectural cake. Features a 4″ bento tier gracefully crowning a 6″ foundation base.',
    imageSrc: '/tower-4-on-6.webp',
    relativeScale: 0.65,
  },
  {
    id: 'tower-6-8',
    category: 'tower',
    topTierInches: 6,
    bottomTierInches: 8,
    name: '6″ on 8″ Signature Tower',
    badge: 'Most Popular Tower',
    tagline: '6″ Top Tier over 8″ Base',
    servings: '20 – 26 Servings',
    sliceCount: '20-26 celebration portions',
    diameterSpec: 'Top: 6″ (15 cm) · Base: 8″ (20 cm)',
    tiers: '2 Layers (Stacked Tower)',
    standardHeight: '9.5" (24 cm) total',
    idealFor: 'Weddings, silver & golden jubilees, sweet sixteens, premium celebrations',
    description: 'Our signature tiered silhouette. The harmony between the 6″ top tier and 8″ lower base delivers timeless beauty and plentiful servings.',
    imageSrc: '/tower-6-on-8.webp',
    relativeScale: 0.85,
  },
  {
    id: 'tower-8-10',
    category: 'tower',
    topTierInches: 8,
    bottomTierInches: 10,
    name: '8″ on 10″ Grand Gala Tower',
    badge: 'Grand Feast Tower',
    tagline: '8″ Top Tier over 10″ Base',
    servings: '35 – 45 Servings',
    sliceCount: '35-45 gala portions',
    diameterSpec: 'Top: 8″ (20 cm) · Base: 10″ (25 cm)',
    tiers: '2 Layers (Stacked Tower)',
    standardHeight: '10.0" (25.5 cm) total',
    idealFor: 'Grand wedding banquets, corporate anniversaries, ballrooms, luxury galas',
    description: 'The ultimate culinary centerpiece. An imposing 8″ top tier anchored by a robust 10″ base, commanding the attention of the entire venue.',
    imageSrc: '/tower-8-on-10.webp',
    relativeScale: 1.05,
  },
];

export const ALL_CAKE_OPTIONS: CakeOptionInfo[] = [
  ...SINGLE_TIER_SIZES,
  ...TOWER_TIER_SIZES,
];

// Backwards compatibility alias
export const CAKE_SIZES = SINGLE_TIER_SIZES;
export type CakeSizeInfo = CakeOptionInfo;
