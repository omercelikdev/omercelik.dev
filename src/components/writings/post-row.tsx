import Link from "next/link";
import { Label } from "@/components/ui/badge";
import type { WritingMeta } from "@/lib/writings";

/** A writing as a list row: title on the left, date on the right, hairline
 *  divider, underline on hover. */
export function PostRow({ post }: { post: WritingMeta }) {
  const dateLabel = new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
  }).format(new Date(post.date));

  return (
    <Link
      href={`/writings/${post.slug}`}
      className="group flex items-baseline justify-between gap-6 border-b border-border py-5"
    >
      <span className="flex min-w-0 flex-col gap-1">
        <span
          lang={post.lang}
          className="font-serif text-lead font-medium text-foreground decoration-1 underline-offset-[5px] group-hover:underline"
        >
          {post.title}
        </span>
        {post.description && (
          <span
            lang={post.lang}
            className="line-clamp-2 max-w-xl text-ui text-muted-foreground sm:line-clamp-1"
          >
            {post.description}
          </span>
        )}
      </span>
      <span className="mono flex flex-none items-center gap-2 text-caption text-muted-foreground">
        <Label className="uppercase">{post.lang}</Label>
        <time dateTime={post.date}>{dateLabel}</time>
      </span>
    </Link>
  );
}
