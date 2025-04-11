"use client";
import React, { useState } from "react";
import { Plus } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  GraphExecutionID,
  GraphExecutionMeta,
  LibraryAgent,
  LibraryAgentPreset,
  LibraryAgentPresetID,
  Schedule,
  ScheduleID,
} from "@/lib/autogpt-server-api";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/agptui/Button";
import { Badge } from "@/components/ui/badge";

import { AgentRunsViewSelection } from "@/app/library/agents/[id]/page";
import { agentRunStatusMap } from "@/components/agents/agent-run-status-chip";
import AgentRunSummaryCard from "@/components/agents/agent-run-summary-card";

interface AgentRunsSelectorListProps {
  agent: LibraryAgent;
  agentRuns: GraphExecutionMeta[];
  agentPresets: LibraryAgentPreset[];
  schedules: Schedule[];
  selectedView: AgentRunsViewSelection;
  allowDraftNewRun?: boolean;
  onSelectRun: (id: GraphExecutionID) => void;
  onSelectPreset: (id: LibraryAgentPresetID) => void;
  onSelectSchedule: (schedule: Schedule) => void;
  onSelectDraftNewRun: () => void;
  onDeleteRun: (id: GraphExecutionMeta) => void;
  // onDeletePreset: (id: LibraryAgentPresetID) => void;
  onDeleteSchedule: (id: ScheduleID) => void;
  onPinAsPreset: (run: GraphExecutionMeta) => void;
  className?: string;
}

export default function AgentRunsSelectorList({
  agent,
  agentRuns,
  agentPresets,
  schedules,
  selectedView,
  allowDraftNewRun = true,
  onSelectRun,
  onSelectPreset,
  onSelectSchedule,
  onSelectDraftNewRun,
  onDeleteRun,
  // onDeletePreset,
  onDeleteSchedule,
  onPinAsPreset,
  className,
}: AgentRunsSelectorListProps): React.ReactElement {
  const [activeListTab, setActiveListTab] = useState<"runs" | "scheduled">(
    "runs",
  );

  return (
    <aside className={cn("flex flex-col gap-4", className)}>
      {allowDraftNewRun && (
        <Button
          size="card"
          className={
            "mb-4 hidden h-16 w-72 items-center gap-2 py-6 lg:flex xl:w-80 " +
            (selectedView.type == "run" && !selectedView.id
              ? "agpt-card-selected text-accent"
              : "")
          }
          onClick={onSelectDraftNewRun}
        >
          <Plus className="h-6 w-6" />
          <span>New run</span>
        </Button>
      )}

      <div className="flex gap-2">
        <Badge
          variant={activeListTab === "runs" ? "secondary" : "outline"}
          className="cursor-pointer gap-2 rounded-full text-base"
          onClick={() => setActiveListTab("runs")}
        >
          <span>Runs</span>
          <span className="text-neutral-600">{agentRuns.length}</span>
        </Badge>

        <Badge
          variant={activeListTab === "scheduled" ? "secondary" : "outline"}
          className="cursor-pointer gap-2 rounded-full text-base"
          onClick={() => setActiveListTab("scheduled")}
        >
          <span>Scheduled</span>
          <span className="text-neutral-600">
            {schedules.filter((s) => s.graph_id === agent.graph_id).length}
          </span>
        </Badge>
      </div>

      {/* Runs+Presets / Schedules list */}
      <ScrollArea className="lg:h-[calc(100vh-200px)]">
        <div className="flex gap-2 lg:flex-col">
          {/* New Run button - only in small layouts */}
          {allowDraftNewRun && (
            <Button
              size="card"
              className={
                "flex h-28 w-40 items-center gap-2 py-6 lg:hidden " +
                (selectedView.type == "run" && !selectedView.id
                  ? "agpt-card-selected text-accent"
                  : "")
              }
              onClick={onSelectDraftNewRun}
            >
              <Plus className="h-6 w-6" />
              <span>New run</span>
            </Button>
          )}

          {activeListTab === "runs" ? (
            <>
              {/* Presets */}
              {agentPresets
                .toSorted(
                  (a, b) => b.updated_at.getTime() - a.updated_at.getTime(),
                )
                .map((preset) => (
                  <AgentRunSummaryCard
                    className="h-28 w-72 lg:h-auto xl:w-80"
                    key={preset.id}
                    type="preset"
                    title={preset.name}
                    selected={selectedView.id === preset.id}
                    onClick={() => onSelectPreset(preset.id)}
                    // onDelete={() => onDeletePreset(preset.id)}
                  />
                ))}

              {/* Runs */}
              {agentRuns
                .toSorted(
                  (a, b) => b.started_at.getTime() - a.started_at.getTime(),
                )
                .map((run) => (
                  <AgentRunSummaryCard
                    className="h-28 w-72 lg:h-30 xl:w-80"
                    key={run.id}
                    type="run"
                    status={agentRunStatusMap[run.status]}
                    title={agent.name}
                    timestamp={run.started_at}
                    selected={selectedView.id === run.id}
                    onClick={() => onSelectRun(run.id)}
                    onDelete={() => onDeleteRun(run)}
                    onPinAsPreset={() => onPinAsPreset(run)}
                  />
                ))}
            </>
          ) : (
            schedules
              .filter((schedule) => schedule.graph_id === agent.graph_id)
              .map((schedule) => (
                <AgentRunSummaryCard
                  className="h-28 w-72 lg:h-30 xl:w-80"
                  key={schedule.id}
                  type="schedule"
                  title={schedule.name}
                  timestamp={schedule.next_run_time}
                  selected={selectedView.id === schedule.id}
                  onClick={() => onSelectSchedule(schedule)}
                  onDelete={() => onDeleteSchedule(schedule.id)}
                />
              ))
          )}
        </div>
      </ScrollArea>
    </aside>
  );
}
