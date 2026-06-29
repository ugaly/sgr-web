import { useEffect, useRef, useState } from "react";
import { loadGoogleMaps } from "@/lib/google-maps";
import { RAILWAY_PATH, type SosAlert } from "@/lib/sgr-data";

const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#e8edf5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a5d7a" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "simplified" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d4f0" }] },
];

function interpolate(path: { lat: number; lng: number }[], t: number) {
  const segs: number[] = [];
  let total = 0;
  for (let i = 0; i < path.length - 1; i++) {
    const dx = path[i + 1].lat - path[i].lat;
    const dy = path[i + 1].lng - path[i].lng;
    const d = Math.sqrt(dx * dx + dy * dy);
    segs.push(d);
    total += d;
  }
  let target = t * total;
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const f = segs[i] === 0 ? 0 : target / segs[i];
      return {
        lat: path[i].lat + (path[i + 1].lat - path[i].lat) * f,
        lng: path[i].lng + (path[i + 1].lng - path[i].lng) * f,
      };
    }
    target -= segs[i];
  }
  return path[path.length - 1];
}

function bearing(from: { lat: number; lng: number }, to: { lat: number; lng: number }) {
  const lat1 = (from.lat * Math.PI) / 180;
  const lat2 = (to.lat * Math.PI) / 180;
  const dLng = ((to.lng - from.lng) * Math.PI) / 180;
  const y = Math.sin(dLng) * Math.cos(lat2);
  const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

function svgUrl(svg: string) {
  return "data:image/svg+xml;charset=UTF-8," + encodeURIComponent(svg);
}

/* Professional SOS pin — teardrop with gradient, gloss, pulsing rings + siren glyph */
function sosSvg(pulse = true) {
  const rings = pulse
    ? `<circle cx="36" cy="34" r="20" fill="#F04438" opacity="0.18">
         <animate attributeName="r" values="14;30;14" dur="1.8s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values="0.35;0;0.35" dur="1.8s" repeatCount="indefinite"/>
       </circle>
       <circle cx="36" cy="34" r="14" fill="#F04438" opacity="0.22">
         <animate attributeName="r" values="10;22;10" dur="1.8s" begin="0.4s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values="0.4;0;0.4" dur="1.8s" begin="0.4s" repeatCount="indefinite"/>
       </circle>`
    : "";
  return {
    url: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="72" height="80" viewBox="0 0 72 80">
        <defs>
          <linearGradient id="sosg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#FF6A5E"/>
            <stop offset="55%" stop-color="#F04438"/>
            <stop offset="100%" stop-color="#C01A0E"/>
          </linearGradient>
          <radialGradient id="sosgloss" cx="0.5" cy="0.32" r="0.6">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.55"/>
            <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <filter id="sosShadow" x="-50%" y="-30%" width="200%" height="180%">
            <feDropShadow dx="0" dy="3" stdDeviation="3.5" flood-color="#7a1109" flood-opacity="0.45"/>
          </filter>
        </defs>
        ${rings}
        <path d="M36 8 C22.7 8 12 18.7 12 32 C12 50 36 70 36 70 C36 70 60 50 60 32 C60 18.7 49.3 8 36 8 Z"
              fill="url(#sosg)" stroke="#ffffff" stroke-width="3.5" filter="url(#sosShadow)"/>
        <path d="M36 8 C22.7 8 12 18.7 12 32 C12 50 36 70 36 70 C36 70 60 50 60 32 C60 18.7 49.3 8 36 8 Z"
              fill="url(#sosgloss)"/>
        <g transform="translate(36 32)">
          <path d="M-9 6 a9 9 0 0 1 18 0 Z" fill="#ffffff"/>
          <rect x="-1.6" y="-12" width="3.2" height="11" rx="1.6" fill="#ffffff"/>
          <circle cx="0" cy="-13.5" r="2.4" fill="#ffffff"/>
          <path d="M-12 -3 l-3.5 -2 M12 -3 l3.5 -2" stroke="#ffffff" stroke-width="2.2" stroke-linecap="round"/>
        </g>
      </svg>`,
    ),
    scaledSize: new window.google.maps.Size(pulse ? 56 : 42, pulse ? 62 : 47),
    anchor: new window.google.maps.Point(pulse ? 28 : 21, pulse ? 62 : 47),
  };
}

/* Crisp station marker — gradient ring, white core, soft shadow */
function stationSvg() {
  return {
    url: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 22 22">
        <defs>
          <linearGradient id="stg" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#3E74CE"/>
            <stop offset="100%" stop-color="#10367D"/>
          </linearGradient>
          <filter id="stsh" x="-40%" y="-40%" width="180%" height="180%">
            <feDropShadow dx="0" dy="1" stdDeviation="1.2" flood-color="#0b234f" flood-opacity="0.4"/>
          </filter>
        </defs>
        <circle cx="11" cy="11" r="6.5" fill="url(#stg)" stroke="#ffffff" stroke-width="2.5" filter="url(#stsh)"/>
        <circle cx="11" cy="11" r="2.2" fill="#ffffff"/>
      </svg>`,
    ),
    scaledSize: new window.google.maps.Size(16, 16),
    anchor: new window.google.maps.Point(8, 8),
  };
}

/* Premium train marker — glossy navy disc, sky glow, clean train-front glyph + heading arrow */
function trainSvg(rotation = 0) {
  return {
    url: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
        <defs>
          <radialGradient id="trglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="#5B9BD5" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#5B9BD5" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="trbody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1C50A8"/>
            <stop offset="100%" stop-color="#081C45"/>
          </linearGradient>
          <linearGradient id="trgloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
            <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
          </linearGradient>
          <filter id="trsh" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#06112b" flood-opacity="0.5"/>
          </filter>
        </defs>
        <circle cx="26" cy="26" r="22" fill="url(#trglow)">
          <animate attributeName="r" values="16;23;16" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite"/>
        </circle>
        <g transform="rotate(${rotation} 26 26)">
          <path d="M26 4 L33 16 L19 16 Z" fill="#F79009" stroke="#ffffff" stroke-width="1.5"/>
        </g>
        <circle cx="26" cy="26" r="15" fill="url(#trbody)" stroke="#ffffff" stroke-width="3" filter="url(#trsh)"/>
        <circle cx="26" cy="26" r="15" fill="url(#trgloss)"/>
        <g transform="translate(26 26)">
          <path d="M-7 -6 a4 4 0 0 1 4 -4 h6 a4 4 0 0 1 4 4 v7 a2.5 2.5 0 0 1 -2.5 2.5 h-9 A2.5 2.5 0 0 1 -7 1 Z" fill="#ffffff"/>
          <rect x="-5" y="-5.5" width="4" height="3.2" rx="0.8" fill="#1C50A8"/>
          <rect x="1" y="-5.5" width="4" height="3.2" rx="0.8" fill="#1C50A8"/>
          <circle cx="-3" cy="4.5" r="1.5" fill="#1C50A8"/>
          <circle cx="3" cy="4.5" r="1.5" fill="#1C50A8"/>
        </g>
      </svg>`,
    ),
    scaledSize: new window.google.maps.Size(44, 44),
    anchor: new window.google.maps.Point(22, 22),
  };
}

export function SosMap({
  alert,
  alerts,
}: {
  alert?: SosAlert;
  alerts?: SosAlert[];
}) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const railwayRef = useRef<any[]>([]);
  const trainRef = useRef<any>(null);
  const animRef = useRef<number | null>(null);
  const [ready, setReady] = useState(false);

  // Initialise map once: base map, railway corridor, stations, moving train.
  useEffect(() => {
    let cancelled = false;
    loadGoogleMaps().then(() => {
      if (cancelled || !mapRef.current || mapInstanceRef.current) return;
      const g = window.google;
      const map = new g.maps.Map(mapRef.current, {
        center: { lat: -6.75, lng: 37.2 },
        zoom: 8,
        disableDefaultUI: true,
        zoomControl: true,
        gestureHandling: "greedy",
        styles: MAP_STYLE,
        backgroundColor: "#e8edf5",
      });
      mapInstanceRef.current = map;

      // Railway corridor
      railwayRef.current.push(
        new g.maps.Polyline({
          path: RAILWAY_PATH,
          strokeColor: "#10367D",
          strokeOpacity: 0.9,
          strokeWeight: 6,
          map,
          zIndex: 2,
        }),
      );
      railwayRef.current.push(
        new g.maps.Polyline({
          path: RAILWAY_PATH,
          strokeColor: "#5B9BD5",
          strokeOpacity: 1,
          strokeWeight: 2,
          map,
          zIndex: 3,
        }),
      );

      // Stations
      RAILWAY_PATH.forEach((s) => {
        if (!s.name) return;
        railwayRef.current.push(
          new g.maps.Marker({
            position: { lat: s.lat, lng: s.lng },
            map,
            icon: stationSvg(),
            title: s.name,
            zIndex: 5,
          }),
        );
      });

      // Moving train
      trainRef.current = new g.maps.Marker({
        position: RAILWAY_PATH[0],
        map,
        icon: trainSvg(0),
        zIndex: 90,
        title: "SGR Express — Live",
      });

      let t = 0;
      const step = () => {
        t = (t + 0.00045) % 1;
        const pos = interpolate(RAILWAY_PATH, t);
        const nextPos = interpolate(RAILWAY_PATH, (t + 0.001) % 1);
        trainRef.current.setPosition(pos);
        trainRef.current.setIcon(trainSvg(bearing(pos, nextPos)));
        animRef.current = requestAnimationFrame(step);
      };
      animRef.current = requestAnimationFrame(step);

      setReady(true);
    });

    return () => {
      cancelled = true;
      if (animRef.current) cancelAnimationFrame(animRef.current);
    };
  }, []);

  // React to selection / list changes: draw SOS markers + recenter.
  useEffect(() => {
    const map = mapInstanceRef.current;
    const g = window.google;
    if (!map || !g?.maps) return;

    markersRef.current.forEach((m) => m.setMap(null));
    markersRef.current = [];

    if (alert) {
      markersRef.current.push(
        new g.maps.Marker({
          position: { lat: alert.lat, lng: alert.lng },
          map,
          icon: sosSvg(true),
          zIndex: 999,
        }),
      );
      map.panTo({ lat: alert.lat, lng: alert.lng });
      map.setZoom(11);
    } else if (alerts && alerts.length > 0) {
      const bounds = new g.maps.LatLngBounds();
      RAILWAY_PATH.forEach((p) => bounds.extend(p));
      alerts.forEach((a) => {
        markersRef.current.push(
          new g.maps.Marker({
            position: { lat: a.lat, lng: a.lng },
            map,
            icon: sosSvg(a.status === "Active"),
            title: a.reporter,
            zIndex: a.status === "Active" ? 100 : 50,
          }),
        );
        bounds.extend({ lat: a.lat, lng: a.lng });
      });
      map.fitBounds(bounds, { top: 48, right: 48, bottom: 48, left: 48 });
    }
  }, [alert, alerts, ready]);

  return (
    <div className="relative h-full w-full">
      <div ref={mapRef} className="absolute inset-0" />
      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-secondary/60 text-sm text-muted-foreground">
          Loading map…
        </div>
      )}
    </div>
  );
}
