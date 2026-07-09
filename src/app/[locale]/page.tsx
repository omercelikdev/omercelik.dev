import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { SectionHead } from "@/components/ui/section";
import { Hero } from "@/components/home/hero";
import { Capabilities } from "@/components/home/capabilities";
import { WorkRow } from "@/components/products/work-row";
import { PostRow } from "@/components/writings/post-row";
import { Reveal } from "@/components/motion/reveal";
import { getFeaturedProducts } from "@/lib/github";
import { getLatestWritings } from "@/lib/writings";
import { alternatesFor } from "@/lib/seo";

export function generateMetadata(): Metadata {
  return { alternates: alternatesFor("/") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [products, writings] = await Promise.all([
    getFeaturedProducts(),
    getLatestWritings(4),
  ]);

  return (
    <>
      <Hero />

      <Container>
        {/* 01 — what I do */}
        <section className="py-16">
          <Reveal>
            <SectionHead index="01" label={t("sec1")} />
          </Reveal>
          <Capabilities />
        </section>

        {/* 02 — products */}
        {products.length > 0 && (
          <section className="py-16">
            <Reveal>
              <SectionHead
                index="02"
                label={t("sec2")}
                action={{ href: "/products", label: t("viewAll") }}
              />
            </Reveal>
            <div>
              {products.map((product) => (
                <WorkRow key={product.fullName} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* 03 — writing */}
        {writings.length > 0 && (
          <section className="py-16">
            <Reveal>
              <SectionHead
                index="03"
                label={t("sec3")}
                action={{ href: "/writings", label: t("viewAll") }}
              />
            </Reveal>
            <div>
              {writings.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </div>
          </section>
        )}
      </Container>
    </>
  );
}
