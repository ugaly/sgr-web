import { REPORTS_TREND } from "@/lib/sgr-data";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

export function ReportsChart() {
  return (
    <section className="rounded-2xl border border-border bg-card shadow-soft">
      <header className="flex items-center justify-between px-6 py-5 border-b border-border">
        <div>
          <h3 className="text-[15px] font-bold text-foreground">Incident Trend</h3>
          <p className="text-xs text-muted-foreground mt-0.5">Submitted vs resolved this week</p>
        </div>
        <div className="flex items-center gap-4 text-[11px] font-semibold">
          <span className="flex items-center gap-1.5 text-foreground/80">
            <span className="size-2.5 rounded-sm bg-primary" /> Submitted
          </span>
          <span className="flex items-center gap-1.5 text-foreground/80">
            <span className="size-2.5 rounded-sm bg-sky" /> Resolved
          </span>
        </div>
      </header>

      <div className="h-64 p-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={REPORTS_TREND} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="gSub" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#10367D" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#10367D" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gRes" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#5B9BD5" stopOpacity={0.35} />
                <stop offset="100%" stopColor="#5B9BD5" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="4 4" stroke="rgba(16,54,125,0.08)" vertical={false} />
            <XAxis dataKey="day" stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={11} />
            <YAxis stroke="#94A3B8" tickLine={false} axisLine={false} fontSize={11} width={36} />
            <Tooltip
              contentStyle={{
                borderRadius: 12,
                border: "1px solid rgba(16,54,125,0.1)",
                fontFamily: "Poppins, sans-serif",
                fontSize: 12,
                boxShadow: "0 10px 30px -12px rgba(16,54,125,0.2)",
              }}
            />
            <Area type="monotone" dataKey="submitted" stroke="#10367D" strokeWidth={2.5} fill="url(#gSub)" />
            <Area type="monotone" dataKey="resolved"  stroke="#5B9BD5" strokeWidth={2.5} fill="url(#gRes)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
