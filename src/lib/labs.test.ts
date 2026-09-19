import { readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { labSlugs } from "@/generated/labs";
import { getAllLabs, LABS_DIR } from "./labs";

/** Adding a lab is a folder; the registry that imports its demo is
 *  generated. These keep the two in step and every lab complete. */
describe("labs", () => {
  const folders = existsSync(LABS_DIR)
    ? readdirSync(LABS_DIR, { withFileTypes: true })
        .filter((d) => d.isDirectory() && !d.name.startsWith("."))
        .map((d) => d.name)
        .sort()
    : [];

  it("registry matches the folders (run `npm run gen` after adding one)", () => {
    expect(labSlugs).toEqual(folders);
  });

  it("every lab has a demo, a title and a summary", async () => {
    const labs = await getAllLabs();
    for (const slug of folders) {
      expect(existsSync(path.join(LABS_DIR, slug, "Demo.tsx"))).toBe(true);
      const lab = labs.find((l) => l.slug === slug);
      // Drafts are hidden outside dev, so a missing one is fine there.
      if (!lab) continue;
      expect(lab.title).toBeTruthy();
      expect(lab.summary).toBeTruthy();
      expect(lab.date).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });
});
