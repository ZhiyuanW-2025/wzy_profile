import assert from "node:assert/strict";
import test from "node:test";
import {readFile} from "node:fs/promises";
import ts from "typescript";
const source=await readFile(new URL('../content/city-camera.ts',import.meta.url),'utf8');
const {outputText}=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}});
const {homeCamera,cameraBounds,clampCamera,dragCamera,isMapDrag,cameraEdge}=await import(`data:text/javascript;base64,${Buffer.from(outputText).toString('base64')}`);
const world={width:2392,height:1292,coreX:360,coreY:240,coreWidth:1672,coreHeight:812};
test('default camera contains the core composition below fixed HUD on desktop',()=>{
  for(const view of [{width:1280,height:720},{width:1440,height:900},{width:1920,height:1080}]) {
    const c=homeCamera(view,world);
    assert.ok(c.x+world.coreX*c.scale>=-1);
    assert.ok(c.x+(world.coreX+world.coreWidth)*c.scale<=view.width+1);
    assert.ok(c.y+world.coreY*c.scale>=100);
    assert.ok(c.y+(world.coreY+world.coreHeight)*c.scale<=view.height-55);
  }
});
test('world always covers the viewport including portrait and ultrawide sizes',()=>{
  for(const view of [{width:320,height:700},{width:390,height:844},{width:2560,height:1080}]) {
    const c=homeCamera(view,world);
    assert.ok(c.x<=0&&c.y<=0);
    assert.ok(c.x+world.width*c.scale>=view.width);
    assert.ok(c.y+world.height*c.scale>=view.height);
  }
});
test('drag is bounded, slows near edges, and does not reset the camera',()=>{
  const view={width:1280,height:720},home=homeCamera(view,world),bounds=cameraBounds(view,world,home.scale);
  const moved=dragCamera(home,-60,20,view,world);
  assert.notEqual(moved.x,home.x);
  assert.deepEqual(clampCamera(moved,view,world),moved);
  const near={...home,x:-3};
  assert.ok(dragCamera(near,2,0,view,world).x-near.x<2);
  const extreme=dragCamera(home,-1e6,1e6,view,world);
  assert.equal(extreme.x,bounds.minX); assert.equal(extreme.y,bounds.maxY);
  assert.match(cameraEdge(extreme,view,world),/地图边缘/);
});
test('small pointer jitter remains a click; deliberate movement becomes a drag',()=>{
  assert.equal(isMapDrag(2,2),false);
  assert.equal(isMapDrag(3,4),false);
  assert.equal(isMapDrag(6,0),true);
  assert.equal(isMapDrag(20,-5),true);
});
