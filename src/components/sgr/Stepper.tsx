import { Check } from "lucide-react";

export type Step = {
  key: string;
  label: string;
  hint?: string;
  time?: string;
  by?: string;
};

type Props = {
  steps: Step[];
  activeIndex: number;
  orientation?: "vertical" | "horizontal";
};

export function Stepper({ steps, activeIndex, orientation = "vertical" }: Props) {
  if (orientation === "horizontal") {
    return (
      <ol className="flex items-center w-full">
        {steps.map((s, i) => {
          const done = i < activeIndex;
          const current = i === activeIndex;
          return (
            <li key={s.key} className="flex-1 flex items-center">
              <div className="flex flex-col items-center gap-2">
                <div
                  className={[
                    "grid size-9 place-items-center rounded-full text-[12px] font-bold ring-4 transition",
                    done
                      ? "bg-success text-white ring-success/15"
                      : current
                        ? "bg-primary text-primary-foreground ring-primary/15 shadow-elevated"
                        : "bg-secondary text-muted-foreground ring-secondary/40",
                  ].join(" ")}
                >
                  {done ? <Check className="size-4" /> : i + 1}
                </div>
                <div className="text-center">
                  <div
                    className={[
                      "text-[11px] font-semibold",
                      current ? "text-primary" : done ? "text-foreground" : "text-muted-foreground",
                    ].join(" ")}
                  >
                    {s.label}
                  </div>
                  {s.time && (
                    <div className="text-[10px] text-muted-foreground mt-0.5">{s.time}</div>
                  )}
                </div>
              </div>
              {i < steps.length - 1 && (
                <div className="flex-1 mx-2 h-[2px] rounded-full overflow-hidden bg-secondary">
                  <div
                    className={[
                      "h-full rounded-full transition-all",
                      done ? "w-full bg-success" : current ? "w-1/2 bg-gradient-to-r from-primary to-sky" : "w-0",
                    ].join(" ")}
                  />
                </div>
              )}
            </li>
          );
        })}
      </ol>
    );
  }

  return (
    <ol className="relative">
      {steps.map((s, i) => {
        const done = i < activeIndex;
        const current = i === activeIndex;
        const isLast = i === steps.length - 1;
        return (
          <li key={s.key} className="relative flex gap-4 pb-5 last:pb-0">
            {!isLast && (
              <span
                className={[
                  "absolute left-[17px] top-9 bottom-0 w-[2px] rounded-full",
                  done ? "bg-success/40" : "bg-border",
                ].join(" ")}
              />
            )}
            <div
              className={[
                "relative z-10 grid size-9 shrink-0 place-items-center rounded-full text-[12px] font-bold ring-4 ring-card transition",
                done
                  ? "bg-success text-white"
                  : current
                    ? "bg-primary text-primary-foreground shadow-elevated"
                    : "bg-secondary text-muted-foreground",
              ].join(" ")}
            >
              {done ? <Check className="size-4" /> : i + 1}
            </div>
            <div className="min-w-0 flex-1 pt-1">
              <div className="flex items-center justify-between gap-3">
                <div
                  className={[
                    "text-[13px] font-semibold",
                    current ? "text-primary" : done ? "text-foreground" : "text-muted-foreground",
                  ].join(" ")}
                >
                  {s.label}
                </div>
                {s.time && <div className="text-[11px] text-muted-foreground">{s.time}</div>}
              </div>
              {s.hint && <div className="text-[12px] text-muted-foreground mt-0.5">{s.hint}</div>}
              {s.by && (
                <div className="mt-1 text-[11px] text-muted-foreground">by {s.by}</div>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}
