import type EventHandlerName from "./EventHandlerName.js";
import { getType } from "is-what";

/**
 * Need this so we get good type inference via "is an HTMLBodyElement or an
 * HTMLFrameSetElement" that we are asserting here.
 */
function isHTMLBodyElementOrHTMLFrameSetElement(
  eventTarget: EventTarget
): eventTarget is EventTarget & (HTMLBodyElement | HTMLFrameSetElement) {
  return (
    getType(eventTarget) === "HTMLBodyElement" ||
    getType(eventTarget) === "HTMLFrameSetElement"
  );
}

/** @see https://html.spec.whatwg.org/multipage/webappapis.html#windoweventhandlers */
const WindowEventHandlersMixinStub = {
  onafterprint: 0,
  onbeforeprint: 0,
  onbeforeunload: 0,
  onhashchange: 0,
  onlanguagechange: 0,
  onmessage: 0,
  onmessageerror: 0,
  onoffline: 0,
  ononline: 0,
  onpagehide: 0,
  onpageshow: 0,
  onpopstate: 0,
  onrejectionhandled: 0,
  onstorage: 0,
  onunhandledrejection: 0,
  onunload: 0,
};

/**
 * | Event handler | Event handler event type |
 * | ------------- | ------------------------ |
 * | onblur        | blur                     |
 * | onerror       | error                    |
 * | onfocus       | focus                    |
 * | onload        | load                     |
 * | onresize      | resize                   |
 * | onscroll      | scroll                   |
 * | onscrollend   | scrollend                |
 *
 * We call the set of the names of the event handlers listed in the first column
 * of this table the Window-reflecting body element event handler set.
 *
 * @see https://html.spec.whatwg.org/multipage/webappapis.html#window-reflecting-body-element-event-handler-set
 */
const windowReflectingBodyElementEventHandlerSetStub = new Set([
  "onblur",
  "onerror",
  "onfocus",
  "onload",
  "onresize",
  "onscroll",
  "onscrollend",
]);

/** @see https://html.spec.whatwg.org/multipage/webappapis.html#determining-the-target-of-an-event-handler */
function determineTheTargetOfAnEventHandler(
  eventTarget: EventTarget,
  name: EventHandlerName
): EventTarget | null {
  // To determine the target of an event handler, given an EventTarget object eventTarget on which the event handler is exposed, and an event handler name name, the following steps are taken:

  // 1. If eventTarget is not a body element or a frameset element, then return eventTarget.
  if (!isHTMLBodyElementOrHTMLFrameSetElement(eventTarget)) {
    return eventTarget;
  }

  // 2. If name is not the name of an attribute member of the WindowEventHandlers interface mixin and the Window-reflecting body element event handler set does not contain name, then return eventTarget.
  if (
    !Object.keys(WindowEventHandlersMixinStub).includes(name) &&
    !windowReflectingBodyElementEventHandlerSetStub.has(name)
  ) {
    return eventTarget;
  }

  // 3. If eventTarget's node document is not an active document, then return null.
  if (eventTarget.ownerDocument.readyState !== "complete") {
    return null;
  }
  // Note: This could happen if this object is a body element without a
  // corresponding Window object, for example. This check does not necessarily
  // prevent body and frameset elements that are not the body element of their
  // node document from reaching the next step. In particular, a body element
  // created in an active document (perhaps with document.createElement()) but
  // not connected will also have its corresponding Window object as the target
  // of several event handlers exposed through it.

  // 4. Return eventTarget's node document's relevant global object.
  return eventTarget.ownerDocument.defaultView;
}

export default determineTheTargetOfAnEventHandler;
export {
  WindowEventHandlersMixinStub,
  windowReflectingBodyElementEventHandlerSetStub,
};
