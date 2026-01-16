import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap, Circle } from 'react-leaflet';
import L from 'leaflet';
import { Airport, TravelHistoryItem } from '../types';
import { AIRPORTS } from '../constants';
import { Plane } from 'lucide-react';

// Fix for Leaflet default icon issues in React
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

// --- Custom Icons ---

// Pulsing Red Icon for Current Location
const currentIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `
    <div class="relative w-6 h-6">
      <div class="pulse-ring"></div>
      <div class="absolute inset-0 m-auto w-4 h-4 bg-red-600 rounded-full border-2 border-white shadow-lg"></div>
    </div>
  `,
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

// Standard Small Airport
const normalIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div class="w-3 h-3 bg-blue-500 rounded-full border-2 border-white shadow-sm hover:scale-125 transition-transform"></div>`,
  iconSize: [12, 12],
  iconAnchor: [6, 6],
});

// Big Hub Airport
const hubIcon = new L.DivIcon({
  className: 'custom-icon',
  html: `<div class="w-4 h-4 bg-indigo-600 rounded-full border-2 border-white shadow-md hover:scale-125 transition-transform"></div>`,
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

// SVG Plane Icon for Animation
// We use a function to generate the icon so we can rotate it
const createPlaneIcon = (rotation: number) => new L.DivIcon({
  className: 'plane-icon',
  html: `
    <div style="transform: rotate(${rotation}deg); transition: transform 0.1s linear;">
       <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="#dc2626" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="drop-shadow-lg">
         <path d="M2 12h20"/><path d="M13 2l9 10-9 10"/><path d="M2 12l5-5m0 10l-5-5"/>
         <path d="M12 2l10 10-10 10" fill="none"/> 
         <!-- Simple Plane Shape -->
         <path d="M2 12h20M22 12l-5-5m5 5l-5 5" stroke="none" /> 
         <path d="M15 12 L4 20 L6 12 L4 4 L15 12 Z" fill="#dc2626" stroke="white" stroke-width="1.5" />
       </svg>
    </div>
  `,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

interface MapProps {
  currentAirport: Airport;
  history: TravelHistoryItem[];
  validDestinations: string[];
  excludeRadiusKm: number;
  animatingDestination: Airport | null;
  onAnimationComplete: () => void;
}

// --- Flight Animation Component ---
const FlightAnimator: React.FC<{
  from: Airport;
  to: Airport;
  onComplete: () => void;
}> = ({ from, to, onComplete }) => {
  const map = useMap();
  const [position, setPosition] = useState<[number, number]>([from.lat, from.lng]);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    // Calculate bearing
    const y = Math.sin((to.lng - from.lng) * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180);
    const x = Math.cos(from.lat * Math.PI / 180) * Math.sin(to.lat * Math.PI / 180) -
              Math.sin(from.lat * Math.PI / 180) * Math.cos(to.lat * Math.PI / 180) * Math.cos((to.lng - from.lng) * Math.PI / 180);
    const brng = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360;
    
    // SVG plane icon points right (90 deg usually), so we might need adjustment depending on SVG orientation.
    // Our SVG arrow points Right. Leaflet 0 degrees is North? No, standard CSS rotation 0 is North.
    // Bearing 0 is North.
    // If SVG points Right, we need to rotate Bearing - 90. 
    // Let's assume standard nav bearing.
    setRotation(brng + 90); 

    const duration = 2000; // 2 seconds flight
    const start = performance.now();
    
    // Zoom out slightly to see the flight path if needed
    map.flyTo([(from.lat + to.lat)/2, (from.lng + to.lng)/2], 5, { animate: true, duration: 1 });

    const animate = (time: number) => {
      const progress = Math.min((time - start) / duration, 1);
      
      // Linear interpolation
      const lat = from.lat + (to.lat - from.lat) * progress;
      const lng = from.lng + (to.lng - from.lng) * progress;
      
      setPosition([lat, lng]);

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // Animation done
        setTimeout(onComplete, 300); // Slight pause at destination
      }
    };

    const frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [from, to, map, onComplete]);

  return <Marker position={position} icon={createPlaneIcon(rotation)} zIndexOffset={2000} />;
};


// --- Map Logic ---
const MapUpdater: React.FC<{ lat: number; lng: number, isAnimating: boolean }> = ({ lat, lng, isAnimating }) => {
  const map = useMap();
  
  useEffect(() => {
    map.invalidateSize();
    const timer = setTimeout(() => map.invalidateSize(), 300);
    return () => clearTimeout(timer);
  }, [map]);
  
  useEffect(() => {
    // Only center on current airport if we are NOT currently animating a flight
    if (!isAnimating) {
        map.flyTo([lat, lng], 6, { 
        animate: true, 
        duration: 1.5,
        easeLinearity: 0.25
        });
    }
  }, [lat, lng, map, isAnimating]);
  
  return null;
};

const Map: React.FC<MapProps> = ({ 
  currentAirport, 
  history, 
  validDestinations, 
  excludeRadiusKm, 
  animatingDestination,
  onAnimationComplete
}) => {
  const airportList = Object.values(AIRPORTS);

  return (
    <div className="h-full w-full rounded-xl overflow-hidden shadow-inner border border-slate-200 bg-slate-100">
      <MapContainer
        center={[currentAirport.lat, currentAirport.lng]}
        zoom={6}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        attributionControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        
        <MapUpdater 
            lat={currentAirport.lat} 
            lng={currentAirport.lng} 
            isAnimating={!!animatingDestination} 
        />

        {/* Exclusion Zone */}
        {excludeRadiusKm > 0 && (
           <Circle 
             center={[currentAirport.lat, currentAirport.lng]}
             radius={excludeRadiusKm * 1000}
             pathOptions={{ color: '#ef4444', fillColor: '#ef4444', fillOpacity: 0.05, weight: 1, dashArray: '4, 8' }}
             interactive={false}
           />
        )}

        {/* History Lines */}
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
              pathOptions={{ color: '#94a3b8', weight: 2, opacity: 0.4, dashArray: '5, 5' }}
            />
          )
        })}

        {/* Potential Routes (Animated) */}
        {/* Only show these when NOT animating, to avoid clutter during flight */}
        {!animatingDestination && validDestinations.map((destIata) => {
           const destAp = AIRPORTS[destIata];
           if(!destAp) return null;
           return (
             <Polyline
              key={`potential-${destIata}`}
              positions={[
                [currentAirport.lat, currentAirport.lng],
                [destAp.lat, destAp.lng],
              ]}
              // Using className for CSS animation defined in index.html
              pathOptions={{ 
                  className: 'flight-path-line',
                  color: '#ef4444', 
                  weight: 2, 
                  opacity: 0.6 
              }}
            />
           )
        })}

        {/* Flight Animation */}
        {animatingDestination && (
            <FlightAnimator 
                from={currentAirport} 
                to={animatingDestination} 
                onComplete={onAnimationComplete} 
            />
        )}

        {/* Markers */}
        {airportList.map((airport) => {
          const isCurrent = airport.iata === currentAirport.iata;
          const isDest = validDestinations.includes(airport.iata);
          const isAnimatingTarget = animatingDestination?.iata === airport.iata;
          
          let iconToUse = normalIcon;
          if (isCurrent) iconToUse = currentIcon;
          else if (airport.size === 'BIG') iconToUse = hubIcon;
          
          // Hide current marker if we are mid-flight (optional, but looks cleaner if plane leaves the spot)
          // But usually we keep the "Previous" spot until arrival.
          
          return (
            <Marker
              key={airport.iata}
              position={[airport.lat, airport.lng]}
              icon={iconToUse}
              opacity={isCurrent || isDest || airport.size === 'BIG' || isAnimatingTarget ? 1 : 0.4}
              zIndexOffset={isCurrent ? 1000 : isAnimatingTarget ? 900 : 0}
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