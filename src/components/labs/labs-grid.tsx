"use client";

import { useMemo, useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { LabCard } from "./lab-card";
import type { LabMeta } from "@/lib/labs";

const ALL = "all";

/** The Labs list with a topic filter. The filter appears only when there
 *  is more than one topic to choose from. */
export function LabsGrid({
  labs,
  allLabel,
  filterLabel,
}: {
  labs: LabMeta[];
  allLabel: string;
  filterLabel: string;
}) {
  const [topic, setTopic] = useState(ALL);
  const topics = useMemo(
    () => [...new Set(labs.map((l) => l.topic).filter(Boolean))] as string[],
    [labs],
  );
  const shown = topic === ALL ? labs : labs.filter((l) => l.topic === topic);

  return (
    <div className="flex flex-col gap-6">
      {topics.length > 1 && (
        <Segmented
          label={filterLabel}
          value={topic}
          onChange={setTopic}
          options={[
            { value: ALL, label: allLabel },
            ...topics.map((t) => ({ value: t, label: t })),
          ]}
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((lab) => (
          <LabCard key={lab.slug} lab={lab} />
        ))}
      </div>
    </div>
  );
}
