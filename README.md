# Observer pattern implementation for TypeScript
This tiny package implements the `observer` pattern in two different classes - `Observer` and `EventDispatcher`.

## Installation
Run:
```
npm i @stein197/observer
```

## Usage
`Observer` class:
```ts
const productObserver = new Observer<(id: number, name: string) => void>();
productObserver.addListener((id, name) => {/* ... */}); // Adding a listener
productObserver.onceListener((id, name) => {/* ... */}); // Will be fired only once
productObserver.notify(12, "Title"); // Notifying and passing parameters to all subscribed listeners
productObserver.notify(12, "Title", "Unused parameter"); // Compile-time error
```

`EventDispatcher` class:
```ts
type PlayerEvent = {
	AfterJoin(id: number): void;
	AfterUnjoin(id: number, reason: string): void;
}
const playerObserver = new EventDispatcher<PlayerEvent>();
playerObserver.addEventListener("AfterJoin", id => {/* ... */}); // Adding listener on "AfterJoin" event
playerObserver.addEventListener("AfterUnjoin", (id, reason) => {/* ... */}); // Adding listener on "AfterUnjoin" event
playerObserver.onceEventListener("AfterUnjoin", (id, reason) => {/* ... */}); // Will be fired only once
playerObserver.notify("AfterJoin", 12); // Firing all listeners subscribed on "AfterJoin" event
playerObserver.notify("AfterUnjoin", 12, "John"); // Firing all listeners subscribed on "AfterUnjoin" event
playerObserver.notify("AfterUnjoin", 12); // Compile-time error
```

Every class that emits event must implement `Observable` either `EventEmitter` interfaces for single or multiple events respectively:
```ts
import {Observable, EventEmitter} from "@stein197/observer";

class User implements EventEmitter<{AfterLeave(reason: string): void}> {
	public addEventListener(/* ... */) {/* ... */}
	public removeEventListener(/* ... */) {/* ... */}
}

class Value implements Observable<(value: string) => void> {
	public addListener(listener: (value: string) => void) {/* ... */}
	public removeListener(listener: (value: string) => void) {/* ... */}
}
```

## NPM scripts
- `clean` cleans working directory from compiled files
- `compile` compiles source code
- `bundle` bundles compiled code into a single file
- `test` runs unit tests