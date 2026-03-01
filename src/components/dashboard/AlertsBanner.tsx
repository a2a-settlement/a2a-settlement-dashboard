"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { AlertTriangle, AlertCircle } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import type { Alert } from "@/lib/api/types";

export function AlertsBanner(props: { alerts: Alert[]; isLoading: boolean }) {
  const { alerts, isLoading } = props;

  if (isLoading) {
    return (
      <Card>
        <CardHeader><Skeleton className="h-6 w-24" /></CardHeader>
        <CardContent><Skeleton className="h-16 w-full" /></CardContent>
      </Card>
    );
  }

  if (alerts.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <p className="text-sm font-medium flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Active Alerts
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {alerts.map((alert) => (
            <Link
              key={alert.id}
              href={alert.link ?? "#"}
              className={`flex items-center gap-2 rounded-md border p-3 text-sm transition-colors hover:bg-accent ${
                alert.severity === "critical" ? "border-[#ef4444] bg-[#ef4444]/10" : "border-[#eab308] bg-[#eab308]/10"
              }`}
            >
              {alert.severity === "critical" ? <AlertCircle className="h-4 w-4 text-[#ef4444]" /> : <AlertTriangle className="h-4 w-4 text-[#eab308]" />}
              <span>{alert.message}</span>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
