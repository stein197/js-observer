import {Observable} from "./Observable";

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
export class Observer<T extends (...args: any[]) => void = () => void> implements Observable<T> {

	/** Holds all subscribed listeners */
	private readonly listeners: T[] = [];

	public addListener(listener: T): void {
		if (this.listeners.indexOf(listener) < 0)
			this.listeners.push(listener);
	}

	public removeListener(listener: T): void {
		const index: number = this.listeners.indexOf(listener);
		if (index >= 0)
			this.listeners.splice(index, 1);
	}

	/**
	 * Notify all subscribed listeners.
	 * @param args Parameters being passed to subscribed listeners.
	 */
	public notify(...args: Parameters<T>): void {
		this.listeners.slice().forEach(callback => callback(...args));
	}
}
