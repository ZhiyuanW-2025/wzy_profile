import test from "node:test";
import assert from "node:assert/strict";
import { loadLocalTS } from "./load-local-ts.mjs";
const { cityVisitor: config } = await loadLocalTS("content/city-visitor.ts");
const { visitorPose } = await loadLocalTS("components/reference-city/visitor-motion.ts");
const { helicopterPosition } = await loadLocalTS("content/city-paths.ts");
test("helicopter continuously patrols within the city so its invitation never cycles off-screen", () => {
  let previous = helicopterPosition(0, 1672);
  for (let time = .1; time < 270; time += .1) {
    const point = helicopterPosition(time, 1672);
    assert.ok(point.x >= 210 && point.x <= 1462);
    assert.ok(point.y >= 126 && point.y <= 158);
    assert.ok(Math.hypot(point.x - previous.x, point.y - previous.y) < 5, "No teleport when a lap completes");
    previous = point;
  }
  assert.equal(config.invitationPeriod, undefined);
});

test("visitor choices are exactly eighteen; invitation and landing route are configurable", () => {
  assert.equal(config.emojis.length, 18);
  assert.equal(new Set(config.emojis.map(e => e.value)).size, 18);
  assert.equal(config.invitation, "在这里留言，成为城市旅客");
  assert.deepEqual(config.dock, config.walk[0]);
  assert.ok(config.walk.every(([x,y]) => x >= 0 && x <= 1672 && y >= 0 && y <= 812));
});
test("parachutist starts at the moving helicopter, reaches the dock, then walks continuously", () => {
  for (const startedAt of [0, 19, 38, 80]) {
    const actor = { id: "test", emoji: "🙂", startedAt, origin: helicopterPosition(startedAt, 1672), reduced: false };
    const start = visitorPose(actor, startedAt);
    assert.equal(start.phase, "parachuting"); assert.equal(start.x, actor.origin.x); assert.equal(start.y, actor.origin.y);
    const dock = visitorPose(actor, startedAt + config.dropDuration + .1);
    assert.equal(dock.phase, "landed"); assert.equal(dock.x, config.dock[0]); assert.equal(dock.y, config.dock[1]);
    const walk = visitorPose(actor, startedAt + 13);
    assert.equal(walk.phase, "walking"); assert.ok(Math.hypot(walk.x - dock.x, walk.y - dock.y) > 10);
    let prev = walk;
    for (let t = 13.05; t < 210; t += .05) {
      const next = visitorPose(actor, startedAt + t);
      assert.ok(Math.hypot(next.x - prev.x, next.y - prev.y) <= 1.1, "No teleport at road ends"); prev = next;
    }
  }
});
test("reduced-motion visitors appear safely at the dock without parachute or walking", () => {
  const actor = { id: "test", emoji: "🙂", startedAt: 0, origin: { x: 300, y: 100 }, reduced: true };
  assert.deepEqual(visitorPose(actor, 0), visitorPose(actor, 100));
  assert.equal(visitorPose(actor, 0).phase, "landed");
});
