import { describe, expect, it } from "vitest";
import en from "./messages/en.json";
import tr from "./messages/tr.json";

/** A message tree with every string replaced by its type: same shape ⇔ same
 *  keys, and the same number of entries in every list. */
function shape(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(shape);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .map(([key, child]) => [key, shape(child)] as const)
        .sort(([a], [b]) => a.localeCompare(b)),
    );
  }
  return typeof value;
}

function strings(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([key, child]) =>
      strings(child, path ? `${path}.${key}` : key),
    );
  }
  return [];
}

describe("UI messages", () => {
  it("have the same keys and list lengths in English and Turkish", () => {
    expect(shape(tr)).toEqual(shape(en));
  });

  it("have no empty strings", () => {
    const empty = [...strings(en), ...strings(tr)].filter(
      ([, text]) => text.trim() === "",
    );
    expect(empty).toEqual([]);
  });
});
