import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import {
  X,
  UserRound,
  IdCard,
  MapPin,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Check,
  Phone,
  Mail,
  Star,
} from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
  { key: "personal", label: "Personal info", icon: UserRound },
  { key: "identification", label: "Identification", icon: IdCard },
  { key: "assignment", label: "Location & assignment", icon: MapPin },
  { key: "review", label: "Review", icon: ShieldCheck },
] as const;

type Form = {
  firstName: string;
  lastName: string;
  rank: string;
  gender: string;
  dob: string;
  phone: string;
  email: string;
  nationalId: string;
  badgeNumber: string;
  employeeId: string;
  idType: string;
  zone: string;
  dispatchBase: string;
  teams: string;
  officers: string;
  shift: string;
  status: string;
};

const EMPTY: Form = {
  firstName: "",
  lastName: "",
  rank: "Section Command",
  gender: "Male",
  dob: "",
  phone: "",
  email: "",
  nationalId: "",
  badgeNumber: "",
  employeeId: "",
  idType: "National ID",
  zone: "",
  dispatchBase: "",
  teams: "",
  officers: "",
  shift: "06:00 – 18:00 EAT",
  status: "On duty",
};

export function AddSupervisorModal({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<Form>(EMPTY);

  useEffect(() => {
    if (open) {
      setStep(0);
      setForm(EMPTY);
    }
  }, [open]);

  function set<K extends keyof Form>(key: K, value: Form[K]) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  const isLast = step === STEPS.length - 1;

  function next() {
    if (isLast) {
      onOpenChange(false);
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-foreground/45 backdrop-blur-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <DialogPrimitive.Content className="fixed left-1/2 top-1/2 z-50 flex h-[88vh] max-h-[760px] w-[92vw] max-w-[860px] -translate-x-1/2 -translate-y-1/2 flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-elevated duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
          <DialogPrimitive.Title className="sr-only">Add supervisor</DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">Multi-step form to register a new supervisor</DialogPrimitive.Description>

          {/* Header + stepper */}
          <header className="shrink-0 border-b border-border px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-[17px] font-extrabold tracking-tight text-foreground">Add supervisor</h2>
                <p className="text-[12px] text-muted-foreground">Step {step + 1} of {STEPS.length} · {STEPS[step].label}</p>
              </div>
              <DialogPrimitive.Close className="grid size-9 place-items-center rounded-lg border border-border bg-card text-muted-foreground transition hover:bg-secondary hover:text-foreground">
                <X className="size-4" />
              </DialogPrimitive.Close>
            </div>

            {/* Stepper */}
            <ol className="mt-5 flex items-center">
              {STEPS.map((s, i) => {
                const done = i < step;
                const current = i === step;
                const Icon = s.icon;
                return (
                  <li key={s.key} className="flex flex-1 items-center last:flex-none">
                    <button
                      type="button"
                      onClick={() => i <= step && setStep(i)}
                      className="flex shrink-0 flex-col items-center gap-1.5"
                    >
                      <span
                        className={cn(
                          "grid size-10 place-items-center rounded-full border-2 text-[13px] font-bold transition",
                          done
                            ? "border-success bg-success text-white"
                            : current
                              ? "border-primary bg-primary text-white shadow-soft"
                              : "border-border bg-card text-muted-foreground",
                        )}
                      >
                        {done ? <Check className="size-4" /> : <Icon className="size-[18px]" />}
                      </span>
                      <span
                        className={cn(
                          "hidden text-[11px] font-semibold sm:block",
                          current ? "text-primary" : done ? "text-foreground" : "text-muted-foreground",
                        )}
                      >
                        {s.label}
                      </span>
                    </button>
                    {i < STEPS.length - 1 && (
                      <div className="mx-2 h-0.5 flex-1 rounded-full bg-secondary">
                        <div className={cn("h-full rounded-full transition-all", done ? "w-full bg-success" : "w-0")} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
          </header>

          {/* Body */}
          <div className="min-h-0 flex-1 overflow-y-auto p-6">
            {step === 0 && <PersonalStep form={form} set={set} />}
            {step === 1 && <IdentificationStep form={form} set={set} />}
            {step === 2 && <AssignmentStep form={form} set={set} />}
            {step === 3 && <ReviewStep form={form} />}
          </div>

          {/* Footer */}
          <footer className="flex shrink-0 items-center justify-between border-t border-border px-6 py-4">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(s - 1, 0))}
              disabled={step === 0}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-4 py-2 text-[13px] font-semibold text-foreground transition hover:bg-secondary disabled:cursor-default disabled:opacity-40"
            >
              <ChevronLeft className="size-4" /> Back
            </button>
            <div className="flex items-center gap-2">
              <DialogPrimitive.Close className="rounded-lg px-4 py-2 text-[13px] font-semibold text-muted-foreground transition hover:text-foreground">
                Cancel
              </DialogPrimitive.Close>
              <button
                type="button"
                onClick={next}
                className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-[13px] font-semibold text-primary-foreground transition hover:bg-primary-light"
              >
                {isLast ? (
                  <>
                    <Check className="size-4" /> Create supervisor
                  </>
                ) : (
                  <>
                    Continue <ChevronRight className="size-4" />
                  </>
                )}
              </button>
            </div>
          </footer>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

type StepProps = {
  form: Form;
  set: <K extends keyof Form>(key: K, value: Form[K]) => void;
};

function PersonalStep({ form, set }: StepProps) {
  return (
    <FormGrid>
      <Input label="First name" value={form.firstName} onChange={(v) => set("firstName", v)} placeholder="Emmanuel" required />
      <Input label="Last name" value={form.lastName} onChange={(v) => set("lastName", v)} placeholder="Mwita" required />
      <Select label="Rank" value={form.rank} onChange={(v) => set("rank", v)} options={["Corridor Lead", "Section Command", "Field Officer"]} />
      <Select label="Gender" value={form.gender} onChange={(v) => set("gender", v)} options={["Male", "Female"]} />
      <Input label="Date of birth" type="date" value={form.dob} onChange={(v) => set("dob", v)} />
      <Input label="Phone number" value={form.phone} onChange={(v) => set("phone", v)} placeholder="+255 712 000 000" icon={Phone} />
      <Input label="Email address" type="email" value={form.email} onChange={(v) => set("email", v)} placeholder="name@sgr.tz" icon={Mail} className="sm:col-span-2" />
    </FormGrid>
  );
}

function IdentificationStep({ form, set }: StepProps) {
  return (
    <FormGrid>
      <Select label="ID document type" value={form.idType} onChange={(v) => set("idType", v)} options={["National ID", "Passport", "Driver License"]} className="sm:col-span-2" />
      <Input label="National ID number" value={form.nationalId} onChange={(v) => set("nationalId", v)} placeholder="19900101-00001-00001-00" required />
      <Input label="Badge number" value={form.badgeNumber} onChange={(v) => set("badgeNumber", v)} placeholder="SGR-0001" required />
      <Input label="Employee ID" value={form.employeeId} onChange={(v) => set("employeeId", v)} placeholder="EMP-00123" />
      <div className="sm:col-span-2">
        <Label>ID document upload</Label>
        <div className="mt-1.5 flex items-center justify-center rounded-xl border border-dashed border-border bg-secondary/30 px-4 py-8 text-center">
          <div>
            <IdCard className="mx-auto size-7 text-muted-foreground/50" />
            <p className="mt-2 text-[13px] font-semibold text-foreground">Click to upload or drag & drop</p>
            <p className="text-[11px] text-muted-foreground">PNG, JPG or PDF · up to 5 MB</p>
          </div>
        </div>
      </div>
    </FormGrid>
  );
}

function AssignmentStep({ form, set }: StepProps) {
  return (
    <FormGrid>
      <Input label="Sector / zone" value={form.zone} onChange={(v) => set("zone", v)} placeholder="Dar — Ruvu" icon={MapPin} required />
      <Input label="Dispatch base" value={form.dispatchBase} onChange={(v) => set("dispatchBase", v)} placeholder="Dar es Salaam" />
      <Input label="Teams to supervise" type="number" value={form.teams} onChange={(v) => set("teams", v)} placeholder="3" />
      <Input label="Officers under command" type="number" value={form.officers} onChange={(v) => set("officers", v)} placeholder="24" />
      <Select label="Shift window" value={form.shift} onChange={(v) => set("shift", v)} options={["06:00 – 18:00 EAT", "18:00 – 06:00 EAT", "Flexible"]} />
      <Select label="Initial status" value={form.status} onChange={(v) => set("status", v)} options={["On duty", "Briefing", "Off duty"]} />
    </FormGrid>
  );
}

function ReviewStep({ form }: { form: Form }) {
  const name = `${form.firstName || "—"} ${form.lastName}`.trim();
  return (
    <div className="space-y-5">
      <div className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/30 p-4">
        <div className="grid size-14 shrink-0 place-items-center rounded-2xl bg-primary text-base font-extrabold text-white">
          {(form.firstName[0] ?? "") + (form.lastName[0] ?? "") || "SV"}
        </div>
        <div className="min-w-0">
          <div className="text-[16px] font-extrabold text-foreground">{name || "New supervisor"}</div>
          <div className="text-[12px] text-muted-foreground">{form.rank} · {form.zone || "Unassigned sector"}</div>
          <div className="mt-1 inline-flex items-center gap-1 text-[12px] font-semibold text-warning">
            <Star className="size-3.5 fill-warning" /> New · pending activation
          </div>
        </div>
      </div>

      <ReviewSection title="Personal info">
        <ReviewRow label="Full name" value={name} />
        <ReviewRow label="Rank" value={form.rank} />
        <ReviewRow label="Gender" value={form.gender} />
        <ReviewRow label="Date of birth" value={form.dob || "—"} />
        <ReviewRow label="Phone" value={form.phone || "—"} />
        <ReviewRow label="Email" value={form.email || "—"} />
      </ReviewSection>

      <ReviewSection title="Identification">
        <ReviewRow label="ID type" value={form.idType} />
        <ReviewRow label="National ID" value={form.nationalId || "—"} />
        <ReviewRow label="Badge number" value={form.badgeNumber || "—"} />
        <ReviewRow label="Employee ID" value={form.employeeId || "—"} />
      </ReviewSection>

      <ReviewSection title="Location & assignment">
        <ReviewRow label="Sector" value={form.zone || "—"} />
        <ReviewRow label="Dispatch base" value={form.dispatchBase || "—"} />
        <ReviewRow label="Teams" value={form.teams || "—"} />
        <ReviewRow label="Officers" value={form.officers || "—"} />
        <ReviewRow label="Shift" value={form.shift} />
        <ReviewRow label="Status" value={form.status} />
      </ReviewSection>
    </div>
  );
}

/* ---------- Form primitives ---------- */
function FormGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>;
}

function Label({ children }: { children: React.ReactNode }) {
  return <label className="text-[12px] font-semibold text-foreground">{children}</label>;
}

function Input({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  icon: Icon,
  required,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  icon?: React.ComponentType<{ className?: string }>;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="relative mt-1.5">
        {Icon && <Icon className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(
            "w-full rounded-lg border border-border bg-card py-2.5 text-[13px] text-foreground placeholder:text-muted-foreground transition focus:border-ring focus:outline-none focus:ring-4 focus:ring-ring/10",
            Icon ? "pl-9 pr-3" : "px-3",
          )}
        />
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
  className,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  className?: string;
}) {
  return (
    <div className={className}>
      <Label>{label}</Label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1.5 w-full rounded-lg border border-border bg-card px-3 py-2.5 text-[13px] font-medium text-foreground transition focus:border-ring focus:outline-none focus:ring-4 focus:ring-ring/10"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

function ReviewSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-xl border border-border">
      <div className="border-b border-border bg-secondary/40 px-4 py-2 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {title}
      </div>
      <div className="divide-y divide-border">{children}</div>
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 px-4 py-2.5">
      <span className="text-[12px] text-muted-foreground">{label}</span>
      <span className="text-[13px] font-semibold text-foreground">{value}</span>
    </div>
  );
}
