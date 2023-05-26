import type EventHandler from "./EventHandler.js";

/** @see https://html.spec.whatwg.org/multipage/webappapis.html#event-handler-map */
const eventHandlerMap = new WeakMap<
  EventTarget,
  Record<string, EventHandler>
>();

function EventTargetMixin(this: EventTarget): void {
  const names = Object.keys(this).filter((n) => n.startsWith("on"));
  if (names.length > 0) {
    let o: Record<string, EventHandler> = {};
    for (const n of names) {
      o[n] = { value: null, listener: null };
    }
    eventHandlerMap.set(this, o);
  }
}

export default EventTargetMixin;
export { eventHandlerMap };
