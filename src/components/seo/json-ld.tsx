/** Structured data for search engines — a plain script tag, as the Next.js
 *  JSON-LD guide recommends. `<` is escaped so no value can close the tag. */
export function JsonLd({ data }: { data: object }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
