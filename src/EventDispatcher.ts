import {EventEmitter} from "./EventEmitter";
import {Observer} from "./Observer";

/**
 * Class that is used to implement pattern `observer`. Observer is an object you can subscribe on to listen to it's
 * changes. Unlike single {@link Observer} where at dispatching moment every listener is being fired, here only selected
 * group of events could be called, passing them specific data.
 * @typeParam T - Map of pairs `<event name>: <listener type>`.
 * Basic usage:
 * ```ts
 * type PlayerEvent = {
 *     AfterJoin: (id: number) => void;
 *     AfterUnjoin: (id: number, reason: string) => void;
 * }
 * const playerObserver = new EventDispatcher<PlayerEvent>();
 * playerObserver.addEventListener("AfterJoin", id => {}); // Adding listener on "AfterJoin" event
 * playerObserver.addEventListener("AfterUnjoin", (id, reason) => {}); // Adding listener on "AfterUnjoin" event
 * playerObserver.dispatch("AfterJoin", 12); // Firing all listeners subscribed on "AfterJoin" event
 * playerObserver.dispatch("AfterUnjoin", 12, "John"); // Firing all listeners subscribed on "AfterUnjoin" event
 * ```
 */
export class EventDispatcher<T extends {[K: string]: (...args: any[]) => void}> implements EventEmitter<T> {

	/** Holds all subscribed listeners grouped by event name */
	private readonly observers: {[K in keyof T]?: Observer<T[K]>} = {};

	public addEventListener<K extends keyof T>(key: K, listener: T[K]): void {
		this.ensureEventObserver(key);
		this.observers[key]!.addListener(listener);
	}

	public removeEventListener<K extends keyof T>(key: K, listener: T[K]): void {
		this.observers[key]?.removeListener(listener);
	}

	public onceEventListener<K extends keyof T>(key: K, listener: T[K]): void {
		this.ensureEventObserver(key);
		this.observers[key]!.onceListener(listener);
	}

	/**
	 * Dispatch listeners subscribed on specific event.
	 * @param key Event name which listeners will be called.
	 * @param args Arguments to pass to the listeners.
	 */
	public dispatch<K extends keyof T>(key: K, ...args: Parameters<T[K]>): void {
		this.observers[key]?.dispatch(...args);
	}

	private ensureEventObserver<K extends keyof T>(key: K): void {
		if (!this.observers[key])
			this.observers[key] = new Observer();
	}
}
