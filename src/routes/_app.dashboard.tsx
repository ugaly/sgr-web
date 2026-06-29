import { createFileRoute } from "@tanstack/react-router";
import { Users, ShieldCheck, FileWarning, Activity } from "lucide-react";

import { Topbar } from "@/components/sgr/Topbar";
import { StatCard } from "@/components/sgr/StatCard";
import { RailwayMap } from "@/components/sgr/RailwayMap";
import { IncidentsTable } from "@/components/sgr/IncidentsTable";
import { SupervisorsList } from "@/components/sgr/SupervisorsList";
import { TeamsGrid } from "@/components/sgr/TeamsGrid";
import { ActivityFeed } from "@/components/sgr/ActivityFeed";
import { ReportsChart } from "@/components/sgr/ReportsChart";

export const Route = createFileRoute("/_app/dashboard")({
  head: () => ({
    meta: [{ title: "Dashboard · SGR Guardian" }],
  }),
  component: Dashboard,
});

function Dashboard() {
  return (
    <>
      <Topbar />
      <div className="space-y-6 p-4 sm:p-6 lg:p-8">
        <section className="grid gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Officers On Duty" value="78" delta="+4.2%" trend="up" icon={Users} tone="primary" hint="of 92 total · 6 supervisors active" />
          <StatCard label="Open Incidents" value="14" delta="-2" trend="down" icon={FileWarning} tone="warning" hint="3 high priority · 1 SOS active" />
          <StatCard label="Corridor Coverage" value="96%" delta="+1.1%" trend="up" icon={ShieldCheck} tone="success" hint="Dar — Dodoma · 9/10 stations" />
          <StatCard label="Avg Response" value="4m 12s" delta="-18s" trend="up" icon={Activity} tone="sky" hint="from alert to first acknowledgement" />
        </section>

        <section className="grid gap-6 grid-cols-1 xl:grid-cols-3">
          <div className="xl:col-span-2"><RailwayMap /></div>
          <div className="xl:col-span-1"><ActivityFeed /></div>
        </section>

        <section className="grid gap-6 grid-cols-1 xl:grid-cols-2">
          <div className="flex flex-col gap-6">
            <div className="flex-1">
              <TeamsGrid />
            </div>
            <ReportsChart />
          </div>
          <SupervisorsList />
        </section>

        <section>
          <IncidentsTable />
        </section>

        <footer className="py-6 text-center text-[11px] text-muted-foreground">
          SGR Guardian Command · Tanzania Railways Corporation · v1.0
        </footer>
      </div>
    </>
  );
}
