import { Oem } from "@/types/vehicle";

export const oems: Oem[] = [
  {
    key: "tata",
    slug: "tata",
    name: "Tata Motors",
    color: "#1E88E5",
    country: "India",
    categories: ["car"],
    description:
      "India's largest homegrown EV maker, credited with kickstarting mass-market electric adoption with the Nexon EV and Tiago EV.",
  },
  {
    key: "mg",
    slug: "mg",
    name: "MG Motor",
    color: "#FF6B00",
    country: "UK / China",
    categories: ["car"],
    description:
      "Early mover in India's EV SUV space with the ZS EV, now expanding into affordable electric hatchbacks and premium SUVs.",
  },
  {
    key: "hyundai",
    slug: "hyundai",
    name: "Hyundai",
    color: "#002C5F",
    country: "South Korea",
    categories: ["car"],
    description:
      "Global EV technology brought to India through the Kona and Creta EV, with dedicated e-GMP platform models on the way.",
  },
  {
    key: "mahindra",
    slug: "mahindra",
    name: "Mahindra",
    color: "#DC2626",
    country: "India",
    categories: ["car"],
    description:
      "Betting big on its BE and XUV.e born-electric sub-brands, built on a dedicated INGLO skateboard platform.",
  },
  {
    key: "byd",
    slug: "byd",
    name: "BYD",
    color: "#1B5E20",
    country: "China",
    categories: ["car"],
    description:
      "World's largest EV maker bringing Blade Battery tech and premium electric SUVs/sedans to the Indian market.",
  },
  {
    key: "kia",
    slug: "kia",
    name: "Kia",
    color: "#BB162B",
    country: "South Korea",
    categories: ["car"],
    description:
      "Design-forward EVs including the futuristic EV6, sharing Hyundai's e-GMP underpinnings with distinct styling.",
  },
  {
    key: "ola-electric",
    slug: "ola-electric",
    name: "Ola Electric",
    color: "#111827",
    country: "India",
    categories: ["2-wheeler"],
    description:
      "India's largest electric scooter maker by volume, built out of its own Futurefactory, now expanding into motorcycles.",
  },
  {
    key: "ather",
    slug: "ather",
    name: "Ather Energy",
    color: "#38C6F4",
    country: "India",
    categories: ["2-wheeler"],
    description:
      "Premium electric scooter pioneer known for its smart dashboard, fast charging Ather Grid network and sporty performance.",
  },
  {
    key: "bajaj",
    slug: "bajaj",
    name: "Bajaj",
    color: "#003DA5",
    country: "India",
    categories: ["2-wheeler"],
    description:
      "Legacy two-wheeler giant behind the Chetak, blending retro styling with modern EV underpinnings.",
  },
  {
    key: "tvs",
    slug: "tvs",
    name: "TVS Motor",
    color: "#ED1C24",
    country: "India",
    categories: ["2-wheeler"],
    description:
      "Maker of the iQube, one of India's best-selling electric scooters, with a rapidly expanding lineup.",
  },
  {
    key: "hero",
    slug: "hero",
    name: "Hero Electric / Vida",
    color: "#F97316",
    country: "India",
    categories: ["2-wheeler"],
    description:
      "Hero MotoCorp's electric arm, now consolidated under the Vida brand for its next-generation scooter lineup.",
  },
  {
    key: "ampere",
    slug: "ampere",
    name: "Ampere",
    color: "#7C3AED",
    country: "India",
    categories: ["2-wheeler"],
    description:
      "Greaves Electric Mobility's value-focused electric scooter brand, popular for affordable daily commuting.",
  },
];

export function getOemBySlug(slug: string): Oem | undefined {
  return oems.find((oem) => oem.slug === slug);
}
