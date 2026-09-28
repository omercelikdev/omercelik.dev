import { describe, expect, it } from "vitest";
import { getAllWork } from "./work";
import { getAllLabs } from "./labs";

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
});
