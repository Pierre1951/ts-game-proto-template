import { describe, it, expect } from "vitest";
import { describeExample } from "../../src/domain/example.js";

describe("describeExample", () => {
  it("returns a non-empty string", () => {
    const result = describeExample();
    expect(result).toBeTypeOf("string");
    expect(result.length).toBeGreaterThan(0);
  });
});
