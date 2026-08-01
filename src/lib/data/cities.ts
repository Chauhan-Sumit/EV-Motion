export interface City {
  id: string;
  name: string;
  state: string;
  /** The administrative district, when it differs meaningfully from the city name — lets search match "Gautam Buddh Nagar" and find Noida, for example. */
  district?: string;
  lat: number;
  lng: number;
  popular?: boolean;
}

export const DEFAULT_CITY_ID = "delhi";

/**
 * Real Indian city names + approximate city-center coordinates (public
 * geographic data), used for display and for nearest-match "Detect My
 * Location" — not a live geocoding API, since this app has no backend.
 *
 * Covers every state capital, every union territory, and a broad set of
 * tier-2/tier-3 cities and district headquarters so search genuinely works
 * for most of India, not just the original 8 metros (still flagged
 * `popular: true` below).
 */
export const CITIES: City[] = [
  // --- Original metros + first-pass tier-2/3 set (ids/coords unchanged) ---
  { id: "delhi", name: "Delhi", state: "Delhi", district: "New Delhi", lat: 28.6139, lng: 77.209, popular: true },
  { id: "mumbai", name: "Mumbai", state: "Maharashtra", district: "Mumbai City", lat: 19.076, lng: 72.8777, popular: true },
  { id: "bengaluru", name: "Bengaluru", state: "Karnataka", district: "Bengaluru Urban", lat: 12.9716, lng: 77.5946, popular: true },
  { id: "chennai", name: "Chennai", state: "Tamil Nadu", district: "Chennai", lat: 13.0827, lng: 80.2707, popular: true },
  { id: "pune", name: "Pune", state: "Maharashtra", district: "Pune", lat: 18.5204, lng: 73.8567, popular: true },
  { id: "hyderabad", name: "Hyderabad", state: "Telangana", district: "Hyderabad", lat: 17.385, lng: 78.4867, popular: true },
  { id: "ahmedabad", name: "Ahmedabad", state: "Gujarat", district: "Ahmedabad", lat: 23.0225, lng: 72.5714, popular: true },
  { id: "kolkata", name: "Kolkata", state: "West Bengal", district: "Kolkata", lat: 22.5726, lng: 88.3639, popular: true },
  { id: "jaipur", name: "Jaipur", state: "Rajasthan", district: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { id: "lucknow", name: "Lucknow", state: "Uttar Pradesh", district: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { id: "chandigarh", name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { id: "surat", name: "Surat", state: "Gujarat", district: "Surat", lat: 21.1702, lng: 72.8311 },
  { id: "kochi", name: "Kochi", state: "Kerala", district: "Ernakulam", lat: 9.9312, lng: 76.2673 },
  { id: "indore", name: "Indore", state: "Madhya Pradesh", district: "Indore", lat: 22.7196, lng: 75.8577 },
  { id: "nagpur", name: "Nagpur", state: "Maharashtra", district: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { id: "bhopal", name: "Bhopal", state: "Madhya Pradesh", district: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { id: "patna", name: "Patna", state: "Bihar", district: "Patna", lat: 25.5941, lng: 85.1376 },
  { id: "coimbatore", name: "Coimbatore", state: "Tamil Nadu", district: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { id: "visakhapatnam", name: "Visakhapatnam", state: "Andhra Pradesh", district: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
  { id: "guwahati", name: "Guwahati", state: "Assam", district: "Kamrup Metropolitan", lat: 26.1445, lng: 91.7362 },
  { id: "thiruvananthapuram", name: "Thiruvananthapuram", state: "Kerala", district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { id: "noida", name: "Noida", state: "Uttar Pradesh", district: "Gautam Buddh Nagar", lat: 28.5355, lng: 77.391 },
  { id: "gurugram", name: "Gurugram", state: "Haryana", district: "Gurugram", lat: 28.4595, lng: 77.0266 },
  { id: "faridabad", name: "Faridabad", state: "Haryana", district: "Faridabad", lat: 28.4089, lng: 77.3178 },
  { id: "ghaziabad", name: "Ghaziabad", state: "Uttar Pradesh", district: "Ghaziabad", lat: 28.6692, lng: 77.4538 },
  { id: "vadodara", name: "Vadodara", state: "Gujarat", district: "Vadodara", lat: 22.3072, lng: 73.1812 },
  { id: "ludhiana", name: "Ludhiana", state: "Punjab", district: "Ludhiana", lat: 30.901, lng: 75.8573 },
  { id: "agra", name: "Agra", state: "Uttar Pradesh", district: "Agra", lat: 27.1767, lng: 78.0081 },
  { id: "nashik", name: "Nashik", state: "Maharashtra", district: "Nashik", lat: 19.9975, lng: 73.7898 },
  { id: "rajkot", name: "Rajkot", state: "Gujarat", district: "Rajkot", lat: 22.3039, lng: 70.8022 },
  { id: "varanasi", name: "Varanasi", state: "Uttar Pradesh", district: "Varanasi", lat: 25.3176, lng: 82.9739 },
  { id: "amritsar", name: "Amritsar", state: "Punjab", district: "Amritsar", lat: 31.634, lng: 74.8723 },
  { id: "bhubaneswar", name: "Bhubaneswar", state: "Odisha", district: "Khordha", lat: 20.2961, lng: 85.8245 },
  { id: "ranchi", name: "Ranchi", state: "Jharkhand", district: "Ranchi", lat: 23.3441, lng: 85.3096 },
  { id: "dehradun", name: "Dehradun", state: "Uttarakhand", district: "Dehradun", lat: 30.3165, lng: 78.0322 },
  { id: "raipur", name: "Raipur", state: "Chhattisgarh", district: "Raipur", lat: 21.2514, lng: 81.6296 },
  { id: "jodhpur", name: "Jodhpur", state: "Rajasthan", district: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { id: "mysuru", name: "Mysuru", state: "Karnataka", district: "Mysuru", lat: 12.2958, lng: 76.6394 },

  // --- State capitals not already covered ---
  { id: "itanagar", name: "Itanagar", state: "Arunachal Pradesh", district: "Papum Pare", lat: 27.0844, lng: 93.6053 },
  { id: "dispur", name: "Dispur", state: "Assam", district: "Kamrup Metropolitan", lat: 26.1433, lng: 91.7898 },
  { id: "naya-raipur", name: "Naya Raipur (Atal Nagar)", state: "Chhattisgarh", district: "Raipur", lat: 21.1697, lng: 81.8746 },
  { id: "panaji", name: "Panaji", state: "Goa", district: "North Goa", lat: 15.4909, lng: 73.8278 },
  { id: "gandhinagar", name: "Gandhinagar", state: "Gujarat", district: "Gandhinagar", lat: 23.2156, lng: 72.6369 },
  { id: "shimla", name: "Shimla", state: "Himachal Pradesh", district: "Shimla", lat: 31.1048, lng: 77.1734 },
  { id: "imphal", name: "Imphal", state: "Manipur", district: "Imphal West", lat: 24.817, lng: 93.9368 },
  { id: "shillong", name: "Shillong", state: "Meghalaya", district: "East Khasi Hills", lat: 25.5788, lng: 91.8933 },
  { id: "aizawl", name: "Aizawl", state: "Mizoram", district: "Aizawl", lat: 23.7271, lng: 92.7176 },
  { id: "kohima", name: "Kohima", state: "Nagaland", district: "Kohima", lat: 25.6751, lng: 94.1086 },
  { id: "amaravati", name: "Amaravati", state: "Andhra Pradesh", district: "Guntur", lat: 16.5062, lng: 80.518 },
  { id: "gangtok", name: "Gangtok", state: "Sikkim", district: "Gangtok", lat: 27.3389, lng: 88.6065 },
  { id: "agartala", name: "Agartala", state: "Tripura", district: "West Tripura", lat: 23.8315, lng: 91.2868 },

  // --- Union territories ---
  { id: "port-blair", name: "Port Blair", state: "Andaman & Nicobar Islands", lat: 11.6234, lng: 92.7265 },
  { id: "silvassa", name: "Silvassa", state: "Dadra & Nagar Haveli and Daman & Diu", lat: 20.2766, lng: 73.0143 },
  { id: "daman", name: "Daman", state: "Dadra & Nagar Haveli and Daman & Diu", lat: 20.3974, lng: 72.8328 },
  { id: "srinagar", name: "Srinagar", state: "Jammu & Kashmir", district: "Srinagar", lat: 34.0837, lng: 74.7973 },
  { id: "jammu", name: "Jammu", state: "Jammu & Kashmir", district: "Jammu", lat: 32.7266, lng: 74.857 },
  { id: "leh", name: "Leh", state: "Ladakh", district: "Leh", lat: 34.1526, lng: 77.577 },
  { id: "kavaratti", name: "Kavaratti", state: "Lakshadweep", lat: 10.5669, lng: 72.6420 },
  { id: "puducherry", name: "Puducherry", state: "Puducherry", lat: 11.9416, lng: 79.8083 },

  // --- Andhra Pradesh ---
  { id: "vijayawada", name: "Vijayawada", state: "Andhra Pradesh", district: "NTR", lat: 16.5062, lng: 80.648 },
  { id: "guntur", name: "Guntur", state: "Andhra Pradesh", district: "Guntur", lat: 16.3067, lng: 80.4365 },
  { id: "nellore", name: "Nellore", state: "Andhra Pradesh", district: "SPSR Nellore", lat: 14.4426, lng: 79.9865 },
  { id: "kurnool", name: "Kurnool", state: "Andhra Pradesh", district: "Kurnool", lat: 15.8281, lng: 78.0373 },
  { id: "tirupati", name: "Tirupati", state: "Andhra Pradesh", district: "Tirupati", lat: 13.6288, lng: 79.4192 },
  { id: "rajahmundry", name: "Rajahmundry", state: "Andhra Pradesh", district: "East Godavari", lat: 17.0005, lng: 81.804 },
  { id: "kakinada", name: "Kakinada", state: "Andhra Pradesh", district: "Kakinada", lat: 16.9891, lng: 82.2475 },

  // --- Assam ---
  { id: "silchar", name: "Silchar", state: "Assam", district: "Cachar", lat: 24.8333, lng: 92.7789 },
  { id: "dibrugarh", name: "Dibrugarh", state: "Assam", district: "Dibrugarh", lat: 27.4728, lng: 94.912 },
  { id: "jorhat", name: "Jorhat", state: "Assam", district: "Jorhat", lat: 26.7509, lng: 94.2037 },

  // --- Bihar ---
  { id: "gaya", name: "Gaya", state: "Bihar", district: "Gaya", lat: 24.7955, lng: 84.9994 },
  { id: "bhagalpur", name: "Bhagalpur", state: "Bihar", district: "Bhagalpur", lat: 25.2445, lng: 87.0108 },
  { id: "muzaffarpur", name: "Muzaffarpur", state: "Bihar", district: "Muzaffarpur", lat: 26.1225, lng: 85.3906 },
  { id: "darbhanga", name: "Darbhanga", state: "Bihar", district: "Darbhanga", lat: 26.1542, lng: 85.8918 },

  // --- Chhattisgarh ---
  { id: "bhilai", name: "Bhilai", state: "Chhattisgarh", district: "Durg", lat: 21.1938, lng: 81.3509 },
  { id: "bilaspur-cg", name: "Bilaspur", state: "Chhattisgarh", district: "Bilaspur", lat: 22.0797, lng: 82.1391 },

  // --- Goa ---
  { id: "margao", name: "Margao", state: "Goa", district: "South Goa", lat: 15.2832, lng: 73.9862 },
  { id: "vasco-da-gama", name: "Vasco da Gama", state: "Goa", district: "South Goa", lat: 15.3982, lng: 73.8114 },

  // --- Gujarat ---
  { id: "jamnagar", name: "Jamnagar", state: "Gujarat", district: "Jamnagar", lat: 22.4707, lng: 70.0577 },
  { id: "bhavnagar", name: "Bhavnagar", state: "Gujarat", district: "Bhavnagar", lat: 21.7645, lng: 72.1519 },
  { id: "anand", name: "Anand", state: "Gujarat", district: "Anand", lat: 22.5645, lng: 72.9289 },
  { id: "gandhidham", name: "Gandhidham", state: "Gujarat", district: "Kutch", lat: 23.0753, lng: 70.1337 },
  { id: "junagadh", name: "Junagadh", state: "Gujarat", district: "Junagadh", lat: 21.5222, lng: 70.4579 },

  // --- Haryana ---
  { id: "panipat", name: "Panipat", state: "Haryana", district: "Panipat", lat: 29.3909, lng: 76.9635 },
  { id: "hisar", name: "Hisar", state: "Haryana", district: "Hisar", lat: 29.1492, lng: 75.7217 },
  { id: "rohtak", name: "Rohtak", state: "Haryana", district: "Rohtak", lat: 28.8955, lng: 76.6066 },
  { id: "karnal", name: "Karnal", state: "Haryana", district: "Karnal", lat: 29.6857, lng: 76.9905 },
  { id: "ambala", name: "Ambala", state: "Haryana", district: "Ambala", lat: 30.3752, lng: 76.7821 },

  // --- Himachal Pradesh ---
  { id: "dharamshala", name: "Dharamshala", state: "Himachal Pradesh", district: "Kangra", lat: 32.219, lng: 76.3234 },
  { id: "manali", name: "Manali", state: "Himachal Pradesh", district: "Kullu", lat: 32.2432, lng: 77.1892 },
  { id: "solan", name: "Solan", state: "Himachal Pradesh", district: "Solan", lat: 30.9045, lng: 77.0967 },

  // --- Jharkhand ---
  { id: "jamshedpur", name: "Jamshedpur", state: "Jharkhand", district: "East Singhbhum", lat: 22.8046, lng: 86.2029 },
  { id: "dhanbad", name: "Dhanbad", state: "Jharkhand", district: "Dhanbad", lat: 23.7957, lng: 86.4304 },
  { id: "bokaro", name: "Bokaro", state: "Jharkhand", district: "Bokaro", lat: 23.6693, lng: 86.1511 },

  // --- Karnataka ---
  { id: "hubballi", name: "Hubballi-Dharwad", state: "Karnataka", district: "Dharwad", lat: 15.3647, lng: 75.124 },
  { id: "mangaluru", name: "Mangaluru", state: "Karnataka", district: "Dakshina Kannada", lat: 12.9141, lng: 74.856 },
  { id: "belagavi", name: "Belagavi", state: "Karnataka", district: "Belagavi", lat: 15.8497, lng: 74.4977 },
  { id: "davangere", name: "Davangere", state: "Karnataka", district: "Davangere", lat: 14.4644, lng: 75.9218 },
  { id: "ballari", name: "Ballari", state: "Karnataka", district: "Ballari", lat: 15.1394, lng: 76.9214 },
  { id: "shivamogga", name: "Shivamogga", state: "Karnataka", district: "Shivamogga", lat: 13.9299, lng: 75.5681 },

  // --- Kerala ---
  { id: "kozhikode", name: "Kozhikode", state: "Kerala", district: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { id: "thrissur", name: "Thrissur", state: "Kerala", district: "Thrissur", lat: 10.5276, lng: 76.2144 },
  { id: "kollam", name: "Kollam", state: "Kerala", district: "Kollam", lat: 8.8932, lng: 76.6141 },
  { id: "kannur", name: "Kannur", state: "Kerala", district: "Kannur", lat: 11.8745, lng: 75.3704 },
  { id: "kottayam", name: "Kottayam", state: "Kerala", district: "Kottayam", lat: 9.5916, lng: 76.5222 },

  // --- Madhya Pradesh ---
  { id: "gwalior", name: "Gwalior", state: "Madhya Pradesh", district: "Gwalior", lat: 26.2183, lng: 78.1828 },
  { id: "jabalpur", name: "Jabalpur", state: "Madhya Pradesh", district: "Jabalpur", lat: 23.1815, lng: 79.9864 },
  { id: "ujjain", name: "Ujjain", state: "Madhya Pradesh", district: "Ujjain", lat: 23.1765, lng: 75.7885 },
  { id: "sagar", name: "Sagar", state: "Madhya Pradesh", district: "Sagar", lat: 23.8388, lng: 78.7378 },
  { id: "satna", name: "Satna", state: "Madhya Pradesh", district: "Satna", lat: 24.6005, lng: 80.8322 },

  // --- Maharashtra ---
  { id: "thane", name: "Thane", state: "Maharashtra", district: "Thane", lat: 19.2183, lng: 72.9781 },
  { id: "navi-mumbai", name: "Navi Mumbai", state: "Maharashtra", district: "Thane", lat: 19.033, lng: 73.0297 },
  { id: "aurangabad-mh", name: "Chhatrapati Sambhajinagar (Aurangabad)", state: "Maharashtra", district: "Chhatrapati Sambhajinagar", lat: 19.8762, lng: 75.3433 },
  { id: "solapur", name: "Solapur", state: "Maharashtra", district: "Solapur", lat: 17.6599, lng: 75.9064 },
  { id: "kolhapur", name: "Kolhapur", state: "Maharashtra", district: "Kolhapur", lat: 16.705, lng: 74.2433 },
  { id: "amravati-mh", name: "Amravati", state: "Maharashtra", district: "Amravati", lat: 20.9374, lng: 77.7796 },

  // --- Odisha ---
  { id: "cuttack", name: "Cuttack", state: "Odisha", district: "Cuttack", lat: 20.4625, lng: 85.8828 },
  { id: "rourkela", name: "Rourkela", state: "Odisha", district: "Sundargarh", lat: 22.2604, lng: 84.8536 },
  { id: "berhampur", name: "Berhampur", state: "Odisha", district: "Ganjam", lat: 19.3149, lng: 84.7941 },

  // --- Punjab ---
  { id: "jalandhar", name: "Jalandhar", state: "Punjab", district: "Jalandhar", lat: 31.326, lng: 75.5762 },
  { id: "patiala", name: "Patiala", state: "Punjab", district: "Patiala", lat: 30.3398, lng: 76.3869 },
  { id: "bathinda", name: "Bathinda", state: "Punjab", district: "Bathinda", lat: 30.2110, lng: 74.9455 },
  { id: "mohali", name: "Mohali", state: "Punjab", district: "SAS Nagar", lat: 30.7046, lng: 76.7179 },

  // --- Rajasthan ---
  { id: "udaipur", name: "Udaipur", state: "Rajasthan", district: "Udaipur", lat: 24.5854, lng: 73.7125 },
  { id: "kota", name: "Kota", state: "Rajasthan", district: "Kota", lat: 25.2138, lng: 75.8648 },
  { id: "ajmer", name: "Ajmer", state: "Rajasthan", district: "Ajmer", lat: 26.4499, lng: 74.6399 },
  { id: "bikaner", name: "Bikaner", state: "Rajasthan", district: "Bikaner", lat: 28.0229, lng: 73.3119 },
  { id: "alwar", name: "Alwar", state: "Rajasthan", district: "Alwar", lat: 27.5530, lng: 76.6346 },
  { id: "bhilwara", name: "Bhilwara", state: "Rajasthan", district: "Bhilwara", lat: 25.3407, lng: 74.6313 },

  // --- Tamil Nadu ---
  { id: "madurai", name: "Madurai", state: "Tamil Nadu", district: "Madurai", lat: 9.9252, lng: 78.1198 },
  { id: "tiruchirappalli", name: "Tiruchirappalli (Trichy)", state: "Tamil Nadu", district: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
  { id: "salem", name: "Salem", state: "Tamil Nadu", district: "Salem", lat: 11.6643, lng: 78.146 },
  { id: "tirunelveli", name: "Tirunelveli", state: "Tamil Nadu", district: "Tirunelveli", lat: 8.7139, lng: 77.7567 },
  { id: "erode", name: "Erode", state: "Tamil Nadu", district: "Erode", lat: 11.341, lng: 77.7172 },
  { id: "vellore", name: "Vellore", state: "Tamil Nadu", district: "Vellore", lat: 12.9165, lng: 79.1325 },

  // --- Telangana ---
  { id: "warangal", name: "Warangal", state: "Telangana", district: "Warangal", lat: 17.9784, lng: 79.6 },
  { id: "nizamabad", name: "Nizamabad", state: "Telangana", district: "Nizamabad", lat: 18.6725, lng: 78.0941 },
  { id: "karimnagar", name: "Karimnagar", state: "Telangana", district: "Karimnagar", lat: 18.4386, lng: 79.1288 },

  // --- Uttar Pradesh ---
  { id: "kanpur", name: "Kanpur", state: "Uttar Pradesh", district: "Kanpur Nagar", lat: 26.4499, lng: 80.3319 },
  { id: "prayagraj", name: "Prayagraj (Allahabad)", state: "Uttar Pradesh", district: "Prayagraj", lat: 25.4358, lng: 81.8463 },
  { id: "meerut", name: "Meerut", state: "Uttar Pradesh", district: "Meerut", lat: 28.9845, lng: 77.7064 },
  { id: "bareilly", name: "Bareilly", state: "Uttar Pradesh", district: "Bareilly", lat: 28.367, lng: 79.4304 },
  { id: "aligarh", name: "Aligarh", state: "Uttar Pradesh", district: "Aligarh", lat: 27.8974, lng: 78.088 },
  { id: "moradabad", name: "Moradabad", state: "Uttar Pradesh", district: "Moradabad", lat: 28.8386, lng: 78.7733 },
  { id: "gorakhpur", name: "Gorakhpur", state: "Uttar Pradesh", district: "Gorakhpur", lat: 26.7606, lng: 83.3732 },
  { id: "firozabad", name: "Firozabad", state: "Uttar Pradesh", district: "Firozabad", lat: 27.1592, lng: 78.3957 },
  { id: "saharanpur", name: "Saharanpur", state: "Uttar Pradesh", district: "Saharanpur", lat: 29.968, lng: 77.5552 },
  { id: "jhansi", name: "Jhansi", state: "Uttar Pradesh", district: "Jhansi", lat: 25.4484, lng: 78.5685 },

  // --- Uttarakhand ---
  { id: "haridwar", name: "Haridwar", state: "Uttarakhand", district: "Haridwar", lat: 29.9457, lng: 78.1642 },
  { id: "roorkee", name: "Roorkee", state: "Uttarakhand", district: "Haridwar", lat: 29.8543, lng: 77.8880 },
  { id: "haldwani", name: "Haldwani", state: "Uttarakhand", district: "Nainital", lat: 29.2183, lng: 79.5130 },
  { id: "nainital", name: "Nainital", state: "Uttarakhand", district: "Nainital", lat: 29.3919, lng: 79.4542 },
  { id: "rishikesh", name: "Rishikesh", state: "Uttarakhand", district: "Dehradun", lat: 30.0869, lng: 78.2676 },

  // --- West Bengal ---
  { id: "siliguri", name: "Siliguri", state: "West Bengal", district: "Darjeeling", lat: 26.7271, lng: 88.3953 },
  { id: "durgapur", name: "Durgapur", state: "West Bengal", district: "Paschim Bardhaman", lat: 23.5204, lng: 87.3119 },
  { id: "asansol", name: "Asansol", state: "West Bengal", district: "Paschim Bardhaman", lat: 23.6889, lng: 86.9661 },
  { id: "howrah", name: "Howrah", state: "West Bengal", district: "Howrah", lat: 22.5958, lng: 88.2636 },
  { id: "darjeeling", name: "Darjeeling", state: "West Bengal", district: "Darjeeling", lat: 27.041, lng: 88.2663 },
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
