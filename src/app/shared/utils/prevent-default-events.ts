import {EventManagerPlugin} from '@angular/platform-browser';

export class PreventDefaultEventPlugin extends EventManagerPlugin {
  // Says to the plugin manager whether this plugin supports the given event name
  // So it supports all events that end with ".prevent" (submit.prevent)
  override supports(eventName: string): boolean {
   return eventName.endsWith(".prevent");
  }

  // If the event is supported by this plugin, this method will override the default behavior of the event
  // and prevent the default behavior of the event
  override addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    const originalEvent = eventName.split(".")[0];

    const wrappedHandler = (e: Event) => {
      e.preventDefault(); // Here
      handler(e);
    }
    element.addEventListener(originalEvent, wrappedHandler)

    // Prevents memory leak when the element is destroyed
    return () => element.removeEventListener(
      originalEvent,
      wrappedHandler
    )
  }
}
