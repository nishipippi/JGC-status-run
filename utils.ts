// Haversine formula to calculate distance between two lat/lng points in miles
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 3958.8; // Radius of the Earth in miles
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d);
};

// Convert miles to km for internal logic (if needed) or display
export const milesToKm = (miles: number) => Math.round(miles * 1.60934);
export const kmToMiles = (km: number) => km * 0.621371;

// Calculate approximate flight duration based on mileage
// Logic: ~40 mins for taxi/takeoff/landing + cruising at ~460mph
export const calculateFlightDuration = (miles: number): string => {
  const totalMinutes = Math.round((miles / 460) * 60 + 40);
  const hours = Math.floor(totalMinutes / 60);
  const mins = totalMinutes % 60;
  
  if (hours > 0) {
    return `${hours}時間${mins}分`;
  }
  return `${mins}分`;
};