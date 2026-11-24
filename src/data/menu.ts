/** Single source of truth for every product and price shown on the site. */
export type CategoryId =
  | 'coffee-tea'
  | 'buns'
  | 'momos'
  | 'burgers'
  | 'milkshakes'
  | 'juices'
  | 'sandwiches'
  | 'others';

export interface MenuItem {
  id: string;
  name: string;
  category: CategoryId;
  /** Base price in INR. */
  price: number;
  /** Overrides the displayed price (e.g. "₹20 + ₹5" for honey add-ons). */
  priceLabel?: string;
  /** Secondary line (e.g. "Steamed · 5 pieces"). */
  detail?: string;
  /** Optional sub-group inside a category. */
  group?: string;
}

export const CATEGORIES: { id: CategoryId; label: string }[] = [
  { id: 'coffee-tea', label: 'Coffee & Tea' },
  { id: 'buns', label: 'Bun Varieties' },
  { id: 'momos', label: 'Momos' },
  { id: 'burgers', label: 'Burgers' },
  { id: 'milkshakes', label: 'Milkshakes' },
  { id: 'juices', label: 'Fresh Juice' },
  { id: 'sandwiches', label: 'Sandwiches' },
  { id: 'others', label: 'Others' },
];

const slug = (s: string) =>
  s.toLowerCase().replace(/\+/g, 'plus').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

type Row = [name: string, price: number, extra?: { label?: string; detail?: string; group?: string }];

const make = (category: CategoryId, rows: Row[]): MenuItem[] =>
  rows.map(([name, price, extra]) => ({
    id: `${category}-${slug(name)}${extra?.group ? `-${slug(extra.group)}` : ''}`,
    name,
    category,
    price,
    priceLabel: extra?.label,
    detail: extra?.detail,
    group: extra?.group,
  }));

export const MENU_ITEMS: MenuItem[] = [
  ...make('coffee-tea', [
    ['Classic Filter Coffee', 20],
    ['Black Coffee', 15],
    ['Chocolate Coffee', 25],
    ['Cold Coffee', 50],
    ['Special Tea', 15],
    ['Ginger Tea', 18],
    ['Elachi Tea', 18],
    ['Green Tea + Honey', 20, { label: '₹20 + ₹5' }],
    ['Sukku Coffee', 20],
    ['Black Tea + Honey', 12, { label: '₹12 + ₹5' }],
    ['Lemon Tea + Honey', 20, { label: '₹20 + ₹5' }],
    ['Badam (Hot)', 30],
    ['Horlick', 25],
    ['Boost', 25],
  ]),
  ...make('buns', [
    ['Madurai Butter Bun', 40],
    ['Cheese Bun', 40],
    ['Peanut Butter Bun', 40],
    ['Lays Bun', 40],
    ['Bun Butter Jam', 40],
    ['Schezwan Bun', 40],
    ['Chilly Cheese Bun', 45],
    ['Nutella Chocolate Bun', 45],
    ['Bun Omlet', 45],
    ['Chutney Bun Maska', 45],
    ['Chutney Cheese Bun', 45],
    ['Honey Bun Butter Jam', 45],
    ['Horlick Bun', 45],
    ['Boost Bun', 45],
    ['Bun Maska', 45],
    ['Bread Omlete', 50],
  ]),
  ...make('momos', [
    ['Veg Momo', 59, { group: 'Steamed', detail: 'Steamed · 5 pieces' }],
    ['Paneer Momo', 69, { group: 'Steamed', detail: 'Steamed · 5 pieces' }],
    ['Chicken Momo', 69, { group: 'Steamed', detail: 'Steamed · 5 pieces' }],
    ['Veg Momo', 69, { group: 'Fried', detail: 'Fried · 5 pieces' }],
    ['Paneer Momo', 79, { group: 'Fried', detail: 'Fried · 5 pieces' }],
    ['Chicken Momo', 79, { group: 'Fried', detail: 'Fried · 5 pieces' }],
  ]),
  ...make('burgers', [
    ['Veg Patty Burger', 79],
    ['Chicken Patty Burger', 99],
    ['Panner Patty Burger', 129],
    ['Monster Burger', 129],
  ]),
  ...make('milkshakes', [
    ['Horlicks Milkshake', 79],
    ['Boost Milkshake', 79],
    ['Badam Milkshake', 79],
    ['Rose Milkshake', 79],
    ['Cold Filter Coffee Shake', 99],
    ['Oreo Milk Shake', 99],
    ['KitKat Shake', 99],
    ['Cold Chocolate Coffee', 99],
    ['Strawberry Milkshake', 99],
    ['Blueberry Milk Shake', 99],
  ]),
  ...make('juices', [
    ['Paal Sarbath', 60],
    ['Nanari Sarbath', 30],
    ['Pomegranate', 60],
    ['Sathukudi', 60],
    ['Pine Apple', 50],
    ['Dates Shake', 50],
    ['Red Banana', 50],
    ['Sapota Shake', 50],
    ['Watermelon', 40],
    ['Orange', 60],
    ['Lassi', 40],
    ['Rose Milk', 35],
    ['Badam Milk', 40],
    ['Butter Milk', 20],
    ['Lemon Juice', 20],
    ['Lemon Sooda', 30],
    ['Fig Shake', 50],
  ]),
  ...make('sandwiches', [
    ['Plain Sandwich', 50],
    ['Cheese Sandwich', 60],
    ['Egg Sandwich', 70],
    ['Corn Sandwich', 60],
    ['Cheese + Corn Sandwich', 70],
    ['Cheese + Chilli Sandwich', 65],
    ['Corn + Chilli Sandwich', 65],
  ]),
  ...make('others', [
    ['Boiled Peanut', 20],
    ['Masala Boiled Peanut', 25],
    ['Masala Sweet Corn', 25],
    ['Veg Cutlet', 25],
    ['Veg Nuggets', 59],
    ['Masala French Fries', 69],
    ['Smileys', 69],
    ['Chicken Nuggets', 79],
  ]),
];

/** Extra charged on any burger. */
export const BURGER_ADDON = { name: 'Add Cheese', price: 10 } as const;

export const itemsByCategory = (id: CategoryId): MenuItem[] => MENU_ITEMS.filter((i) => i.category === id);
export const formatPrice = (item: MenuItem): string => item.priceLabel ?? `₹${item.price}`;
export const findItem = (id: string): MenuItem => {
  const found = MENU_ITEMS.find((i) => i.id === id);
  if (!found) throw new Error(`Unknown menu item: ${id}`);
  return found;
};

export const FAVOURITE_IDS = [
  'coffee-tea-classic-filter-coffee',
  'buns-madurai-butter-bun',
  'momos-chicken-momo-steamed',
  'burgers-chicken-patty-burger',
  'milkshakes-oreo-milk-shake',
  'juices-orange',
] as const;
