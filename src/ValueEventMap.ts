import {Nullable} from "./Nullable";

export type ValueEventMap<T> = {
	Change(value?: Nullable<T>): void;
	Error(error: any, value?: Nullable<T>): void;
}
