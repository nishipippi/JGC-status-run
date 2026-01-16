export interface Airport {
  iata: string;
  name: string;
  lat: number;
  lng: number;
  size: 'BIG' | 'SMALL'; // Big = Hubs/Major, Small = Regional/Islands
  connections: string[]; // List of IATA codes reachable via JAL Group
}

export interface TravelHistoryItem {
  from: string;
  to: string;
  distance: number;
  earnedMiles: number;
  flightTime: string;
  flightNumber: number;
}

export interface AppSettings {
  bigAirportRatio: number; // 0 to 1 (percentage chance of picking a big airport if available)
  excludeRadiusKm: number; // Minimum distance required to be a valid candidate
  retryMode: boolean; // If true, user can accept or retry the result
}