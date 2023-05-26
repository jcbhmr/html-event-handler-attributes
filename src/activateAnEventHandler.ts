import type EventHandlerName from "./EventHandlerName.js";
import { eventHandlerMap } from "./EventTargetMixin.js";
import theEventHandlerProcessingAlgorithm from "./theEventHandlerProcessingAlgorithm.js";

export default function activateAnEventHandler(
  eventTarget: EventTarget,
  name: EventHandlerName,
  type: string
): void {
  // To activate an event handler given an EventTarget object eventTarget and a
  // string name that is the name of an event handler, run these steps:

  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = eventHandlerMap.get(eventTarget)!;

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = handlerMap[name];

  // 3. If eventHandler's listener is not null, then return.
  if (eventHandler.listener != null) {
    return;
  }

  // 4. Let callback be the result of creating a Web IDL EventListener instance
  //    representing a reference to a function of one argument that executes the
  //    steps of the event handler processing algorithm, given eventTarget,
  //    name, and its argument. The EventListener's callback context can be
  //    arbitrary; it does not impact the steps of the event handler processing
  //    algorithm. [DOM]
  const callback = (x: Event) =>
    theEventHandlerProcessingAlgorithm(eventTarget, name, x);

  // Note: The callback is emphatically not the event handler itself. Every
  // event handler ends up registering the same callback, the algorithm defined
  // below, which takes care of invoking the right code, and processing the
  // code's return value.

  // 5. Let listener be a new event listener whose type is the event handler
  //    event type corresponding to eventHandler and callback is callback. Note:
  //    To be clear, an event listener is different from an EventListener.
  // 6. Add an event listener with eventTarget and listener.
  eventTarget.addEventListener(type, callback);

  // 8. Set eventHandler's listener to listener.
  eventHandler.listener = callback;
}
