import { eventHandlerMap } from "./EventTargetMixin.js";

export default function deactivateAnEventHandler(
  eventTarget: EventTarget,
  name: `on${string}`,
  type: string
): void {
  // To deactivate an event handler given an EventTarget object eventTarget and a string name that is the name of an event handler, run these steps:

  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = eventHandlerMap.get(eventTarget)!;

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = handlerMap[name];

  // 3. Set eventHandler's value to null.
  eventHandler.value = null;

  // 4. Let listener be eventHandler's listener.
  const listener = eventHandler.listener;

  // 5. If listener is not null, then remove an event listener with eventTarget and listener.
  if (listener != null) {
    eventTarget.removeEventListener(type, listener);
  }

  // 6. Set eventHandler's listener to null.
  eventHandler.listener = null;
}
