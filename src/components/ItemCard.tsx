import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import { formatPrice, MenuItem } from '../data/menu';

interface Props {
  item: MenuItem;
  icon: LucideIcon;
  /** Shown instead of the base price (e.g. burger with cheese). */
  priceOverride?: string;
}

/** One menu entry. Used by every product section and the full menu so names/prices never drift. */
export default function ItemCard({ item, icon: Icon, priceOverride }: Props) {
  return (
    <motion.li
      variants={{ hidden: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.5 } } }}
      className="card-surface group relative flex items-center gap-4 rounded-2xl p-4 transition duration-300 hover:-translate-y-1 hover:border-gold/60 hover:shadow-[0_18px_40px_-18px_rgba(214,177,94,.45)]"
    >
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/10 text-gold transition group-hover:bg-gold group-hover:text-charcoal">
        <Icon size={20} strokeWidth={1.6} aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="font-display text-lg leading-tight text-cream">{item.name}</p>
        {item.detail && <p className="mt-0.5 text-xs text-cream/60">{item.detail}</p>}
      </div>
      <p className="shrink-0 whitespace-nowrap font-display text-lg font-semibold text-gold" aria-label={`Price ${priceOverride ?? formatPrice(item)}`}>
        {priceOverride ?? formatPrice(item)}
      </p>
    </motion.li>
  );
}
