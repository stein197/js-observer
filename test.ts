import "mocha";
import * as assert from "assert";
import Observer = require("./src/Observer");
import EventDispatcher = require("./src/EventDispatcher");

function getNoop(): {tracker: assert.CallTracker; noop(): void} {
	const tracker = new assert.CallTracker();
	return {
		tracker,
		noop: tracker.calls(() => {})
	};
}

function getNoopNumberNString(): {tracker: assert.CallTracker; noop(n: number, s: string): void} {
	const tracker = new assert.CallTracker();
	return {
		tracker,
		noop: tracker.calls((n, s) => {n;s;})
	};
}

function getNoopStringNNumber(): {tracker: assert.CallTracker; noop(s: string, n: number): void} {
	const tracker = new assert.CallTracker();
	return {
		tracker,
		noop: tracker.calls((s, n) => {s;n;})
	};
}

describe("Observer<T>", () => {
	const arg = 12;
	let observer: Observer<(number: number) => void>;
	let noop: () => void;
	let tracker: assert.CallTracker;

	beforeEach(() => {
		observer = new Observer();
		({noop, tracker} = getNoop());
	});

	describe("addListener()", () => {
		it("Firing registered listener", () => {
			observer.addListener(noop);
			observer.dispatch(arg);
			tracker.verify();
		});
	
		it("Adding already added listener won't lead to firing it more than once", () => {
			observer.addListener(noop);
			observer.addListener(noop);
			observer.dispatch(arg);
			tracker.verify();
		});
	});

	describe("removeListener()", () => {
		it("Listeners won't be fired after removing", () => {
			observer.addListener(noop);
			observer.removeListener(noop);
			observer.dispatch(arg);
			assert.throws(() => tracker.verify(), assert.AssertionError);
		});
	
		it("Removing a listener actually removes it from the inner array", () => {
			observer.addListener(noop);
			assert.equal((observer as any).listeners.length, 1);
			observer.removeListener(noop);
			assert.equal((observer as any).listeners.length, 0);
		});
	});

	describe("onceListener()", () => {
		it("Fires only once", () => {
			observer.onceListener(noop);
			observer.dispatch(arg);
			observer.dispatch(arg);
			tracker.verify();
		});
	});

	describe("dispatch()", () => {
		it("Passes arguments through addListener()", () => {
			let tmp = 0;
			observer.addListener(arg => tmp = arg);
			observer.dispatch(arg);
			assert.equal(tmp, arg);
		});

		it("Passes arguments through onceListener()", () => {
			let tmp = 0;
			observer.onceListener(arg => tmp = arg);
			observer.dispatch(arg);
			assert.equal(tmp, arg);
		});
	});
});

describe("EventDispatcher<T>", () => {
	const argNumber = 12;
	const argString = "John";
	let eventDispatcher: EventDispatcher<{
		numberNstring(n: number, s: string): void;
		stringNnumber(s: string, n: number): void;
	}>;
	let noopNumberNString: (n: number, s: string) => void;
	let noopStringNNumber: (s: string, n: number) => void;
	let trackerNumberNString: assert.CallTracker;
	let trackerStringNNumber: assert.CallTracker;

	beforeEach(() => {
		eventDispatcher = new EventDispatcher();
		({noop: noopNumberNString, tracker: trackerNumberNString} = getNoopNumberNString());
		({noop: noopStringNNumber, tracker: trackerStringNNumber} = getNoopStringNNumber());
	});

	describe("addEventListener()", () => {
		it("Firing registered listener", () => {
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			eventDispatcher.dispatch("numberNstring", argNumber, argString);
			trackerNumberNString.verify();
		});
	
		it("Adding already added listener won't lead to firing it more than once", () => {
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			eventDispatcher.dispatch("numberNstring", argNumber, argString);
			trackerNumberNString.verify();
		});
	});

	describe("removeEventListener()", () => {
		it("Listeners won't be fired after removing", () => {
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			eventDispatcher.removeEventListener("numberNstring", noopNumberNString);
			eventDispatcher.dispatch("numberNstring", argNumber, argString);
			assert.throws(() => trackerNumberNString.verify(), assert.AssertionError);
		});
	
		it("Removing a listener actually removes it from the inner array", () => {
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			assert.equal((eventDispatcher as any).observers.numberNstring.listeners.length, 1);
			eventDispatcher.removeEventListener("numberNstring", noopNumberNString);
			assert.equal((eventDispatcher as any).observers.numberNstring.listeners, 0);
		});
	});

	describe("onceEventListener()", () => {
		it("Fires only once", () => {
			eventDispatcher.onceEventListener("numberNstring", noopNumberNString);
			eventDispatcher.dispatch("numberNstring", argNumber, argString);
			eventDispatcher.dispatch("numberNstring", argNumber, argString);
			trackerNumberNString.verify();
		});
	});

	describe("dispatch()", () => {
		it("Passes arguments through addEventListener()", () => {
			let tmpNumber = 0;
			let tmpString = "";
			eventDispatcher.addEventListener("numberNstring", (n, s) => {
				tmpNumber = n;
				tmpString = s;
			});
			eventDispatcher.dispatch("numberNstring", argNumber, argString);
			assert.equal(tmpNumber, argNumber);
			assert.equal(tmpString, argString);
		});

		it("Passes arguments through onceEventListener()", () => {
			let tmpNumber = 0;
			let tmpString = "";
			eventDispatcher.onceEventListener("numberNstring", (n, s) => {
				tmpNumber = n;
				tmpString = s;
			});
			eventDispatcher.dispatch("numberNstring", argNumber, argString);
			assert.equal(tmpNumber, argNumber);
			assert.equal(tmpString, argString);
		});
	});

	it("Firing event of one type won't fire listeners of another", () => {
		eventDispatcher.addEventListener("numberNstring", noopNumberNString);
		eventDispatcher.addEventListener("stringNnumber", noopStringNNumber);
		eventDispatcher.dispatch("numberNstring", argNumber, argString);
		trackerNumberNString.verify();
		assert.throws(() => trackerStringNNumber.verify(), assert.AssertionError)
		eventDispatcher.dispatch("stringNnumber", argString, argNumber);
		trackerNumberNString.verify();
		trackerStringNNumber.verify();
	});

	it("Removing event of one type won't remove listeners of another", () => {
		eventDispatcher.addEventListener("numberNstring", noopNumberNString);
		eventDispatcher.addEventListener("stringNnumber", noopStringNNumber);
		eventDispatcher.removeEventListener("numberNstring", noopNumberNString);
		assert.equal((eventDispatcher as any).observers.numberNstring.listeners.length, 0);
		assert.equal((eventDispatcher as any).observers.stringNnumber.listeners.length, 1);
	});
});
