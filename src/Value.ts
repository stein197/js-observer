import {Nullable} from "./Nullable";
import {Observable} from "./Observable";
import { Observer } from "..";

export class Value<T> implements Observable<(value: Nullable<T>) => void> {

	private readonly observer = new Observer<(value: Nullable<T>) => void>();

	public get value(): Nullable<T> {
		return this.__value;
	}

	public set value(value: Nullable<T>) {
		if (this.__value === value)
			return;
		this.__value = value;
		this.observer.notify(value);
	}

	public constructor(private __value?: Nullable<T>) {}

	public addListener(listener: (value: Nullable<T>) => void): void {
		this.observer.addListener(listener);
	}

	public removeListener(listener: (value: Nullable<T>) => void): void {
		this.observer.removeListener(listener);
	}
}
