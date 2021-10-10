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

/**
 * Class that is used to implement pattern `observer`. Observer is an object you can subscribe on to listen to it's
 * changes. Unlike single {@link Observer} where at notifying moment every listener is being fired, here only selected
 * group of events could be called, passing them specific data.
 * @typeParam T - Map of pairs `<event name>: <listener type>`.
 * Basic usage:
 * ```ts
 * type PlayerEvent = {
 *     AfterJoin: (id: number) => void;
 *     AfterUnjoin: (id: number, reason: string) => void;
 * }
 * const playerObserver = new ObserverGroup<PlayerEvent>();
 * playerObserver.addEventListener("AfterJoin", id => {}); // Adding listener on "AfterJoin" event
 * playerObserver.addEventListener("AfterUnjoin", (id, reason) => {}); // Adding listener on "AfterUnjoin" event
 * playerObserver.notify("AfterJoin", 12); // Firing all listeners subscribed on "AfterJoin" event
 * playerObserver.notify("AfterUnjoin", 12, "John"); // Firing all listeners subscribed on "AfterUnjoin" event
 * ```
 */
export class EventDispatcher<T extends {[K: string]: (...data: any[]) => void}> {

	/** Holds all subscribed listeners grouped by event name */
	private readonly observers: {[K in keyof T]?: Observer<T[K]>} = {};

	/**
	 * Add a listener to specific event.
	 * @param key Event name to subscribe on.
	 * @param listener Listener.
	 */
	public addEventListener<K extends keyof T>(key: K, listener: T[K]): void {
		if (!this.observers[key])
			this.observers[key] = new Observer();
		this.observers[key]!.addListener(listener);
	}

	/**
	 * Remove previously subscribed listener from specific event.
	 * @param key Event name to cancel subscribe.
	 * @param listener Listener to remove.
	 */
	public removeEventListener<K extends keyof T>(key: K, listener: T[K]): void {
		this.observers[key]?.removeListener(listener);
	}

	/**
	 * Notify listeners subscribed on specific event.
	 * @param key Event name which listeners will be called.
	 * @param data Arguments to pass to the listeners.
	 */
	public notify<K extends keyof T>(key: K, ...data: Parameters<T[K]>): void {
		this.observers[key]?.notify(...data);
	}
}

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
	addEventListener<K extends keyof T>(key: K, listener: T): void;

	/**
	 * Remove previously subscribed listener from specific event.
	 * @param key Event name to cancel subscribe.
	 * @param listener Listener to remove.
	 */
	removeEventListener<K extends keyof T>(key: K, listener: T): void;
}
