# Observer pattern implementation for TypeScript
This tiny package implements the `observer` pattern in two different classes - `Observer` and `EventDispatcher`.

## Installation
Run:
```
npm i @stein197/ts-observer
```

## Usage
For `Observer` class:
```ts
const productObserver = new Observer<(id: number, name: string) => void>();
productObserver.addListener((id, name) => {/* ... */}); // Adding a listener
productObserver.notify(12, "Title"); // Notifying and passing parameters to all subscribed listeners
```

For `EventDispatcher` class:
```ts
type PlayerEvent = {
	AfterJoin: (id: number) => void;
	AfterUnjoin: (id: number, reason: string) => void;
}
const playerObserver = new EventDispatcher<PlayerEvent>();
playerObserver.addEventListener("AfterJoin", id => {/* ... */}); // Adding listener on "AfterJoin" event
playerObserver.addEventListener("AfterUnjoin", (id, reason) => {/* ... */}); // Adding listener on "AfterUnjoin" event
playerObserver.notify("AfterJoin", 12); // Firing all listeners subscribed on "AfterJoin" event
playerObserver.notify("AfterUnjoin", 12, "John"); // Firing all listeners subscribed on "AfterUnjoin" event
```

## Testing
Run `npm run test` to test the package.
