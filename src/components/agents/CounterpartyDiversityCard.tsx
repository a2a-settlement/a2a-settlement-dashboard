"use client";

interface CounterpartyDiversityCardProps {
  unique_counterparties_90d?: number;
  counterparty_hhi?: number | null;
  diversity_score?: number | null;
}

function HHIBar({ hhi }: { hhi: number }) {
  const pct = Math.round(hhi * 100);
  const color =
    hhi >= 0.7
      ? "bg-red-500"
      : hhi >= 0.4
      ? "bg-amber-500"
      : "bg-green-500";

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>Diverse</span>
        <span>Concentrated</span>
      </div>
      <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-muted-foreground text-right">{pct}% HHI</p>
    </div>
  );
}

export function CounterpartyDiversityCard({
  unique_counterparties_90d,
  counterparty_hhi,
  diversity_score,
}: CounterpartyDiversityCardProps) {
  const hasData =
    unique_counterparties_90d !== undefined ||
    counterparty_hhi !== undefined ||
    diversity_score !== undefined;

  if (!hasData) return null;

  const diversityPct =
    diversity_score != null ? Math.round(diversity_score * 100) : null;

  return (
    <div className="rounded-lg border bg-card p-4 space-y-4">
      <h3 className="text-sm font-semibold">Counterparty Diversity</h3>
      <p className="text-xs text-muted-foreground">
        Based on last 90 days of transactions. Updated nightly.
      </p>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-muted-foreground">Unique Counterparties</p>
          <p className="text-2xl font-bold">
            {unique_counterparties_90d ?? "—"}
          </p>
          <p className="text-xs text-muted-foreground">90-day rolling</p>
        </div>

        {diversityPct !== null && (
          <div>
            <p className="text-xs text-muted-foreground">Diversity Score</p>
            <p className="text-2xl font-bold">{diversityPct}%</p>
            <p className="text-xs text-muted-foreground">
              {diversityPct >= 70
                ? "Healthy"
                : diversityPct >= 40
                ? "Moderate"
                : "Concentrated"}
            </p>
          </div>
        )}
      </div>

      {counterparty_hhi != null && <HHIBar hhi={counterparty_hhi} />}
    </div>
  );
}
