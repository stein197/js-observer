import type {EventEmitter} from "./EventEmitter";
import type {Constructor} from "./Constructor";
import type Event = require("./Event");

export = EventDispatcher;

/**
 * Class that is used to implement pattern `observer`. Observer is an object you can subscribe on to listen to it's
 * changes.
 * @typeParam T - List of events that this dispatcher can produce.
 * Basic usage:
 * ```ts
 * class JoinEvent extends Event {}
 * class LeaveEvent extends Event {}
 * const dispatcher = new EventDispatcher<[JoinEvent, LeaveEvent]>();
 * dispatcher.addEventListener(JoinEvent, event => {}); // Adding listener on JoinEvent event
 * dispatcher.addEventListener(LeaveEvent, event => {}); // Adding listener on LeaveEvent event
 * dispatcher.dispatch(JoinEvent, new JoinEvent()); // Firing all listeners subscribed on "AfterJoin" event
 * dispatcher.dispatch(LeaveEvent, new LeaveEvent()); // Firing all listeners subscribed on "AfterUnjoin" event
 * ```
 */
class EventDispatcher<T extends Event[]> implements EventEmitter<T> {

	private readonly observers: Map<Constructor<Event>, ((event: Event) => void)[]> = new Map();

	/**
	 * @inheritdoc
	 */
	public addEventListener<E extends T[number]>(type: Constructor<E>, listener: (event: E) => void): void {
		this.ensureEventObserver(type);
		const index = this.getListenerIndex(type, listener);
		if (index < 0)
			this.observers.get(type)!.push(listener as (event: Event) => void);
	}

	/**
	 * @inheritdoc
	 */
	public removeEventListener<E extends T[number]>(type: Constructor<E>, listener: (event: E) => void): void {
		const index = this.getListenerIndex(type, listener);
		if (index >= 0)
			this.observers.get(type)!.splice(index, 1);
	}

	/**
	 * @inheritdoc
	 */
	public onceEventListener<E extends T[number]>(type: Constructor<E>, listener: (event: E) => void): void {
		this.ensureEventObserver(type);
		const once = (e: E): void => {
			listener(e);
			this.removeEventListener(type, once);
		}
		this.addEventListener(type, once);
	}

	/**
	 * Dispatch listeners subscribed on specific event. Event type is automatically inferred from the instance.
	 * @param type Event type which listeners will be called.
	 * @param event Event object to pass to the listeners.
	 */
	public dispatch<E extends T[number]>(event: E): void {
		const type = event.constructor as Constructor<Event>;
		this.observers.get(type)?.forEach(listener => listener(event));
	}

	private ensureEventObserver<E extends T[number]>(type: Constructor<E>): void {
		if (!this.observers.has(type))
			this.observers.set(type, []);
	}

	private getListenerIndex<E extends T[number]>(type: Constructor<E>, listener: (event: E) => void): number {
		const listenerArray = this.observers.get(type);
		return listenerArray ? listenerArray.indexOf(listener as (event: Event) => void) : -1;
	}
}
