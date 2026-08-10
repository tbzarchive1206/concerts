import assert from "node:assert/strict";
import fs from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (file) => fs.readFile(new URL(file, root), "utf8");

test("Drive snapshot contains ordered videos and no spreadsheet", async () => {
  const context = { window: {} };
  vm.createContext(context);
  vm.runInContext(await read("data.js"), context);
  const data = context.window.CONCERTS_DATA;
  assert.equal(data.items.length, 25);
  const displayedOrder = Array.from(data.items, (item) => item.order);
  assert.equal(displayedOrder.join(","), [...displayedOrder].sort((a, b) => a - b).join(","));
  assert.ok(data.items.every((item) => !/^\d+[.\-_]/.test(item.title) && !/\.mp4$/i.test(item.title)));
  assert.ok(data.items.every((item) => item.id !== "1QZfgTaawpbd7lobIyYZCq5RXFo3g1Ey1Ira2t9vVGjQ"));
});

test("tiles use direct Drive links and responsive INSTA layout", async () => {
  const app = await read("app.js");
  const styles = await read("styles.css");
  assert.match(app, /drive\.google\.com\/file\/d\/\$\{encodeURIComponent\(item\.id\)\}\/view/);
  assert.doesNotMatch(app, /iframe|preview/);
  assert.match(styles, /repeat\(5,minmax\(0,1fr\)\)/);
  assert.match(styles, /repeat\(2,minmax\(0,1fr\)\)/);
});
