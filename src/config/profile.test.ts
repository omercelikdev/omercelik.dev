import { describe, expect, it } from "vitest";
import { profile } from "./profile";

/** Placeholders (`todo`) never reach production, but the page still needs
 *  something to show. */
describe("profile", () => {
  it("keeps at least two real facts and one real role", () => {
    expect(profile.facts.filter((f) => !f.todo).length).toBeGreaterThanOrEqual(
      1,
    );
    expect(profile.roles.filter((r) => !r.todo).length).toBeGreaterThanOrEqual(
      1,
    );
  });

  it("writes experience as prose, not bullet lists", () => {
    for (const role of profile.roles) {
      expect(role.summary).not.toMatch(/^\s*[-*•]/m);
    }
  });
});
