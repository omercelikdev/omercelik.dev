import { getLabBySlug } from "@/lib/labs";
import { DemoFrame } from "./demo-frame";

/** A lab embedded in an essay or case study. In MDX: <Demo id="spec-drift" />
 *  Looks the lab up by folder name, shows its title and summary, and loads
 *  the demo itself only when the reader opens it. */
export async function Demo({ id }: { id: string }) {
  const lab = await getLabBySlug(id);
  if (!lab) {
    return (
      <p className="my-8 rounded-[var(--radius-lg)] border border-danger-border bg-danger-bg p-4 text-ui text-danger">
        Unknown demo “{id}” — is there a folder at content/labs/{id}?
      </p>
    );
  }
  return (
    <DemoFrame
      slug={lab.slug}
      title={lab.title}
      summary={lab.summary}
      href={`/labs/${lab.slug}`}
    />
  );
}
