import { test, expect } from "vitest";
import { greet } from "../index.js";

test("greet returns Hello, {name}!", () => {
  expect(greet("World")).toBe("Hello, World!");
  expect(greet("Alice")).toBe("Hello, Alice!");
});
