/**
 * Interface that every class must implement if it emits an event.
 * @typeParam T - Callback type that an object accepts as listener.
 */
export interface Observable<T extends (...data: any[]) => void> {

	/**
	 * Add a listener.
	 * @param listener Listener.
	 */
	addListener(listener: T): void;

	/**
	 * Remove previously subscribed listener.
	 * @param listener Listener to remove.
	 */
	removeListener(listener: T): void;
}
