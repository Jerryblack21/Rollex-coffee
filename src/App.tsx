import { useEffect } from 'react';
import { Citrus, Croissant, CupSoda, Popcorn, Sandwich, Soup, LucideIcon } from 'lucide-react';
import AboutSection from './components/AboutSection';
import BurgerAssembly from './components/BurgerAssembly';
import CoffeeExperience from './components/CoffeeExperience';
import Favourites from './components/Favourites';
import Footer from './components/Footer';
import MenuGrid from './components/MenuGrid';
import Navbar from './components/Navbar';
import { GoldDust, Steam } from './components/Particles';
import ProductSection, { fadeEdge, MediaFrame } from './components/ProductSection';
import { JuiceArt, MomoArt } from './components/ProductArt';
import ScrollVideoHero from './components/ScrollVideoHero';
import VisitSection from './components/VisitSection';
import { ASSETS } from './config/assets';
import { itemsByCategory, MenuItem } from './data/menu';
import { ScrollTrigger } from './lib/motion';
import { scrollToSection } from './lib/scroll';

const photo = (src: string, alt: string, w: number, h: number) => (
  <img src={src} alt={alt} width={w} height={h} loading="lazy" decoding="async" style={fadeEdge} className="h-full w-full object-contain" />
);

const snackIcon = (item: MenuItem): LucideIcon => (item.category === 'sandwiches' ? Sandwich : Popcorn);

export default function App() {
  // Honour deep links (#menu etc.) and re-measure ScrollTrigger once fonts and images settle.
  useEffect(() => {
    const refresh = () => ScrollTrigger.refresh();
    window.addEventListener('load', refresh);
    document.fonts?.ready.then(refresh).catch(() => undefined);
    const hash = window.location.hash.replace('#', '');
    const t = hash ? window.setTimeout(() => scrollToSection(hash), 400) : 0;
    return () => {
      window.removeEventListener('load', refresh);
      window.clearTimeout(t);
    };
  }, []);

  return (
    <>
      <a href="#menu" className="sr-only z-[100] rounded bg-gold px-4 py-2 text-charcoal focus:not-sr-only focus:fixed focus:left-4 focus:top-4">
        Skip to menu
      </a>
      <Navbar />
      <main>
        <ScrollVideoHero />
        <CoffeeExperience />

        <ProductSection
          id="buns"
          eyebrow="Bun varieties"
          title="SMALL BITES. BIG HAPPINESS."
          intro="Soft, warm buns with butter, jam, cheese, chutney and more — sixteen ways to start the day."
          items={itemsByCategory('buns')}
          icon={Croissant}
          mediaSide="right"
          tone="espresso"
          media={
            <MediaFrame>
              <div className="relative h-full w-full">
                <Steam className="inset-x-0 top-0 z-10 opacity-60" wisps={4} />
                {photo(ASSETS.images.bun, 'Warm bun pulled open with melting butter', 720, 756)}
              </div>
            </MediaFrame>
          }
        />

        <ProductSection
          id="momos"
          eyebrow="Momos"
          title="STEAMED. FRIED. ALWAYS FRESH."
          intro="Five pieces to a plate, served steamed or fried — veg, paneer or chicken."
          items={itemsByCategory('momos')}
          icon={Soup}
          grouped
          mediaSide="left"
          media={
            <MediaFrame>
              <div className="relative h-full w-full">
                <Steam className="inset-x-0 top-[6%] z-10 opacity-70" wisps={5} />
                <MomoArt className="relative h-full w-full" />
              </div>
            </MediaFrame>
          }
        />

        <BurgerAssembly />

        <ProductSection
          id="milkshakes"
          eyebrow="Milkshakes"
          title="THICK, CREAMY, UNFORGETTABLE."
          intro="Chilled glasses, chocolate swirls and cold-coffee classics — poured thick."
          items={itemsByCategory('milkshakes')}
          icon={CupSoda}
          mediaSide="right"
          tone="espresso"
          media={<MediaFrame>{photo(ASSETS.images.milkshake, 'Creamy chocolate milkshake splashing from a chilled glass', 720, 790)}</MediaFrame>}
        />

        <ProductSection
          id="juices"
          eyebrow="Fresh juice"
          title="COLD, BRIGHT AND FRESHLY MADE."
          intro="Sarbaths, fruit juices, shakes and traditional coolers — from ₹20."
          items={itemsByCategory('juices')}
          icon={Citrus}
          mediaSide="left"
          media={
            <MediaFrame>
              <div className="relative h-full w-full">
                <JuiceArt className="h-full w-full" />
                <GoldDust count={8} className="opacity-60" />
              </div>
            </MediaFrame>
          }
        />

        <ProductSection
          id="snacks"
          eyebrow="Sandwiches & snacks"
          title="YOUR FAVOURITE BITES, ANY TIME."
          intro="Toasted sandwiches, crisp nuggets and masala snacks — filter by what you’re craving."
          items={[...itemsByCategory('sandwiches'), ...itemsByCategory('others')]}
          icon={Sandwich}
          iconFor={snackIcon}
          filters={[
            { id: 'sandwiches', label: 'Sandwiches' },
            { id: 'others', label: 'Other snacks' },
          ]}
          mediaSide="right"
          tone="espresso"
          media={<MediaFrame>{photo(ASSETS.images.sandwich, 'Toasted sandwich with melted cheese above a tray of fries', 720, 805)}</MediaFrame>}
        />

        <MenuGrid />
        <Favourites />
        <AboutSection />
        <VisitSection />
      </main>
      <Footer />
    </>
  );
}
