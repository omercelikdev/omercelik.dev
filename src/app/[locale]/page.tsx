import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { SectionHead } from "@/components/ui/section";
import { Hero } from "@/components/home/hero";
import { Capabilities } from "@/components/home/capabilities";
import { CtaBand } from "@/components/home/cta-band";
import { ProductCard } from "@/components/products/product-card";
import { PostRow } from "@/components/writings/post-row";
import { FeaturedPost } from "@/components/writings/featured-post";
import { Reveal } from "@/components/motion/reveal";
import { getFeaturedProducts } from "@/lib/github";
import { getLatestWritings } from "@/lib/writings";
import { alternatesFor } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return { alternates: alternatesFor(locale, "/") };
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");

  const [products, latest] = await Promise.all([
    getFeaturedProducts(),
    getLatestWritings(5),
  ]);
  // A featured essay leads the section; the list below skips it.
  const featured = latest.find((post) => post.featured) ?? null;
  const writings = latest.filter((post) => post !== featured).slice(0, 4);

  return (
    <>
      <Hero />

      <Container>
        {/* 01 — what I do */}
        <section className="py-14 sm:py-16">
          <Reveal>
            <SectionHead index="01" label={t("sec1")} />
          </Reveal>
          <Capabilities />
        </section>

        {/* 02 — products */}
        {products.length > 0 && (
          <section className="py-14 sm:py-16">
            <Reveal>
              <SectionHead
                index="02"
                label={t("sec2")}
                action={{ href: "/products", label: t("viewAll") }}
              />
            </Reveal>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {products.map((product) => (
                <Reveal key={product.fullName}>
                  <ProductCard product={product} />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {/* 03 — writing */}
        {(featured || writings.length > 0) && (
          <section className="py-14 sm:py-16">
            <Reveal>
              <SectionHead
                index="03"
                label={t("sec3")}
                action={{ href: "/writings", label: t("viewAll") }}
              />
            </Reveal>
            {featured && (
              <Reveal>
                <FeaturedPost post={featured} />
              </Reveal>
            )}
            <div>
              {writings.map((post) => (
                <Reveal key={post.slug}>
                  <PostRow post={post} />
                </Reveal>
              ))}
            </div>
          </section>
        )}
      </Container>

      <CtaBand />
    </>
  );
}
