import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  MapPin,
  Phone,
  MessageSquare,
  Navigation,
  FileImage,
  FileVideo,
  FileAudio,
  Paperclip,
  Download,
  Play,
  FileText,
  Activity,
  Map as MapIcon,
  Files,
} from "lucide-react";
import { type Incident, type IncidentAttachment } from "@/lib/sgr-data";
import { Stepper, type Step } from "./Stepper";
import { cn } from "@/lib/utils";

const STATUS_STYLE: Record<Incident["status"], string> = {
  Submitted: "bg-info/10 text-info ring-info/20",
  "In Progress": "bg-warning/10 text-warning ring-warning/20",
  Review: "bg-sky/15 text-primary ring-sky/30",
  Resolved: "bg-success/10 text-success ring-success/20",
};

const PRIORITY_STYLE: Record<Incident["priority"], string> = {
  high: "bg-destructive/10 text-destructive ring-destructive/20",
  medium: "bg-warning/10 text-warning ring-warning/20",
  low: "bg-info/10 text-info ring-info/20",
};

const STATUS_INDEX: Record<Incident["status"], number> = {
  Submitted: 0,
  "In Progress": 1,
  Review: 2,
  Resolved: 3,
};

function buildSteps(i: Incident): Step[] {
  const idx = STATUS_INDEX[i.status];
  return [
    { key: "sub", label: "Submitted", hint: `Reported by ${i.reporter}`, time: i.time, by: i.team },
    { key: "prog", label: "Acknowledged", hint: idx >= 1 ? "Dispatched patrol unit" : "Awaiting supervisor", time: idx >= 1 ? "+3 min" : undefined },
    { key: "rev", label: "Under Review", hint: idx >= 2 ? "Evidence collected, supervisor reviewing" : "Pending field report", time: idx >= 2 ? "+18 min" : undefined },
    { key: "res", label: "Resolved", hint: idx >= 3 ? "Incident closed and logged" : "Pending closure", time: idx >= 3 ? "+42 min" : undefined },
  ];
}

type TabKey = "overview" | "evidence" | "timeline" | "location";

export function IncidentDetailModal({
  incident,
  open,
  onOpenChange,
}: {
  incident: Incident | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/45 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex h-[88vh] w-[92vw] max-w-[1180px] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-elevated duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          {incident && <IncidentContent incident={incident} />}
          <DialogPrimitive.Close className="absolute right-4 top-4 z-20 grid size-9 place-items-center rounded-lg border border-border bg-card/90 text-muted-foreground backdrop-blur transition hover:bg-secondary hover:text-foreground">
            <X className="size-4" />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function IncidentContent({ incident }: { incident: Incident }) {
  const [tab, setTab] = useState<TabKey>("overview");
  const [preview, setPreview] = useState<IncidentAttachment | null>(null);

  useEffect(() => {
    setTab("overview");
    setPreview(null);
  }, [incident.id]);

  const NAV: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }>; count?: number }[] = [
    { key: "overview", label: "Overview", icon: FileText },
    { key: "evidence", label: "Evidence & files", icon: Files, count: incident.attachments.length },
    { key: "timeline", label: "Timeline", icon: Activity },
    { key: "location", label: "Location", icon: MapIcon },
  ];

  return (
    <div className="flex min-h-0 w-full">
      {/* LEFT NAV */}
      <aside className="hidden w-[260px] shrink-0 flex-col border-r border-border bg-secondary/30 sm:flex">
        <div className="border-b border-border px-5 py-5">
          <div className="flex items-center gap-2">
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ring-1", PRIORITY_STYLE[incident.priority])}>
              {incident.priority}
            </span>
            <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold ring-1", STATUS_STYLE[incident.status])}>
              {incident.status}
            </span>
          </div>
          <h2 className="mt-2.5 text-[16px] font-extrabold leading-tight tracking-tight text-foreground">
            {incident.title}
          </h2>
          <p className="mt-1 text-[12px] text-muted-foreground">{incident.code} · {incident.type}</p>
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {NAV.map((n) => {
            const active = tab === n.key;
            const Icon = n.icon;
            return (
              <button
                key={n.key}
                onClick={() => setTab(n.key)}
                className={cn(
                  "flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] font-semibold transition",
                  active
                    ? "bg-card text-primary shadow-soft ring-1 ring-border"
                    : "text-muted-foreground hover:bg-card/60 hover:text-foreground",
                )}
              >
                <Icon className={cn("size-[18px]", active ? "text-primary" : "text-muted-foreground")} />
                <span className="flex-1 text-left">{n.label}</span>
                {n.count !== undefined && n.count > 0 && (
                  <span className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground",
                  )}>
                    {n.count}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div className="space-y-2 border-t border-border p-3">
          <a
            href={`tel:${incident.phone}`}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-3 py-2.5 text-[12.5px] font-semibold text-primary-foreground transition hover:bg-primary-light"
          >
            <Phone className="size-4" /> Call reporter
          </a>
          <div className="grid grid-cols-2 gap-2">
            <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-2 text-[11.5px] font-semibold text-foreground transition hover:bg-secondary">
              <MessageSquare className="size-3.5" /> Message
            </button>
            <button className="inline-flex items-center justify-center gap-1.5 rounded-xl border border-border bg-card px-2 py-2 text-[11.5px] font-semibold text-foreground transition hover:bg-secondary">
              <Navigation className="size-3.5 text-sky" /> Route
            </button>
          </div>
        </div>
      </aside>

      {/* RIGHT CONTENT */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Mobile tab bar */}
        <div className="flex shrink-0 gap-1 overflow-x-auto border-b border-border p-2 sm:hidden">
          {NAV.map((n) => (
            <button
              key={n.key}
              onClick={() => setTab(n.key)}
              className={cn(
                "whitespace-nowrap rounded-lg px-3 py-1.5 text-[12px] font-semibold transition",
                tab === n.key ? "bg-secondary text-primary" : "text-muted-foreground",
              )}
            >
              {n.label}
            </button>
          ))}
        </div>

        <DialogPrimitive.Title className="sr-only">{incident.title}</DialogPrimitive.Title>
        <DialogPrimitive.Description className="sr-only">Incident case file {incident.code}</DialogPrimitive.Description>

        {/* Section header */}
        <header className="flex shrink-0 items-center justify-between border-b border-border px-6 py-5 pr-16">
          <h3 className="text-[20px] font-extrabold tracking-tight text-foreground">
            {NAV.find((n) => n.key === tab)?.label}
          </h3>
        </header>

        <div className="min-h-0 flex-1 overflow-y-auto">
          {tab === "overview" && <OverviewTab incident={incident} />}
          {tab === "evidence" && <EvidenceTab incident={incident} preview={preview} onPreview={setPreview} />}
          {tab === "timeline" && <TimelineTab incident={incident} />}
          {tab === "location" && <LocationTab incident={incident} />}
        </div>
      </div>
    </div>
  );
}

/* ---------- Clean settings-style row ---------- */
function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border px-6 py-5 last:border-b-0">
      <div className="min-w-0">
        <div className="text-[14px] font-semibold text-foreground">{label}</div>
        {hint && <div className="mt-0.5 text-[12px] text-muted-foreground">{hint}</div>}
      </div>
      <div className="shrink-0 text-right text-[14px] font-medium text-foreground">{children}</div>
    </div>
  );
}

function OverviewTab({ incident }: { incident: Incident }) {
  return (
    <div>
      <Row label="Report description" hint="Filed via mobile patrol app">
        <span className="block max-w-[420px] text-left text-[13px] font-normal leading-relaxed text-foreground/80">
          {incident.description}
        </span>
      </Row>
      <Row label="Case ID">
        <span className="font-mono">{incident.code}</span>
      </Row>
      <Row label="Type">{incident.type}</Row>
      <Row label="Priority">
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold uppercase ring-1", PRIORITY_STYLE[incident.priority])}>
          {incident.priority}
        </span>
      </Row>
      <Row label="Status">
        <span className={cn("rounded-full px-2.5 py-1 text-[11px] font-bold ring-1", STATUS_STYLE[incident.status])}>
          {incident.status}
        </span>
      </Row>
      <Row label="Reporter" hint="Field officer on scene">{incident.reporter}</Row>
      <Row label="Supervisor">{incident.supervisor}</Row>
      <Row label="Assigned team">{incident.team}</Row>
      <Row label="Section">
        <span className="inline-flex items-center gap-1.5">
          <MapPin className="size-3.5 text-muted-foreground" /> {incident.section}
        </span>
      </Row>
      <Row label="Reported">{incident.time}</Row>
      <Row label="Attachments">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-2.5 py-1 text-[12px] font-semibold text-muted-foreground">
          <Paperclip className="size-3.5" /> {incident.attachments.length} files
        </span>
      </Row>
    </div>
  );
}

function EvidenceTab({
  incident,
  preview,
  onPreview,
}: {
  incident: Incident;
  preview: IncidentAttachment | null;
  onPreview: (a: IncidentAttachment | null) => void;
}) {
  const images = incident.attachments.filter((a) => a.type === "image");
  const videos = incident.attachments.filter((a) => a.type === "video");
  const audios = incident.attachments.filter((a) => a.type === "audio");

  return (
    <div className="p-6">
      {preview && <MediaPreview attachment={preview} onClose={() => onPreview(null)} />}

      {images.length > 0 && (
        <EvidenceGroup title="Photos" icon={FileImage} count={images.length}>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((a) => (
              <ImageThumb key={a.id} attachment={a} active={preview?.id === a.id} onSelect={() => onPreview(a)} />
            ))}
          </div>
        </EvidenceGroup>
      )}

      {videos.length > 0 && (
        <EvidenceGroup title="Videos" icon={FileVideo} count={videos.length}>
          <div className="space-y-2.5">
            {videos.map((a) => (
              <VideoCard key={a.id} attachment={a} active={preview?.id === a.id} onSelect={() => onPreview(a)} />
            ))}
          </div>
        </EvidenceGroup>
      )}

      {audios.length > 0 && (
        <EvidenceGroup title="Audio recordings" icon={FileAudio} count={audios.length}>
          <div className="space-y-2.5">
            {audios.map((a) => (
              <AudioCard key={a.id} attachment={a} active={preview?.id === a.id} onSelect={() => onPreview(a)} />
            ))}
          </div>
        </EvidenceGroup>
      )}

      {incident.attachments.length === 0 && (
        <div className="grid place-items-center gap-2 py-16 text-center">
          <Paperclip className="size-8 text-muted-foreground/40" />
          <p className="text-sm font-semibold text-foreground">No attachments</p>
          <p className="text-xs text-muted-foreground">No files were submitted with this report</p>
        </div>
      )}
    </div>
  );
}

function TimelineTab({ incident }: { incident: Incident }) {
  return (
    <div className="p-6">
      <div className="rounded-2xl border border-border bg-card p-6">
        <div className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Resolution progress</div>
        <h4 className="mt-1 text-[15px] font-bold text-foreground">Case lifecycle</h4>
        <div className="mt-5">
          <Stepper steps={buildSteps(incident)} activeIndex={STATUS_INDEX[incident.status]} />
        </div>
      </div>
    </div>
  );
}

function LocationTab({ incident }: { incident: Incident }) {
  const q = `${incident.lat},${incident.lng}`;
  const src = `https://maps.google.com/maps?q=${q}&z=13&output=embed`;
  return (
    <div className="p-6">
      <div className="overflow-hidden rounded-2xl border border-border">
        <iframe
          title="Incident location"
          src={src}
          className="h-[320px] w-full"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
        <div className="flex items-center justify-between border-t border-border bg-card px-4 py-3">
          <div>
            <div className="text-[13px] font-semibold text-foreground">{incident.section}</div>
            <div className="font-mono text-[11px] text-muted-foreground">{incident.lat.toFixed(4)}, {incident.lng.toFixed(4)}</div>
          </div>
          <a
            href={`https://maps.google.com/maps?q=${q}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-2 text-[12px] font-semibold text-foreground transition hover:bg-secondary"
          >
            <Navigation className="size-3.5 text-sky" /> Open in Maps
          </a>
        </div>
      </div>
    </div>
  );
}

function EvidenceGroup({
  title,
  icon: Icon,
  count,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  count: number;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 flex items-center gap-2 text-[12px] font-bold uppercase tracking-wider text-muted-foreground">
        <Icon className="size-4" /> {title}
        <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-bold normal-case">{count}</span>
      </div>
      {children}
    </div>
  );
}

function ImageThumb({
  attachment,
  active,
  onSelect,
}: {
  attachment: IncidentAttachment;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "group relative aspect-[4/3] overflow-hidden rounded-xl border bg-secondary transition",
        active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-primary/40",
      )}
    >
      <img src={attachment.url} alt={attachment.name} className="size-full object-cover transition group-hover:scale-105" />
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2">
        <div className="truncate text-left text-[10px] font-semibold text-white">{attachment.name}</div>
        <div className="text-left text-[9px] text-white/70">{attachment.size}</div>
      </div>
    </button>
  );
}

function VideoCard({
  attachment,
  active,
  onSelect,
}: {
  attachment: IncidentAttachment;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition hover:shadow-soft",
        active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30",
      )}
    >
      <div className="relative size-16 shrink-0 overflow-hidden rounded-lg bg-secondary">
        {attachment.thumbnail ? (
          <img src={attachment.thumbnail} alt="" className="size-full object-cover" />
        ) : (
          <div className="grid size-full place-items-center bg-primary/10">
            <FileVideo className="size-6 text-primary" />
          </div>
        )}
        <div className="absolute inset-0 grid place-items-center bg-black/30">
          <div className="grid size-8 place-items-center rounded-full bg-white/90">
            <Play className="size-4 text-foreground" />
          </div>
        </div>
        {attachment.duration && (
          <span className="absolute bottom-1 right-1 rounded bg-black/70 px-1 py-0.5 text-[9px] font-bold text-white">
            {attachment.duration}
          </span>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-foreground">{attachment.name}</div>
        <div className="text-[11px] text-muted-foreground">{attachment.uploadedBy} · {attachment.uploadedAt}</div>
        {attachment.size && <div className="text-[10px] text-muted-foreground">{attachment.size}</div>}
      </div>
    </button>
  );
}

function AudioCard({
  attachment,
  active,
  onSelect,
}: {
  attachment: IncidentAttachment;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full items-center gap-3 rounded-xl border bg-card p-3 text-left transition hover:shadow-soft",
        active ? "border-primary ring-2 ring-primary/20" : "border-border hover:border-primary/30",
      )}
    >
      <div className="grid size-12 shrink-0 place-items-center rounded-xl bg-primary/10">
        <FileAudio className="size-5 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <div className="truncate text-[13px] font-semibold text-foreground">{attachment.name}</div>
        <div className="text-[11px] text-muted-foreground">{attachment.uploadedBy} · {attachment.uploadedAt}</div>
        <div className="mt-1.5 flex items-end gap-0.5">
          {Array.from({ length: 24 }).map((_, i) => (
            <span
              key={i}
              className="w-1 rounded-full bg-primary/40"
              style={{ height: `${8 + Math.sin(i * 0.8) * 6 + (i % 4) * 2}px` }}
            />
          ))}
          {attachment.duration && (
            <span className="ml-2 text-[10px] font-medium text-muted-foreground">{attachment.duration}</span>
          )}
        </div>
      </div>
    </button>
  );
}

function MediaPreview({
  attachment,
  onClose,
}: {
  attachment: IncidentAttachment;
  onClose: () => void;
}) {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="mb-6 overflow-hidden rounded-xl border border-border bg-card shadow-soft">
      <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
        <div className="min-w-0">
          <div className="truncate text-[13px] font-semibold text-foreground">{attachment.name}</div>
          <div className="text-[11px] text-muted-foreground">
            {attachment.uploadedBy} · {attachment.uploadedAt}
            {attachment.size && ` · ${attachment.size}`}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <a
            href={attachment.url}
            download
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Download"
          >
            <Download className="size-4" />
          </a>
          <button
            onClick={onClose}
            className="grid size-8 place-items-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
            aria-label="Close preview"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      <div className="bg-secondary/30 p-4">
        {attachment.type === "image" && (
          <img src={attachment.url} alt={attachment.name} className="mx-auto max-h-[360px] w-full rounded-lg object-contain" />
        )}

        {attachment.type === "video" && (
          <video src={attachment.url} controls className="mx-auto max-h-[360px] w-full rounded-lg bg-black" poster={attachment.thumbnail} />
        )}

        {attachment.type === "audio" && (
          <div className="mx-auto max-w-md rounded-xl border border-border bg-card p-5">
            <div className="mb-4 flex items-center justify-center">
              <div className="grid size-16 place-items-center rounded-2xl bg-primary/10">
                <FileAudio className="size-8 text-primary" />
              </div>
            </div>
            <div className="mb-4 flex items-end justify-center gap-0.5">
              {Array.from({ length: 40 }).map((_, i) => (
                <span
                  key={i}
                  className={cn("w-1 rounded-full transition-colors", playing ? "bg-primary" : "bg-primary/30")}
                  style={{ height: `${10 + Math.sin(i * 0.5) * 8 + (i % 3) * 3}px` }}
                />
              ))}
            </div>
            <audio
              src={attachment.url}
              controls
              className="w-full"
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
