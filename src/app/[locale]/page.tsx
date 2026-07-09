import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { Eyebrow, SectionHeading } from "@/components/ui/section";
import { LinkButton } from "@/components/ui/button";
import { ProductCard } from "@/components/products/product-card";
import { PostCard } from "@/components/writings/post-card";
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
    getLatestWritings(3),
  ]);

  return (
    <>
      {/* Hero */}
      <Container className="pt-16 pb-8 sm:pt-24">
        <div className="flex max-w-2xl flex-col gap-5">
          <Eyebrow>{t("eyebrow")}</Eyebrow>
          <h1 className="text-3xl font-extrabold tracking-[-0.02em] text-balance sm:text-4xl">
            {t("title")}
          </h1>
          <p className="max-w-prose text-[15px] leading-relaxed text-muted-foreground">
            {t("subtitle")}
          </p>
          <div className="mt-2 flex flex-wrap items-center gap-3">
            <LinkButton href="/products" variant="primary">
              {t("ctaProducts")}
              <ArrowRight className="size-4 rtl:rotate-180" />
            </LinkButton>
            <LinkButton href="/writings" variant="outline">
              {t("ctaWritings")}
            </LinkButton>
          </div>
        </div>
      </Container>

      {/* Featured products */}
      {products.length > 0 && (
        <Container className="pt-14">
          <SectionHeading
            title={t("featuredTitle")}
            subtitle={t("featuredSubtitle")}
            action={{ href: "/products", label: t("viewAll") }}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <ProductCard key={product.fullName} product={product} />
            ))}
          </div>
        </Container>
      )}

      {/* Latest writing */}
      {writings.length > 0 && (
        <Container className="pt-16">
          <SectionHeading
            title={t("latestTitle")}
            subtitle={t("latestSubtitle")}
            action={{ href: "/writings", label: t("viewAll") }}
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {writings.map((post) => (
              <PostCard key={post.slug} post={post} />
            ))}
          </div>
        </Container>
      )}
    </>
  );
}
