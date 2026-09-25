const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(path.join(__dirname, "..", "dontsupport.js"), "utf8");
let candidates = [];
const context = {
  globalThis: {},
  document: { querySelectorAll: () => candidates },
  window: {}
};
vm.runInNewContext(source, context);

const { explicitBypassPhrases, normalize, run } = context.globalThis.IDontWantToSupport;

const fixtureElement = (label, options = {}) => ({
  innerText: label,
  textContent: label,
  disabled: false,
  style: { display: "block", visibility: "visible", opacity: "1" },
  clicked: 0,
  getAttribute: () => null,
  matches(selector) { return selector === ":disabled" && this.disabled; },
  checkVisibility() { return this.style.display !== "none" && this.style.visibility !== "hidden" && this.style.opacity !== "0"; },
  getBoundingClientRect: () => ({ width: 100, height: 30 }),
  click() { this.clicked += 1; },
  ...options
});

test("matches explicit support and ad-blocker bypass phrases", () => {
  assert.equal(explicitBypassPhrases.includes(normalize("  Continue with ad blocker  ")), true);
  assert.equal(explicitBypassPhrases.includes(normalize("I don’t want to support")), true);
});

test("rejects generic or unrelated phrases", () => {
  for (const phrase of ["Ignore and proceed", "No thanks, continue", "Continue", "Dismiss"]) {
    assert.equal(explicitBypassPhrases.includes(normalize(phrase)), false, phrase);
  }
});

test("clicks only the first visible enabled explicit match", () => {
  const first = fixtureElement("Continue with ad blocker");
  const second = fixtureElement("Proceed without support");
  candidates = [fixtureElement("Ignore and proceed"), first, second];

  const result = run();
  assert.equal(result.status, "clicked");
  assert.equal(result.label, "Continue with ad blocker");
  assert.equal(first.clicked, 1);
  assert.equal(second.clicked, 0);
});

test("does not click generic, hidden, or disabled options", () => {
  const generic = fixtureElement("No thanks, continue");
  const hidden = fixtureElement("Proceed without support", {
    style: { display: "none", visibility: "visible", opacity: "1" }
  });
  const disabled = fixtureElement("Continue with ad blocker", { disabled: true });
  candidates = [generic, hidden, disabled];

  assert.equal(run().status, "not-found");
  assert.equal(generic.clicked + hidden.clicked + disabled.clicked, 0);
});

test("does not click controls hidden by an ancestor or disabled by a fieldset", () => {
  const ancestorHidden = fixtureElement("Proceed without support", {
    checkVisibility: () => false
  });
  const fieldsetDisabled = fixtureElement("Continue with ad blocker", {
    matches: (selector) => selector === ":disabled"
  });
  candidates = [ancestorHidden, fieldsetDisabled];

  assert.equal(run().status, "not-found");
  assert.equal(ancestorHidden.clicked + fieldsetDisabled.clicked, 0);
});
