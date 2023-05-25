import test, { beforeEach } from "node:test";
import assert from "node:assert";
import defineEventHandlerIDLAttribute from "../src/defineEventHandlerIDLAttribute";

let t: EventTarget & { ontest: EventListener | null };
beforeEach(() => {
  t = new EventTarget() as EventTarget & { ontest: EventListener | null };
  defineEventHandlerIDLAttribute(t, "ontest");
});

test("getter returns what was set", () => {
  const f = () => {};
  t.ontest = f;
  assert.equal(t.ontest, f);
});

test("calls onevent when event is dispatched", () => {
  let i = 0;
  t.ontest = () => i++;
  t.dispatchEvent(new Event("test"));
  assert.equal(i, 1);
});

test("when set back to null, onevent is not called", () => {
  let i = 0;
  t.ontest = () => i++;
  t.ontest = null;
  t.dispatchEvent(new Event("test"));
  assert.equal(i, 0);
});

test("called after addEventListener capture=true", () => {
  let i = 0;
  let j = 0;
  t.addEventListener("test", () => i++, { capture: true });
  t.ontest = () => (j = i++);
  t.dispatchEvent(new Event("test"));
  assert.equal(i, 2);
  assert.equal(j, 1);
});

test("called after addEventListener when added after", () => {
  let i = 0;
  let j = 0;
  t.addEventListener("test", () => i++);
  t.ontest = () => (j = i++);
  t.dispatchEvent(new Event("test"));
  assert.equal(i, 2);
  assert.equal(j, 1);
});

test("called before addEventListener when added before", () => {
  let i = 0;
  let j = 0;
  t.ontest = () => (j = i++);
  t.addEventListener("test", () => i++);
  t.dispatchEvent(new Event("test"));
  assert.equal(i, 2);
  assert.equal(j, 0);
});

// TODO: Fix this test case
test(
  "reserves spot in event listener list even when function changes",
  { skip: true },
  () => {
    let i = 0;
    let j = 0;
    t.ontest = () => (j = i++);
    t.addEventListener("test", () => i++);
    t.ontest = () => (j = i++);
    t.dispatchEvent(new Event("test"));
    assert.equal(i, 2);
    assert.equal(j, 0);
  }
);
