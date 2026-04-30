import { describe, it, expect } from "vitest";
import { initialBattle, step } from "../../src/domain/combat.js";
import { seeded } from "../../src/domain/random.js";

describe("combat", () => {
  it("starts with full HP and not finished", () => {
    const s = initialBattle();
    expect(s.playerHp).toBe(20);
    expect(s.enemyHp).toBe(15);
    expect(s.turn).toBe(0);
    expect(s.finished).toBe(false);
  });

  it("step is deterministic with seeded rng", () => {
    const rng1 = seeded(42);
    const s1 = step(initialBattle(), rng1);
    const rng2 = seeded(42);
    const s2 = step(initialBattle(), rng2);
    expect(s1).toEqual(s2);
  });

  it("finishes within reasonable iterations", () => {
    let s = initialBattle();
    const rng = seeded(1);
    for (let i = 0; i < 30 && !s.finished; i++) {
      s = step(s, rng);
    }
    expect(s.finished).toBe(true);
    expect(s.playerHp === 0 || s.enemyHp === 0).toBe(true);
  });

  it("does not change state once finished (idempotent)", () => {
    let s = initialBattle();
    const rng = seeded(1);
    while (!s.finished) {
      s = step(s, rng);
    }
    const after = step(s, rng);
    expect(after).toBe(s);
  });

  it("logs include turn number and roll details", () => {
    const s = step(initialBattle(), seeded(42));
    const recentLog = s.log.slice(1).join("\n");
    expect(recentLog).toContain("Turn 1");
    expect(recentLog).toContain("Player rolls");
  });
});
