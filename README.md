# Observer pattern implementation for TypeScript
This tiny package implements the `observer` pattern.

## Installation
Run:
```
npm i @stein197/observer
```

## Usage
```ts
import Event from "@stein197/observer/Event";
class JoinEvent extends Event {}
class LeaveEvent extends Event {}
const dispatcher = new EventDispatcher<[JoinEvent, LeaveEvent]>();
dispatcher.addEventListener(JoinEvent, event => {}); // Adding listener on JoinEvent event
dispatcher.addEventListener(LeaveEvent, event => {}); // Adding listener on LeaveEvent event
dispatcher.dispatch(JoinEvent, new JoinEvent()); // Firing all listeners subscribed on "AfterJoin" event
dispatcher.dispatch(LeaveEvent, new LeaveEvent()); // Firing all listeners subscribed on "AfterUnjoin" event
```

Every class that emits event must implement `EventEmitter` interface:
```ts
import type {EventEmitter} from "@stein197/observer/EventEmitter";

class User implements EventEmitter<[]> {
	public addEventListener(/* ... */) {/* ... */}
	public removeEventListener(/* ... */) {/* ... */}
}
```

## NPM scripts
- `clean` cleans working directory
- `build` compiles source code
- `test` runs unit tests
