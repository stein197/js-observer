/**
 * Interface that every class must implement if it emits events.
 * @typeParam T - `<event name>: <event listener signature>` map that describes which events the class could emit.
 */
export interface EventEmitter<T extends {[K: string]: (...data: any[]) => void}> {

	/**
	 * Add a listener to specific event.
	 * @param key Event name to subscribe on.
	 * @param listener Listener.
	 */
	addEventListener<K extends keyof T>(key: K, listener: T[K]): void;

	/**
	 * Remove previously subscribed listener from specific event.
	 * @param key Event name to cancel subscribe.
	 * @param listener Listener to remove.
	 */
	removeEventListener<K extends keyof T>(key: K, listener: T[K]): void;
}
