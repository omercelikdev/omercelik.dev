import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { Container } from "@/components/layout/container";
import { PageHeader, PAGE_PADDING } from "@/components/ui/page-header";
import { ProductCard } from "@/components/products/product-card";
import { Reveal } from "@/components/motion/reveal";
import { getProducts } from "@/lib/github";
import { pageMetadata } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("products");
  return pageMetadata({
    path: "/products",
    title: t("title"),
    description: t("subtitle"),
  });
}

export default async function ProductsPage() {
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
