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

function sosSvg(pulse = true) {
  const anim = pulse
    ? `<circle cx="30" cy="30" r="26" fill="#F04438" opacity="0.25">
         <animate attributeName="r" values="16;28;16" dur="1.5s" repeatCount="indefinite"/>
         <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite"/>
       </circle>`
    : `<circle cx="30" cy="30" r="20" fill="#F04438" opacity="0.15"/>`;
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="60" height="60" viewBox="0 0 60 60">
          ${anim}
          <circle cx="30" cy="30" r="12" fill="#F04438" stroke="#fff" stroke-width="2.5"/>
          <path d="M30 22 v8 M30 35 v0.5" stroke="#fff" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`,
      ),
    scaledSize: new window.google.maps.Size(pulse ? 48 : 36, pulse ? 48 : 36),
    anchor: new window.google.maps.Point(pulse ? 24 : 18, pulse ? 24 : 18),
  };
}

function stationSvg() {
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
          <circle cx="8" cy="8" r="5" fill="#fff" stroke="#10367D" stroke-width="2.5"/>
        </svg>`,
      ),
    scaledSize: new window.google.maps.Size(12, 12),
    anchor: new window.google.maps.Point(6, 6),
  };
}

function trainSvg(rotation = 0) {
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
          <g transform="rotate(${rotation} 22 22)">
            <circle cx="22" cy="22" r="18" fill="#5B9BD5" opacity="0.2">
              <animate attributeName="r" values="14;20;14" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="22" cy="22" r="13" fill="#10367D" stroke="#fff" stroke-width="2.5"/>
            <rect x="16" y="13" width="12" height="11" rx="2.5" fill="#fff"/>
            <rect x="17.5" y="14.5" width="4" height="3" rx="0.8" fill="#5B9BD5"/>
            <rect x="22.5" y="14.5" width="4" height="3" rx="0.8" fill="#5B9BD5"/>
            <path d="M22 5 L25 12 H19 Z" fill="#F79009" stroke="#fff" stroke-width="1.2"/>
          </g>
        </svg>`,
      ),
    scaledSize: new window.google.maps.Size(38, 38),
    anchor: new window.google.maps.Point(19, 19),
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
