import type InternalRawUncompiledHandler from "./InternalRawUncompiledHandler.js";

/**
 * Many objects can have event handlers specified. These act as non-capture
 * event listeners for the object on which they are specified. [DOM]
 */
export default interface EventHandler {
  /**
   * A value, which is either null, a callback object, or an internal raw
   * uncompiled handler. The EventHandler callback function type describes how
   * this is exposed to scripts. Initially, an event handler's value must be set
   * to null.
   *
   * @default null
   */
  value: null | EventListener | InternalRawUncompiledHandler;

  /**
   * A listener, which is either null or an event listener responsible for
   * running the event handler processing algorithm. Initially, an event
   * handler's listener must be set to null.
   *
   * @default null
   */
  listener: null | EventListener;
}
