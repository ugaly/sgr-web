import { useCallback, useEffect, useRef, useState } from "react";
import { OFFICERS, INCIDENTS, RAILWAY_PATH } from "@/lib/sgr-data";
import { Maximize2, Minimize2, Layers, TrainFront } from "lucide-react";
import { cn } from "@/lib/utils";
import { loadGoogleMaps } from "@/lib/google-maps";

const CORRIDOR_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#e8edf5" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#e8edf5" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#4a5d7a" }] },
  { featureType: "administrative", elementType: "geometry.stroke", stylers: [{ color: "#b8c5d9" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#10367D" }] },
  { featureType: "landscape", stylers: [{ color: "#f0f4fa" }] },
  { featureType: "landscape.natural", stylers: [{ color: "#e4ecf6" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#ffffff" }] },
  { featureType: "road", elementType: "geometry.stroke", stylers: [{ color: "#d8e0ec" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#f8fafc" }] },
  { featureType: "road", elementType: "labels", stylers: [{ visibility: "simplified" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#b8d4f0" }] },
  { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: "#3e74ce" }] },
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

/* Glossy officer pin — gradient disc, status ring, person glyph, drop shadow */
function officerSvg(color: string, status: string) {
  const ring =
    status === "sos" ? "#F04438" : status === "active" ? "#12B76A" : status === "idle" ? "#F79009" : "#98A2B3";
  const id = status + color.replace("#", "");
  const pulse =
    status === "sos"
      ? `<circle cx="22" cy="22" r="18" fill="${ring}" opacity="0.18"><animate attributeName="r" values="13;20;13" dur="1.5s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.35;0;0.35" dur="1.5s" repeatCount="indefinite"/></circle>`
      : "";
  return {
    url: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="44" viewBox="0 0 44 44">
        <defs>
          <linearGradient id="og${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.95"/>
            <stop offset="100%" stop-color="${color}"/>
          </linearGradient>
          <radialGradient id="ogl${id}" cx="0.5" cy="0.3" r="0.6">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.45"/>
            <stop offset="60%" stop-color="#ffffff" stop-opacity="0"/>
          </radialGradient>
          <filter id="ofs${id}" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0b234f" flood-opacity="0.4"/>
          </filter>
        </defs>
        ${pulse}
        <circle cx="22" cy="22" r="14" fill="url(#og${id})" stroke="#ffffff" stroke-width="3" filter="url(#ofs${id})"/>
        <circle cx="22" cy="22" r="14" fill="url(#ogl${id})"/>
        <circle cx="22" cy="18.5" r="4.2" fill="#ffffff"/>
        <path d="M14.5 30c0-4.1 3.4-7 7.5-7s7.5 2.9 7.5 7" fill="#ffffff"/>
        <circle cx="32" cy="13" r="4.5" fill="${ring}" stroke="#ffffff" stroke-width="2"/>
      </svg>`,
    ),
    scaledSize: new window.google.maps.Size(36, 36),
    anchor: new window.google.maps.Point(18, 18),
  };
}

/* Glossy incident teardrop pin with warning glyph */
function incidentSvg(priority: string) {
  const color = priority === "high" ? "#F04438" : priority === "medium" ? "#F79009" : "#2E90FA";
  const id = priority;
  return {
    url: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="34" height="40" viewBox="0 0 34 40">
        <defs>
          <linearGradient id="ig${id}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.92"/>
            <stop offset="100%" stop-color="${color}"/>
          </linearGradient>
          <filter id="ifs${id}" x="-50%" y="-30%" width="200%" height="180%">
            <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#5a1207" flood-opacity="0.4"/>
          </filter>
        </defs>
        <path d="M17 4 C10.4 4 5 9.4 5 16 C5 25 17 34 17 34 C17 34 29 25 29 16 C29 9.4 23.6 4 17 4 Z"
              fill="url(#ig${id})" stroke="#ffffff" stroke-width="2.5" filter="url(#ifs${id})"/>
        <rect x="16" y="10" width="2" height="7" rx="1" fill="#ffffff"/>
        <circle cx="17" cy="20" r="1.4" fill="#ffffff"/>
      </svg>`,
    ),
    scaledSize: new window.google.maps.Size(30, 35),
    anchor: new window.google.maps.Point(15, 35),
  };
}

/* Crisp station marker — gradient ring + white core */
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
    scaledSize: new window.google.maps.Size(18, 18),
    anchor: new window.google.maps.Point(9, 9),
  };
}

/* Premium train marker — glossy navy disc, sky glow, train-front glyph + heading arrow */
function trainSvg(rotation = 0) {
  return {
    url: svgUrl(
      `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
        <defs>
          <radialGradient id="rtrglow" cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stop-color="#5B9BD5" stop-opacity="0.45"/>
            <stop offset="100%" stop-color="#5B9BD5" stop-opacity="0"/>
          </radialGradient>
          <linearGradient id="rtrbody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#1C50A8"/>
            <stop offset="100%" stop-color="#081C45"/>
          </linearGradient>
          <linearGradient id="rtrgloss" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#ffffff" stop-opacity="0.5"/>
            <stop offset="55%" stop-color="#ffffff" stop-opacity="0"/>
          </linearGradient>
          <filter id="rtrsh" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="2" stdDeviation="2.5" flood-color="#06112b" flood-opacity="0.5"/>
          </filter>
        </defs>
        <circle cx="26" cy="26" r="22" fill="url(#rtrglow)">
          <animate attributeName="r" values="16;23;16" dur="2.4s" repeatCount="indefinite"/>
          <animate attributeName="opacity" values="0.9;0.3;0.9" dur="2.4s" repeatCount="indefinite"/>
        </circle>
        <g transform="rotate(${rotation} 26 26)">
          <path d="M26 4 L33 16 L19 16 Z" fill="#F79009" stroke="#ffffff" stroke-width="1.5"/>
        </g>
        <circle cx="26" cy="26" r="15" fill="url(#rtrbody)" stroke="#ffffff" stroke-width="3" filter="url(#rtrsh)"/>
        <circle cx="26" cy="26" r="15" fill="url(#rtrgloss)"/>
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

export function RailwayMap() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const trainRef = useRef<any>(null);
  const trainTrailRef = useRef<any>(null);
  const [ready, setReady] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mapLayer, setMapLayer] = useState<"corridor" | "satellite">("corridor");

  const resizeMap = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map && window.google?.maps) {
      window.google.maps.event.trigger(map, "resize");
      const bounds = new window.google.maps.LatLngBounds();
      RAILWAY_PATH.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, { top: 60, right: 40, bottom: 40, left: 40 });
    }
  }, []);

  const toggleFullscreen = useCallback(async () => {
    const el = containerRef.current;
    if (!el) return;
    try {
      if (!document.fullscreenElement) {
        await el.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      // fallback: toggle CSS fullscreen state
      setIsFullscreen((v) => !v);
      setTimeout(resizeMap, 100);
    }
  }, [resizeMap]);

  const toggleLayer = useCallback(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const next = mapLayer === "corridor" ? "satellite" : "corridor";
    if (next === "satellite") {
      map.setMapTypeId("hybrid");
      map.setOptions({ styles: [] });
    } else {
      map.setMapTypeId("roadmap");
      map.setOptions({ styles: CORRIDOR_STYLE });
    }
    setMapLayer(next);
  }, [mapLayer]);

  useEffect(() => {
    const onFsChange = () => {
      const fs = !!document.fullscreenElement;
      setIsFullscreen(fs);
      setTimeout(resizeMap, 150);
    };
    document.addEventListener("fullscreenchange", onFsChange);
    return () => document.removeEventListener("fullscreenchange", onFsChange);
  }, [resizeMap]);

  useEffect(() => {
    let cancelled = false;
    let anim: number;
    loadGoogleMaps().then(() => {
      if (cancelled || !mapRef.current) return;
      const g = window.google;
      const map = new g.maps.Map(mapRef.current, {
        center: { lat: -6.55, lng: 37.6 },
        zoom: 7,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: { position: g.maps.ControlPosition.RIGHT_BOTTOM },
        gestureHandling: "greedy",
        styles: CORRIDOR_STYLE,
        mapTypeId: "roadmap",
        backgroundColor: "#e8edf5",
      });
      mapInstanceRef.current = map;

      const bounds = new g.maps.LatLngBounds();
      RAILWAY_PATH.forEach((p) => bounds.extend(p));
      map.fitBounds(bounds, { top: 60, right: 40, bottom: 40, left: 40 });

      // Track shadow
      new g.maps.Polyline({
        path: RAILWAY_PATH,
        strokeColor: "#081C45",
        strokeOpacity: 0.15,
        strokeWeight: 14,
        map,
        zIndex: 1,
      });
      // Railway casing
      new g.maps.Polyline({
        path: RAILWAY_PATH,
        strokeColor: "#10367D",
        strokeOpacity: 0.95,
        strokeWeight: 7,
        map,
        zIndex: 2,
      });
      // Inner rail
      new g.maps.Polyline({
        path: RAILWAY_PATH,
        strokeColor: "#5B9BD5",
        strokeOpacity: 1,
        strokeWeight: 2.5,
        map,
        zIndex: 3,
      });
      // Rail ties (dashed)
      new g.maps.Polyline({
        path: RAILWAY_PATH,
        strokeColor: "#ffffff",
        strokeOpacity: 0.5,
        strokeWeight: 1,
        icons: [{ icon: { path: "M 0,-1 0,1", strokeOpacity: 0.6, scale: 3 }, offset: "0", repeat: "16px" }],
        map,
        zIndex: 4,
      });

      // Stations
      RAILWAY_PATH.forEach((s) => {
        if (!s.name) return;
        new g.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          icon: stationSvg(),
          title: s.name,
          zIndex: 10,
        });
        new g.maps.Marker({
          position: { lat: s.lat, lng: s.lng },
          map,
          icon: {
            url: "data:image/svg+xml," + encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/>`),
            labelOrigin: new g.maps.Point(0, -14),
          },
          label: {
            text: s.name,
            color: "#10367D",
            fontSize: "11px",
            fontWeight: "700",
            className: "sgr-station-label",
          },
          zIndex: 9,
        });
      });

      // Officers
      OFFICERS.forEach((o) => {
        const m = new g.maps.Marker({
          position: { lat: o.lat, lng: o.lng },
          map,
          icon: officerSvg(o.avatarColor, o.status),
          title: o.name,
          zIndex: o.status === "sos" ? 50 : 20,
        });
        const info = new g.maps.InfoWindow({
          content: `<div style="font-family:Outfit,sans-serif;padding:4px 2px;min-width:140px">
            <div style="font-weight:700;color:#10367D;font-size:13px">${o.name}</div>
            <div style="font-size:11px;color:#667085;margin-top:2px">${o.team} · ${o.section}</div>
            <div style="font-size:10px;margin-top:4px;text-transform:uppercase;letter-spacing:0.08em;color:${
              o.status === "sos" ? "#F04438" : o.status === "active" ? "#12B76A" : o.status === "idle" ? "#F79009" : "#98A2B3"
            };font-weight:700">${o.status}</div>
          </div>`,
        });
        m.addListener("click", () => info.open({ map, anchor: m }));
      });

      // Incidents
      INCIDENTS.slice(0, 6).forEach((i) => {
        const m = new g.maps.Marker({
          position: { lat: i.lat, lng: i.lng },
          map,
          icon: incidentSvg(i.priority),
          title: i.title,
          zIndex: 30,
        });
        const info = new g.maps.InfoWindow({
          content: `<div style="font-family:Outfit,sans-serif;padding:4px 2px;max-width:180px">
            <div style="font-size:10px;font-weight:700;color:#667085;text-transform:uppercase;letter-spacing:0.06em">${i.code}</div>
            <div style="font-weight:700;color:#10367D;font-size:12px;margin-top:2px">${i.title}</div>
            <div style="font-size:11px;color:#667085;margin-top:2px">${i.section} · ${i.team}</div>
          </div>`,
        });
        m.addListener("click", () => info.open({ map, anchor: m }));
      });

      // Train trail
      trainTrailRef.current = new g.maps.Polyline({
        path: [RAILWAY_PATH[0]],
        strokeColor: "#F79009",
        strokeOpacity: 0.6,
        strokeWeight: 3,
        map,
        zIndex: 98,
      });

      // Train marker
      trainRef.current = new g.maps.Marker({
        position: RAILWAY_PATH[0],
        map,
        icon: trainSvg(0),
        zIndex: 100,
        title: "SGR Express — Live",
      });

      let t = 0;
      let prevPos = RAILWAY_PATH[0];
      const trail: { lat: number; lng: number }[] = [RAILWAY_PATH[0]];

      const step = () => {
        t = (t + 0.00045) % 1;
        const pos = interpolate(RAILWAY_PATH, t);
        const nextT = (t + 0.001) % 1;
        const nextPos = interpolate(RAILWAY_PATH, nextT);
        const heading = bearing(pos, nextPos);

        trainRef.current.setPosition(pos);
        trainRef.current.setIcon(trainSvg(heading));

        trail.push(pos);
        if (trail.length > 24) trail.shift();
        trainTrailRef.current.setPath(trail);

        prevPos = pos;
        anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
      setReady(true);
    });

    return () => {
      cancelled = true;
      if (anim) cancelAnimationFrame(anim);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-border/80 bg-card/80 shadow-soft backdrop-blur-md",
        isFullscreen && "fixed inset-0 z-50 min-h-screen rounded-none border-0",
      )}
    >
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-2">
        <div className="pointer-events-auto glass-panel-strong rounded-xl px-4 py-3 shadow-elevated ring-1 ring-border/80">
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.14em] text-muted-foreground">
            <TrainFront className="size-3.5 text-primary" /> Live Corridor
          </div>
          <div className="mt-1 text-[15px] font-extrabold text-foreground">Dar es Salaam → Dodoma</div>
          <div className="mt-2 grid grid-cols-2 gap-x-5 gap-y-1 text-[11px] text-muted-foreground">
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-success" /> Active 6</div>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-warning" /> Idle 1</div>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-destructive" /> SOS 1</div>
            <div className="flex items-center gap-1.5"><span className="size-2 rounded-full bg-offline" /> Offline 1</div>
          </div>
        </div>
      </div>

      <div className="pointer-events-none absolute right-4 top-4 z-10 flex gap-2">
        <button
          type="button"
          onClick={toggleLayer}
          title={mapLayer === "corridor" ? "Switch to satellite" : "Switch to corridor view"}
          className={cn(
            "pointer-events-auto grid size-9 place-items-center rounded-lg shadow-soft ring-1 ring-border transition",
            mapLayer === "satellite"
              ? "bg-primary text-primary-foreground"
              : "bg-white/95 text-foreground hover:bg-white",
          )}
        >
          <Layers className="size-4" />
        </button>
        <button
          type="button"
          onClick={toggleFullscreen}
          title={isFullscreen ? "Exit fullscreen" : "Expand map"}
          className="pointer-events-auto grid size-9 place-items-center rounded-lg bg-white/95 text-foreground shadow-soft ring-1 ring-border transition hover:bg-white"
        >
          {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
        </button>
      </div>

      <div ref={mapRef} className="absolute inset-0" />

      {!ready && (
        <div className="absolute inset-0 grid place-items-center bg-secondary/60 text-sm text-muted-foreground">
          Loading corridor map…
        </div>
      )}
    </div>
  );
}
