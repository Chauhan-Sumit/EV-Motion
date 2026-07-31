export interface City {
  id: string;
  name: string;
  state: string;
  lat: number;
  lng: number;
  popular?: boolean;
}

export const DEFAULT_CITY_ID = "delhi";

/**
 * Real Indian city names + approximate city-center coordinates (public
 * geographic data), used for display and for nearest-match "Detect My
 * Location" — not a live geocoding API, since this app has no backend.
 */
export const CITIES: City[] = [
  { id: "delhi", name: "Delhi", state: "Delhi", lat: 28.6139, lng: 77.209, popular: true },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", lat: 19.076, lng: 72.8777, popular: true },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", lat: 12.9716, lng: 77.5946, popular: true },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707, popular: true },
  { id: "pune", name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567, popular: true },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", lat: 17.385, lng: 78.4867, popular: true },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714, popular: true },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639, popular: true },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { id: "chandigarh", name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { id: "surat", name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { id: "kochi", name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", lat: 23.2599, lng: 77.4126 },
  { id: "patna", name: "Patna", state: "Bihar", lat: 25.5941, lng: 85.1376 },
  { id: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", lat: 11.0168, lng: 76.9558 },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185 },
  { id: "guwahati", name: "Guwahati", state: "Assam", lat: 26.1445, lng: 91.7362 },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", lat: 8.5241, lng: 76.9366 },
  { id: "noida", name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.391 },
  { id: "gurugram", name: "Gurugram", state: "Haryana", lat: 28.4595, lng: 77.0266 },
  { id: "faridabad", name: "Faridabad", state: "Haryana", lat: 28.4089, lng: 77.3178 },
  { id: "ghaziabad", name: "Ghaziabad", state: "Uttar Pradesh", lat: 28.6692, lng: 77.4538 },
  { id: "vadodara", name: "Vadodara", state: "Gujarat", lat: 22.3072, lng: 73.1812 },
  { id: "ludhiana", name: "Ludhiana", state: "Punjab", lat: 30.901, lng: 75.8573 },
  { id: "agra", name: "Agra", state: "Uttar Pradesh", lat: 27.1767, lng: 78.0081 },
  { id: "nashik", name: "Nashik", state: "Maharashtra", lat: 19.9975, lng: 73.7898 },
  { id: "rajkot", name: "Rajkot", state: "Gujarat", lat: 22.3039, lng: 70.8022 },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", lat: 25.3176, lng: 82.9739 },
  { id: "amritsar", name: "Amritsar", state: "Punjab", lat: 31.634, lng: 74.8723 },
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", lat: 20.2961, lng: 85.8245 },
  { id: "ranchi", name: "Ranchi", state: "Jharkhand", lat: 23.3441, lng: 85.3096 },
  { id: "dehradun", name: "Dehradun", state: "Uttarakhand", lat: 30.3165, lng: 78.0322 },
  { id: "raipur", name: "Raipur", state: "Chhattisgarh", lat: 21.2514, lng: 81.6296 },
  { id: "jodhpur", name: "Jodhpur", state: "Rajasthan", lat: 26.2389, lng: 73.0243 },
  { id: "mysuru", name: "Mysuru", state: "Karnataka", lat: 12.2958, lng: 76.6394 },
];

export const POPULAR_CITIES = CITIES.filter((c) => c.popular);

export function getCityById(id: string): City | undefined {
  return CITIES.find((c) => c.id === id);
}

export const DEFAULT_CITY = getCityById(DEFAULT_CITY_ID)!;

function haversineKm(a: City, lat: number, lng: number): number {
  const R = 6371;
  const dLat = ((lat - a.lat) * Math.PI) / 180;
  const dLng = ((lng - a.lng) * Math.PI) / 180;
  const la1 = (a.lat * Math.PI) / 180;
  const la2 = (lat * Math.PI) / 180;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(la1) * Math.cos(la2) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Nearest known city to a raw lat/lng — used by "Detect My Location" (no reverse-geocoding API available). */
export function nearestCity(lat: number, lng: number): City {
  return CITIES.reduce((closest, city) =>
    haversineKm(city, lat, lng) < haversineKm(closest, lat, lng) ? city : closest,
  );
}
