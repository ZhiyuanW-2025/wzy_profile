import assert from "node:assert/strict";
import test from "node:test";
import { readFile } from "node:fs/promises";
import ts from "typescript";

// Compile pure configuration/math in memory; no browser globals or test-only production hooks.
async function loadTS(path) {
  const source = await readFile(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ES2022 } });
  return import(`data:text/javascript;base64,${Buffer.from(outputText).toString("base64")}`);
}
const { routeLength, routePosition } = await loadTS("../content/city-paths.ts");
const { referenceCity: city } = await loadTS("../content/reference-city.ts");

test("traffic uses arc length through bends and wraps in both directions", () => {
  const route = [[0, 0], [100, 0], [100, 100]];
  assert.equal(routeLength(route), 200);
  assert.deepEqual(routePosition(route, 50), { x: 50, y: 0, angle: 0 });
  assert.deepEqual(routePosition(route, 125), { x: 100, y: 25, angle: Math.PI / 2 });
  assert.deepEqual(routePosition(route, 250), routePosition(route, 50));
  assert.deepEqual(routePosition(route, -50), routePosition(route, 150));
  assert.equal(routePosition(route, 50, 8).y, 8);
  assert.equal(routePosition(route, 125, 8).x, 92);
});

for (const [name, routes] of [["traffic", city.traffic], ["walks", city.walks], ["boats", city.boats]]) {
  test(`${name} retains finite constant-speed motion across time`, () => {
    for (const route of routes) {
      assert.ok(route.points.length >= 2 && route.speed > 0);
      assert.ok(routeLength(route.points) > 0);
      for (const time of [0, 1, 60, 600]) {
        const p = routePosition(route.points, time * 12);
        assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y));
      }
    }
  });
}
