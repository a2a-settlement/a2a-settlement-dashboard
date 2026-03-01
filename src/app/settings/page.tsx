"use client";

import { useExchangeHealth } from "@/lib/hooks/useExchangeHealth";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusIndicator } from "@/components/layout/StatusIndicator";

export default function SettingsPage() {
  const { data: health, isLoading } = useExchangeHealth();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Settings</h1>

      <Card>
        <CardHeader>
          <p className="text-sm font-medium">Exchange Connection</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="exchange-url">Exchange URL</Label>
            <Input
              id="exchange-url"
              defaultValue={process.env.NEXT_PUBLIC_EXCHANGE_URL ?? "http://localhost:3000"}
              readOnly
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <StatusIndicator
              status={isLoading ? "loading" : health?.ok ? "ok" : "error"}
              label={health?.latency != null ? `${health.latency}ms latency` : undefined}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-sm font-medium">Alert Thresholds</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="spending-threshold">Spending limit alert (%)</Label>
            <Input
              id="spending-threshold"
              type="number"
              defaultValue="80"
              className="mt-1 max-w-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Flag when agent reaches this % of daily limit
            </p>
          </div>
          <div>
            <Label htmlFor="reputation-threshold">Reputation drop alert</Label>
            <Input
              id="reputation-threshold"
              type="number"
              step="0.1"
              defaultValue="0.1"
              className="mt-1 max-w-[120px]"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Flag when reputation drops by this amount
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-sm font-medium">Notification Preferences</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Email and webhook notifications for alerts (coming soon)
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <p className="text-sm font-medium">API Key Management</p>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Dashboard API key for exchange authentication (coming soon)
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
