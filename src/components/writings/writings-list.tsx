"use client";

import { useState } from "react";
import { Segmented } from "@/components/ui/segmented";
import { PostRow } from "./post-row";
import type { WritingMeta } from "@/lib/writings";
import { tagSlug } from "@/lib/slug";

const ALL = "all";

/** The writing list with the same tag filter every list on the site uses.
 *  Tag pages (/writings/tag/<slug>) still exist for search engines. */
export function WritingsList({
  posts,
  tags,
  allLabel,
  filterLabel,
}: {
  posts: WritingMeta[];
  tags: { tag: string; slug: string }[];
  allLabel: string;
  filterLabel: string;
}) {
  const [tag, setTag] = useState(ALL);
  const shown =
    tag === ALL
      ? posts
      : posts.filter((p) => (p.tags ?? []).some((t) => tagSlug(t) === tag));

  return (
    <div className="flex flex-col gap-6">
      {tags.length > 1 && (
        <Segmented
          label={filterLabel}
          value={tag}
          onChange={setTag}
          options={[
            { value: ALL, label: allLabel },
            ...tags.map((t) => ({ value: t.slug, label: t.tag })),
          ]}
        />
      )}
      <div className="border-t border-border">
        {shown.map((post) => (
          <PostRow key={post.slug} post={post} />
        ))}
      </div>
    </div>
  );
}
