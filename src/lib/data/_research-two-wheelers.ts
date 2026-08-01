import type { Vehicle, Oem } from "@/types/vehicle";

const gallery = ["front-three-quarter", "side-profile", "dashboard"];

// ---------------------------------------------------------------------------
// UNMERGED — earmarked for Batch 4 (motorcycles). Everything else that was
// originally staged in this file (Okinawa, Kinetic Green, River Mobility,
// BGauss, PURE EV, Bounce Infinity, Simple Energy, plus gap-fill scooter
// models for Ola/Ather/Bajaj/TVS/Hero Vida/Ampere) was merged into
// src/lib/data/oems.ts and src/lib/data/two-wheelers.ts during Batch 3
// (scooters). Ultraviolette and Revolt were deliberately left out of Batch 3
// because they are motorcycle-first brands, not in Batch 3's scooter brand
// list — spot-check this data against public sources before merging into
// Batch 4, same as every other batch.
// ---------------------------------------------------------------------------
export const additionalOems: Oem[] = [
  {
    key: "ultraviolette",
    slug: "ultraviolette",
    name: "Ultraviolette Automotive",
    color: "#C026D3",
    country: "India",
    categories: ["2-wheeler"],
    description:
      "Bengaluru performance-EV maker known for the track-capable F77 motorcycle and an expanding range of high-output electric two-wheelers.",
  },
  {
    key: "revolt",
    slug: "revolt",
    name: "Revolt Motors",
    color: "#92400E",
    country: "India",
    categories: ["2-wheeler"],
    description:
      "Pioneer of the AI-connected electric motorcycle in India, best known for the sound-simulating RV400 and the commuter-focused RV1.",
  },
];

export const additionalTwoWheelers: Vehicle[] = [
  {
    id: "tw-ultraviolette-f77",
    slug: "ultraviolette-f77",
    category: "2-wheeler",
    oem: "ultraviolette",
    oemName: "Ultraviolette Automotive",
    modelName: "F77",
    tagline: "India's first high-performance electric sportbike",
    twoWheelerType: "motorcycle",
    priceRangeLakh: [3.09, 4.24],
    rangeKm: 323,
    batteryCapacityKwh: 10.3,
    chargingTimeSlowHr: 5.0,
    chargingTimeFastMin: 60,
    topSpeedKmph: 155,
    launchStatus: "available",
    launchDate: "2023-04",
    colors: ["Black", "Grey", "Blue"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "standard", name: "Standard", priceLakh: 3.09, rangeKm: 211, batteryKwh: 7.1, topSpeedKmph: 155 },
      { id: "recon", name: "Recon", priceLakh: 4.24, rangeKm: 323, batteryKwh: 10.3, topSpeedKmph: 155 },
    ],
    highlights: ["27 kW motor with 90 Nm torque", "155 km/h top speed", "20-80% fast charge in about an hour"],
    description:
      "F77 was one of the first Indian electric motorcycles built purely around performance, offering sportbike ergonomics and genuine highway-capable speed.",
  },
  {
    id: "tw-ultraviolette-tesseract",
    slug: "ultraviolette-tesseract",
    category: "2-wheeler",
    oem: "ultraviolette",
    oemName: "Ultraviolette Automotive",
    modelName: "Tesseract",
    tagline: "Ultraviolette's move into performance scooters",
    twoWheelerType: "scooter",
    priceRangeLakh: [1.2, 1.45],
    rangeKm: 261,
    batteryCapacityKwh: 6.0,
    chargingTimeSlowHr: 5.5,
    topSpeedKmph: 100,
    launchStatus: "upcoming",
    launchDate: "2026-09 (Tentative)",
    colors: ["Black", "White", "Grey"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "tesseract", name: "Tesseract", priceLakh: 1.45, rangeKm: 261, batteryKwh: 6.0, topSpeedKmph: 100 },
    ],
    highlights: ["Ultraviolette's first electric scooter", "Introductory pricing for early customers", "Larger battery than most rival scooters"],
    description:
      "Tesseract extends Ultraviolette beyond motorcycles into the scooter segment, aiming to bring some of the F77's performance focus to a more mainstream body style.",
  },
  {
    id: "tw-revolt-rv400",
    slug: "revolt-rv400",
    category: "2-wheeler",
    oem: "revolt",
    oemName: "Revolt Motors",
    modelName: "RV400",
    tagline: "AI-connected electric motorcycle with simulated engine sound",
    twoWheelerType: "motorcycle",
    priceRangeLakh: [1.24, 1.24],
    rangeKm: 150,
    batteryCapacityKwh: 3.24,
    chargingTimeSlowHr: 4.5,
    topSpeedKmph: 85,
    launchStatus: "available",
    launchDate: "2019-08",
    colors: ["Cosmic Black", "Rebel Red", "Pacific Blue"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "rv400", name: "RV400", priceLakh: 1.24, rangeKm: 150, batteryKwh: 3.24, topSpeedKmph: 85 },
    ],
    highlights: ["Switchable simulated exhaust sounds", "Swappable battery support", "Connected app with geofencing"],
    description:
      "RV400 was one of India's earliest electric motorcycles to gain a following, known for its swappable battery and app-controlled engine-sound simulation.",
  },
  {
    id: "tw-revolt-rv1",
    slug: "revolt-rv1",
    category: "2-wheeler",
    oem: "revolt",
    oemName: "Revolt Motors",
    modelName: "RV1",
    tagline: "Revolt's more affordable commuter motorcycle",
    twoWheelerType: "motorcycle",
    priceRangeLakh: [0.9, 1.0],
    rangeKm: 160,
    batteryCapacityKwh: 3.24,
    chargingTimeSlowHr: 4.5,
    topSpeedKmph: 70,
    launchStatus: "available",
    launchDate: "2023-08",
    colors: ["Black", "White", "Red"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "rv1", name: "RV1", priceLakh: 0.9, rangeKm: 100, batteryKwh: 2.2, topSpeedKmph: 65 },
      { id: "rv1-plus", name: "RV1+", priceLakh: 1.0, rangeKm: 160, batteryKwh: 3.24, topSpeedKmph: 70 },
    ],
    highlights: ["India's first electric motorcycle aimed at the commuter segment", "Two battery sizes to choose from", "Reverse mode and fast charging support"],
    description:
      "RV1 brings Revolt's electric motorcycle platform down to commuter pricing, positioned as a cheaper alternative to the flagship RV400.",
  },
];
