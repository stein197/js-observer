// TODO: Documentation
export interface EventEmitter<T extends {[K: string]: (...data: any[]) => void}> {

	addEventListener<K extends keyof T>(key: K, listener: T): void;

	removeEventListener<K extends keyof T>(key: K, listener: T): void;
}
