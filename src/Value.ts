import {EventDispatcher} from "./EventDispatcher";
import {EventEmitter} from "./EventEmitter";

export class Value<T> implements EventEmitter<ValueEvent<T>> {

	private readonly dispatcher = new EventDispatcher<ValueEvent<T>>();

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

	public addEventListener<K extends keyof ValueEvent<T>>(key: K, listener: ValueEvent<T>[K]): void {
		this.dispatcher.addEventListener(key, listener);
	}

	public removeEventListener<K extends keyof ValueEvent<T>>(key: K, listener: ValueEvent<T>[K]): void {
		this.dispatcher.removeEventListener(key, listener);
	}
}

type ValueEvent<T> = {
	Change(value?: Nullable<T>): void;
	Error(error: any, value?: Nullable<T>): void;
}

type Nullable<T> = T | null | undefined;
