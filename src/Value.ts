import {EventDispatcher} from "./EventDispatcher";
import {EventEmitter} from "./EventEmitter";
import {ValueEventMap} from "./ValueEventMap";
import {Nullable} from "./Nullable";

export class Value<T> implements EventEmitter<ValueEventMap<T>> {

	private readonly dispatcher = new EventDispatcher<ValueEventMap<T>>();

	public get value(): Nullable<T> {
		return this.__value;
	}

	public set value(value: Nullable<T>) {
		if (this.__value === value)
			return;
		try {
			this.validate?.(value);
		} catch (e) {
			this.dispatcher.notify("Error", e, value);
			return;
		}
		this.__value = value;
		this.dispatcher.notify("Change", value);
	}

	public constructor(private __value?: Nullable<T>, private readonly validate?: (value?: Nullable<T>) => void) {}

	public addEventListener<K extends keyof ValueEventMap<T>>(key: K, listener: ValueEventMap<T>[K]): void {
		this.dispatcher.addEventListener(key, listener);
	}

	public removeEventListener<K extends keyof ValueEventMap<T>>(key: K, listener: ValueEventMap<T>[K]): void {
		this.dispatcher.removeEventListener(key, listener);
	}
}
