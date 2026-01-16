import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Airport, TravelHistoryItem } from '../types';
import { AIRPORTS } from '../constants';

// Fix for Leaflet default icon issues in React
// Using CDN URLs instead of imports to avoid bundler issues in browser-native environments
const iconUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png';
const iconRetinaUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png';
const shadowUrl = 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom Icons
const currentIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div class="w-6 h-6 bg-red-600 rounded-full border-4 border-white shadow-lg animate-pulse"></div>`,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

const normalIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div class="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

const hubIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div class="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-md"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

interface MapProps {
  currentAirport: Airport;
  history: TravelHistoryItem[];
  validDestinations: string[];
  excludeRadiusKm: number;
}

// MapUpdater component to handle programmatic map movements
// Now accepts lat/lng individually to ensure stable dependency checking
const MapUpdater: React.FC<{ lat: number; lng: number }> = ({ lat, lng }) => {
  const map = useMap();
  
  useEffect(() => {
    // Invalidate size to ensure map renders correctly if container size changed
    map.invalidateSize();
    
    // Fly to the new coordinates
    // Using zoom level 6 to show context, or maintain current zoom if preferred
    map.flyTo([lat, lng], 6, { 
      animate: true, 
      duration: 1.5,
      easeLinearity: 0.25
    });
  }, [lat, lng, map]);
  
  return null;
};

const Map: React.FC<MapProps> = ({ currentAirport, history, validDestinations, excludeRadiusKm }) => {
  const airportList = Object.values(AIRPORTS);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer
        center={[currentAirport.lat, currentAirport.lng]}
        zoom={5}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        {/* Update map view when current airport changes */}
        <MapUpdater lat={currentAirport.lat} lng={currentAirport.lng} />

        {/* Draw exclusion circle */}
        {excludeRadiusKm > 0 && (
           <Circle 
             center={[currentAirport.lat, currentAirport.lng]}
             radius={excludeRadiusKm * 1000}
             pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.1, weight: 1, dashArray: '4, 4' }}
           />
        )}

        {/* Draw flight history paths */}
        {history.map((flight, idx) => {
          const fromAp = AIRPORTS[flight.from];
          const toAp = AIRPORTS[flight.to];
          if (!fromAp || !toAp) return null;
          
          return (
             <Polyline
              key={`hist-${idx}`}
              positions={[
                [fromAp.lat, fromAp.lng],
                [toAp.lat, toAp.lng],
              ]}
              pathOptions={{ color: '#94a3b8', weight: 2, opacity: 0.6, dashArray: '5, 10' }}
            />
          )
        })}

        {/* Draw potential routes from current location */}
        {validDestinations.map((destIata) => {
           const destAp = AIRPORTS[destIata];
           if(!destAp) return null;
           return (
             <Polyline
              key={`potential-${destIata}`}
              positions={[
                [currentAirport.lat, currentAirport.lng],
                [destAp.lat, destAp.lng],
              ]}
              pathOptions={{ color: '#ef4444', weight: 2, opacity: 0.8 }}
            />
           )
        })}

        {/* Draw Airports */}
        {airportList.map((airport) => {
          const isCurrent = airport.iata === currentAirport.iata;
          const isDest = validDestinations.includes(airport.iata);
          
          let iconToUse = normalIcon;
          if (isCurrent) iconToUse = currentIcon;
          else if (airport.size === 'BIG') iconToUse = hubIcon;
          
          return (
            <Marker
              key={airport.iata}
              position={[airport.lat, airport.lng]}
              icon={iconToUse}
              opacity={isCurrent || isDest || airport.size === 'BIG' ? 1 : 0.5}
              zIndexOffset={isCurrent ? 1000 : 0}
            >
              <Popup>
                <div className="text-center">
                  <h3 className="font-bold text-lg">{airport.iata}</h3>
                  <p className="text-sm">{airport.name}</p>
                  {isCurrent && <span className="inline-block px-2 py-0.5 bg-red-100 text-red-800 text-xs rounded-full mt-1">現在地</span>}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default Map;