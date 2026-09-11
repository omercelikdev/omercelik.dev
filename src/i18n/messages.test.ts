import { describe, expect, it } from "vitest";
import en from "./messages/en.json";

function entries(value: unknown, path = ""): [string, unknown][] {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return Object.entries(value).flatMap(([key, child]) =>
      entries(child, path ? `${path}.${key}` : key),
    );
  }
  if (Array.isArray(value)) {
    return [
      [path, value],
      ...value.flatMap((child, i) => entries(child, `${path}.${i}`)),
    ];
  }
  return [[path, value]];
}

describe("UI messages", () => {
  const all = entries(en);

  it("have no empty strings", () => {
    const empty = all
      .filter(([, v]) => typeof v === "string" && v.trim() === "")
      .map(([path]) => path);
    expect(empty).toEqual([]);
  });

  it("have no empty lists", () => {
    const empty = all
      .filter(([, v]) => Array.isArray(v) && v.length === 0)
      .map(([path]) => path);
    expect(empty).toEqual([]);
  });

  it("describe every layer of the hero stack", () => {
    // HeroStack pairs these with its five layers by position.
    expect(en.home.layers).toHaveLength(5);
  });
});
