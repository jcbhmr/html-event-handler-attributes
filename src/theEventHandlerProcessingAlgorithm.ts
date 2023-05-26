import { getType } from "is-what";
import getTheCurrentValueOfTheEventHandler from "./getTheCurrentValueOfTheEventHandler.js";

function isErrorEvent(event: Event): event is ErrorEvent {
  return getType(event) === "ErrorEvent";
}
function isBeforeUnloadEvent(event: Event): event is BeforeUnloadEvent {
  return getType(event) === "BeforeUnloadEvent";
}

function theEventHandlerProcessingAlgorithm(
  eventTarget: EventTarget,
  name: `on${string}`,
  event: Event
): void {
  // The event handler processing algorithm for an EventTarget object eventTarget, a string name representing the name of an event handler, and an Event object event is as follows:

  // 1. Let callback be the result of getting the current value of the event handler given eventTarget and name.
  const callback = getTheCurrentValueOfTheEventHandler(eventTarget, name);

  // 2. If callback is null, then return.
  if (callback == null) {
    return;
  }

  // 3. Let special error event handling be true if event is an ErrorEvent
  //    object, event's type is error, and event's currentTarget implements the
  //    WindowOrWorkerGlobalScope mixin. Otherwise, let special error event
  //    handling be false.
  const specialErrorEventHandling =
    isErrorEvent(event) && event.type === "error";

  // 2. Process the Event object event as follows: If an exception gets thrown by
  // the callback, end these steps and allow the exception to propagate. (It
  // will propagate to the DOM event dispatch logic, which will then report the
  // exception.)
  // - If special error event handling is true => Invoke callback with five
  //   arguments, the first one having the value of event's message attribute,
  //   the second having the value of event's filename attribute, the third
  //   having the value of event's lineno attribute, the fourth having the value
  //   of event's colno attribute, the fifth having the value of event's error
  //   attribute, and with the callback this value set to event's currentTarget.
  //   Let return value be the callback's return value. [WEBIDL]
  let returnValue: unknown;
  if (specialErrorEventHandling) {
    returnValue = (callback as OnErrorEventHandlerNonNull).call(
      event.currentTarget,
      event.message,
      event.filename,
      event.lineno,
      event.colno,
      event.error
    );
  }
  // - Otherwise => Invoke callback with one argument, the value of which is the
  //   Event object event, with the callback this value set to event's
  //   currentTarget. Let return value be the callback's return value. [WEBIDL]
  else {
    returnValue = callback.call(event.currentTarget, event);
  }

  // 3. Process return value as follows:
  // - If event is a BeforeUnloadEvent object and event's type is beforeunload
  //   => Note: In this case, the event handler IDL attribute's type will be
  //   OnBeforeUnloadEventHandler, so return value will have been coerced into
  //   either null or a DOMString.
  if (isBeforeUnloadEvent(event) && event.type === "beforeunload") {
    //   If return value is not null, then:
    if (returnValue != null) {
      // 1. Set event's canceled flag.
      event.preventDefault();

      // 2. If event's returnValue attribute's value is the empty string, then
      //    set event's returnValue attribute's value to return value.
      // @ts-ignore It is a string on BeforeUnloadEvent
      if (event.returnValue === "") {
        // @ts-ignore It is a string on BeforeUnloadEvent
        event.returnValue = returnValue;
      }
    }
  }
  // - If special error event handling is true
  else if (specialErrorEventHandling) {
    // If return value is true, then set event's canceled flag.
    if (returnValue === true) {
      event.preventDefault();
    }
  }
  // - Otherwise
  else {
    // If return value is false, then set event's canceled flag.
    if (returnValue === false) {
      event.preventDefault();
    }
  }
  // Note: If we've gotten to this "Otherwise" clause because event's type is
  // beforeunload but event is not a BeforeUnloadEvent object, then return value
  // will never be false, since in such cases return value will have been
  // coerced into either null or a DOMString.
}

export default theEventHandlerProcessingAlgorithm;
