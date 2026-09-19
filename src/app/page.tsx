import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { SectionHead } from "@/components/ui/section";
import { Hero } from "@/components/home/hero";
import { Practice } from "@/components/home/practice";
import { QorpeBand } from "@/components/home/qorpe-band";
import { WorkCard } from "@/components/work/work-card";
import { LabCard } from "@/components/labs/lab-card";
import { PostRow } from "@/components/writings/post-row";
import { FeaturedPost } from "@/components/writings/featured-post";
import { NewsletterBox } from "@/components/writings/newsletter-box";
import { Reveal } from "@/components/motion/reveal";
import { getFeaturedWork } from "@/lib/work";
import { getLatestLabs } from "@/lib/labs";
import { getLatestWritings } from "@/lib/writings";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("meta");
  return pageMetadata({
    path: "/",
    title: t("homeTitle"),
    description: t("description"),
    absoluteTitle: true,
  });
}

/** Thesis → proof → practice → work → labs → writing. Each section reveals
 *  as one block; cards inside don't animate on their own. */
export default async function HomePage() {
  const t = await getTranslations("home");

  const [work, labs, latest] = await Promise.all([
    getFeaturedWork(2),
    getLatestLabs(3),
    getLatestWritings(5),
  ]);
  const featured = latest.find((post) => post.featured) ?? null;
  const writings = latest.filter((post) => post !== featured).slice(0, 4);

  return (
    <>
      <Hero />

      <Container>
        <Reveal as="section" className="py-14 sm:py-16">
          <SectionHead title={t("practiceTitle")} intro={t("practiceIntro")} />
          <Practice />
        </Reveal>

        {work.length > 0 && (
          <Reveal as="section" className="py-14 sm:py-16">
            <SectionHead
              title={t("workTitle")}
              intro={t("workIntro")}
              action={{ href: "/work", label: t("allWork") }}
            />
            <div className="grid gap-4 sm:grid-cols-2">
              {work.map((item) => (
                <WorkCard key={item.slug} work={item} />
              ))}
            </div>
          </Reveal>
        )}

        {labs.length > 0 && (
          <Reveal as="section" className="py-14 sm:py-16">
            <SectionHead
              title={t("labsTitle")}
              intro={t("labsIntro")}
              action={{ href: "/labs", label: t("allLabs") }}
            />
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {labs.map((lab) => (
                <LabCard key={lab.slug} lab={lab} />
              ))}
            </div>
          </Reveal>
        )}

        <QorpeBand />

        {(featured || writings.length > 0) && (
          <Reveal as="section" className="py-14 sm:py-16">
            <SectionHead
              title={t("writingTitle")}
              intro={t("writingIntro")}
              action={{ href: "/writings", label: t("allWriting") }}
            />
            {featured && <FeaturedPost post={featured} />}
            <div>
              {writings.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </div>
            <NewsletterBox />
          </Reveal>
        )}
      </Container>
    </>
  );
}
