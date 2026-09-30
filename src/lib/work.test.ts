import { describe, expect, it } from "vitest";
import { getAllWork } from "./work";
import { getAllLabs } from "./labs";
import { THEME_SLUGS } from "@/config/themes";
import { WORK_KINDS } from "./work";
import { getAllWritings } from "./writings";

describe("work", () => {
  it("every case study has the card fields and only known labs", async () => {
    const [work, labs] = await Promise.all([getAllWork(), getAllLabs()]);
    const known = new Set(labs.map((l) => l.slug));
    for (const w of work) {
      expect(w.title).toBeTruthy();
      expect(w.summary).toBeTruthy();
      expect(w.sector).toBeTruthy();
      expect(w.period).toBeTruthy();
      // Domains, never client names.
      expect(w.sector).not.toMatch(/telekom|bank of|a\.ş\./i);
      for (const lab of w.labs ?? []) expect(known.has(lab)).toBe(true);
    }
  });

  it("files every case under one or two known themes, with a known kind", async () => {
    for (const w of await getAllWork()) {
      expect(w.themes.length, w.slug).toBeGreaterThanOrEqual(1);
      expect(w.themes.length, w.slug).toBeLessThanOrEqual(2);
      for (const t of w.themes) expect(THEME_SLUGS, w.slug).toContain(t);
      expect(WORK_KINDS, w.slug).toContain(w.kind);
    }
  });

  it("never marks client work as AI-native", async () => {
    for (const w of await getAllWork()) {
      if (w.kind === "client") expect(w.aiNative, w.slug).toBe(false);
    }
  });

  it("points every part at an existing overview", async () => {
    const work = await getAllWork();
    const slugs = new Set(work.map((w) => w.slug));
    for (const w of work) {
      if (w.programme) {
        expect(slugs.has(w.programme), w.slug).toBe(true);
        expect(w.programme, w.slug).not.toBe(w.slug);
      }
    }
  });

  it("uses only known themes on writing and labs", async () => {
    const [writings, labs] = await Promise.all([
      getAllWritings(),
      getAllLabs(),
    ]);
    for (const item of [...writings, ...labs]) {
      for (const t of item.themes ?? [])
        expect(THEME_SLUGS, item.slug).toContain(t);
    }
  });
});
