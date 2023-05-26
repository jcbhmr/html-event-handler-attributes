import EventTargetMixin, { eventHandlerMap } from "./EventTargetMixin.js";
import activateAnEventHandler from "./activateAnEventHandler.js";
import deactivateAnEventHandler from "./deactivateAnEventHandler.js";
import determineTheTargetOfAnEventHandler from "./determineTheTargetOfAnEventHandler.js";
import getTheCurrentValueOfTheEventHandler from "./getTheCurrentValueOfTheEventHandler.js";

const seen = new WeakSet<EventTarget>();

function createEventHandlerIDLAttributeDescriptor(
  name: `on${string}`,
  type: string
): PropertyDescriptor {
  function get(this: EventTarget): EventListener | null {
    if (!seen.has(this)) {
      EventTargetMixin.call(this);
    }
    seen.add(this);

    // The getter of an event handler IDL attribute with name name, when called, must run these steps:

    // 1. Let eventTarget be the result of determining the target of an event handler given this object and name.
    const eventTarget = determineTheTargetOfAnEventHandler(this, name);

    // 2. If eventTarget is null, then return null.
    if (eventTarget == null) {
      return null;
    }

    // 3. Return the result of getting the current value of the event handler given eventTarget and name.
    return getTheCurrentValueOfTheEventHandler(eventTarget, name);
  }
  function set(this: EventTarget, value: EventListener | null): void {
    if (!seen.has(this)) {
      EventTargetMixin.call(this);
    }
    seen.add(this);

    // The setter of an event handler IDL attribute with name name, when called, must run these steps:

    // 1. Let eventTarget be the result of determining the target of an event handler given this object and name.
    const eventTarget = determineTheTargetOfAnEventHandler(this, name);

    // 2. If eventTarget is null, then return.
    if (eventTarget == null) {
      return;
    }

    // 3. If the given value is null, then deactivate an event handler given eventTarget and name.
    if (value == null) {
      deactivateAnEventHandler(eventTarget, name, type);
      return;
    }

    // 4. Otherwise:
    else {
      // 1. Let handlerMap be eventTarget's event handler map.
      const handlerMap = eventHandlerMap.get(eventTarget)!;

      // 2. Let eventHandler be handlerMap[name].
      const eventHandler = handlerMap[name];

      // 3. Set eventHandler's value to the given value.
      eventHandler.value = value;

      // 4. Activate an event handler given eventTarget and name.
      activateAnEventHandler(eventTarget, name, type);
    }
  }

  return { get, set, enumerable: true, configurable: true };
}

/**
 * An event handler IDL attribute is an IDL attribute for a specific event
 * handler. The name of the IDL attribute is the same as the name of the event
 * handler.
 */
function defineEventHandlerIDLAttribute<T extends EventTarget>(
  target: T,
  name: `on${string}`,
  type: string
): T {
  const d = createEventHandlerIDLAttributeDescriptor(name, type);
  return Object.defineProperty(target, name, d);
}

export default defineEventHandlerIDLAttribute;
export { createEventHandlerIDLAttributeDescriptor as createEventHaandlerIDLAttributeDescriptor };
