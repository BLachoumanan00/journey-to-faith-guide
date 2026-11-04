import { expect, it } from "vitest";
import { collectPages } from "./pagination";
it("exports every account record beyond the first page", async () => {
  const rows = Array.from({ length: 1203 }, (_, id) => ({ id }));
  const result = await collectPages(async (from, to) => rows.slice(from, to + 1));
  expect(result).toHaveLength(1203);
  expect(result[1202]).toEqual({ id: 1202 });
});