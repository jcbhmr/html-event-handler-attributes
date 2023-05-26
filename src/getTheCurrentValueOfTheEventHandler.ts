import { eventHandlerMap } from "./EventTargetMixin.js";
// @ts-ignore
import isInstanceOf from "is-instance-of";
import InternalRawUncompiledHandler from "./InternalRawUncompiledHandler.js";

function isWindowObject(x: unknown): x is Window {
  return x === globalThis || isInstanceOf(x, "Window");
}

/** @see https://html.spec.whatwg.org/multipage/webappapis.html#getting-the-current-value-of-the-event-handler */
function getTheCurrentValueOfTheEventHandler(
  eventTarget: EventTarget,
  name: string
): EventListener | null {
  // When the user agent is to get the current value of the event handler given
  // an EventTarget object eventTarget and a string name that is the name of an
  // event handler, it must run these steps:

  // 1. Let handlerMap be eventTarget's event handler map.
  const handlerMap = eventHandlerMap.get(eventTarget)!;

  // 2. Let eventHandler be handlerMap[name].
  const eventHandler = handlerMap[name];

  // 3. If eventHandler's value is an internal raw uncompiled handler, then:
  if (
    InternalRawUncompiledHandler.isInternalRawUncompiledHandler(
      eventHandler.value
    )
  ) {
    // 3. Let body be the uncompiled script body in eventHandler's value.
    // 4. Let location be the location where the script body originated, as
    //    given by eventHandler's value.
    const [body, location] = eventHandler.value;

    // 9. Let function be the result of calling OrdinaryFunctionCreate, with
    //    arguments:
    //    - functionPrototype = %Function.prototype%
    //    - sourceText =
    //      - If name is onerror and eventTarget is a Window object => The
    //        string formed by concatenating "function ", name, "(event, source,
    //        lineno, colno, error) {", U+000A LF, body, U+000A LF, and
    //        "}".
    //      - Otherwise => The string formed by concatenating "function ", name,
    //        "(event) {", U+000A LF, body, U+000A LF, and "}".
    //    - ParameterList =
    //      - If name is onerror and eventTarget is a Window object => Let the
    //        function have five arguments, named event, source, lineno, colno,
    //        and error.
    //      - Otherwise => Let the function have a single argument called event.
    let function_: Function;
    try {
      if (name === "onerror" && isWindowObject(eventTarget)) {
        function_ = new Function(
          "event",
          "source",
          "lineno",
          "colno",
          "error",
          body
        );
      } else {
        function_ = new Function("event", body);
      }
    } catch (error) {
      // 7. If body is not parsable as FunctionBody or if parsing detects an
      //    early error, then follow these substeps:

      // 1. Set eventHandler's value to null.
      eventHandler.value = null;
      // Note: This does not deactivate the event handler, which additionally
      // removes the event handler's listener (if present).

      // 2. Report the error for the appropriate script and with the appropriate
      //    position (line number and column number) given by location, using
      //    settings object's global object. If the error is still not handled
      //    after this, then the error may be reported to a developer console.
      if (typeof reportError !== "undefined") {
        Object.assign(error as Error, location);
        reportError(error);
      }

      // 3. Return null.
      return null;
    }

    // 12. Set eventHandler's value to the result of creating a Web IDL
    //     EventHandler callback function object whose object reference is
    //     function and whose callback context is settings object.
    eventHandler.value = function_ as EventListener;
  }

  // 4. Return eventHandler's value.
  return eventHandler.value;
}

export default getTheCurrentValueOfTheEventHandler;
