/**
 * Class that is used to implement pattern `observer`. Observer is an object you can subscribe on to listen to it's
 * changes.
 * @typeParam T - What type of listener an observer can accept. `() => void` by default.
 * Basic usage:
 * ```ts
 * const productObserver = new Observer<(id: number, name: string) => void>();
 * productObserver.addListener((id, name) => {}); // Adding a listener
 * productObserver.notify(12, "Title"); // Notifying and passing parameters to all subscribed listeners
 * ```
 */
export class Observer<T extends (...data: any[]) => void = () => void> {

	/** Holds all subscribed listeners */
	private readonly listeners: T[] = [];

	/**
	 * Add a listener.
	 * @param listener Listener.
	 */
	public addListener(listener: T): void {
		if (!this.has(listener))
			this.listeners.push(listener);
	}

	/**
	 * Remove previously subscribed listener.
	 * @param listener Listener to remove.
	 */
	public removeListener(listener: T): void {
		const index: number = this.listeners.indexOf(listener);
		if (index >= 0)
			this.listeners.splice(index, 1);
	}

	/**
	 * Notify all subscribed listeners.
	 * @param data Parameters being passed to subscribed listeners.
	 */
	public notify(...data: Parameters<T>): void {
		this.listeners.slice().forEach(callback => callback(...data));
	}

	private has(listener: T): boolean {
		return this.listeners.indexOf(listener) >= 0;
	}
}
