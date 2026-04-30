import { describe, it, expect } from "vitest";
import { seeded, rollD6 } from "../../src/domain/random.js";

describe("random", () => {
  it("seeded produces deterministic sequence", () => {
    const a = seeded(42);
    const b = seeded(42);
    for (let i = 0; i < 10; i++) {
      expect(a.next()).toBe(b.next());
    }
  });

  it("seeded with different seeds produces different sequences", () => {
    const a = seeded(1);
    const b = seeded(2);
    expect(a.next()).not.toBe(b.next());
  });

  it("rollD6 stays in [1, 6]", () => {
    const rng = seeded(1);
    for (let i = 0; i < 100; i++) {
      const v = rollD6(rng);
      expect(v).toBeGreaterThanOrEqual(1);
      expect(v).toBeLessThanOrEqual(6);
      expect(Number.isInteger(v)).toBe(true);
    }
  });
});
