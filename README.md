# Observer pattern implementation for TypeScript
This tiny package implements the `observer` pattern in two different classes - `Observer` and `EventDispatcher`.

## Installation
Run:
```
npm i @stein197/observer
```

## Usage
For `Observer` class:
```ts
const productObserver = new Observer<(id: number, name: string) => void>();
productObserver.addListener((id, name) => {/* ... */}); // Adding a listener
productObserver.notify(12, "Title"); // Notifying and passing parameters to all subscribed listeners
productObserver.notify(12, "Title", "Unused parameter"); // Compile-time error
```

For `EventDispatcher` class:
```ts
type PlayerEvent = {
	AfterJoin(id: number): void;
	AfterUnjoin(id: number, reason: string): void;
}
const playerObserver = new EventDispatcher<PlayerEvent>();
playerObserver.addEventListener("AfterJoin", id => {/* ... */}); // Adding listener on "AfterJoin" event
playerObserver.addEventListener("AfterUnjoin", (id, reason) => {/* ... */}); // Adding listener on "AfterUnjoin" event
playerObserver.notify("AfterJoin", 12); // Firing all listeners subscribed on "AfterJoin" event
playerObserver.notify("AfterUnjoin", 12, "John"); // Firing all listeners subscribed on "AfterUnjoin" event
playerObserver.notify("AfterUnjoin", 12); // Compile-time error
```

Every class that emits event must implement `EventEmitter` interface:
```ts
import {EventEmitter} from "@stein197/observer";

class User implements EventEmitter<{AfterLeave(reason: string): void}> {
	public addEventListener(...) {...}
	public removeEventListener(...) {...}
}
```

## NPM scripts
- `test` runs unit tests
- `build` compiles source code into js files