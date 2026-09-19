"use client";

import { useMemo, useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { WorkCard } from "./work-card";
import type { WorkMeta } from "@/lib/work";

const ALL = "all";

/** The Work list with a sector filter, shown once there are two sectors. */
export function WorkGrid({
  work,
  allLabel,
  filterLabel,
}: {
  work: WorkMeta[];
  allLabel: string;
  filterLabel: string;
}) {
  const [sector, setSector] = useState(ALL);
  const sectors = useMemo(
    () => [...new Set(work.map((w) => w.sector))],
    [work],
  );
  const shown = sector === ALL ? work : work.filter((w) => w.sector === sector);

  return (
    <div className="flex flex-col gap-6">
      {sectors.length > 1 && (
        <Segmented
          label={filterLabel}
          value={sector}
          onChange={setSector}
          options={[
            { value: ALL, label: allLabel },
            ...sectors.map((s) => ({ value: s, label: s })),
          ]}
        />
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {shown.map((item) => (
          <WorkCard key={item.slug} work={item} />
        ))}
      </div>
    </div>
  );
}
