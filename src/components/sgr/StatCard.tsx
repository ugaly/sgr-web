import type { LucideIcon } from "lucide-react";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

type Props = {
  label: string;
  value: string;
  delta?: string;
  trend?: "up" | "down";
  icon: LucideIcon;
  tone?: "primary" | "sky" | "success" | "warning" | "danger";
  hint?: string;
  spark?: number[];
};

const TONE: Record<NonNullable<Props["tone"]>, { bg: string; fg: string; stroke: string; fill: string }> = {
  primary: { bg: "bg-primary/8",      fg: "text-primary",     stroke: "#10367D", fill: "rgba(16,54,125,0.15)" },
  sky:     { bg: "bg-sky/15",         fg: "text-sky",         stroke: "#5B9BD5", fill: "rgba(91,155,213,0.18)" },
  success: { bg: "bg-success/10",     fg: "text-success",     stroke: "#12B76A", fill: "rgba(18,183,106,0.15)" },
  warning: { bg: "bg-warning/10",     fg: "text-warning",     stroke: "#F79009", fill: "rgba(247,144,9,0.15)" },
  danger:  { bg: "bg-destructive/10", fg: "text-destructive", stroke: "#F04438", fill: "rgba(240,68,56,0.15)" },
};

const DEFAULT_SPARK = [4, 6, 5, 8, 7, 10, 9, 12, 11, 14];

function Sparkline({ data, stroke, fill }: { data: number[]; stroke: string; fill: string }) {
  const w = 96;
  const h = 36;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => {
    const x = i * step;
    const y = h - ((v - min) / range) * (h - 4) - 2;
    return [x, y] as const;
  });
  const path = pts.map(([x, y], i) => (i === 0 ? `M${x},${y}` : `L${x},${y}`)).join(" ");
  const area = `${path} L${w},${h} L0,${h} Z`;
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className="overflow-visible">
      <path d={area} fill={fill} />
      <path d={path} fill="none" stroke={stroke} strokeWidth={2} strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r={3} fill={stroke} stroke="#fff" strokeWidth={1.5} />
    </svg>
  );
}

export function StatCard({
  label,
  value,
  delta,
  trend = "up",
  icon: Icon,
  tone = "primary",
  hint,
  spark = DEFAULT_SPARK,
}: Props) {
  const t = TONE[tone];
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-0.5 hover:shadow-elevated">
      <div className="flex items-start justify-between gap-3">
        <div className={`grid size-11 place-items-center rounded-xl ${t.bg} ${t.fg}`}>
          <Icon className="size-5" />
        </div>
        {delta && (
          <div
            className={[
              "inline-flex shrink-0 items-center gap-0.5 rounded-full px-2 py-1 text-[11px] font-bold ring-1",
              trend === "up"
                ? "bg-success/10 text-success ring-success/20"
                : "bg-destructive/10 text-destructive ring-destructive/20",
            ].join(" ")}
          >
            {trend === "up" ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
            {delta}
          </div>
        )}
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[12.5px] font-medium text-muted-foreground">{label}</div>
          <div className="mt-1 text-[28px] font-extrabold leading-none tracking-tight text-foreground">
            {value}
          </div>
        </div>
        <div className="opacity-90 group-hover:opacity-100 transition-opacity">
          <Sparkline data={spark} stroke={t.stroke} fill={t.fill} />
        </div>
      </div>

      {hint && (
        <div className="mt-4 border-t border-border pt-3 text-[12px] text-muted-foreground">
          {hint}
        </div>
      )}
    </div>
  );
}
