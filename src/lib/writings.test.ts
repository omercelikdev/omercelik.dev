import { describe, expect, it } from "vitest";
import { extractHeadings, tagSlug } from "./writings";

// The table of contents links to ids that rehype-slug writes into the
// rendered article. These pin the two to the same rules.
describe("extractHeadings", () => {
  it("returns h2 and h3 headings with rehype-slug ids", () => {
    const source = [
      "# Title",
      "",
      "## What this is",
      "Some text.",
      "### A detail",
      "## What's next",
    ].join("\n");

    expect(extractHeadings(source)).toEqual([
      { depth: 2, text: "What this is", id: "what-this-is" },
      { depth: 3, text: "A detail", id: "a-detail" },
      { depth: 2, text: "What's next", id: "whats-next" },
    ]);
  });

  it("numbers repeated headings the way rehype-slug does", () => {
    const ids = extractHeadings("## Setup\n## Setup\n## Setup").map(
      (h) => h.id,
    );
    expect(ids).toEqual(["setup", "setup-1", "setup-2"]);
  });

  it("counts slugs taken by headings it doesn't list", () => {
    // The h1 claims "setup" first, so the h2 becomes "setup-1".
    expect(extractHeadings("# Setup\n## Setup")[0].id).toBe("setup-1");
  });

  it("ignores lines inside code fences", () => {
    const source = "## Real\n```md\n## Not a heading\n```\n## Also real";
    expect(extractHeadings(source).map((h) => h.text)).toEqual([
      "Real",
      "Also real",
    ]);
  });

  it("strips inline markdown from the heading text", () => {
    expect(
      extractHeadings("## The `manifest`, **golden** [paths](/x)")[0],
    ).toEqual({
      depth: 2,
      text: "The manifest, golden paths",
      id: "the-manifest-golden-paths",
    });
  });
});

describe("tagSlug", () => {
  it("transliterates Turkish letters", () => {
    expect(tagSlug("Mühendislik")).toBe("muhendislik");
    expect(tagSlug("Çağrı Şişe")).toBe("cagri-sise");
    expect(tagSlug("İzmir")).toBe("izmir");
  });

  it("turns punctuation and spaces into single hyphens", () => {
    expect(tagSlug(".NET")).toBe("net");
    expect(tagSlug("Golden Paths")).toBe("golden-paths");
    expect(tagSlug("  spec -- driven  ")).toBe("spec-driven");
  });
});
