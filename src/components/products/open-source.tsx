import { getTranslations } from "next-intl/server";
import { SectionHead } from "@/components/ui/section";
import { ProductCard } from "@/components/products/product-card";
import { features } from "@/config/features";
import { getFeaturedProducts, getProducts } from "@/lib/github";

/** Public repositories, as cards with their GitHub links — the code behind
 *  the practice. Behind `features.openSource`; the Qorpe band is a separate
 *  flag, so the repositories can show without the brand. */
export async function OpenSource({
  featuredOnly = false,
  action,
}: {
  featuredOnly?: boolean;
  action?: boolean;
}) {
  if (!features.openSource) return null;
  const t = await getTranslations("openSource");
  const products = featuredOnly
    ? await getFeaturedProducts()
    : await getProducts();
  if (products.length === 0) return null;

  return (
    <section>
      <SectionHead
        title={t("title")}
        intro={t("intro")}
        action={action ? { href: "/work", label: t("all") } : undefined}
      />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.fullName} product={product} />
        ))}
      </div>
    </section>
  );
}
