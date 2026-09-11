import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/motion/reveal";
import { getProducts } from "@/lib/github";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "products" });
  return pageMetadata({
    locale,
    path: "/products",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ProductsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("products");
  const products = await getProducts();

  return (
    <Container className={PAGE_PADDING}>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />

      {products.length === 0 ? (
        <p className="border-t border-border py-16 text-center text-ui text-muted-foreground">
          {t("empty")}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Reveal key={product.fullName}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </Container>
  );
}
