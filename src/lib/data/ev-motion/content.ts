import type { AdvertPlanData, CategoryItemData, WhyFeatureData } from "@/types/ev-motion";
import { cars } from "@/lib/data/cars";
import { twoWheelers } from "@/lib/data/two-wheelers";

const scooterCount = twoWheelers.filter((v) => v.twoWheelerType === "scooter").length;
const motorcycleCount = twoWheelers.filter((v) => v.twoWheelerType === "motorcycle").length;

export const categories: CategoryItemData[] = [
  { id: "cat-cars", name: "Electric Cars", count: `${cars.length}`, emoji: "🚗", href: "/cars" },
  { id: "cat-scooters", name: "E-Scooters", count: `${scooterCount}`, emoji: "🛺", href: "/two-wheelers?type=scooter" },
  { id: "cat-bikes", name: "E-Bikes", count: `${motorcycleCount}`, emoji: "🛵", href: "/two-wheelers?type=motorcycle" },
  // No listing exists yet for these — left without an href so the tile renders disabled instead of linking nowhere.
  { id: "cat-buses", name: "E-Buses", count: "—", emoji: "🚌" },
  { id: "cat-commercial", name: "Commercial", count: "—", emoji: "🚚" },
  { id: "cat-chargers", name: "Chargers", count: "—", emoji: "🔌" },
];

export const whyFeatures: WhyFeatureData[] = [
  {
    id: "why-1",
    emoji: "⚡",
    title: "EV-Only Platform",
    description: "Zero ICE clutter. Built purely for electric vehicles.",
  },
  {
    id: "why-2",
    emoji: "✓",
    title: "Verified Dealers",
    description: "All dealers manually vetted. No fake listings.",
  },
  {
    id: "why-3",
    emoji: "📊",
    title: "Real Range Data",
    description: "Actual vs claimed range from owner-reported figures.",
  },
  {
    id: "why-4",
    emoji: "🗺️",
    title: "Charger Map",
    description: "Locate DC fast chargers across every major city.",
  },
];

export const advertPlans: AdvertPlanData[] = [
  {
    id: "plan-starter",
    name: "Starter",
    priceLabel: "₹4,999",
    unitLabel: "per month",
    features: ["5 listings", "Basic profile", "City targeting", "Lead dashboard"],
  },
  {
    id: "plan-growth",
    name: "Growth",
    priceLabel: "₹14,999",
    unitLabel: "per month",
    features: ["Unlimited listings", "Featured placement", "State targeting", "Priority leads"],
    featured: true,
  },
  {
    id: "plan-brand",
    name: "Brand",
    priceLabel: "Custom",
    unitLabel: "contact sales",
    features: ["Homepage banners", "Launch campaigns", "National reach", "Dedicated manager"],
  },
];
