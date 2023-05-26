/**
 * For both of these two ways, the event handler is exposed through a name,
 * which is a string that always starts with "on" and is followed by the name of
 * the event for which the handler is intended.
 */
type EventHandlerName = `on${string}`;

export type { EventHandlerName as default };
