import type {Constructor} from "./Constructor";
import type Event = require("./Event");

/**
 * Interface that every class must implement if it emits events.
 * @typeParam T - List of events to produce.
 */
export interface EventEmitter<T extends Event[]> {

	/**
	 * Add a listener to specific event.
	 * @param type Event type to subscribe on.
	 * @param listener Listener.
	 */
	addEventListener<E extends T[number]>(type: Constructor<E>, listener: (event: E) => void): void;

	/**
	 * Remove previously subscribed listener from specific event.
	 * @param type Event type to cancel subscribe.
	 * @param listener Listener to remove.
	 */
	removeEventListener<E extends T[number]>(type: Constructor<E>, listener: (event: E) => void): void;

	/**
	 * Add a listener to specific event that will be fired only once.
	 * @param type Event type to subscribe on.
	 * @param listener Listener.
	 */
	onceEventListener<E extends T[number]>(type: Constructor<E>, listener: (event: E) => void): void;
}
