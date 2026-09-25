const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const root = path.join(__dirname, "..");
const manifest = require("../manifest.json");

test("the extension only gets temporary access to the selected tab", () => {
  assert.equal(manifest.manifest_version, 3);
  assert.deepEqual(manifest.permissions, ["activeTab", "scripting"]);
  assert.equal("content_scripts" in manifest, false);
  assert.equal("host_permissions" in manifest, false);
});

test("popup and icon paths in the manifest exist", () => {
  assert.ok(fs.existsSync(path.join(root, manifest.action.default_popup)));
  assert.ok(fs.existsSync(path.join(root, manifest.action.default_icon)));
  for (const icon of Object.values(manifest.icons)) {
    assert.ok(fs.existsSync(path.join(root, icon)), icon);
  }
});
