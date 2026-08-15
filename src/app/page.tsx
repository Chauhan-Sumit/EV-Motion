import type { Metadata } from "next";
import {
  Hero,
  HeroSearchSection,
  MainLayout,
  UpcomingSection,
  LatestEVNewsSection,
  WhyEvMotionSection,
  AdvertiseSection,
} from "@/components/home";
import { getUpcomingByCategory } from "@/lib/data/ev-motion/derive";

export const metadata: Metadata = {
  title: "EV Motion - India's #1 EV Marketplace",
  description:
    "Compare electric cars, bikes and scooters from every major OEM across India. Real prices, real range, real reviews.",
  openGraph: {
    title: "EV Motion - India's #1 EV Marketplace",
    description: "Compare electric cars, bikes and scooters from every major OEM across India.",
    type: "website",
  },
};

export default function HomePage() {
  return (
    <>
      {/* Hero — single H1 lives here */}
      <Hero />

      {/* Search (left) + sticky Key Highlights (right) + trending carousels,
          overlapping the hero boundary. Key Highlights stays sticky through
          this section and releases once MainLayout/FeaturedBanner begins. */}
      <HeroSearchSection />

      {/* Browse by Category, Featured spotlight, Popular Cars, Compare EVs
          Instantly, Popular Bikes, Brand carousels + sidebar (EV Tools,
          Popular Comparisons, Advertiser, Top lists, Subsidy calculator) */}
      <MainLayout />

      {/* Upcoming */}
      <UpcomingSection title="Upcoming Electric Cars" items={getUpcomingByCategory("car")} showNotifyBanner />
      <UpcomingSection
        title="Upcoming Electric Bikes & Scooters"
        items={getUpcomingByCategory("2-wheeler")}
        tinted
      />

      {/* Latest EV News — honest empty state, no fabricated headlines (see
          LatestEVNewsSection.tsx and SectionLatestNews.tsx for the pattern
          this project uses everywhere a real news source doesn't exist) */}
      <LatestEVNewsSection />

      {/* Why EV Motion */}
      <WhyEvMotionSection />

      {/* Advertise */}
      <AdvertiseSection />
    </>
  );
}
