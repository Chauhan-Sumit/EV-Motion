import { Vehicle } from "@/types/vehicle";

// No real gallery photos sourced yet — see VehicleImages doc comment in
// src/types/vehicle.ts. Populate with real ImageKit paths per vehicle once
// photography is prepared; VehicleGallery renders them automatically.
const gallery: string[] = [];

export const cars: Vehicle[] = [
  {
    id: "car-tata-nexon-ev",
    slug: "tata-nexon-ev",
    category: "car",
    oem: "tata",
    oemName: "Tata Motors",
    modelName: "Nexon EV",
    tagline: "India's best-selling electric SUV",
    bodyType: "suv",
    priceRangeLakh: [12.49, 17.19],
    rangeKm: 465,
    batteryCapacityKwh: 45,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 56,
    chargingTimeSlowHr: 8.5,
    topSpeedKmph: 150,
    accelerationSec0To100: 8.9,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2023-08",
    colors: ["Pristine White", "Intensi-Teal", "Flame Red", "Daytona Grey"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "creative-mr", name: "Creative MR", priceLakh: 12.49, rangeKm: 325, batteryKwh: 30, topSpeedKmph: 140, fastChargeTimeMin: 45 },
      { id: "fearless-lr", name: "Fearless LR", priceLakh: 15.49, rangeKm: 465, batteryKwh: 45, topSpeedKmph: 150, fastChargeTimeMin: 56 },
      { id: "empowered-lr", name: "Empowered+ LR", priceLakh: 17.19, rangeKm: 465, batteryKwh: 45, topSpeedKmph: 150, fastChargeTimeMin: 56 },
    ],
    highlights: ["465 km ARAI range", "Ventilated front seats", "Segment-first sunroof", "15kW DC fast charging"],
    description:
      "The Nexon EV is the model that put mass-market EVs on the map in India, pairing a spacious SUV body with a choice of two battery packs.",
    specs: {
      dimensions: { lengthMm: 3994, widthMm: 1811, heightMm: 1616, wheelbaseMm: 2498, groundClearanceMm: 190, bootSpaceLiters: 350, kerbWeightKg: 1437 },
      safety: { ncapRating: 5, ncapAgency: "Bharat NCAP", airbagsCount: 6, adas: true, abs: true, esc: true, isofix: true },
      warranty: { batteryYears: 8, batteryKm: 160000 },
      motor: { peakPowerKw: 106, peakTorqueNm: 215, driveLayout: "FWD", driveModes: ["Eco", "City", "Sport"], regenBraking: true },
      chargingExtra: { connectorType: "CCS2", v2v: true },
    },
  },
  {
    id: "car-tata-tiago-ev",
    slug: "tata-tiago-ev",
    category: "car",
    oem: "tata",
    oemName: "Tata Motors",
    modelName: "Tiago EV",
    tagline: "The most affordable electric hatchback",
    bodyType: "hatchback",
    priceRangeLakh: [7.99, 11.29],
    rangeKm: 315,
    batteryCapacityKwh: 24,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 58,
    chargingTimeSlowHr: 6.9,
    topSpeedKmph: 120,
    accelerationSec0To100: 12.5,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2022-09",
    colors: ["Tropical Mist", "Pristine White", "Midnight Plum"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "xe", name: "XE 24kWh", priceLakh: 7.99, rangeKm: 250, batteryKwh: 19.2, topSpeedKmph: 120 },
      { id: "xz-plus-lr", name: "XZ+ LR", priceLakh: 11.29, rangeKm: 315, batteryKwh: 24, topSpeedKmph: 120, fastChargeTimeMin: 58 },
    ],
    highlights: ["Lowest entry price of any EV in India", "315 km range on the LR pack", "Harman infotainment"],
    description:
      "Tiago EV brings electric mobility within reach of first-time car buyers, undercutting every other EV on price without skimping on range.",
    specs: {
      dimensions: { lengthMm: 3825, widthMm: 1684, heightMm: 1562, wheelbaseMm: 2400, groundClearanceMm: 165, bootSpaceLiters: 240 },
      motor: { peakPowerKw: 55, peakTorqueNm: 114, driveLayout: "FWD", regenBraking: true },
      chargingExtra: { connectorType: "CCS2" },
    },
  },
  {
    id: "car-tata-curvv-ev",
    slug: "tata-curvv-ev",
    category: "car",
    oem: "tata",
    oemName: "Tata Motors",
    modelName: "Curvv EV",
    tagline: "Coupe-styled SUV with flagship-grade tech",
    bodyType: "suv",
    priceRangeLakh: [14.99, 19.99],
    rangeKm: 502,
    batteryCapacityKwh: 45,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 55,
    chargingTimeSlowHr: 8.4,
    topSpeedKmph: 165,
    accelerationSec0To100: 8.6,
    seatingCapacity: 5,
    launchStatus: "just-launched",
    launchDate: "2026-05",
    colors: ["Pure Grey", "Empowered Oxide", "Victory Yellow"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "creative-45", name: "Creative 45", priceLakh: 14.99, rangeKm: 425, batteryKwh: 45, topSpeedKmph: 160 },
      { id: "accomplished-plus", name: "Accomplished+ 45", priceLakh: 19.99, rangeKm: 502, batteryKwh: 45, topSpeedKmph: 165, fastChargeTimeMin: 55 },
    ],
    highlights: ["502 km ARAI range", "Coupe SUV silhouette", "ADAS Level 2", "JBL sound system"],
    description:
      "Curvv EV moves Tata upmarket with a sleeker coupe-SUV design, longer range and a full suite of driver-assist features.",
    specs: {
      dimensions: { lengthMm: 4310, widthMm: 1810, heightMm: 1637, wheelbaseMm: 2560, groundClearanceMm: 186, bootSpaceLiters: 500 },
      safety: { ncapRating: 5, ncapAgency: "Bharat NCAP", airbagsCount: 6, adas: true, esc: true, hillHoldControl: true, camera360: true, tpms: true },
      warranty: { batteryYears: 8, batteryKm: 160000 },
      motor: { peakPowerKw: 123, peakTorqueNm: 215, driveLayout: "FWD", regenBraking: true },
      chargingExtra: { connectorType: "CCS2" },
    },
  },
  {
    id: "car-tata-punch-ev",
    slug: "tata-punch-ev",
    category: "car",
    oem: "tata",
    oemName: "Tata Motors",
    modelName: "Punch EV",
    tagline: "Tata's tallboy micro-SUV, reborn as a dedicated EV",
    bodyType: "suv",
    priceRangeLakh: [9.69, 12.79],
    rangeKm: 468,
    batteryCapacityKwh: 40,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 26,
    chargingTimeSlowHr: 5.3,
    topSpeedKmph: 150,
    accelerationSec0To100: 9.0,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2026-01",
    colors: ["Supernova Copper", "Pure Grey", "Bengal Rouge", "Pristine White"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "smart-30", name: "Smart 30", priceLakh: 9.69, rangeKm: 365, batteryKwh: 30, topSpeedKmph: 140 },
      { id: "empowered-plus-s-40", name: "Empowered+ S 40", priceLakh: 12.79, rangeKm: 468, batteryKwh: 40, topSpeedKmph: 150, fastChargeTimeMin: 26 },
    ],
    highlights: ["468 km ARAI range on the 40kWh pack", "Battery-as-a-Service purchase option", "Lifetime battery warranty on the 40kWh pack"],
    description:
      "Punch EV carries Tata's tallboy micro-SUV design onto a dedicated electric platform, offered with two battery sizes and a subscription-style ownership option.",
    specs: {
      dimensions: { lengthMm: 3880, widthMm: 1742, heightMm: 1622, wheelbaseMm: 2445, groundClearanceMm: 195, bootSpaceLiters: 366 },
      motor: { driveLayout: "FWD", regenBraking: true },
      chargingExtra: { connectorType: "CCS2" },
    },
  },
  {
    id: "car-tata-tigor-ev",
    slug: "tata-tigor-ev",
    category: "car",
    oem: "tata",
    oemName: "Tata Motors",
    modelName: "Tigor EV",
    tagline: "Compact electric sedan with proven Ziptron underpinnings",
    bodyType: "sedan",
    priceRangeLakh: [12.49, 13.75],
    rangeKm: 315,
    batteryCapacityKwh: 26,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 59,
    chargingTimeSlowHr: 9.4,
    topSpeedKmph: 120,
    accelerationSec0To100: 13.5,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2021-08",
    colors: ["Signature Teal Blue", "Magnetic Red", "Daytona Grey"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "xe", name: "XE", priceLakh: 12.49, rangeKm: 315, batteryKwh: 26, topSpeedKmph: 120 },
      { id: "xz-plus-lux", name: "XZ+ Lux", priceLakh: 13.75, rangeKm: 315, batteryKwh: 26, topSpeedKmph: 120, fastChargeTimeMin: 59 },
    ],
    highlights: ["One of the first EVs crash-tested by Global NCAP", "315 km ARAI range", "Sub-4-metre sedan footprint"],
    description:
      "Tigor EV pairs Tata's Ziptron powertrain with a compact sedan body, for buyers who want three-box practicality without stepping up to an SUV.",
    specs: {
      dimensions: { lengthMm: 3993, widthMm: 1677, heightMm: 1532, wheelbaseMm: 2450, groundClearanceMm: 172, bootSpaceLiters: 316 },
      safety: { airbagsCount: 2 },
      motor: { peakPowerKw: 55, peakTorqueNm: 170, driveLayout: "FWD", regenBraking: true },
      chargingExtra: { connectorType: "CCS2" },
    },
  },
  {
    id: "car-tata-harrier-ev",
    slug: "tata-harrier-ev",
    category: "car",
    oem: "tata",
    oemName: "Tata Motors",
    modelName: "Harrier EV",
    tagline: "Flagship electric SUV with optional all-wheel drive",
    bodyType: "suv",
    priceRangeLakh: [21.69, 29.19],
    rangeKm: 627,
    batteryCapacityKwh: 75,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 25,
    chargingTimeSlowHr: 11,
    topSpeedKmph: 180,
    accelerationSec0To100: 6.3,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2025-01",
    colors: ["Pure Grey", "Pristine White", "Nainital Nocturne", "Empowered Oxide", "Matte Stealth Black"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "adventure-65", name: "Adventure 65", priceLakh: 21.69, rangeKm: 538, batteryKwh: 65, topSpeedKmph: 180 },
      { id: "fearless-plus-75", name: "Fearless+ 75", priceLakh: 24.69, rangeKm: 627, batteryKwh: 75, topSpeedKmph: 180, fastChargeTimeMin: 25 },
      { id: "empowered-75-awd", name: "Empowered 75 AWD", priceLakh: 29.19, rangeKm: 622, batteryKwh: 75, topSpeedKmph: 180, fastChargeTimeMin: 25 },
    ],
    highlights: ["627 km ARAI range on the 75kWh RWD pack", "Optional all-wheel drive", "6.3s 0-100 km/h"],
    description:
      "Harrier EV tops Tata's mainstream electric range with two battery sizes and Tata's first electric AWD option, aimed at buyers cross-shopping premium SUVs.",
    // Sourced Aug 2026 from Autocar India + Wikipedia + Bharat NCAP reporting.
    // Deliberately absent: peak power/torque (Autocar's 313hp and the 390bhp
    // "Boost Mode" figure disagree, and RWD/AWD differ — no single honest
    // number); ground clearance (only the ICE Harrier's 205mm is published);
    // kerb weight (a 2235-2336kg variant range); battery warranty (lifetime
    // for the first owner, 10yr/200,000km from second registration — the
    // conditional scheme this schema can't represent); driveLayout (both RWD
    // and AWD are sold); batteryChemistry (LFP, but single-sourced).
    specs: {
      dimensions: { lengthMm: 4607, widthMm: 1922, heightMm: 1740, wheelbaseMm: 2741, bootSpaceLiters: 502 },
      // 5 stars on the EV itself — BNCAP tested Empowered 75 and Empowered 75
      // AWD, 32/32 adult and 45/49 child, applicable to all variants. Not an
      // ICE-Harrier rating carried across.
      safety: { ncapRating: 5, ncapAgency: "Bharat NCAP", airbagsCount: 7, adas: true, abs: true, esc: true, tpms: true, camera360: true },
      warranty: { vehicleYears: 3, vehicleKm: 125000, motorYears: 8, motorKm: 160000 },
      features: {
        touchscreenInches: 14.53,
        otaUpdates: true,
        connectedCarApp: true,
        ventilatedSeats: true,
        sunroofType: "panoramic",
        digitalCluster: true,
        premiumAudioBrand: "JBL",
      },
      chargingExtra: { v2l: true, v2v: true },
      motor: { regenBraking: true },
      tyres: { size: "245/55 R19" },
      suspension: { front: "Independent, MacPherson strut", rear: "Independent, multi-link" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-tata-sierra-ev",
    slug: "tata-sierra-ev",
    category: "car",
    oem: "tata",
    oemName: "Tata Motors",
    modelName: "Sierra EV",
    tagline: "Cult SUV nameplate revived as a ground-up EV",
    bodyType: "suv",
    priceRangeLakh: [18.79, 25.99],
    rangeKm: 665,
    batteryCapacityKwh: 75,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 25,
    chargingTimeSlowHr: 10.5,
    topSpeedKmph: 170,
    accelerationSec0To100: 5.8,
    seatingCapacity: 5,
    launchStatus: "just-launched",
    launchDate: "2026-06",
    colors: ["Rishikesh Rapids", "Nainital Nocturne", "Coorg Clouds", "Pure Grey", "Pristine White", "Andaman Adventure", "Bengal Rouge"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "pure-63", name: "Pure 63", priceLakh: 18.79, rangeKm: 535, batteryKwh: 63, topSpeedKmph: 165 },
      { id: "adventure-75", name: "Adventure 75", priceLakh: 22.19, rangeKm: 665, batteryKwh: 75, topSpeedKmph: 170, fastChargeTimeMin: 25 },
      { id: "empowered-a-75-qwd", name: "Empowered A 75 QWD", priceLakh: 25.99, rangeKm: 622, batteryKwh: 75, topSpeedKmph: 170, fastChargeTimeMin: 25 },
    ],
    highlights: ["665 km MIDC range", "5.8s 0-100 km/h in Boost Mode", "Optional Quad Wheel Drive (QWD)"],
    description:
      "Sierra EV revives Tata's cult SUV nameplate as a dedicated electric model, slotting between Curvv EV and Harrier EV with segment-leading acceleration.",
    // Sourced Aug 2026 from Autocar India's Sierra EV spec page (not the ICE
    // Sierra's) + ZigWheels' launch report.
    // NO NCAP RATING ON PURPOSE: the Sierra EV has not been crash-tested. The
    // widely-quoted 5-star Bharat NCAP result belongs to the petrol Sierra, and
    // several aggregators present it as the EV's own — the same trap that kept
    // a rating off the Tiago EV and Punch EV records.
    // Also absent: peak power/torque (306hp converts to no round kW and the
    // 504Nm figure is QWD-only, while RWD is standard); kerb weight (not
    // published); battery warranty (lifetime for first owner — conditional).
    specs: {
      dimensions: { lengthMm: 4340, widthMm: 1841, heightMm: 1750, wheelbaseMm: 2730, groundClearanceMm: 205, bootSpaceLiters: 622 },
      safety: { airbagsCount: 6, adas: true, abs: true, esc: true },
      features: { touchscreenInches: 12.3, digitalCluster: true, connectedCarApp: true, otaUpdates: true },
      chargingExtra: { v2l: true, v2v: true },
      motor: { motorType: "Permanent magnet synchronous", regenBraking: true },
      tyres: { size: "225/55 R19" },
      suspension: { front: "Independent, MacPherson strut", rear: "Independent, multi-link" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-mg-zs-ev",
    slug: "mg-zs-ev",
    category: "car",
    oem: "mg",
    oemName: "MG Motor",
    modelName: "ZS EV",
    tagline: "The SUV that started MG's EV journey in India",
    bodyType: "suv",
    priceRangeLakh: [18.98, 24.98],
    rangeKm: 461,
    batteryCapacityKwh: 50.3,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 60,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 175,
    accelerationSec0To100: 8.5,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2022-04",
    colors: ["Glaze Red", "Aurora Silver", "Starry Black"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "excite", name: "Excite", priceLakh: 18.98, rangeKm: 461, batteryKwh: 50.3, topSpeedKmph: 175 },
      { id: "exclusive", name: "Exclusive", priceLakh: 24.98, rangeKm: 461, batteryKwh: 50.3, topSpeedKmph: 175, fastChargeTimeMin: 60 },
    ],
    highlights: ["461 km range", "Panoramic sunroof", "360-degree camera"],
    description:
      "ZS EV remains one of the longest-serving electric SUVs in India, known for its comfortable ride and generous feature list.",
    // ncapRating is CORRECT and must not be 'corrected' away — this is one of
    // the two counter-cases to CLAUDE.md #28(a). Euro NCAP crash-tested the ZS
    // EV itself and gave it five stars where the petrol ZS scored three, so the
    // usual ICE-twin check must NOT fire here.
    // It has, however, LAPSED: the test was 2019 and Euro NCAP results run six
    // years, so it stopped being current on 1 January 2026. `ncapYear: 2019`
    // records that, and `src/lib/vehicle-safety.ts` presents it as expired and
    // keeps it out of the winner engine and the safety score. Before
    // 2026-08-21 this rendered as a plain "5 Stars (Euro NCAP)" — a lapsed
    // result being shown as a current one.
    specs: {
      dimensions: { lengthMm: 4323, widthMm: 1809, heightMm: 1649, wheelbaseMm: 2585, groundClearanceMm: 177, bootSpaceLiters: 448, kerbWeightKg: 1518 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2019, airbagsCount: 6, abs: true, esc: true, camera360: true },
      warranty: { vehicleYears: 3, batteryYears: 8, batteryKm: 150000 },
      motor: { peakPowerKw: 130, peakTorqueNm: 280, driveLayout: "FWD" },
    },
  },
  {
    id: "car-mg-comet-ev",
    slug: "mg-comet-ev",
    category: "car",
    oem: "mg",
    oemName: "MG Motor",
    modelName: "Comet EV",
    tagline: "Compact city runabout for two",
    bodyType: "hatchback",
    priceRangeLakh: [6.99, 9.98],
    rangeKm: 230,
    batteryCapacityKwh: 17.3,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 55,
    chargingTimeSlowHr: 7,
    topSpeedKmph: 100,
    accelerationSec0To100: 14.2,
    seatingCapacity: 4,
    launchStatus: "available",
    launchDate: "2023-05",
    colors: ["Candy White", "Starry Black", "Aurora Silver"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "pace", name: "Pace", priceLakh: 6.99, rangeKm: 230, batteryKwh: 17.3, topSpeedKmph: 100 },
      { id: "play", name: "Play", priceLakh: 9.98, rangeKm: 230, batteryKwh: 17.3, topSpeedKmph: 100 },
    ],
    highlights: ["Tiny turning radius", "Twin 10.25-inch screens", "Dual-tone interior themes"],
    description:
      "Comet EV is a quirky, compact micro-EV built for dense city driving, with just enough room for a small family's daily errands.",
    // Omitted: peakPowerKw — sources conflict on the UNIT, not the number.
    // ZigWheels prints "41.42 kW (42bhp)", which is self-contradictory (41.42 kW
    // is ~55hp); 41.42 is the PS figure, putting the real output near 30 kW. No
    // source states kW unambiguously, so it stays out. Also omitted: brakes
    // (ZigWheels claims rear disc, implausible on a microcar and uncorroborated),
    // batteryChemistry (LFP is widely reported but not OEM-stated), and ground
    // clearance / boot / kerb weight (not published).
    specs: {
      dimensions: { lengthMm: 2974, widthMm: 1505, heightMm: 1640, wheelbaseMm: 2010 },
      safety: { airbagsCount: 2 },
      motor: { peakTorqueNm: 110, driveLayout: "RWD", regenBraking: true },
      tyres: { size: "145/70 R12" },
    },
  },
  {
    id: "car-mg-windsor-ev",
    slug: "mg-windsor-ev",
    category: "car",
    oem: "mg",
    oemName: "MG Motor",
    modelName: "Windsor EV",
    tagline: "Crossover comfort with battery-as-a-service option",
    bodyType: "suv",
    priceRangeLakh: [13.49, 17.89],
    rangeKm: 449,
    batteryCapacityKwh: 52.9,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 50,
    chargingTimeSlowHr: 9.5,
    topSpeedKmph: 130,
    accelerationSec0To100: 9.6,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2026-04",
    colors: ["Glaze Red", "Starry Black", "Aurora Silver"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "essence", name: "Essence", priceLakh: 13.49, rangeKm: 332, batteryKwh: 38, topSpeedKmph: 130 },
      { id: "exclusive-ac", name: "Exclusive AC", priceLakh: 15.99, rangeKm: 332, batteryKwh: 38, topSpeedKmph: 130, fastChargeTimeMin: 50 },
      { id: "exclusive-pro", name: "Exclusive Pro", priceLakh: 17.89, rangeKm: 449, batteryKwh: 52.9, topSpeedKmph: 130, fastChargeTimeMin: 50 },
    ],
    highlights: ["Lounge-style reclining rear seats", "Battery subscription option", "449 km range on the Pro's 52.9kWh pack"],
    description:
      "Windsor EV positions itself as an affordable crossover with a flexible battery-ownership model, now also offered with a longer-range Pro pack for buyers who want to own the bigger battery outright.",
    specs: {
      dimensions: { lengthMm: 4295, widthMm: 2126, heightMm: 1677, wheelbaseMm: 2700, groundClearanceMm: 186, bootSpaceLiters: 579 },
      safety: { airbagsCount: 6, adas: true },
      warranty: { vehicleYears: 3, batteryYears: 8, batteryKm: 160000, motorYears: 8, motorKm: 160000 },
      motor: { peakPowerKw: 100, peakTorqueNm: 200, motorType: "Permanent Magnet Synchronous", driveLayout: "FWD" },
      chargingExtra: { connectorType: "CCS2" },
      tyres: { size: "215/55 R18" },
      suspension: { front: "MacPherson strut", rear: "Twist beam" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-mg-cyberster",
    slug: "mg-cyberster",
    category: "car",
    oem: "mg",
    oemName: "MG Motor",
    modelName: "Cyberster",
    tagline: "MG's halo electric roadster",
    bodyType: "sedan",
    priceRangeLakh: [82.5, 82.5],
    rangeKm: 580,
    batteryCapacityKwh: 77,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 40,
    chargingTimeSlowHr: 11,
    topSpeedKmph: 200,
    accelerationSec0To100: 3.2,
    seatingCapacity: 2,
    launchStatus: "available",
    launchDate: "2025-07",
    colors: ["Flare Red", "Andes Grey", "Modern Beige", "Nuclear Yellow", "Irises Cyan"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "standard", name: "Standard", priceLakh: 82.5, rangeKm: 580, batteryKwh: 77, topSpeedKmph: 200, fastChargeTimeMin: 40 },
    ],
    highlights: ["510hp dual-motor AWD", "3.2s 0-100 km/h", "Sold exclusively via MG Select showrooms"],
    description:
      "Cyberster is MG's low-volume electric roadster halo model, showcasing dual-motor performance in a two-seat convertible body.",
    // peakPowerKw 375 is safe: the quoted "503bhp" and "510PS" both convert to
    // 375.1 kW, so the underlying OEM figure is unambiguous. Staggered tyres are
    // recorded as one string since the schema has a single size field. Omitted:
    // ncapRating (not tested in India), ground clearance and kerb weight.
    specs: {
      dimensions: { lengthMm: 4535, widthMm: 1913, heightMm: 1329, wheelbaseMm: 2690, bootSpaceLiters: 250 },
      safety: { airbagsCount: 4 },
      motor: { peakPowerKw: 375, peakTorqueNm: 725, driveLayout: "AWD", regenBraking: true },
      tyres: { size: "245/45 R20 (front), 275/35 R20 (rear)" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-mg-m9",
    slug: "mg-m9",
    category: "car",
    oem: "mg",
    oemName: "MG Motor",
    modelName: "M9",
    tagline: "Chauffeur-focused electric luxury MPV",
    bodyType: "muv",
    priceRangeLakh: [79.95, 79.95],
    rangeKm: 548,
    batteryCapacityKwh: 90,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 90,
    chargingTimeSlowHr: 10,
    topSpeedKmph: 180,
    accelerationSec0To100: 9.5,
    seatingCapacity: 7,
    launchStatus: "available",
    launchDate: "2025-12",
    colors: ["Pearl Lustre White", "Metal Black", "Concrete Grey"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "standard", name: "Standard", priceLakh: 79.95, rangeKm: 548, batteryKwh: 90, topSpeedKmph: 180, fastChargeTimeMin: 90 },
    ],
    highlights: ["India's first all-electric luxury MPV from MG", "16-way power captain chairs with massage function", "548 km claimed range"],
    description:
      "M9 sits at the top of MG's India range as a chauffeur-focused electric MPV, aimed at business and premium family use.",
    // peakPowerKw 180 is corroborated two ways: ZigWheels' "242bhp" and Autocar's
    // "245hp" both convert to 180.x kW. Boot is the all-three-rows-up figure, so it
    // compares like-for-like with other 7-seaters. Omitted: ncapRating (not tested),
    // tyres, ground clearance, kerb weight.
    specs: {
      dimensions: { lengthMm: 5270, widthMm: 2000, heightMm: 1800, wheelbaseMm: 3200, bootSpaceLiters: 945 },
      safety: { airbagsCount: 7, adas: true, abs: true, esc: true, camera360: true },
      motor: { peakPowerKw: 180, peakTorqueNm: 350, driveLayout: "FWD", regenBraking: true },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-hyundai-kona-electric",
    slug: "hyundai-kona-electric",
    category: "car",
    oem: "hyundai",
    oemName: "Hyundai",
    modelName: "Kona Electric",
    tagline: "Hyundai's pioneering EV crossover",
    bodyType: "suv",
    priceRangeLakh: [23.84, 24.03],
    rangeKm: 452,
    batteryCapacityKwh: 39.2,
    // Hyundai/E-GMP published capacities are totals, a few % above usable.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 57,
    chargingTimeSlowHr: 6.1,
    topSpeedKmph: 167,
    accelerationSec0To100: 9.7,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2023-11",
    colors: ["Atlas White", "Abyss Black", "Pulse Red"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "premium", name: "Premium", priceLakh: 23.84, rangeKm: 452, batteryKwh: 39.2, topSpeedKmph: 167 },
      { id: "premium-dual-tone", name: "Premium Dual Tone", priceLakh: 24.03, rangeKm: 452, batteryKwh: 39.2, topSpeedKmph: 167, fastChargeTimeMin: 57 },
    ],
    highlights: ["452 km range", "Bose premium sound", "Vehicle-to-load support"],
    description:
      "Kona Electric brought Hyundai's global EV know-how to India, with a comfortable ride and strong efficiency figures.",
    // CORRECTED in Batch 7 sub-batch 4: this record previously credited the
    // 5-star result to Euro NCAP. Euro NCAP has never crash-tested the Kona
    // *Electric* — its 2017 5-star result is the petrol Kona's, which is
    // exactly the ICE-twin trap in CLAUDE.md #28(a), hit here for a fourth
    // time. ANCAP did test the Kona Electric itself, in 2019, and awarded 5
    // stars, so the rating stands but the agency is now recorded correctly.
    // (Unrelated: the second-generation Kona, petrol and electric alike, scored
    // 4 stars at Euro NCAP. This record is the first-generation India car.)
    // LAPSED as of 2026: ANCAP results also run six years, so the 2019 test
    // stopped being current on 1 January 2026. `ncapYear: 2019` records it and
    // `src/lib/vehicle-safety.ts` presents it as expired rather than as a
    // current rating. The agency correction above stands — it was the right
    // agency for a result that has since aged out, which is why the year
    // matters as much as the agency does.
    specs: {
      dimensions: { lengthMm: 4180, widthMm: 1800, heightMm: 1570, wheelbaseMm: 2600, bootSpaceLiters: 332 },
      safety: { ncapRating: 5, ncapAgency: "ANCAP", ncapYear: 2019 },
      warranty: { vehicleYears: 3, batteryYears: 8, batteryKm: 160000 },
      motor: { peakPowerKw: 100, peakTorqueNm: 395, motorType: "Permanent Magnet Synchronous Motor (PMSM)" },
      chargingExtra: { v2l: true },
    },
  },
  {
    id: "car-hyundai-creta-electric",
    slug: "hyundai-creta-electric",
    category: "car",
    oem: "hyundai",
    oemName: "Hyundai",
    modelName: "Creta Electric",
    tagline: "India's favourite SUV, now electric",
    bodyType: "suv",
    priceRangeLakh: [17.99, 21.99],
    rangeKm: 473,
    batteryCapacityKwh: 51.4,
    // Hyundai/E-GMP published capacities are totals.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 58,
    chargingTimeSlowHr: 8,
    topSpeedKmph: 170,
    accelerationSec0To100: 7.9,
    seatingCapacity: 5,
    launchStatus: "just-launched",
    launchDate: "2026-01",
    colors: ["Ocean Wave", "Atlas White", "Abyss Black"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "executive", name: "Executive", priceLakh: 17.99, rangeKm: 390, batteryKwh: 42, topSpeedKmph: 160 },
      { id: "excellence", name: "Excellence", priceLakh: 21.99, rangeKm: 473, batteryKwh: 51.4, topSpeedKmph: 170, fastChargeTimeMin: 58 },
    ],
    highlights: ["V2L and V2V charging", "ADAS Level 2", "473 km range on the bigger pack"],
    description:
      "Creta Electric brings Hyundai's best-selling nameplate into the EV era, aiming to convert loyal Creta buyers into EV owners.",
    // Mostly OEM-primary: dimensions, motor power, motor type, tyres, suspension
    // and brakes are from Hyundai India's own Creta Electric specification page.
    // Torque, boot space and the airbag count come from Autocar India/ZigWheels,
    // which Hyundai's page doesn't publish. Power is the 51.4kWh figure (126 kW /
    // 171 PS), matching this record's headline battery; the 42kWh pack is 99 kW.
    // No NCAP rating: no Bharat NCAP result for the Creta *Electric* was found,
    // and the petrol Creta's rating is not this car's.
    // No batteryChemistry: Hyundai publishes only "liquid cooled Lithium Ion",
    // which is a pack type, not the NMC/LFP-level chemistry this field means.
    specs: {
      dimensions: { lengthMm: 4340, widthMm: 1790, heightMm: 1655, wheelbaseMm: 2610, groundClearanceMm: 200, bootSpaceLiters: 433 },
      safety: { airbagsCount: 6, adas: true, abs: true, esc: true },
      features: { connectedCarApp: true, otaUpdates: true, digitalCluster: true },
      chargingExtra: { connectorType: "CCS2", v2l: true, v2v: true },
      motor: {
        motorType: "Interior permanent magnet synchronous (IPMSM)",
        peakPowerKw: 126,
        peakTorqueNm: 255,
        driveLayout: "FWD",
        regenBraking: true,
      },
      tyres: { size: "215/60 R17" },
      suspension: { front: "Independent, MacPherson strut", rear: "Coupled torsion beam axle" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-hyundai-ioniq-5",
    slug: "hyundai-ioniq-5",
    category: "car",
    oem: "hyundai",
    oemName: "Hyundai",
    modelName: "Ioniq 5",
    tagline: "Retro-futuristic flagship EV crossover",
    bodyType: "suv",
    priceRangeLakh: [46.05, 46.05],
    rangeKm: 631,
    batteryCapacityKwh: 72.6,
    // 72.6 stated as the total; usable is a few % lower.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 18,
    chargingTimeSlowHr: 10,
    topSpeedKmph: 185,
    accelerationSec0To100: 7.1,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2023-01",
    colors: ["Gravity Gold Matte", "Atlas White", "Abyss Black"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "awd", name: "AWD", priceLakh: 46.05, rangeKm: 631, batteryKwh: 72.6, topSpeedKmph: 185, fastChargeTimeMin: 18 },
    ],
    highlights: ["631 km range", "800V ultra-fast charging", "Vehicle-to-load powered picnics", "Flat floor lounge cabin"],
    description:
      "Built on Hyundai's dedicated E-GMP platform, Ioniq 5 pairs 800V ultra-fast charging with striking pixel-inspired design.",
    specs: {
      dimensions: { lengthMm: 4655, widthMm: 1890, heightMm: 1605, groundClearanceMm: 163, bootSpaceLiters: 527 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP" },
      warranty: { batteryYears: 8, batteryKm: 160000 },
      motor: { peakPowerKw: 160, peakTorqueNm: 350, driveLayout: "RWD", motorType: "Permanent Magnet Synchronous Motor (PMSM)" },
      chargingExtra: { v2l: true },
    },
  },
  {
    id: "car-hyundai-ioniq-6",
    slug: "hyundai-ioniq-6",
    category: "car",
    oem: "hyundai",
    oemName: "Hyundai",
    modelName: "Ioniq 6",
    tagline: "Aerodynamic electric streamliner sedan",
    bodyType: "sedan",
    priceRangeLakh: [55.7, 55.7],
    rangeKm: 614,
    batteryCapacityKwh: 77.4,
    // 77.4 total (E-GMP).
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 18,
    chargingTimeSlowHr: 10.5,
    topSpeedKmph: 185,
    // 7.4s, not the 5.1s this record carried until Batch 7 sub-batch 4: 5.1s is
    // the 239 kW Long Range AWD, and the only variant listed here is the 168 kW
    // Long Range RWD, which Hyundai quotes at 7.4s 0-100 km/h.
    accelerationSec0To100: 7.4,
    seatingCapacity: 5,
    // CORRECTED in the 2026-08-21 staleness sweep: was `available` with a
    // launchDate of "2026-03". The Ioniq 6 has NOT launched in India — every
    // source checked (Autocar, CarWale, CarDekho, ZigWheels, Team-BHP) lists it
    // as upcoming with an EXPECTED price, and they split between October and
    // November 2026, so the month is deliberately not asserted.
    // This also fixes the price silently: an `upcoming` record renders its
    // price through `toUpcomingItem` as "(est.)", which is what a figure for an
    // unlaunched car actually is. The 55.7 figure is left as-is because the
    // expected range quoted across sources is a wide ₹50-65 lakh and picking a
    // new point inside it would be inventing precision (CLAUDE.md #28(c)).
    launchStatus: "upcoming",
    launchDate: "2026 (Tentative)",
    colors: ["Atlas White", "Abyss Black", "Gravity Gold Matte"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "long-range-rwd", name: "Long Range RWD", priceLakh: 55.7, rangeKm: 614, batteryKwh: 77.4, topSpeedKmph: 185, fastChargeTimeMin: 18 },
    ],
    highlights: ["614 km range", "800V ultra-fast charging", "Streamliner aerodynamic design"],
    description:
      "Ioniq 6 brings Hyundai's E-GMP platform to a low-drag sedan body, prioritising range and efficiency over the Ioniq 5's crossover shape.",
    // Global/Korean-market specification for the 77.4 kWh Long Range RWD, the
    // single variant this record lists: the Ioniq 6 has not launched in India,
    // so no India-spec sheet exists. These are pre-facelift figures, matching
    // this record's 77.4 kWh pack rather than the later 84 kWh car.
    // Power reconciles across units — 168 kW is simultaneously the quoted
    // "225 bhp" and "228 PS" — so it is recorded rather than back-converted.
    // Width is the body width, excluding mirrors (the with-mirrors figure is
    // ~2073mm), the same convention every other record here uses.
    // ncapRating is safe: the Ioniq 6 is born-electric with no ICE twin, so the
    // 5-star Euro NCAP 2022 result (97% adult occupant) is this car's own.
    // Omitted: kerbWeightKg (quoted from ~1930 to 2095 kg across markets and
    // wheel sizes); connectorType (CCS2 in Europe/Korea, NACS in the US, and no
    // India spec exists to choose between them); airbagsCount (market/trim
    // dependent); warranty (India terms don't exist for an unlaunched car).
    specs: {
      dimensions: { lengthMm: 4855, widthMm: 1880, heightMm: 1495, wheelbaseMm: 2950, groundClearanceMm: 141, bootSpaceLiters: 401 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2022 },
      chargingExtra: { v2l: true },
      motor: {
        motorType: "Permanent Magnet Synchronous Motor (PMSM)",
        peakPowerKw: 168,
        peakTorqueNm: 350,
        driveLayout: "RWD",
        regenBraking: true,
      },
      tyres: { size: "225/55 R18" },
      suspension: { front: "Independent, MacPherson strut", rear: "Independent, multi-link" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-hyundai-ioniq-9",
    slug: "hyundai-ioniq-9",
    category: "car",
    oem: "hyundai",
    oemName: "Hyundai",
    modelName: "Ioniq 9",
    tagline: "Full-size three-row electric flagship",
    bodyType: "suv",
    priceRangeLakh: [120.0, 130.0],
    // CORRECTED in the 2026-08-21 staleness sweep. The headline used to
    // straddle three variants: 620 km is the Long Range RWD's figure (a variant
    // this record does not list) and 5.2s is the 320 kW Performance AWD's. Both
    // now describe the FIRST listed variant, Long Range AWD, which is what the
    // rest of the record and its `specs` block describe.
    // 606 km WLTP and 6.7s are agreed by EV Database, ArenaEV and EVKX.
    // Battery and top speed were already the Long Range AWD's and are unchanged.
    rangeKm: 606,
    batteryCapacityKwh: 110.3,
    // 110.3 gross / 106.0 usable — the pairing that opened this whole audit.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 24,
    chargingTimeSlowHr: 13,
    topSpeedKmph: 200,
    accelerationSec0To100: 6.7,
    seatingCapacity: 7,
    launchStatus: "upcoming",
    launchDate: "2026-08 (Tentative)",
    colors: ["Atlas White", "Abyss Black", "Vapor Blue", "Gravity Gold Matte"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "long-range-awd", name: "Long Range AWD", priceLakh: 120.0, rangeKm: 606, batteryKwh: 110.3, topSpeedKmph: 200, fastChargeTimeMin: 24 },
      { id: "performance-awd", name: "Performance AWD", priceLakh: 130.0, rangeKm: 590, batteryKwh: 110.3, topSpeedKmph: 200, fastChargeTimeMin: 24 },
    ],
    highlights: ["Three-row flagship with 6/7-seat layouts", "606 km WLTP range", "Level 2 ADAS suite"],
    description:
      "Ioniq 9 tops Hyundai's electric range as a full-size three-row SUV, bringing E-GMP's 800V architecture to a flagship family package.",
    // Global/Korean-market specification: the Ioniq 9 has not launched in India,
    // so no India-spec sheet exists. The figures below are what Hyundai
    // publishes for the markets it does sell in (Korea, US, Australia, EU).
    // Power is the Long Range AWD figure — 230 kW / 605 Nm — matching this
    // record's first variant. The headline straddle this comment used to
    // describe was FIXED in the 2026-08-21 staleness sweep; see the note above.
    // ** peakPowerKw 230 is deliberately NOT changed, and the reason is
    // CLAUDE.md #28(c). ** Sources split irreconcilably: EV Database and Green
    // Cars Compare say 226 kW, Wikipedia says 230 kW, and BOTH reconcile
    // internally (226 kW = 307 PS = 303 bhp; 230 kW = 313 PS = 308 bhp), which
    // is exactly what makes choosing between them unsafe — the same situation
    // as the Mercedes EQE's 300-vs-330 kW. ArenaEV prints "230 kW (303 hp)",
    // which reconciles to neither and is evidence the figure is muddled at
    // source rather than merely disputed. Torque (605 Nm) is agreed by all.
    // ncapRating is safe: the Ioniq 9 is born-electric with no ICE twin, so the
    // 5-star Euro NCAP 2025 result can only be this vehicle's own.
    // Omitted: bootSpaceLiters (828 / 620 / 1323 L are all quoted without
    // agreeing which is behind the 3rd row, the 2nd row, or seats folded);
    // tyres (255/50 R20 and 285/45 R21 are both factory fitments by trim, so a
    // single size would misdescribe it); kerbWeightKg (a 2505-2680 kg spread);
    // batteryChemistry (NCM is widely reported but not OEM-primary, and NMC is
    // exactly the value toVehicleDetail.ts used to fabricate — CLAUDE.md #22);
    // brakes (disc/disc is near-certain on a 2.5-tonne SUV but unsourced).
    specs: {
      dimensions: { lengthMm: 5060, widthMm: 1980, heightMm: 1790, wheelbaseMm: 3130, groundClearanceMm: 177 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2025, adas: true },
      chargingExtra: { v2l: true },
      motor: {
        motorType: "Permanent Magnet Synchronous Motor (PMSM)",
        peakPowerKw: 230,
        peakTorqueNm: 605,
        driveLayout: "AWD",
        regenBraking: true,
      },
      suspension: { front: "Independent, MacPherson strut", rear: "Independent, multi-link (5-link)" },
    },
  },
  {
    id: "car-mahindra-xuv400",
    slug: "mahindra-xuv400",
    category: "car",
    oem: "mahindra",
    oemName: "Mahindra",
    modelName: "XUV400",
    tagline: "Quick-accelerating electric SUV",
    bodyType: "suv",
    priceRangeLakh: [15.99, 19.49],
    rangeKm: 456,
    batteryCapacityKwh: 39.4,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 50,
    chargingTimeSlowHr: 6.5,
    topSpeedKmph: 150,
    accelerationSec0To100: 8.3,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2023-02",
    colors: ["Galaxy Grey", "Everest White", "Infinity Blue"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "ec-pro", name: "EC Pro", priceLakh: 15.99, rangeKm: 375, batteryKwh: 34.5, topSpeedKmph: 150 },
      { id: "el-pro-lr", name: "EL Pro LR", priceLakh: 19.49, rangeKm: 456, batteryKwh: 39.4, topSpeedKmph: 150, fastChargeTimeMin: 50 },
    ],
    highlights: ["8.3s 0-100 km/h", "456 km range", "Blue Sense connected app"],
    description:
      "XUV400 punches above its price with segment-leading acceleration, built on the tried-and-tested XUV300 body.",
    // Sourced Aug 2026 from ZigWheels/CarDekho/AckoDrive, cross-checked.
    // Power reconciles cleanly across three quoted units: 110 kW = 147.51 bhp =
    // 149.55 PS, which is why 110 is recorded rather than the "149.55 kW" one
    // aggregator prints - that is the PS figure in a kW field, not a 150 kW
    // motor. Torque 310 Nm is quoted consistently.
    // Wheelbase is 2600mm, the XUV300 platform's: one aggregator lists 2445mm,
    // which no other source supports.
    // Absent: boot space (sources split between 368 and 378 litres, so neither
    // is safe to publish); NCAP (no Bharat NCAP result for the XUV400 itself was
    // found - the XUV300's Global NCAP stars are a different car and a different
    // programme).
    specs: {
      dimensions: { lengthMm: 4200, widthMm: 1821, heightMm: 1634, wheelbaseMm: 2600, groundClearanceMm: 200, kerbWeightKg: 1578 },
      safety: { abs: true, esc: true },
      motor: { peakPowerKw: 110, peakTorqueNm: 310, driveLayout: "FWD", regenBraking: true },
      chargingExtra: { connectorType: "CCS2" },
    },
  },
  {
    id: "car-mahindra-be-6",
    slug: "mahindra-be-6",
    category: "car",
    oem: "mahindra",
    oemName: "Mahindra",
    modelName: "BE 6",
    tagline: "Born-electric coupe SUV on the INGLO platform",
    bodyType: "suv",
    priceRangeLakh: [18.9, 26.9],
    rangeKm: 682,
    batteryCapacityKwh: 79,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 20,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 200,
    accelerationSec0To100: 6.7,
    seatingCapacity: 5,
    launchStatus: "upcoming",
    launchDate: "2026-09 (Tentative)",
    colors: ["Everest White", "Tarini Blue", "Deep Forest"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "pack-3", name: "Pack Three", priceLakh: 18.9, rangeKm: 556, batteryKwh: 59, topSpeedKmph: 190 },
      { id: "pack-4", name: "Pack Four", priceLakh: 26.9, rangeKm: 682, batteryKwh: 79, topSpeedKmph: 200, fastChargeTimeMin: 20 },
    ],
    highlights: ["Dedicated INGLO skateboard platform", "682 km range flagship pack", "800V architecture"],
    description:
      "BE 6 is Mahindra's first ground-up electric model, promising sports-car-like performance in a bold coupe-SUV shape.",
    specs: {
      dimensions: { lengthMm: 4371, widthMm: 1907, heightMm: 1627, wheelbaseMm: 2775, groundClearanceMm: 207, bootSpaceLiters: 455, kerbWeightKg: 2070 },
      safety: { ncapRating: 5, ncapAgency: "Bharat NCAP", airbagsCount: 6, adas: true, camera360: true },
      // 210 kW, not 213: Mahindra's own launch press release states "up to
      // 210 kW" for the 79 kWh pack. 213 was a back-conversion of the quoted
      // 286 PS, and since BE 6 and XEV 9e share this exact powertrain, the 3 kW
      // artifact was enough to hand BE 6 a false Power crown over its sibling in
      // the winner engine. Corrected on both records together.
      motor: { peakPowerKw: 210, peakTorqueNm: 380, driveLayout: "RWD", regenBraking: true },
      chargingExtra: { connectorType: "CCS2" },
      batteryChemistry: "LFP",
    },
  },
  {
    id: "car-mahindra-xev-9e",
    slug: "mahindra-xev-9e",
    category: "car",
    oem: "mahindra",
    oemName: "Mahindra",
    modelName: "XEV 9e",
    tagline: "Born-electric coupe SUV, production sibling to the BE 6",
    bodyType: "suv",
    priceRangeLakh: [21.9, 30.5],
    rangeKm: 656,
    batteryCapacityKwh: 79,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 20,
    chargingTimeSlowHr: 11.7,
    topSpeedKmph: 202,
    accelerationSec0To100: 6.8,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2025-02",
    colors: ["Everest White", "Tarini Blue", "Deep Forest"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "pack-one", name: "Pack One", priceLakh: 21.9, rangeKm: 542, batteryKwh: 59, topSpeedKmph: 190 },
      { id: "pack-three", name: "Pack Three", priceLakh: 26.9, rangeKm: 656, batteryKwh: 79, topSpeedKmph: 202, fastChargeTimeMin: 20 },
      { id: "pack-three-above", name: "Pack Three Above", priceLakh: 30.5, rangeKm: 656, batteryKwh: 79, topSpeedKmph: 202, fastChargeTimeMin: 20 },
    ],
    highlights: ["Coupe-SUV silhouette on the INGLO platform", "656 km range on the 79kWh pack", "202 km/h top speed"],
    description:
      "XEV 9e is the production coupe-SUV sibling to the BE 6, aimed at buyers who want Mahindra's dedicated EV platform in a more premium, feature-loaded package.",
    // Sourced Aug 2026 from Mahindra's BE 6e/XEV 9e launch press release
    // (power, torque, LFP chemistry) + Autocar India's spec page (dimensions,
    // running gear). Power is the 79kWh figure, matching this record's headline
    // battery; torque is 380Nm on every variant, so it needs no such caveat.
    // NCAP is unambiguous here: the XEV 9e is born-electric with no petrol twin,
    // so a 5-star Bharat NCAP result can only be the EV's own.
    // Absent on purpose: battery warranty (Mahindra's "lifetime for the first
    // owner, 10 years if transferred" scheme doesn't reduce to one honest
    // number in this schema - same call as the BE 6 record); sunroofType (it is
    // a *fixed* glass roof, and none of "none"/"electric"/"panoramic" says that
    // truthfully); touchscreenInches (Autocar doesn't publish it).
    specs: {
      dimensions: { lengthMm: 4789, widthMm: 1907, heightMm: 1694, wheelbaseMm: 2775, groundClearanceMm: 218, bootSpaceLiters: 663 },
      safety: { ncapRating: 5, ncapAgency: "Bharat NCAP", airbagsCount: 7, adas: true, abs: true, esc: true, camera360: true },
      features: { digitalCluster: true, ventilatedSeats: true, connectedCarApp: true, otaUpdates: true, premiumAudioBrand: "Harman Kardon" },
      motor: {
        motorType: "Permanent magnet synchronous",
        peakPowerKw: 210,
        peakTorqueNm: 380,
        driveLayout: "RWD",
        regenBraking: true,
      },
      chargingExtra: { connectorType: "CCS2" },
      batteryChemistry: "LFP",
      tyres: { size: "245/55 R19" },
      suspension: { front: "Independent, MacPherson strut", rear: "Independent, multi-link" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-mahindra-xev-9s",
    slug: "mahindra-xev-9s",
    category: "car",
    oem: "mahindra",
    oemName: "Mahindra",
    modelName: "XEV 9S",
    tagline: "7-seat family SUV on the INGLO EV platform",
    bodyType: "suv",
    priceRangeLakh: [19.95, 29.45],
    rangeKm: 679,
    batteryCapacityKwh: 79,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 20,
    chargingTimeSlowHr: 11.7,
    topSpeedKmph: 202,
    accelerationSec0To100: 7.0,
    seatingCapacity: 7,
    launchStatus: "available",
    launchDate: "2025-05",
    colors: ["Everest White", "Tarini Blue", "Deep Forest"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "pack-one-above", name: "Pack One Above", priceLakh: 19.95, rangeKm: 521, batteryKwh: 59, topSpeedKmph: 190 },
      { id: "pack-two-above", name: "Pack Two Above", priceLakh: 24.45, rangeKm: 600, batteryKwh: 70, topSpeedKmph: 195 },
      { id: "pack-three-above", name: "Pack Three Above", priceLakh: 29.45, rangeKm: 679, batteryKwh: 79, topSpeedKmph: 202, fastChargeTimeMin: 20 },
    ],
    highlights: ["7-seat family SUV on the INGLO platform", "679 km range on the 79kWh pack", "Harman Kardon sound system"],
    description:
      "XEV 9S adapts Mahindra's dedicated EV platform into a practical 7-seat family SUV, sitting alongside the more style-focused XEV 9e.",
    // 282bhp converts to 210.3 kW — the same 210 kW / 380 Nm INGLO powertrain
    // already recorded for BE 6 and XEV 9e, which corroborates it rather than
    // relying on one source. airbagsCount is the top-variant figure (Mahindra
    // states "up to 7"; 6 on lower packs), matching how XEV 9e is recorded.
    // Omitted: ncapRating — Mahindra claims 5-star intent but the 9S has not been
    // crash-tested; the XEV 9e result is not transferable. Also boot and kerb.
    specs: {
      dimensions: { lengthMm: 4737, widthMm: 1900, heightMm: 1747, wheelbaseMm: 2762, groundClearanceMm: 201 },
      safety: { airbagsCount: 7, adas: true, abs: true, esc: true },
      motor: { peakPowerKw: 210, peakTorqueNm: 380, driveLayout: "RWD", regenBraking: true },
      chargingExtra: { connectorType: "CCS2" },
      batteryChemistry: "LFP",
    },
  },
  {
    id: "car-mahindra-xuv-3xo-ev",
    slug: "mahindra-xuv-3xo-ev",
    category: "car",
    oem: "mahindra",
    oemName: "Mahindra",
    modelName: "XUV 3XO EV",
    tagline: "Mahindra's most affordable electric SUV",
    bodyType: "suv",
    priceRangeLakh: [13.89, 14.96],
    rangeKm: 351,
    batteryCapacityKwh: 39.4,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 50,
    chargingTimeSlowHr: 6.5,
    topSpeedKmph: 150,
    accelerationSec0To100: 8.3,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2025-04",
    colors: ["Everest White", "Tango Red", "Stealth Black", "Nebula Blue", "Galaxy Grey", "Deep Forest"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "ax5", name: "AX5", priceLakh: 13.89, rangeKm: 351, batteryKwh: 39.4, topSpeedKmph: 150 },
      { id: "ax7l", name: "AX7L", priceLakh: 14.96, rangeKm: 351, batteryKwh: 39.4, topSpeedKmph: 150, fastChargeTimeMin: 50 },
    ],
    highlights: ["Sole 39.4kWh battery across the range", "8.3s 0-100 km/h", "Mahindra's most affordable EV"],
    description:
      "XUV 3XO EV brings Mahindra's electric powertrain to its compact SUV body, positioned as an accessible entry point below the XUV400.",
    // Omitted: lengthMm. Autocar prints 3900mm, but its width (1821) and wheelbase
    // (2600) match the petrol XUV 3XO exactly, and Indian sub-4m cars sit at
    // 3990-3995 to stay inside the tax bracket — so 3900 reads as a dropped digit.
    // One wrong dimension would silently decide a Compare winner, so it stays out
    // until corroborated. peakPowerKw 110 = 150 PS, the unit Mahindra's own launch
    // release uses. Omitted: ncapRating (not tested), kerb weight, chemistry.
    specs: {
      dimensions: { widthMm: 1821, heightMm: 1617, wheelbaseMm: 2600, groundClearanceMm: 190, bootSpaceLiters: 364 },
      safety: { airbagsCount: 6, adas: true, abs: true, esc: true, camera360: true },
      motor: { peakPowerKw: 110, peakTorqueNm: 310, driveLayout: "FWD", regenBraking: true },
      tyres: { size: "215/55 R17" },
      suspension: { front: "Independent, MacPherson strut", rear: "Non-independent, torsion beam" },
      brakes: { front: "disc", rear: "disc" },
      chargingExtra: { connectorType: "CCS2" },
    },
  },
  {
    id: "car-byd-atto-3",
    slug: "byd-atto-3",
    category: "car",
    oem: "byd",
    oemName: "BYD",
    modelName: "Atto 3",
    tagline: "Blade Battery compact electric SUV",
    bodyType: "suv",
    priceRangeLakh: [24.9, 27.6],
    rangeKm: 521,
    batteryCapacityKwh: 60.5,
    // 64.8 total / 60.48 usable — this record rounds the USABLE figure, and
    // it is the documented pair that settled the convention for the whole
    // brand on 2026-08-22: where a gross/usable pair exists for a BYD, the
    // number BYD publishes is the usable one. All five BYD records now carry
    // `usable`; see `byd-seal` for the full argument.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 50,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 160,
    accelerationSec0To100: 7.3,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2023-01",
    colors: ["Surf Blue", "Boulder Grey", "Parkour Red"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "dynamic", name: "Dynamic", priceLakh: 24.9, rangeKm: 521, batteryKwh: 60.5, topSpeedKmph: 160 },
      { id: "superior", name: "Superior", priceLakh: 27.6, rangeKm: 521, batteryKwh: 60.5, topSpeedKmph: 160, fastChargeTimeMin: 50 },
    ],
    highlights: ["Blade Battery fire-safety tech", "Quirky guitar-string door trim", "521 km range"],
    description:
      "Atto 3 was BYD's opening statement in India, showcasing its in-house Blade Battery technology in a quirky, feature-rich SUV.",
    specs: {
      dimensions: { lengthMm: 4455, widthMm: 1875, heightMm: 1615, wheelbaseMm: 2720, groundClearanceMm: 175, bootSpaceLiters: 440 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP" },
      warranty: { vehicleYears: 6, vehicleKm: 150000, batteryYears: 8, batteryKm: 150000, motorYears: 8, motorKm: 150000 },
      motor: { peakPowerKw: 150, peakTorqueNm: 310, driveLayout: "FWD" },
      batteryChemistry: "LFP Blade Battery",
    },
  },
  {
    id: "car-byd-seal",
    slug: "byd-seal",
    category: "car",
    oem: "byd",
    oemName: "BYD",
    modelName: "Seal",
    tagline: "Performance electric sedan",
    bodyType: "sedan",
    priceRangeLakh: [41.0, 53.0],
    rangeKm: 650,
    // 82.56 is BYD's own published figure (Seal spec sheet, byd.com) and is
    // what byd-sealion-7 already carried for the same Blade pack. This record
    // had it rounded to 82.5 — the same pack written two ways in one
    // catalogue. Corrected 2026-08-22.
    batteryCapacityKwh: 82.56,
    // BYD publishes USABLE capacity and never a gross figure: its own spec
    // sheet labels the row only "Battery capacity (kWh)", which is why this
    // record sat unresolved. Three things settle it. (1) The Atto 3's
    // documented 60.48-usable-of-64.8-total pair — 60.48 is the figure BYD
    // quotes. (2) EV Database labels this 82.5 "useable" and only ESTIMATES
    // the total at 84, i.e. no official gross exists to cite. (3) The Seal
    // sheet reconciles: capacity divided by (WLTP range x published
    // consumption) is ~87% across all three variants (61.44/70.84,
    // 82.56/94.62, 82.56/94.64), which is a usable figure plus charging loss;
    // a gross figure would imply ~19% charging losses. See
    // BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 26,
    chargingTimeSlowHr: 11,
    topSpeedKmph: 180,
    accelerationSec0To100: 3.8,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2024-03",
    colors: ["Arctic Blue", "Cosmos Black", "Aurora White"],
    images: {
      hero: "hero",
      gallery,
    },
    // CORRECTED 2026-08-22, and this was the worse half of the problem. All
    // three variants previously carried 82.5 kWh, and the Dynamic also carried
    // the Premium's 650 km — overstating the ENTRY car by 21 kWh and 140 km at
    // the cheapest price in the range, which is exactly the figure a budget
    // filter surfaces first. "Premium AWD" was a mislabel too: the Premium is
    // rear-wheel drive and the Performance is the AWD car.
    // BYD India's actual line-up: Dynamic (61.44 kWh / 510 km, RWD), Premium
    // (82.56 / 650, RWD), Performance (82.56 / 580, AWD).
    // Prices are the known-weak part and are NOT resolved here — sources split
    // at the decimal (Dynamic 41.0 vs 41.5, Performance 53.0 vs 53.65). The
    // duplicated 53.0 the Premium carried is gone, since 46.2 is what every
    // source agrees on for it, but all three belong to the standing price
    // audit (HANDOFF.md data-quality item 2), not to this pass.
    // `fastChargeTimeMin` stays on Performance alone: it is the 150 kW car,
    // and the Premium's 80 kW DC time is not reliably sourced for India.
    variants: [
      { id: "dynamic-rwd", name: "Dynamic RWD", priceLakh: 41.0, rangeKm: 510, batteryKwh: 61.44, topSpeedKmph: 180 },
      { id: "premium-rwd", name: "Premium RWD", priceLakh: 46.2, rangeKm: 650, batteryKwh: 82.56, topSpeedKmph: 180 },
      { id: "performance-awd", name: "Performance AWD", priceLakh: 53.0, rangeKm: 580, batteryKwh: 82.56, topSpeedKmph: 180, fastChargeTimeMin: 26 },
    ],
    highlights: ["3.8s 0-100 km/h on AWD", "CTB battery-as-structure design", "650 km range on RWD"],
    description:
      "Seal brings genuine sports-sedan performance to the EV segment, with an AWD variant that outruns most petrol performance cars.",
    // Sourced from Autocar India's Seal specification page.
    // Power is the 82.56 kWh Premium RWD's 230 kW, matching this record's
    // headline battery and 650 km range. Autocar prints it as "313 hp /
    // 230 kW", which is the round OEM figure rather than a back-conversion,
    // and the Sealion 7 carries the same motor.
    // NO peakTorqueNm: sources disagree irreconcilably — Autocar's own page
    // lists "370Nm" against the 390 kW Performance AWD while launch coverage
    // quotes 670 Nm for that variant, and neither states the Premium RWD's
    // figure outright. A 300 Nm spread is not a rounding artifact, so it is
    // omitted rather than picked between. CLAUDE.md #28(c).
    // ncapRating is safe: born-electric, no ICE twin, 5-star Euro NCAP 2023.
    // Omitted: warranty (see the Sealion 7 note). Boot space is the 400 L rear
    // compartment; the 50 L frunk is not part of what this field means
    // elsewhere in the dataset.
    specs: {
      dimensions: { lengthMm: 4800, widthMm: 1875, heightMm: 1460, wheelbaseMm: 2920, groundClearanceMm: 145, bootSpaceLiters: 400, kerbWeightKg: 2185 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2023, airbagsCount: 9 },
      motor: { peakPowerKw: 230, driveLayout: "RWD" },
      tyres: { size: "235/45 R19" },
      suspension: { front: "Independent, double wishbone", rear: "Independent, multi-link" },
      brakes: { front: "disc", rear: "disc" },
      batteryChemistry: "LFP Blade Battery",
    },
  },
  {
    id: "car-byd-e6",
    slug: "byd-e6",
    category: "car",
    oem: "byd",
    oemName: "BYD",
    modelName: "e6",
    tagline: "Spacious electric MPV",
    bodyType: "muv",
    priceRangeLakh: [29.6, 29.6],
    rangeKm: 415,
    batteryCapacityKwh: 71.7,
    // Usable — see `byd-seal`. BYD India's own launch material pairs this
    // 71.7 kWh Blade pack with the 415 km WLTP figure this record already
    // carries, so both sides of the record agree with the source.
    // Discontinued, but still served on its own page and in comparisons
    // naming it, so the basis matters here too.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 90,
    chargingTimeSlowHr: 11,
    topSpeedKmph: 130,
    accelerationSec0To100: 12.8,
    seatingCapacity: 5,
    // CORRECTED in the 2026-08-21 staleness sweep — see the note below the
    // description. `launchDate` stays as the India launch date; it records when
    // this car went on sale, not that it still is.
    launchStatus: "discontinued",
    launchDate: "2022-11",
    colors: ["Pearl White"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "standard", name: "Standard", priceLakh: 29.6, rangeKm: 415, batteryKwh: 71.7, topSpeedKmph: 130 },
    ],
    highlights: ["415 km range", "Fleet-friendly running costs", "Large boot and cabin space"],
    description:
      "e6 targets fleet and family buyers who need MPV-like space, originally positioned for cab and business use.",
    // The e6 is BYD India's fleet-oriented MPV and its specification is
    // unusually stable across sources: 70 kW / 180 Nm reconciles exactly
    // (70 kW = 95.2 PS = 93.9 bhp, and sources print "94 bhp").
    // No ncapRating: the e6 has no Euro NCAP, Bharat NCAP or ASEAN NCAP result.
    // Omitted: airbagsCount, tyres, suspension and brakes (not published);
    // warranty (see the Sealion 7 note).
    // ** RESOLVED in the 2026-08-21 staleness sweep: marked `discontinued`. **
    // The single-aggregator label this note used to hedge against is now
    // corroborated. CarWale states it outright — "BYD e6 has been discontinued
    // and the car is out of production", with the FAQ adding "BYD has stopped
    // the production of BYD e6" — and other sources date it to October 2024 and
    // give a last price of ₹29.15 lakh (this record carries ₹29.6L, left alone:
    // a discontinued car's last price is not a live price either way).
    // The record is kept, not deleted, and its pages keep working — see
    // src/lib/vehicle-availability.ts. BYD's own eMax 7, already in this
    // dataset, is the effective replacement in the same segment.
    specs: {
      dimensions: { lengthMm: 4695, widthMm: 1810, heightMm: 1670, wheelbaseMm: 2800, groundClearanceMm: 170, bootSpaceLiters: 580, kerbWeightKg: 1930 },
      motor: {
        motorType: "Permanent Magnet Synchronous Motor (PMSM)",
        peakPowerKw: 70,
        peakTorqueNm: 180,
        driveLayout: "FWD",
      },
      batteryChemistry: "LFP Blade Battery",
    },
  },
  {
    id: "car-byd-emax-7",
    slug: "byd-emax-7",
    category: "car",
    oem: "byd",
    oemName: "BYD",
    modelName: "eMAX 7",
    tagline: "Three-row family MPV with a choice of two battery packs",
    bodyType: "muv",
    priceRangeLakh: [26.9, 29.9],
    rangeKm: 530,
    batteryCapacityKwh: 71.8,
    // Usable — see `byd-seal` for the brand-level reasoning. The 55.4/71.8
    // variant split and its 420/530 km NEDC ranges match BYD India's own
    // Premium/Superior line-up, so no figure needed correcting here.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 37,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 180,
    accelerationSec0To100: 8.6,
    seatingCapacity: 7,
    launchStatus: "available",
    launchDate: "2024-04",
    colors: ["Quartz Blue", "Harbour Grey", "Crystal White", "Cosmos Black"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "premium-6-str", name: "Premium 6 STR", priceLakh: 26.9, rangeKm: 420, batteryKwh: 55.4, topSpeedKmph: 180 },
      { id: "superior-7-str", name: "Superior 7 STR", priceLakh: 29.9, rangeKm: 530, batteryKwh: 71.8, topSpeedKmph: 180, fastChargeTimeMin: 37 },
    ],
    highlights: ["Choice of 6- or 7-seat layouts", "530 km range on the larger pack", "580-litre boot space"],
    description:
      "eMAX 7 gives BYD a dedicated family MPV, pairing three-row practicality with a choice of two Blade Battery packs.",
    // Power is the 71.8 kWh Superior variant's 150 kW, matching this record's
    // headline battery and 530 km range; the 55.4 kWh Premium is 120 kW. It
    // reconciles cleanly across units — sources print both "201 bhp" and
    // "204 hp" for it, and 150 kW is 201.2 bhp / 204.0 PS.
    // No ncapRating: no Euro NCAP, Bharat NCAP or ASEAN NCAP result for the
    // eMAX 7 was found. It is a body-on-platform relative of BYD's Song Max
    // line, which makes any rating quoted near it worth distrusting.
    // Omitted: tyres, suspension and brakes (not published for the India car);
    // kerbWeightKg; warranty (see the Sealion 7 note).
    specs: {
      dimensions: { lengthMm: 4710, widthMm: 1810, heightMm: 1690, wheelbaseMm: 2800, groundClearanceMm: 170, bootSpaceLiters: 180 },
      safety: { airbagsCount: 6 },
      motor: {
        motorType: "Permanent Magnet Synchronous Motor (PMSM)",
        peakPowerKw: 150,
        peakTorqueNm: 310,
        driveLayout: "FWD",
      },
      batteryChemistry: "LFP Blade Battery",
    },
  },
  {
    id: "car-byd-sealion-7",
    slug: "byd-sealion-7",
    category: "car",
    oem: "byd",
    oemName: "BYD",
    modelName: "Sealion 7",
    tagline: "Performance-oriented electric SUV",
    bodyType: "suv",
    priceRangeLakh: [49.4, 55.9],
    rangeKm: 567,
    batteryCapacityKwh: 82.56,
    // Usable — BYD publishes no gross figure for any Blade pack. Full
    // reasoning on `byd-seal`, which carries the same pack; EV Database
    // labels this exact 82.5/82.56 figure "useable" and only estimates the
    // total at 84.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 32,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 215,
    accelerationSec0To100: 4.5,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2025-03",
    colors: ["Cosmos Black", "Aurora White", "Atlantis Gray", "Shark Gray"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "premium", name: "Premium", priceLakh: 49.4, rangeKm: 567, batteryKwh: 82.56, topSpeedKmph: 210 },
      { id: "performance", name: "Performance", priceLakh: 55.9, rangeKm: 562, batteryKwh: 82.56, topSpeedKmph: 215, fastChargeTimeMin: 32 },
    ],
    highlights: ["Dual-motor AWD Performance variant", "4.5s 0-100 km/h", "567 km range on the RWD Premium"],
    description:
      "Sealion 7 is BYD's driving-focused electric SUV, offering a rear-drive Premium and a quicker dual-motor Performance variant.",
    // Sourced from Autocar India's Sealion 7 specification page, cross-checked
    // against India launch coverage.
    // Power is the Premium RWD's 230 kW, matching this record's headline
    // 567 km range. Note what the sources actually print: "313hp" and "530hp"
    // are PS values (230 kW = 312.6 PS, 390 kW = 530.2 PS), and at least one
    // aggregator back-converts them into "233 kW" and "396 kW". Those are the
    // artifact, not the figure — CLAUDE.md #28(c), and the same mistake that
    // handed the BE 6 a false Power crown. The round OEM numbers are
    // corroborated by the Seal, which shares both motors and whose Autocar
    // page prints "313 hp / 230 kW" and "530 hp / 390 kW" explicitly.
    // ncapRating is safe: BYD builds no ICE version of this car, so the 5-star
    // Euro NCAP 2025 result can only be its own.
    // Omitted: kerbWeightKg (Autocar says 2340 kg, 91Wheels 2225 kg — a 115 kg
    // disagreement); warranty (BYD India's uniform terms are on the Atto 3
    // record but were not re-verified for this car).
    specs: {
      dimensions: { lengthMm: 4830, widthMm: 1925, heightMm: 1620, wheelbaseMm: 2930, groundClearanceMm: 170, bootSpaceLiters: 500 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2025, airbagsCount: 8 },
      motor: { peakPowerKw: 230, peakTorqueNm: 380, driveLayout: "RWD" },
      tyres: { size: "245/45 R20" },
      suspension: { front: "Independent, double wishbone", rear: "Independent, multi-link" },
      brakes: { front: "disc", rear: "disc" },
      batteryChemistry: "LFP Blade Battery",
    },
  },
  {
    id: "car-kia-ev6",
    slug: "kia-ev6",
    category: "car",
    oem: "kia",
    oemName: "Kia",
    modelName: "EV6",
    tagline: "Design-led electric crossover GT",
    bodyType: "suv",
    priceRangeLakh: [65.9, 65.9],
    rangeKm: 663,
    batteryCapacityKwh: 77.4,
    // 77.4 total (E-GMP).
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 18,
    chargingTimeSlowHr: 10,
    topSpeedKmph: 192,
    accelerationSec0To100: 5.2,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2022-06",
    colors: ["Runway Red", "Yacht Blue", "Snow White Pearl"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "gt-line", name: "GT Line AWD", priceLakh: 65.9, rangeKm: 663, batteryKwh: 77.4, topSpeedKmph: 192, fastChargeTimeMin: 18 },
    ],
    highlights: ["663 km range", "800V ultra-fast charging", "5.2s 0-100 km/h"],
    description:
      "EV6 wraps Hyundai-Kia's E-GMP platform in sharper, sportier styling, aimed at buyers who want an EV that also looks fast standing still.",
    specs: {
      dimensions: { lengthMm: 4695, widthMm: 1890, heightMm: 1570, wheelbaseMm: 2900, groundClearanceMm: 178, bootSpaceLiters: 520 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP" },
      warranty: { batteryYears: 8, batteryKm: 160000 },
      motor: { peakPowerKw: 239, peakTorqueNm: 604, driveLayout: "AWD", motorType: "Dual Motor AWD" },
    },
  },
  {
    id: "car-kia-ev9",
    slug: "kia-ev9",
    category: "car",
    oem: "kia",
    oemName: "Kia",
    modelName: "EV9",
    tagline: "Full-size 3-row electric flagship",
    bodyType: "suv",
    // Core fields corrected in Batch 7 sub-batch 5: this record described the
    // EV9 as upcoming at Rs 80-90 lakh with 7 seats. Kia launched it in India
    // in October 2024 at Rs 129.90 lakh, as a single fully-loaded GT-Line AWD
    // in a SIX-seat layout with second-row captain seats. 0-100 is the
    // GT-Line AWD's 5.3s, not the 6.0s previously carried.
    priceRangeLakh: [129.9, 129.9],
    rangeKm: 561,
    batteryCapacityKwh: 99.8,
    // 99.8 total (E-GMP).
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 24,
    chargingTimeSlowHr: 12,
    topSpeedKmph: 200,
    accelerationSec0To100: 5.3,
    seatingCapacity: 6,
    launchStatus: "available",
    launchDate: "2024-10",
    colors: ["Aurora Black", "Snow White Pearl", "Mineral Blue"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "gt-line-awd", name: "GT Line AWD", priceLakh: 129.9, rangeKm: 561, batteryKwh: 99.8, topSpeedKmph: 200, fastChargeTimeMin: 24 },
    ],
    highlights: ["6-seat flagship SUV with second-row captain seats", "561 km range", "Level 3 autonomous-ready hardware"],
    description:
      "EV9 is Kia's largest and most tech-laden EV yet, aimed squarely at premium 3-row SUV buyers looking to go electric.",
    // India-spec GT-Line AWD, the single variant Kia India sells.
    // Power reconciles across every unit it is quoted in: 283 kW appears as
    // "384 PS", "385 hp" and "380 bhp", and Autocar India's India-spec 282.6 kW
    // rounds to the same OEM figure.
    // ncapRating is safe: the EV9 is born-electric with no ICE twin, so the
    // 5-star Euro NCAP 2023 result (84% adult occupant) can only be this
    // vehicle's own.
    // Omitted: bootSpaceLiters (three-row SUV — sources quote behind-3rd-row
    // and behind-2nd-row figures without labelling which, the same problem as
    // the Ioniq 9); tyres and suspension (not published for the India car);
    // kerbWeightKg (2625 kg is the global GT-Line AWD, not an India figure);
    // groundClearanceMm (not published); regenBraking (not stated).
    specs: {
      dimensions: { lengthMm: 5015, widthMm: 1980, heightMm: 1780, wheelbaseMm: 3100 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2023, airbagsCount: 10, adas: true },
      chargingExtra: { v2l: true },
      motor: {
        motorType: "Permanent Magnet Synchronous Motor (PMSM)",
        peakPowerKw: 283,
        peakTorqueNm: 700,
        driveLayout: "AWD",
      },
    },
  },
  {
    id: "car-kia-carens-clavis-ev",
    slug: "kia-carens-clavis-ev",
    category: "car",
    oem: "kia",
    oemName: "Kia",
    modelName: "Carens Clavis EV",
    tagline: "Flexible 6/7-seat electric family MPV",
    bodyType: "muv",
    priceRangeLakh: [18.0, 25.0],
    rangeKm: 490,
    batteryCapacityKwh: 51.4,
    // 51.4 total (E-GMP).
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 39,
    chargingTimeSlowHr: 4.75,
    topSpeedKmph: 160,
    accelerationSec0To100: 8.4,
    seatingCapacity: 7,
    launchStatus: "available",
    launchDate: "2025-08",
    colors: ["Ivory Silver Matt", "Pewter Olive", "Imperial Blue", "Aurora Black Pearl", "Glacier White Pearl", "Gravity Gray"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "htk-plus", name: "HTK+", priceLakh: 18.0, rangeKm: 404, batteryKwh: 42, topSpeedKmph: 160 },
      { id: "x-line-er-6-seat", name: "X-Line ER 6-Seat", priceLakh: 25.0, rangeKm: 490, batteryKwh: 51.4, topSpeedKmph: 160, fastChargeTimeMin: 39 },
    ],
    highlights: ["490 km ARAI range on the Extended Range pack", "6- and 7-seat layouts", "Battery-as-a-Service option"],
    description:
      "Carens Clavis EV electrifies Kia's practical MPV, offering flexible 6- or 7-seat family layouts alongside two battery choices.",
    // OEM-primary: dimensions, safety kit, brakes and V2L are from Kia India's
    // own Carens Clavis EV specification page; motor, suspension and tyres from
    // Autocar India.
    // Power is the 51.4 kWh figure (126 kW / 171 PS), matching this record's
    // headline battery — the 42 kWh pack is 135 PS. Same shared Hyundai-Kia
    // unit as the Creta Electric and Syros EV.
    // NO NCAP RATING: Bharat NCAP has not tested the Carens Clavis EV. The
    // 3-star Global NCAP result that circulates near this car belongs to the
    // pre-facelift petrol Carens, which is neither this bodyshell nor this
    // powertrain — CLAUDE.md #28(a) again.
    // Omitted: bootSpaceLiters and groundClearanceMm (not published for the EV;
    // Kia states only a 25 L frunk); kerbWeightKg (1725 kg is quoted without
    // saying which battery pack); motorType (Autocar lists only "electric");
    // battery warranty (first-owner-only lifetime scheme, as above);
    // trim-gated features (BOSE audio, panoramic sunroof and ventilated seats
    // are real but only on higher trims, and VehicleFeatures has no trim axis).
    specs: {
      dimensions: { lengthMm: 4550, widthMm: 1800, heightMm: 1730, wheelbaseMm: 2780 },
      safety: { airbagsCount: 6, adas: true, abs: true, esc: true, hillHoldControl: true, camera360: true, tpms: true, isofix: true, parkingSensors: "both" },
      features: { connectedCarApp: true, otaUpdates: true, digitalCluster: true },
      chargingExtra: { v2l: true },
      motor: {
        peakPowerKw: 126,
        peakTorqueNm: 255,
        driveLayout: "FWD",
      },
      tyres: { size: "215/55 R17" },
      suspension: { front: "Independent, MacPherson strut", rear: "Coupled torsion beam axle" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-kia-syros-ev",
    slug: "kia-syros-ev",
    category: "car",
    oem: "kia",
    oemName: "Kia",
    modelName: "Syros EV",
    tagline: "Compact electric crossover for the city",
    bodyType: "suv",
    // Core fields corrected in Batch 7 sub-batch 5: this record described an
    // upcoming 45 kWh / 460 km Syros EV at Rs 16.5-20.5 lakh. No 45 kWh Syros
    // EV exists. Kia launched the car on 23 July 2026 from Rs 13.49 lakh with
    // two real packs — 42 kWh / 443 km and 51.4 kWh Extended Range / 526 km
    // (ARAI MIDC-Full) — DC fast charging 10-80% in 39 min and 11 kW AC in
    // 4h50m. Top speed and 0-100 are left as they were: Kia publishes neither.
    priceRangeLakh: [13.49, 20.0],
    rangeKm: 526,
    batteryCapacityKwh: 51.4,
    // 51.4 total (E-GMP).
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 39,
    chargingTimeSlowHr: 4.83,
    topSpeedKmph: 155,
    accelerationSec0To100: 8.8,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2026-07",
    colors: ["Pulse Red", "Snow White Pearl", "Aurora Black"],
    images: {
      hero: "hero",
      gallery,
    },
    variants: [
      { id: "htk", name: "HTK", priceLakh: 13.49, rangeKm: 443, batteryKwh: 42, topSpeedKmph: 155 },
      { id: "x-line-er", name: "X-Line ER", priceLakh: 20.0, rangeKm: 526, batteryKwh: 51.4, topSpeedKmph: 155, fastChargeTimeMin: 39 },
    ],
    highlights: ["Boxy, upright cabin space", "526 km ARAI range on the Extended Range pack", "Segment-first dual-pane sunroof"],
    description:
      "Syros EV takes Kia's boxy new crossover design language electric, aiming at buyers cross-shopping compact SUVs under 20 lakh.",
    // OEM-primary where possible: dimensions, boot space, brakes, airbags,
    // ADAS and V2L are from Kia India's own Syros EV pages; suspension, tyres,
    // ground clearance and torque from Autocar India, which publishes what
    // Kia's pages don't.
    // Power: Kia India states "171 PS" and Autocar India "171 hp" — both the
    // same 126 kW Hyundai-Kia unit the Creta Electric and Carens Clavis EV
    // carry, all three quoted at 171 PS / 255 Nm, which is what makes 126 safe
    // to record rather than back-converted. This is the 51.4 kWh Extended
    // Range figure, matching this record's headline pack; 42 kWh is 133 PS.
    // NO NCAP RATING, and this is the ICE-twin trap in its purest form: the
    // widely reported 5-star Bharat NCAP result — the first ever for a
    // made-in-India Kia — belongs to the petrol/diesel Syros. The Syros EV has
    // not been crash-tested. CLAUDE.md #28(a), fifth sighting.
    // Omitted: tyres (215/60 R16 and 215/55 R17 are both factory fitments by
    // trim, so one size would misdescribe it); kerbWeightKg (not published);
    // battery warranty (Kia's "Lifetime" cover is 15 years / unlimited km for
    // the FIRST OWNER only — VehicleWarranty's single-number fields cannot
    // express that without misrepresenting a second owner, see sub-batch 2);
    // regenBraking (not stated on either source page).
    specs: {
      dimensions: { lengthMm: 3995, widthMm: 1805, heightMm: 1670, wheelbaseMm: 2550, groundClearanceMm: 197, bootSpaceLiters: 390 },
      safety: { airbagsCount: 6, adas: true, esc: true, camera360: true },
      features: { connectedCarApp: true, otaUpdates: true },
      chargingExtra: { v2l: true },
      motor: {
        motorType: "Permanent Magnet Synchronous Motor (PMSM)",
        peakPowerKw: 126,
        peakTorqueNm: 255,
        driveLayout: "FWD",
      },
      suspension: { front: "Independent, MacPherson strut", rear: "Coupled torsion beam axle" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-bmw-ix1-lwb",
    slug: "bmw-ix1-lwb",
    category: "car",
    oem: "bmw",
    oemName: "BMW",
    modelName: "iX1 LWB",
    tagline: "BMW's entry-point electric SUV, stretched for India",
    bodyType: "suv",
    priceRangeLakh: [51.4, 51.4],
    rangeKm: 531,
    batteryCapacityKwh: 66.4,
    // 66.5 gross / 64.8 usable
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 32,
    chargingTimeSlowHr: 6.5,
    topSpeedKmph: 175,
    accelerationSec0To100: 8.34,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2025-03",
    colors: ["Mineral White Metallic", "Sparkling Copper Grey Metallic", "Skyscraper Grey Metallic", "Carbon Black Metallic", "Portimao Blue Metallic"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "edrive20l-m-sport", name: "eDrive 20L M Sport", priceLakh: 51.4, rangeKm: 531, batteryKwh: 66.4, topSpeedKmph: 175, fastChargeTimeMin: 32 },
    ],
    highlights: ["Long-wheelbase body built for India", "531 km range", "Single-variant, fully-loaded M Sport spec"],
    description:
      "iX1 LWB is BMW's most accessible EV in India, stretching the global iX1 for extra rear legroom without changing the electric platform underneath.",
    // The India car is the iX1 LWB — a long-wheelbase body built in India, and
    // that fact drives the most important omission here.
    // Power reconciles: 150 kW is the quoted "204 hp", which is the PS figure
    // (150 kW = 204.0 PS).
    // ** NO ncapRating, and this is a NEW SHAPE of CLAUDE.md #28(a). ** Euro
    // NCAP did test an iX1 — the standard-wheelbase xDrive30, in 2023, 5 stars
    // — and that is genuinely the EV rather than the petrol X1 tested in 2022,
    // so the usual ICE-twin check passes. It still cannot be used: this record
    // is the LWB, whose 2800mm wheelbase is 108mm longer than the 2692mm car
    // Euro NCAP crashed. A stretched bodyshell is a different structure, and
    // borrowing a crash result across it is the same error as borrowing one
    // from a petrol twin. The trap is not only "ICE vs EV" — it is "was THIS
    // structure tested".
    // Omitted: groundClearanceMm (published as 175mm laden / ~190mm unladen —
    // two conventions, and this dataset does not record which it uses);
    // kerbWeightKg, tyres and brakes (not published for the India car).
    specs: {
      dimensions: { lengthMm: 4616, widthMm: 1845, heightMm: 1627, wheelbaseMm: 2800, bootSpaceLiters: 490 },
      safety: { airbagsCount: 8 },
      motor: {
        motorType: "Permanently excited synchronous motor",
        peakPowerKw: 150,
        peakTorqueNm: 250,
        driveLayout: "FWD",
      },
      suspension: { front: "Independent, MacPherson strut", rear: "Independent, multi-link" },
    },
  },
  {
    id: "car-bmw-i4",
    slug: "bmw-i4",
    category: "car",
    oem: "bmw",
    oemName: "BMW",
    modelName: "i4",
    tagline: "Electric gran coupe with a choice of two battery packs",
    bodyType: "sedan",
    priceRangeLakh: [72.5, 77.5],
    rangeKm: 590,
    batteryCapacityKwh: 83.9,
    // 83.9 nominal / 81.3 usable. Note bmw-ix and bmw-i7 below record the
    // USABLE figure instead — BMW is split inside its own line-up, which is
    // why this field exists.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 30,
    chargingTimeSlowHr: 8.5,
    topSpeedKmph: 190,
    accelerationSec0To100: 5.7,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2022-10",
    colors: ["Mineral White", "Brooklyn Grey Metallic", "Black Sapphire", "Portimao Blue Metallic"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "edrive35-m-sport", name: "eDrive35 M Sport", priceLakh: 72.5, rangeKm: 483, batteryKwh: 70.2, topSpeedKmph: 190 },
      { id: "edrive40-m-sport", name: "eDrive40 M Sport", priceLakh: 77.5, rangeKm: 590, batteryKwh: 83.9, topSpeedKmph: 190, fastChargeTimeMin: 30 },
    ],
    highlights: ["590 km range on the eDrive40", "Gran coupe styling with a fastback silhouette", "5.7s 0-100 km/h"],
    description:
      "i4 brings BMW's electric powertrain to a sleek four-door coupe body, offered in two battery sizes for buyers who want range or a lower entry price.",
    // eDrive40, the RWD variant this record's 83.9 kWh / 590 km headline
    // describes. Power is a textbook reconciliation: 250 kW is simultaneously
    // the quoted "340 PS" and the quoted "335.25 bhp", two different sources
    // expressing one round OEM figure.
    // ** ncapRating is 4, NOT 5, and this is the most counter-intuitive entry
    // in the dataset. ** Euro NCAP tested the i4 itself in 2022 — both eDrive40
    // and M50 — and awarded FOUR stars, docked on safety-assist because it
    // carries the sensor set of the 2019 3 Series. Every instinct says a
    // premium German EV scores five; this one does not, and the 4 Series Gran
    // Coupe it is based on has never been tested, so there is no twin's rating
    // to have confused it with either. Sourced, not assumed.
    // Omitted: tyres (BMW offers 18/19/20-inch fitments AND staggered
    // front/rear sections — 245/45+255/45, 245/40+255/40, 245/35+255/35 — so no
    // single size describes the car); suspension (one vague source says
    // "front and rear multi-link", which conflicts with BMW's usual
    // double-wishbone front, and one vague source is not sourcing).
    specs: {
      dimensions: { lengthMm: 4783, widthMm: 1852, heightMm: 1448, wheelbaseMm: 2856, bootSpaceLiters: 470, kerbWeightKg: 2125 },
      safety: { ncapRating: 4, ncapAgency: "Euro NCAP", ncapYear: 2022, airbagsCount: 8 },
      motor: { peakPowerKw: 250, peakTorqueNm: 430, driveLayout: "RWD" },
    },
  },
  {
    id: "car-bmw-i5",
    slug: "bmw-i5",
    category: "car",
    oem: "bmw",
    oemName: "BMW",
    modelName: "i5",
    tagline: "Electric 5 Series, in high-performance M60 guise",
    bodyType: "sedan",
    priceRangeLakh: [120.0, 120.0],
    rangeKm: 516,
    batteryCapacityKwh: 83.9,
    // 83.9 as published by BMW India; usable 81.2. Some European sources
    // give the gross as 84.4 — a source discrepancy, not a convention one.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 30,
    chargingTimeSlowHr: 8.5,
    topSpeedKmph: 230,
    accelerationSec0To100: 3.8,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2024-02",
    colors: ["Mineral White Metallic", "Frozen Pure Grey Metallic", "Tanzanite Blue Metallic", "Black Sapphire", "Carbon Black Metallic", "Cape York Green Metallic", "Phytonic Blue Metallic"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "m60-xdrive", name: "M60 xDrive", priceLakh: 120.0, rangeKm: 516, batteryKwh: 83.9, topSpeedKmph: 230, fastChargeTimeMin: 30 },
    ],
    highlights: ["230 km/h top speed", "Dual-motor M Performance AWD", "516 km range"],
    description:
      "i5 electrifies BMW's mid-size executive sedan, launched in India in the range-topping M60 xDrive performance guise.",
    // India gets the i5 M60 xDrive only, which is what this record's 516 km and
    // Rs 120L describe. Power is 442 kW — the widely printed "601" is PS
    // (442 kW = 601.0 PS = 592.7 bhp).
    // ncapRating 5 is Euro NCAP's, earned by the i5 eDrive40. Recorded anyway
    // because eDrive40 and M60 are the same G60 bodyshell differing only in
    // motor count — contrast the iX1 below, where the India car is a DIFFERENT
    // shell from the one tested and the rating is therefore omitted. The line
    // is bodyshell, not badge.
    // Omitted: kerbWeightKg (published as "2.4 tonnes", an approximation);
    // bootSpaceLiters and tyres (not published for the India car).
    specs: {
      dimensions: { lengthMm: 5060, widthMm: 1900, heightMm: 1505, wheelbaseMm: 2995 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", airbagsCount: 6 },
      motor: { peakPowerKw: 442, peakTorqueNm: 820, driveLayout: "AWD" },
      suspension: { front: "Independent, double wishbone", rear: "Independent, multi-link with air springs" },
    },
  },
  {
    id: "car-bmw-ix",
    slug: "bmw-ix",
    category: "car",
    oem: "bmw",
    oemName: "BMW",
    modelName: "iX",
    tagline: "Flagship electric SUV with a twin-motor AWD layout",
    bodyType: "suv",
    priceRangeLakh: [140.0, 140.0],
    rangeKm: 635,
    batteryCapacityKwh: 105.2,
    // 111.5 gross / 105.2 usable — BMW India states both. This is the USABLE
    // figure, unlike bmw-i4/bmw-i5/bmw-ix1-lwb above.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 35,
    chargingTimeSlowHr: 5.5,
    topSpeedKmph: 200,
    accelerationSec0To100: 4.6,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2022-01",
    colors: ["Phytonic Blue", "Black Sapphire", "Oxide Grey", "Sophisto Grey", "Mineral White"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "xdrive50", name: "xDrive50", priceLakh: 140.0, rangeKm: 635, batteryKwh: 105.2, topSpeedKmph: 200, fastChargeTimeMin: 35 },
    ],
    highlights: ["635 km range", "523PS twin-motor AWD", "22kW home wallbox charging support"],
    description:
      "iX is BMW's dedicated-platform electric flagship SUV, sold in India as a fully-imported xDrive50 with a twin-battery pack.",
    // xDrive50. Power is 385 kW: sources print "523 hp", which is the PS figure
    // (385 kW = 523.4 PS = 516.4 bhp), so the round OEM number is recorded
    // rather than the back-conversion — CLAUDE.md #28(c).
    // ** The "635 km looks stale" flag was checked on 2026-08-21 and is a FALSE
    // FLAG. ** BMW India's own press release for the iX xDrive50 states "up to
    // 635 kilometres in the WLTP test cycle", along with 523 hp, 765 Nm, 4.6s
    // 0-100, 10-80% in 35 min on a 195 kW DC charger and 100% in about 5.5 hrs
    // on 22 kW AC — every one of which this record already matches. 635 stays.
    // ** Separate finding, deliberately NOT acted on: the battery. ** BMW India
    // publishes "111.5 kWh", and this record carries 105.2, because 111.5 is the
    // GROSS pack and 105.2 the NET usable (multiple sources confirm the pairing;
    // the buffer is ~5.2%). That is a units convention, not staleness — but it
    // may be the WRONG convention here, since records like the Ioniq 9 (110.3
    // gross / 106.0 usable) carry the gross figure. If so the iX is understated
    // against every car it is compared with, which is the same shape of problem
    // as the hub-vs-shaft torque conventions. Resolving it means auditing the
    // convention across the whole catalogue, not editing one record, so it is
    // recorded here and in HANDOFF.md rather than changed in a staleness sweep.
    // ncapRating is safe here in a way it is NOT for the rest of this brand:
    // the iX is born-electric on a bespoke platform with no ICE twin, so the
    // 5-star Euro NCAP 2021 result can only be its own.
    // NOTE for the staleness sweep: this record's headline claims 635 km while
    // Autocar India currently lists 504 km. Those are different cycles and
    // possibly different variants, so the core field is left alone.
    specs: {
      dimensions: { lengthMm: 4953, widthMm: 1967, heightMm: 1695, wheelbaseMm: 3000, bootSpaceLiters: 500, kerbWeightKg: 2440 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2021, airbagsCount: 6 },
      motor: { peakPowerKw: 385, peakTorqueNm: 765, driveLayout: "AWD" },
      tyres: { size: "275/50 R22" },
      suspension: { front: "Independent, double wishbone with air springs", rear: "Independent, 5-link" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-bmw-i7",
    slug: "bmw-i7",
    category: "car",
    oem: "bmw",
    oemName: "BMW",
    modelName: "i7",
    tagline: "All-electric 7 Series limousine",
    bodyType: "sedan",
    priceRangeLakh: [205.0, 258.0],
    rangeKm: 603,
    batteryCapacityKwh: 101.7,
    // 105.7 gross / 101.7 usable
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 34,
    chargingTimeSlowHr: 5.5,
    topSpeedKmph: 250,
    accelerationSec0To100: 4.7,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2022-12",
    colors: ["Alpine White", "Individual Tanzanite Blue", "Mineral White Metallic", "Oxide Grey Metallic", "Brooklyn Grey", "Carbon Black Metallic", "Aventurine Red Metallic", "Black Sapphire"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "edrive50-m-sport", name: "eDrive50 M Sport", priceLakh: 205.0, rangeKm: 603, batteryKwh: 101.7, topSpeedKmph: 240 },
      { id: "m70-xdrive", name: "M70 xDrive", priceLakh: 258.0, rangeKm: 560, batteryKwh: 101.7, topSpeedKmph: 250, fastChargeTimeMin: 34 },
    ],
    highlights: ["BMW's electric flagship limousine", "603 km range on the eDrive50", "250 km/h top speed on the M70"],
    description:
      "i7 tops BMW's electric range as a chauffeur-focused limousine, offered in a rear-drive eDrive50 and a performance M70 xDrive.",
    // xDrive60, the variant this record's 101.7 kWh usable pack describes.
    // Power reconciles on the round OEM number: BMW quotes 400 kW / 544 PS, and
    // "544" is the PS figure, not bhp (400 kW = 536.4 bhp).
    // NO ncapRating, and this is an honest absence rather than a trap: Euro
    // NCAP has never tested the i7, and has never tested the ICE 7 Series
    // either, so there is not even a twin's rating to be tempted by. Cars at
    // this price and volume routinely go untested.
    // Omitted: airbagsCount (BMW lists the airbags descriptively — steering
    // wheel, front side, front and rear head, driver central — without ever
    // stating a count, and counting them myself would be inventing a spec).
    specs: {
      dimensions: { lengthMm: 5391, widthMm: 1950, heightMm: 1544, wheelbaseMm: 3215, bootSpaceLiters: 500, kerbWeightKg: 2715 },
      motor: { peakPowerKw: 400, peakTorqueNm: 745, driveLayout: "AWD" },
      tyres: { size: "245/50 R19" },
      suspension: { front: "Independent, double wishbone with air springs", rear: "Independent, multi-link with air springs" },
    },
  },
  {
    id: "car-mercedes-benz-eqs",
    slug: "mercedes-benz-eqs",
    category: "car",
    oem: "mercedes-benz",
    oemName: "Mercedes-Benz",
    modelName: "EQS",
    tagline: "Flagship electric S-Class sedan",
    bodyType: "sedan",
    priceRangeLakh: [155.0, 155.0],
    rangeKm: 857,
    batteryCapacityKwh: 107.8,
    // 107.8 usable. Mercedes-Benz publishes usable capacity and does NOT
    // publish a gross figure for this pack, so there is no gross value to
    // switch to without inventing one.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 31,
    chargingTimeSlowHr: 10,
    topSpeedKmph: 210,
    accelerationSec0To100: 4.4,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2022-12",
    colors: ["High Tech Silver", "Diamond White Bright", "Graphite Grey", "Sodalite Blue", "Obsidian Black"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "580-4matic", name: "580 4MATIC", priceLakh: 155.0, rangeKm: 857, batteryKwh: 107.8, topSpeedKmph: 210, fastChargeTimeMin: 31 },
    ],
    highlights: ["857 km ARAI range — the highest of any EV on sale in India", "Dual-motor 4MATIC AWD", "Locally assembled in Pune"],
    description:
      "EQS carries Mercedes-Benz's electric ambitions into its flagship sedan segment, sold in India as a single fully-loaded 580 4MATIC.",
    // EQS 580 4MATIC, the variant this record's 107.8 kWh / 857 km headline
    // describes. 857 km is Mercedes India's own ARAI claim and is genuinely the
    // longest in this catalogue.
    // Power took a correction: Autocar India's India-launch piece prints
    // "385 kW / 885 Nm", and both figures are wrong. Three independent sources
    // agree on 400 kW — expressed as 400 kW, 544 PS and 536 hp, which
    // reconciles exactly — and on 858 Nm. The "885" looks like a transposition
    // of 858. Recorded as 400/858. A wrong number from an otherwise reliable
    // outlet is still a wrong number.
    // ncapRating is safe: the EQS is born-electric on the EVA2 platform with no
    // ICE twin, so the 5-star Euro NCAP 2021 result (96% adult occupant) can
    // only be its own.
    // Width 1926mm is the body figure, not the ~2125mm with-mirrors number.
    // Omitted: bootSpaceLiters, kerbWeightKg, tyres, suspension, brakes and
    // airbagsCount — not published for the India car.
    specs: {
      dimensions: { lengthMm: 5216, widthMm: 1926, heightMm: 1512, wheelbaseMm: 3210 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2021 },
      motor: { peakPowerKw: 400, peakTorqueNm: 858, driveLayout: "AWD" },
    },
  },
  {
    id: "car-mercedes-benz-g580",
    slug: "mercedes-benz-g580",
    category: "car",
    oem: "mercedes-benz",
    oemName: "Mercedes-Benz",
    modelName: "G 580 with EQ Technology",
    tagline: "The iconic G-Wagen, reengineered as a four-motor EV",
    bodyType: "suv",
    priceRangeLakh: [310.0, 310.0],
    rangeKm: 473,
    batteryCapacityKwh: 116,
    // 116 usable / 120 gross
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 32,
    chargingTimeSlowHr: 12.5,
    topSpeedKmph: 180,
    accelerationSec0To100: 5.0,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2025-01",
    colors: ["Obsidian Black", "Opalite White Bright", "Classic Grey", "Opalite White Magno", "South Seas Blue Magno"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "g580-eq", name: "G 580", priceLakh: 310.0, rangeKm: 473, batteryKwh: 116, topSpeedKmph: 180, fastChargeTimeMin: 32 },
    ],
    highlights: ["Four individually-controlled motors, one per wheel", "G-Steering tank-turn off-road mode", "587hp / 1,164Nm"],
    description:
      "G 580 with EQ Technology keeps the G-Class's boxy silhouette and off-road hardware while replacing the engine with four motors, one per wheel.",
    // G 580 with EQ Technology. 432 kW and 1164 Nm come from four individually
    // controlled wheel motors — the first Mercedes production car with
    // individual-wheel drive — so the torque figure is a system total, not a
    // single motor's.
    // ** NO ncapRating, and this one is the INVERSE of CLAUDE.md #28(a) rather
    // than an instance of it, which is why the reasoning is worth keeping. **
    // Euro NCAP's own G-Class assessment page explicitly lists "Electric - G580
    // with EQ Technology" among the variants its 2019 five-star result applies
    // to, LHD and RHD. So this is the rare case where an ICE twin's rating
    // legitimately covers the EV — the rating body did the extension work
    // itself, and refusing it would be over-applying the trap.
    // It nearly stayed omitted for a DIFFERENT reason: that rating EXPIRED on
    // 1 January 2026, six years after the 2019 diesel G350d crash under 2019
    // protocols, and the schema had no way to say so.
    // RESOLVED 2026-08-21: `ncapYear` now records the age, so the published
    // result is preserved as the historical fact it is instead of being thrown
    // away. `src/lib/vehicle-safety.ts` holds the six-year Euro NCAP/ANCAP
    // window; this result renders as "5 Stars (Euro NCAP, 2019 — rating
    // expired)" and is excluded from the Compare winner engine, the computed
    // safety score and the homepage banner's star row, so nothing presents it
    // as current.
    // Omitted: all dimensions, tyres, suspension, brakes, airbags — not sourced
    // for the India car.
    specs: {
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2019 },
      motor: { peakPowerKw: 432, peakTorqueNm: 1164, driveLayout: "AWD" },
    },
  },
  {
    id: "car-mercedes-benz-maybach-eqs-suv",
    slug: "mercedes-benz-maybach-eqs-suv",
    category: "car",
    oem: "mercedes-benz",
    oemName: "Mercedes-Benz",
    modelName: "Maybach EQS SUV",
    tagline: "Mercedes' first fully-electric Maybach",
    bodyType: "suv",
    priceRangeLakh: [225.0, 265.0],
    rangeKm: 611,
    batteryCapacityKwh: 122,
    // 122 gross / 118 usable, per Autocar India on the India car. NOT stale —
    // an earlier draft of the survey misread this against a European 125 gross.
    // Note the three Mercedes records above record USABLE instead: Mercedes
    // publishes usable capacity and never a gross figure, so this record is
    // the odd one out within its own brand.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 31,
    chargingTimeSlowHr: 10,
    topSpeedKmph: 210,
    accelerationSec0To100: 4.4,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2024-09",
    colors: ["Opalite White", "Alpine Grey"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "680-4-seat", name: "680 (4-Seat)", priceLakh: 225.0, rangeKm: 611, batteryKwh: 122, topSpeedKmph: 210, fastChargeTimeMin: 31 },
      { id: "680-5-seat", name: "680 (5-Seat)", priceLakh: 265.0, rangeKm: 611, batteryKwh: 122, topSpeedKmph: 210, fastChargeTimeMin: 31 },
    ],
    highlights: ["First-ever electric Maybach", "56-inch MBUX Hyperscreen", "649hp / 950Nm"],
    description:
      "Maybach EQS SUV is Mercedes' most opulent electric offering, built on the EQS SUV platform with Maybach-specific chauffeur-focused comfort.",
    // Maybach EQS 680 SUV. Power reconciles cleanly: 484 kW is the quoted
    // "658 PS", and 955 Nm is stated unambiguously.
    // NO ncapRating. Five-star Euro NCAP results circulate near this car and
    // belong to OTHER vehicles: the EQE SUV (2023) and the EQS saloon (2021).
    // No verified Euro NCAP result for the EQS SUV itself was found, and the
    // Maybach is a further trim on top of that. Two shells removed from a real
    // result is not a rating.
    // Omitted: all dimensions (not published for the India car in any source
    // checked); tyres, suspension, brakes, airbags.
    specs: {
      motor: { peakPowerKw: 484, peakTorqueNm: 955, driveLayout: "AWD" },
    },
  },
  {
    id: "car-mercedes-benz-eqe",
    slug: "mercedes-benz-eqe",
    category: "car",
    oem: "mercedes-benz",
    oemName: "Mercedes-Benz",
    modelName: "EQE",
    tagline: "Mid-size electric executive sedan",
    bodyType: "sedan",
    priceRangeLakh: [120.0, 120.0],
    rangeKm: 479,
    batteryCapacityKwh: 90.6,
    // 90.6 usable; Mercedes publishes usable only.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 32,
    chargingTimeSlowHr: 10,
    topSpeedKmph: 210,
    accelerationSec0To100: 6.4,
    seatingCapacity: 5,
    launchStatus: "upcoming",
    launchDate: "2026-12 (Tentative)",
    colors: ["High Tech Silver", "Diamond White Bright", "Graphite Grey", "Obsidian Black"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "350-plus", name: "350+", priceLakh: 120.0, rangeKm: 479, batteryKwh: 90.6, topSpeedKmph: 210, fastChargeTimeMin: 32 },
    ],
    highlights: ["Positioned below the EQS as Mercedes' mid-size electric sedan", "479 km expected range", "800V-capable DC fast charging"],
    description:
      "EQE slots beneath the EQS as Mercedes-Benz's mid-size electric executive sedan, expected to bring flagship EQ technology at a lower entry price.",
    // EQE SALOON. Guarding against the obvious confusion first: Mercedes sells
    // an EQE saloon AND an EQE SUV, and aggregator pages for "EQE" freely serve
    // SUV figures. The SUV is 4863mm long on a 3030mm wheelbase with a 520L
    // boot; the saloon below is 4964mm on 3120mm with 430L. None of the SUV's
    // numbers are in this record.
    // ncapRating is safe: the EQE is born-electric on the EVA2 platform with no
    // ICE twin, and Euro NCAP tested the saloon itself in 2022.
    // NO widthMm: the published 1961mm is a MAXIMUM width including mirrors.
    // This dataset records body width (CLAUDE.md #28(b)) and no body figure was
    // sourced, so it is omitted rather than mixed in — a mirror-inflated width
    // silently crowns a false winner in Compare.
    // NO motor: sources split irreconcilably between 300 kW (402 bhp) and
    // 330 kW (449 PS) for the EQE 500 4MATIC, most likely because Mercedes
    // revised the output mid-life. Both are internally consistent, which is
    // exactly what makes picking one unsafe. CLAUDE.md #28(c).
    specs: {
      dimensions: { lengthMm: 4964, heightMm: 1510, wheelbaseMm: 3120, bootSpaceLiters: 430 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2022 },
    },
  },
  {
    id: "car-audi-q8-e-tron",
    slug: "audi-q8-e-tron",
    category: "car",
    oem: "audi",
    oemName: "Audi",
    modelName: "Q8 e-tron",
    tagline: "Audi's full-size electric SUV, in SUV and Sportback body styles",
    bodyType: "suv",
    priceRangeLakh: [115.0, 127.0],
    rangeKm: 600,
    batteryCapacityKwh: 114,
    // 114 gross / 106 usable (audi.com)
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 31,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 200,
    accelerationSec0To100: 5.6,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2023-09",
    colors: ["Manhattan Gray Metallic", "Glacier White Metallic", "Mythos Black Metallic", "Plasma Blue Metallic", "Terra Grey Metallic", "Chronos Gray Metallic"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "50-quattro", name: "50 Quattro", priceLakh: 115.0, rangeKm: 491, batteryKwh: 95, topSpeedKmph: 200 },
      { id: "55-quattro", name: "55 Quattro", priceLakh: 127.0, rangeKm: 600, batteryKwh: 114, topSpeedKmph: 200, fastChargeTimeMin: 31 },
    ],
    highlights: ["600 km range on the 55 Quattro", "Quattro AWD standard across the range", "22kW AC charger included"],
    description:
      "Q8 e-tron is Audi's full-size electric SUV, offered in two battery sizes with Quattro all-wheel drive standard on every variant.",
    // 55 quattro, matching this record's 114 kWh headline. Power is 300 kW,
    // quoted as "408 hp" which is the PS figure (300 kW = 407.9 PS), with
    // 664 Nm.
    // ncapRating passes every attribution check: Euro NCAP tested this car
    // itself — as the Audi e-tron, in 2019, five stars at 91% adult occupant —
    // and carried the entry over when Audi renamed it the Q8 e-tron. It is
    // born-electric with no ICE twin.
    // It failed on AGE alone: the result EXPIRED at the start of 2026, six years
    // after the test, and was omitted entirely because the schema could not say
    // so. RESOLVED 2026-08-21 — `ncapYear` records it, and
    // `src/lib/vehicle-safety.ts` marks it expired everywhere it is shown while
    // keeping it out of every score. Third of the three records that failed on
    // age rather than attribution (with the G 580 and EX40); all three are
    // restored on the same basis.
    // Omitted: bootSpaceLiters, tyres, suspension, brakes, airbags — not
    // published for the India car.
    specs: {
      dimensions: { lengthMm: 4901, widthMm: 1935, heightMm: 1616, wheelbaseMm: 2928, kerbWeightKg: 2560 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2019 },
      motor: { peakPowerKw: 300, peakTorqueNm: 664, driveLayout: "AWD" },
    },
  },
  {
    id: "car-audi-e-tron-gt",
    slug: "audi-e-tron-gt",
    category: "car",
    oem: "audi",
    oemName: "Audi",
    modelName: "e-tron GT",
    tagline: "Electric grand tourer, up to RS performance spec",
    bodyType: "sedan",
    priceRangeLakh: [172.0, 195.0],
    rangeKm: 519,
    batteryCapacityKwh: 93.4,
    // 93.4 gross / 84 net
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 23,
    chargingTimeSlowHr: 9.3,
    topSpeedKmph: 250,
    accelerationSec0To100: 2.8,
    seatingCapacity: 5,
    // CORRECTED in the 2026-08-21 staleness sweep: was `available`.
    // ZigWheels carries an explicit "Discontinued Model since 3 May 2026"
    // banner with a last price of ₹195.29 lakh, and CarDekho independently
    // marks it discontinued in May 2026. Autocar India corroborates from the
    // other direction: the e-tron GT facelift (S / RS / RS Performance,
    // 680-925 hp) is listed as an UPCOMING India launch, so the car this record
    // describes is the outgoing one.
    // ⚠️ CarWale dissents and still shows it as on sale — but lists the
    // facelift's variant names (S, RS) against this car's old ₹1.72-1.95 Cr
    // prices, which reads as a page mid-update rather than a contradiction.
    // Three sources to one, and the dissenter is internally inconsistent.
    // `launchDate` stays: it records when this car went on sale.
    launchStatus: "discontinued",
    launchDate: "2021-12",
    colors: ["Mythos Black Metallic", "Tactics Green Metallic", "Floret Silver Metallic", "Kemora Gray Metallic", "Tango Red Metallic", "Ascari Blue Metallic", "Daytona Grey Pearl Effect", "Suzuka Grey Metallic", "Ibis White Solid"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "e-tron-gt", name: "e-tron GT", priceLakh: 172.0, rangeKm: 519, batteryKwh: 93.4, topSpeedKmph: 245 },
      { id: "rs-e-tron-gt", name: "RS e-tron GT", priceLakh: 195.0, rangeKm: 500, batteryKwh: 93.4, topSpeedKmph: 250, fastChargeTimeMin: 23 },
    ],
    highlights: ["2.8s 0-100 km/h on the RS", "270kW ultra-fast DC charging", "500+ km range"],
    description:
      "e-tron GT is Audi's electric grand tourer, sharing its underpinnings with the Porsche Taycan and topping out in a track-focused RS variant.",
    // ** NO ncapRating, and this is a FOURTH distinct shape of the attribution
    // trap — not an ICE twin, not a different bodyshell, but a platform sibling
    // from a DIFFERENT MANUFACTURER. ** Euro NCAP has never tested the e-tron
    // GT. The five-star result quoted alongside it belongs to the Porsche
    // Taycan, with which it shares the J1 platform. Sharing a platform with a
    // rated car is not a rating; if it were, half this catalogue could claim
    // its siblings' results.
    // NO peakPowerKw either. The quoted "522.99 bhp" is a conversion of 390 kW
    // (390 x 1.341 = 523.0), and 390 kW is the e-tron GT quattro's OVERBOOST
    // output, not its 350 kW nominal. Two legitimate numbers for one car
    // depending on which the record's variant is quoting, so neither is
    // recorded. Torque is quoted unambiguously and is.
    // NOTE for the staleness sweep: sources say Audi India discontinued the
    // e-tron GT in May 2026, while this record says launchStatus "available".
    // Eighth such flag; core field left alone.
    specs: {
      motor: { peakTorqueNm: 630, driveLayout: "AWD" },
    },
  },
  {
    id: "car-volvo-ex30",
    slug: "volvo-ex30",
    category: "car",
    oem: "volvo",
    oemName: "Volvo",
    modelName: "EX30",
    tagline: "Volvo's smallest, most affordable electric SUV",
    bodyType: "suv",
    priceRangeLakh: [41.0, 41.0],
    rangeKm: 480,
    batteryCapacityKwh: 69,
    // 69 gross / 65 usable
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 28,
    chargingTimeSlowHr: 7,
    topSpeedKmph: 180,
    accelerationSec0To100: 5.3,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2024-08",
    colors: ["Cloud Blue", "Crystal White", "Onyx Black", "Sand Dune", "Vapour Grey"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "single-motor", name: "Single Motor", priceLakh: 41.0, rangeKm: 480, batteryKwh: 69, topSpeedKmph: 180, fastChargeTimeMin: 28 },
    ],
    highlights: ["Entry point to Volvo's electric range", "480 km claimed range", "Compact footprint for city driving"],
    description:
      "EX30 is Volvo's smallest and most affordable EV, bringing the brand's safety-first approach to the compact SUV segment.",
    // Single Motor Extended Range: 200 kW, quoted as "272 hp" which is the PS
    // figure (200 kW = 272.0 PS), and 343 Nm.
    // ncapRating is clean on every axis for once: the EX30 is born-electric
    // with no ICE twin, Euro NCAP crash-tested the car itself, and the 2024
    // result (88% adult occupant) is current rather than expired. Worth noting
    // as the baseline case that the EX40 and G 580 fail against.
    // bootSpaceLiters is the 318 L seats-up figure; 904 L is seats-folded.
    specs: {
      dimensions: { lengthMm: 4233, widthMm: 1837, heightMm: 1549, wheelbaseMm: 2650, groundClearanceMm: 171, bootSpaceLiters: 318, kerbWeightKg: 1850 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2024, airbagsCount: 9 },
      motor: { peakPowerKw: 200, peakTorqueNm: 343, driveLayout: "RWD" },
      tyres: { size: "245/45 R19" },
      suspension: { front: "Independent, MacPherson strut", rear: "Independent, multi-link" },
      brakes: { front: "disc", rear: "disc" },
    },
  },
  {
    id: "car-volvo-ex40",
    slug: "volvo-ex40",
    category: "car",
    oem: "volvo",
    oemName: "Volvo",
    modelName: "EX40",
    tagline: "Compact luxury electric SUV, formerly the XC40 Recharge",
    bodyType: "suv",
    priceRangeLakh: [49.0, 60.2],
    rangeKm: 470,
    batteryCapacityKwh: 78,
    // 78 gross / 75 usable
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 34,
    chargingTimeSlowHr: 7,
    topSpeedKmph: 180,
    accelerationSec0To100: 7.3,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2022-09",
    colors: ["Crystal White", "Cloud Blue", "Silver Dawn", "Vapor Grey", "Bright Dusk", "Fjord Blue", "Onyx Black", "Sage Green"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "plus", name: "Plus", priceLakh: 49.0, rangeKm: 450, batteryKwh: 69, topSpeedKmph: 180 },
      { id: "ultimate", name: "Ultimate", priceLakh: 60.2, rangeKm: 470, batteryKwh: 78, topSpeedKmph: 180, fastChargeTimeMin: 34 },
    ],
    highlights: ["Renamed from XC40 Recharge", "470 km range on the Ultimate", "250kW DC fast charging"],
    description:
      "EX40 continues Volvo's original compact electric SUV under a new name, offered in Plus and longer-range Ultimate trims.",
    // EX40 is the renamed XC40 Recharge. Power is the Twin Motor AWD's 300 kW
    // (quoted "408 PS") with 660 Nm, matching this record's 470 km headline —
    // the Single Motor Extended Range is 175 kW and goes ~565 km.
    // ** ncapRating here is the same pairing as the Mercedes G 580 in sub-batch
    // 11. ** Euro NCAP never crash-tested the electric XC40; it ran additional
    // checks and EXTENDED the 2018 petrol XC40's five-star result onto the
    // Recharge — a legitimate extension by the rating body, not an ICE-twin
    // mix-up. But a 2018 result EXPIRED at the start of 2025, and with no way to
    // say that, the rating was omitted outright.
    // RESOLVED 2026-08-21: recorded with `ncapYear: 2018` and presented as
    // expired (see `src/lib/vehicle-safety.ts`). The EX40/EC40 contrast is
    // unchanged and still the clearest case in the dataset — the EC40 below was
    // crash-tested directly in 2022 and its rating is CURRENT, so
    // /compare/volvo-ex40-vs-volvo-ec40 now reads "5 Stars (Euro NCAP, 2018 —
    // rating expired)" against "5 Stars (Euro NCAP, 2022)", and only the EC40
    // can win the safety metric.
    // Omitted: dimensions (published for the EC40 but not separately for the
    // taller EX40 body, and a coupe-roof sibling's height is not this car's);
    // kerbWeightKg, tyres, suspension, brakes, airbags.
    specs: {
      dimensions: { bootSpaceLiters: 460 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2018 },
      motor: { peakPowerKw: 300, peakTorqueNm: 660, driveLayout: "AWD" },
    },
  },
  {
    id: "car-volvo-ec40",
    slug: "volvo-ec40",
    category: "car",
    oem: "volvo",
    oemName: "Volvo",
    modelName: "EC40",
    tagline: "Coupe-styled electric SUV, formerly the C40 Recharge",
    bodyType: "suv",
    priceRangeLakh: [59.0, 59.0],
    rangeKm: 530,
    batteryCapacityKwh: 78,
    // 78 gross / 75 usable
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 27,
    chargingTimeSlowHr: 7.5,
    topSpeedKmph: 180,
    accelerationSec0To100: 4.7,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2023-04",
    colors: ["Crystal White", "Onyx Black", "Fjord Blue", "Sage Green", "Fusion Red", "Cloud Blue"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "e80", name: "E80", priceLakh: 59.0, rangeKm: 530, batteryKwh: 78, topSpeedKmph: 180, fastChargeTimeMin: 27 },
    ],
    highlights: ["Coupe-SUV roofline", "Dual-motor AWD, 405hp", "530 km range"],
    description:
      "EC40 gives Volvo's compact electric platform a sleeker coupe-SUV roofline, sold as a single fully-loaded dual-motor variant.",
    // EC40 is the renamed C40 Recharge, Twin Motor AWD — 300 kW, quoted around
    // "405bhp" (300 kW = 407.9 PS = 402.3 bhp), and 660 Nm stated outright.
    // ncapRating IS recorded here, and the contrast with the EX40 above is the
    // point: the C40 has NO petrol version, so Euro NCAP crash-tested the car
    // itself in 2022 rather than extending a rating onto it. That test is also
    // still current — 2022 results run to 2028. Same brand, same platform
    // family, opposite outcome, entirely because of what was tested and when.
    // bootSpaceLiters is the 404 L rear compartment; the 31 L frunk is not what
    // this field means elsewhere in the dataset.
    specs: {
      dimensions: { lengthMm: 4440, widthMm: 1873, heightMm: 1591, wheelbaseMm: 2702, bootSpaceLiters: 404 },
      safety: { ncapRating: 5, ncapAgency: "Euro NCAP", ncapYear: 2022 },
      motor: { peakPowerKw: 300, peakTorqueNm: 660, driveLayout: "AWD" },
    },
  },
  {
    id: "car-mini-countryman-electric",
    slug: "mini-countryman-electric",
    category: "car",
    oem: "mini",
    oemName: "MINI",
    modelName: "Countryman Electric",
    tagline: "MINI's largest model, in fully-electric form",
    bodyType: "suv",
    priceRangeLakh: [54.9, 67.4],
    rangeKm: 462,
    batteryCapacityKwh: 66.45,
    // 66.45 total (BMW-group convention).
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 29,
    chargingTimeSlowHr: 3.75,
    topSpeedKmph: 180,
    accelerationSec0To100: 8.6,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2024-07",
    colors: ["Smokey Green", "Slate Blue", "Chilli Red II", "British Racing Green", "Blazing Blue", "Midnight Black"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "e", name: "E", priceLakh: 54.9, rangeKm: 462, batteryKwh: 66.45, topSpeedKmph: 180 },
      { id: "se-all4", name: "SE ALL4", priceLakh: 67.4, rangeKm: 433, batteryKwh: 66.45, topSpeedKmph: 180, fastChargeTimeMin: 29 },
    ],
    highlights: ["MINI's largest and most practical EV", "462 km range", "130kW DC fast charging"],
    description:
      "Countryman Electric scales MINI's go-kart character up to a family-sized SUV, sold in India as a fully-imported model.",
  },
  {
    id: "car-mini-cooper-se",
    slug: "mini-cooper-se",
    category: "car",
    oem: "mini",
    oemName: "MINI",
    modelName: "Cooper SE",
    tagline: "MINI's classic 3-door hatch, now fully electric",
    bodyType: "hatchback",
    priceRangeLakh: [53.5, 55.0],
    rangeKm: 270,
    batteryCapacityKwh: 32.6,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 36,
    chargingTimeSlowHr: 2.5,
    topSpeedKmph: 150,
    accelerationSec0To100: 7.3,
    seatingCapacity: 4,
    launchStatus: "available",
    launchDate: "2023-12",
    colors: ["British Racing Green IV Metallic", "Midnight Black Metallic", "Island Blue Metallic", "Nanuq White", "Melting Silver III"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "3-door", name: "3-Door", priceLakh: 53.5, rangeKm: 270, batteryKwh: 32.6, topSpeedKmph: 150 },
      { id: "charged-edition", name: "Charged Edition", priceLakh: 55.0, rangeKm: 270, batteryKwh: 32.6, topSpeedKmph: 150, fastChargeTimeMin: 36 },
    ],
    highlights: ["Classic 3-door MINI hatchback silhouette", "184PS motor", "Fastest-charging entry point to MINI's EV range"],
    description:
      "Cooper SE keeps MINI's smallest, most iconic hatchback shape while swapping the petrol engine for a single electric motor.",
  },
  {
    id: "car-porsche-taycan",
    slug: "porsche-taycan",
    category: "car",
    oem: "porsche",
    oemName: "Porsche",
    modelName: "Taycan",
    tagline: "Porsche's electric sports sedan, up to Turbo spec",
    bodyType: "sedan",
    priceRangeLakh: [170.0, 270.0],
    rangeKm: 705,
    batteryCapacityKwh: 105,
    // 105 gross / 97 usable
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 18,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 260,
    accelerationSec0To100: 2.8,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2020-12",
    colors: ["Crayon", "Shade Green Metallic", "Frozen Blue Metallic", "Neptune Blue", "Carmine Red", "Volcano Grey Metallic", "Jet Black Metallic"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "taycan", name: "Taycan", priceLakh: 170.0, rangeKm: 705, batteryKwh: 89, topSpeedKmph: 230 },
      { id: "taycan-4s", name: "Taycan 4S", priceLakh: 196.0, rangeKm: 640, batteryKwh: 105, topSpeedKmph: 250, fastChargeTimeMin: 18 },
      { id: "taycan-turbo", name: "Taycan Turbo", priceLakh: 270.0, rangeKm: 600, batteryKwh: 105, topSpeedKmph: 260, fastChargeTimeMin: 18 },
    ],
    highlights: ["800V architecture, 320kW DC charging", "705 km range on the base RWD", "Up to 260 km/h top speed on Turbo"],
    description:
      "Taycan brought genuine sports-sedan dynamics to the EV world, offered in India across rear-drive, 4S and range-topping Turbo AWD variants.",
  },
  {
    id: "car-porsche-macan-electric",
    slug: "porsche-macan-electric",
    category: "car",
    oem: "porsche",
    oemName: "Porsche",
    modelName: "Macan Electric",
    tagline: "Porsche's compact electric SUV, up to Turbo spec",
    bodyType: "suv",
    priceRangeLakh: [121.0, 121.0],
    rangeKm: 641,
    batteryCapacityKwh: 100,
    // 100 gross / 95 usable
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 21,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 260,
    accelerationSec0To100: 3.3,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2024-09",
    colors: ["Slate Grey Neo", "Crayon", "Jet Black Metallic", "Carmine Red"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "macan", name: "Macan", priceLakh: 121.0, rangeKm: 641, batteryKwh: 100, topSpeedKmph: 220 },
      { id: "macan-4s", name: "Macan 4S", priceLakh: 145.0, rangeKm: 606, batteryKwh: 100, topSpeedKmph: 240, fastChargeTimeMin: 21 },
      { id: "macan-turbo", name: "Macan Turbo", priceLakh: 170.0, rangeKm: 591, batteryKwh: 100, topSpeedKmph: 260, fastChargeTimeMin: 21 },
    ],
    highlights: ["641 km range on the base RWD", "270kW DC fast charging, 10-80% in 21 min", "Up to 639PS on the Turbo"],
    description:
      "Macan Electric replaces Porsche's best-selling petrol SUV with a dedicated-platform EV, spanning a rear-drive base model to a 639PS Turbo.",
  },
  {
    id: "car-lotus-eletre",
    slug: "lotus-eletre",
    category: "car",
    oem: "lotus",
    oemName: "Lotus",
    modelName: "Eletre",
    tagline: "Lotus's first electric SUV, up to 900+ hp",
    bodyType: "suv",
    priceRangeLakh: [255.0, 299.0],
    rangeKm: 600,
    batteryCapacityKwh: 112,
    // 112 total / 107 usable
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 20,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 265,
    accelerationSec0To100: 4.5,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2023-11",
    colors: ["Galloway Green", "Stellar Black", "Kaimu Grey", "Blossom Grey", "Solar Yellow"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "eletre", name: "Eletre", priceLakh: 255.0, rangeKm: 600, batteryKwh: 112, topSpeedKmph: 265 },
      { id: "eletre-r", name: "Eletre R", priceLakh: 299.0, rangeKm: 490, batteryKwh: 112, topSpeedKmph: 265, fastChargeTimeMin: 20 },
    ],
    highlights: ["Lotus's first-ever SUV and first EV", "Up to 900+ hp on the Eletre R", "265 km/h top speed"],
    description:
      "Eletre marks Lotus's entry into both SUVs and electric power at once, pairing hyper-car performance with SUV practicality.",
  },
  {
    id: "car-lotus-emeya",
    slug: "lotus-emeya",
    category: "car",
    oem: "lotus",
    oemName: "Lotus",
    modelName: "Emeya",
    tagline: "Lotus's electric four-door hyper-GT",
    bodyType: "sedan",
    priceRangeLakh: [234.0, 234.0],
    rangeKm: 610,
    batteryCapacityKwh: 102,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 14,
    chargingTimeSlowHr: 5.5,
    topSpeedKmph: 256,
    accelerationSec0To100: 2.8,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2024-11",
    colors: ["Boreal Grey", "Fireglow Orange", "Akoya White", "Solar Yellow", "Stellar Black", "Kaimu Grey"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "emeya", name: "Emeya", priceLakh: 234.0, rangeKm: 610, batteryKwh: 102, topSpeedKmph: 250 },
    ],
    highlights: ["14-minute 10-80% DC fast charge", "Up to 905hp on the range-topping R", "610 km range"],
    description:
      "Emeya is Lotus's electric four-door hyper-GT, sharing its EPA (Electric Premium Architecture) platform with the Eletre SUV.",
  },
  {
    id: "car-rolls-royce-spectre",
    slug: "rolls-royce-spectre",
    category: "car",
    oem: "rolls-royce",
    oemName: "Rolls-Royce",
    modelName: "Spectre",
    tagline: "Rolls-Royce's first fully-electric model",
    bodyType: "sedan",
    priceRangeLakh: [750.0, 950.0],
    rangeKm: 530,
    batteryCapacityKwh: 102,
    // 105.7 gross / 102 usable — the same BMW-group pack as bmw-i7, and
    // recorded on the same basis.
    batteryMeasuredAt: "usable",
    chargingTimeFastMin: 34,
    chargingTimeSlowHr: 9,
    topSpeedKmph: 250,
    accelerationSec0To100: 4.5,
    seatingCapacity: 4,
    launchStatus: "available",
    launchDate: "2024-01",
    colors: ["English White", "Arctic White", "Tempest Grey", "Jubilee Silver", "Anthracite", "Salamanca Blue", "Midnight Sapphire", "Black Diamond"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "spectre", name: "Spectre", priceLakh: 750.0, rangeKm: 530, batteryKwh: 102, topSpeedKmph: 250 },
      { id: "spectre-black-badge", name: "Spectre Black Badge", priceLakh: 950.0, rangeKm: 510, batteryKwh: 102, topSpeedKmph: 250, fastChargeTimeMin: 34 },
    ],
    highlights: ["Rolls-Royce's first-ever fully-electric car", "Silent, torque-fluid two-door coupe drive", "Extensive Bespoke customisation"],
    description:
      "Spectre marks Rolls-Royce's move to electric power for the first time, retaining the marque's two-door coupe silhouette and self-drive-focused character.",
  },
  {
    id: "car-vinfast-vf6",
    slug: "vinfast-vf6",
    category: "car",
    oem: "vinfast",
    oemName: "VinFast",
    modelName: "VF6",
    tagline: "VinFast's compact electric SUV, with a battery-subscription option",
    bodyType: "suv",
    priceRangeLakh: [18.19, 20.09],
    rangeKm: 468,
    batteryCapacityKwh: 59.6,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 25,
    chargingTimeSlowHr: 8,
    topSpeedKmph: 175,
    accelerationSec0To100: 9.0,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2025-09",
    colors: ["Zenith Grey", "Urban Mint", "Jet Black", "Infinity Blanc", "Desat Silver", "Crimson Red"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "earth", name: "Earth", priceLakh: 18.19, rangeKm: 463, batteryKwh: 59.6, topSpeedKmph: 175 },
      { id: "wind-infinity", name: "Wind Infinity", priceLakh: 20.09, rangeKm: 468, batteryKwh: 59.6, topSpeedKmph: 175, fastChargeTimeMin: 25 },
    ],
    highlights: ["VinFast's India market entry", "468 km ARAI range", "Optional battery-subscription pricing"],
    description:
      "VF6 was VinFast's first model sold in India, a compact electric SUV positioned to undercut established rivals on price.",
  },
  {
    id: "car-vinfast-vf7",
    slug: "vinfast-vf7",
    category: "car",
    oem: "vinfast",
    oemName: "VinFast",
    modelName: "VF7",
    tagline: "VinFast's mid-size electric SUV",
    bodyType: "suv",
    priceRangeLakh: [20.89, 25.49],
    rangeKm: 532,
    batteryCapacityKwh: 70.8,
    // inferred basis: this OEM publishes one nominal pack figure and no usable
    // figure, so the stored value is nominal by construction. Weaker evidence
    // than a confirmed gross/usable pair — see BATTERY_CONVENTION_SURVEY.md.
    batteryMeasuredAt: "gross",
    chargingTimeFastMin: 28,
    chargingTimeSlowHr: 8,
    topSpeedKmph: 175,
    accelerationSec0To100: 8.5,
    seatingCapacity: 5,
    launchStatus: "available",
    launchDate: "2025-09",
    colors: ["Urban Mint", "Zenith Grey", "Crimson Red", "Infinity Blanc", "Desat Silver", "Jet Black"],
    images: { hero: "hero", gallery },
    variants: [
      { id: "earth", name: "Earth", priceLakh: 20.89, rangeKm: 438, batteryKwh: 59.6, topSpeedKmph: 167 },
      { id: "wind", name: "Wind", priceLakh: 23.49, rangeKm: 532, batteryKwh: 70.8, topSpeedKmph: 175 },
      { id: "sky-infinity", name: "Sky Infinity", priceLakh: 25.49, rangeKm: 532, batteryKwh: 70.8, topSpeedKmph: 175, fastChargeTimeMin: 28 },
    ],
    highlights: ["532 km range on the 70.8kWh pack", "5 trims spanning two battery sizes", "110kW DC fast charging"],
    description:
      "VF7 sits above the VF6 in VinFast's India range, offering a larger body and a bigger optional battery pack for longer-range buyers.",
  },
];
