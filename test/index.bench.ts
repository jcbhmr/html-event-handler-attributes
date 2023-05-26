#!/usr/bin/env tsx
import { Bench } from "tinybench";
import { defineEventHandlerIDLAttribute } from "../src/index";

const bench = new Bench({ time: 100 });
let t: EventTarget & { ontest: EventListener | null };

class NaiveTestTarget extends EventTarget {
  #ontest: EventListener | null = null;
  get ontest(): EventListener | null {
    return this.#ontest;
  }
  set ontest(ontest: EventListener | null) {
    this.#ontest = ontest;
  }
  dispatchEvent(event: Event): boolean {
    if (event.type === "test") {
      this.#ontest?.(event);
    }
    return super.dispatchEvent(event);
  }
}

bench.add(
  "dispatchEvent with no attached",
  () => t.dispatchEvent(new Event("test")),
  {
    beforeAll() {
      t = new EventTarget() as EventTarget & { ontest: EventListener | null };
      defineEventHandlerIDLAttribute(t, "ontest", "test");
    },
  }
);

bench.add(
  "dispatchEvent with attached",
  () => t.dispatchEvent(new Event("test")),
  {
    beforeAll() {
      t = new EventTarget() as EventTarget & { ontest: EventListener | null };
      defineEventHandlerIDLAttribute(t, "ontest", "test");
      t.ontest = () => {};
    },
  }
);

bench.add(
  "naive dispatchEvent with attached",
  () => t.dispatchEvent(new Event("test")),
  {
    beforeAll() {
      t = new NaiveTestTarget();
      defineEventHandlerIDLAttribute(t, "ontest", "test");
      t.ontest = () => {};
    },
  }
);

bench.add(
  "attach and remove",
  () => {
    t.ontest = () => {};
    t.ontest = null;
  },
  {
    beforeAll() {
      t = new EventTarget() as EventTarget & { ontest: EventListener | null };
      defineEventHandlerIDLAttribute(t, "ontest", "test");
    },
  }
);

bench.add(
  "long form attach and remove",
  () => {
    const f = () => {};
    t.addEventListener("test", f);
    t.removeEventListener("test", f);
  },
  {
    beforeAll() {
      t = new EventTarget() as EventTarget & { ontest: EventListener | null };
      defineEventHandlerIDLAttribute(t, "ontest", "test");
    },
  }
);

bench.add(
  "naive attach and remove",
  () => {
    t.ontest = () => {};
    t.ontest = null;
  },
  {
    beforeAll() {
      t = new NaiveTestTarget();
    },
  }
);

await bench.run();
console.table(bench.table());
