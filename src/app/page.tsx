import type { Metadata } from "next";
import {
  Hero,
  TrendingCompactSection,
  MainLayout,
  UpcomingSection,
  CompareSection,
  WhyEvMotionSection,
  AdvertiseSection,
} from "@/components/home";
import {
  trendingCarsCompact,
  trendingBikesCompact,
  upcomingCars,
  upcomingBikes,
  carComparisons,
  bikeComparisons,
} from "@/lib/data/ev-motion/derive";

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
      {/* Hero (with overlapping search card) — single H1 lives here */}
      <Hero />

      {/* Compact trending carousels */}
      <TrendingCompactSection title="Trending Cars" items={trendingCarsCompact} />
      <TrendingCompactSection title="Trending Scooters & Bikes" items={trendingBikesCompact} />

      {/* Browse by Category, Sponsored spotlight, Popular Cars, Popular Bikes,
          Brand carousels + sidebar */}
      <MainLayout />

      {/* Upcoming */}
      <UpcomingSection title="Upcoming Electric Cars" items={upcomingCars} />
      <UpcomingSection title="Upcoming Electric Bikes & Scooters" items={upcomingBikes} tinted />

      {/* Compare */}
      <CompareSection title="Compare Electric Cars" pairs={carComparisons} viewAllHref="/compare" />
      <CompareSection
        title="Compare Electric Bikes & Scooters"
        pairs={bikeComparisons}
        viewAllHref="/compare"
        tinted
      />

      {/* Why EV Motion */}
      <WhyEvMotionSection />

      {/* Advertise */}
      <AdvertiseSection />
    </>
  );
}
