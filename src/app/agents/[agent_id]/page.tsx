"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAgent, useSuspendAgent, useRevokeToken } from "@/lib/hooks/useAgents";
import { AgentDetail } from "@/components/agents/AgentDetail";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft } from "lucide-react";

export default function AgentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const agentId = params.agent_id as string;

  const { data: agent, isLoading } = useAgent(agentId);
  const suspendMutation = useSuspendAgent();
  const revokeMutation = useRevokeToken();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  if (!agent) {
    return (
      <div className="space-y-6">
        <p className="text-muted-foreground">Agent not found</p>
        <Button variant="outline" onClick={() => router.push("/agents")}>
          Back to Agents
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" asChild>
          <Link href="/agents">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold">{agent.id}</h1>
      </div>

      <AgentDetail
        agent={agent}
        onSuspend={async () => {
          await suspendMutation.mutateAsync(agentId);
        }}
        onRevokeToken={async (jti) => {
          await revokeMutation.mutateAsync(jti);
        }}
        isSuspending={suspendMutation.isPending}
        isRevoking={revokeMutation.isPending}
      />
    </div>
  );
}
