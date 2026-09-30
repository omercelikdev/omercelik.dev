import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ArrowLeft } from "lucide-react";
import { RailSection, ReadingShell } from "@/components/layout/reading-shell";
import { Label, Tag } from "@/components/ui/badge";
import { WorkCard } from "@/components/work/work-card";
import { getTheme } from "@/config/themes";
import { Counter } from "@/components/motion/counter";
import { LabCard } from "@/components/labs/lab-card";
import { Toc } from "@/components/writings/toc";
import { renderMdx } from "@/lib/mdx";
import { extractHeadings } from "@/lib/writings";
import { getLabsBySlugs } from "@/lib/labs";
import { getAllWritings } from "@/lib/writings";
import { PostRow } from "@/components/writings/post-row";
import { getProgrammeParts, getWorkBySlug, getWorkSlugs } from "@/lib/work";
import { pageMetadata } from "@/lib/seo";

export async function generateStaticParams() {
  return (await getWorkSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const work = await getWorkBySlug(slug);
  if (!work) return {};
  return pageMetadata({
    path: `/work/${slug}`,
    title: work.title,
    description: work.summary,
  });
}

/** A case study: the story in the centre column, the facts (sector, role,
 *  period, stack) and the outline pinned beside it. */
export default async function WorkStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const t = await getTranslations("work");
  const work = await getWorkBySlug(slug);
  if (!work) notFound();

  const [content, labs, parts, programme] = await Promise.all([
    renderMdx(work.content),
    getLabsBySlugs(work.labs ?? []),
    getProgrammeParts(work.slug),
    work.programme ? getWorkBySlug(work.programme) : null,
  ]);
  const themes = work.themes.map(getTheme).filter((x) => x !== undefined);
  const writings = (await getAllWritings()).filter((w) =>
    (w.themes ?? []).some((t) => work.themes.includes(t)),
  );
  const headings = extractHeadings(work.content);

  return (
    <ReadingShell
      aside={
        <>
          <dl className="flex flex-col gap-2 rounded-[var(--radius-xl)] border border-border p-4 text-ui">
            <Fact label={t("sector")}>{work.sector}</Fact>
            <Fact label={t("kind")}>{t(`kinds.${work.kind}`)}</Fact>
            <Fact label={t("role")}>{work.role}</Fact>
            <Fact label={t("period")}>{work.period}</Fact>
            <div>
              <dt className="text-caption text-muted-foreground">
                {t("themes")}
              </dt>
              <dd className="mt-1.5 flex flex-col gap-1">
                {themes.map((theme) => (
                  <Link
                    key={theme.slug}
                    href={`/work#${theme.slug}`}
                    className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
                  >
                    {theme.title}
                  </Link>
                ))}
              </dd>
            </div>
            <div>
              <dt className="text-caption text-muted-foreground">
                {t("stack")}
              </dt>
              <dd className="mt-1.5 flex flex-wrap gap-1.5">
                {work.stack.map((s) => (
                  <Tag key={s}>{s}</Tag>
                ))}
              </dd>
            </div>
          </dl>
          {headings.length > 1 && (
            <RailSection title={t("onThisPage")}>
              <Toc headings={headings} label={t("onThisPage")} />
            </RailSection>
          )}
        </>
      }
    >
      <Link
        href="/work"
        className="inline-flex items-center gap-1.5 text-ui font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="size-3.5" />
        {t("backToList")}
      </Link>

      <header className="intro mt-6 flex flex-col gap-4 border-b border-border pb-8">
        <p className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="mono text-caption text-faint">
            {work.sector} · {t(`kinds.${work.kind}`)} · {work.period}
          </span>
          {work.aiNative && <Label tone="info">{t("aiNative")}</Label>}
        </p>
        {programme && (
          <p className="text-ui text-muted-foreground">
            {t("partOf")}{" "}
            <Link
              href={`/work/${programme.slug}`}
              className="font-medium text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-foreground"
            >
              {programme.title}
            </Link>
          </p>
        )}
        <h1 className="text-h1 font-medium text-balance">{work.title}</h1>
        <p className="text-lead text-muted-foreground">{work.summary}</p>
        {work.outcomes && work.outcomes.length > 0 && (
          <dl className="flex flex-wrap gap-6 pt-2">
            {work.outcomes.map((o) => (
              <div key={o.label} className="flex flex-col">
                <dd className="text-h2 font-medium tabular-nums text-foreground">
                  {o.countTo !== undefined ? (
                    <Counter
                      to={o.countTo}
                      suffix={o.value.replace(/^[\d.]+/, "")}
                    />
                  ) : (
                    o.value
                  )}
                </dd>
                <dt className="text-caption text-muted-foreground">
                  {o.label}
                </dt>
              </div>
            ))}
          </dl>
        )}
      </header>

      <div className="mt-2">{content}</div>

      {parts.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-h3 font-medium">{t("parts")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {parts.map((part) => (
              <WorkCard key={part.slug} work={part} />
            ))}
          </div>
        </section>
      )}

      {writings.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-2 text-h3 font-medium">{t("relatedWriting")}</h2>
          <div className="flex flex-col">
            {writings.map((post) => (
              <PostRow key={post.slug} post={post} />
            ))}
          </div>
        </section>
      )}

      {labs.length > 0 && (
        <section className="mt-14">
          <h2 className="mb-4 text-h3 font-medium">{t("tryIt")}</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {labs.map((lab) => (
              <LabCard key={lab.slug} lab={lab} />
            ))}
          </div>
        </section>
      )}
    </ReadingShell>
  );
}

function Fact({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="grid grid-cols-[72px_1fr] gap-2">
      <dt className="text-caption text-muted-foreground">{label}</dt>
      <dd className="font-medium text-foreground">{children}</dd>
    </div>
  );
}
