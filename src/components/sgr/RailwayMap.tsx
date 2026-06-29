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

function officerSvg(color: string, status: string) {
  const ring =
    status === "sos" ? "#EF4444" : status === "active" ? "#12B76A" : status === "idle" ? "#F79009" : "#98A2B3";
  const pulse = status === "sos" ? `<circle cx="18" cy="18" r="16" fill="none" stroke="${ring}" stroke-width="2" opacity="0.5"><animate attributeName="r" values="12;20;12" dur="1.4s" repeatCount="indefinite"/><animate attributeName="opacity" values="0.6;0;0.6" dur="1.4s" repeatCount="indefinite"/></circle>` : "";
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
          <defs><filter id="s" x="-30%" y="-30%" width="160%" height="160%"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter></defs>
          ${pulse}
          <circle cx="18" cy="18" r="13" fill="${color}" stroke="${ring}" stroke-width="2.5" filter="url(#s)"/>
          <circle cx="18" cy="14" r="4.5" fill="#fff"/>
          <path d="M10 28c0-4.4 3.6-8 8-8s8 3.6 8 8" fill="#fff"/>
        </svg>`,
      ),
    scaledSize: new window.google.maps.Size(32, 32),
    anchor: new window.google.maps.Point(18, 18),
  };
}

function incidentSvg(priority: string) {
  const color = priority === "high" ? "#F04438" : priority === "medium" ? "#F79009" : "#2E90FA";
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 28 28">
          <circle cx="14" cy="14" r="12" fill="${color}" opacity="0.18"/>
          <path d="M14 6 L22 22 H6 Z" fill="${color}" stroke="#fff" stroke-width="2" stroke-linejoin="round"/>
          <circle cx="14" cy="18" r="1.2" fill="#fff"/>
          <rect x="13.2" y="11" width="1.6" height="5.5" rx="0.8" fill="#fff"/>
        </svg>`,
      ),
    scaledSize: new window.google.maps.Size(26, 26),
    anchor: new window.google.maps.Point(14, 14),
  };
}

function stationSvg() {
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" fill="#10367D" stroke="#fff" stroke-width="2.5"/>
          <rect x="7" y="9" width="10" height="7" rx="1" fill="#fff"/>
          <rect x="9" y="11" width="2.5" height="2.5" rx="0.5" fill="#10367D"/>
          <rect x="12.5" y="11" width="2.5" height="2.5" rx="0.5" fill="#10367D"/>
        </svg>`,
      ),
    scaledSize: new window.google.maps.Size(22, 22),
    anchor: new window.google.maps.Point(12, 12),
  };
}

function trainSvg(rotation = 0) {
  return {
    url:
      "data:image/svg+xml;charset=UTF-8," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="52" height="52" viewBox="0 0 52 52">
          <g transform="rotate(${rotation} 26 26)">
            <circle cx="26" cy="26" r="22" fill="#5B9BD5" opacity="0.2">
              <animate attributeName="r" values="18;24;18" dur="2s" repeatCount="indefinite"/>
              <animate attributeName="opacity" values="0.3;0.08;0.3" dur="2s" repeatCount="indefinite"/>
            </circle>
            <circle cx="26" cy="26" r="16" fill="#10367D" stroke="#fff" stroke-width="3"/>
            <rect x="18" y="14" width="16" height="14" rx="3" fill="#fff"/>
            <rect x="20" y="16" width="5" height="4" rx="1" fill="#5B9BD5"/>
            <rect x="27" y="16" width="5" height="4" rx="1" fill="#5B9BD5"/>
            <circle cx="22" cy="32" r="2" fill="#fff"/>
            <circle cx="30" cy="32" r="2" fill="#fff"/>
            <path d="M26 6 L30 14 H22 Z" fill="#F79009" stroke="#fff" stroke-width="1.5"/>
          </g>
        </svg>`,
      ),
    scaledSize: new window.google.maps.Size(44, 44),
    anchor: new window.google.maps.Point(26, 26),
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
        "relative h-full min-h-[420px] overflow-hidden rounded-2xl border border-border bg-card shadow-soft",
        isFullscreen && "fixed inset-0 z-50 min-h-screen rounded-none border-0",
      )}
    >
      <div className="pointer-events-none absolute left-4 top-4 z-10 flex flex-col gap-2">
        <div className="pointer-events-auto rounded-xl bg-white/95 px-4 py-3 shadow-elevated ring-1 ring-border backdrop-blur">
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
