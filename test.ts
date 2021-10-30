import mocha from "mocha";
import assert from "assert";
import {Observer, EventDispatcher} from ".";

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

mocha.describe("Observer<T>", () => {
	const arg = 12;
	let observer: Observer<(number: number) => void>;
	let noop: () => void;
	let tracker: assert.CallTracker;

	mocha.beforeEach(() => {
		observer = new Observer();
		({noop, tracker} = getNoop());
	});

	mocha.describe("addListener()", () => {
		mocha.it("Firing registered listener", () => {
			observer.addListener(noop);
			observer.notify(arg);
			tracker.verify();
		});
	
		mocha.it("Adding already added listener won't lead to firing it more than once", () => {
			observer.addListener(noop);
			observer.addListener(noop);
			observer.notify(arg);
			tracker.verify();
		});
	});

	mocha.describe("removeListener()", () => {
		mocha.it("Listeners won't be fired after removing", () => {
			observer.addListener(noop);
			observer.removeListener(noop);
			observer.notify(arg);
			assert.throws(() => tracker.verify(), assert.AssertionError);
		});
	
		mocha.it("Removing a listener actually removes it from the inner array", () => {
			observer.addListener(noop);
			assert.equal((observer as any).listeners.length, 1);
			observer.removeListener(noop);
			assert.equal((observer as any).listeners.length, 0);
		});
	});

	mocha.describe("onceListener()", () => {
		mocha.it("Fires only once", () => {
			observer.onceListener(noop);
			observer.notify(arg);
			observer.notify(arg);
			tracker.verify();
		});
	});

	mocha.describe("notify()", () => {
		mocha.it("Passes arguments through addListener()", () => {
			let tmp = 0;
			observer.addListener(arg => tmp = arg);
			observer.notify(arg);
			assert.equal(tmp, arg);
		});

		mocha.it("Passes arguments through onceListener()", () => {
			let tmp = 0;
			observer.onceListener(arg => tmp = arg);
			observer.notify(arg);
			assert.equal(tmp, arg);
		});
	});
});

mocha.describe("EventDispatcher<T>", () => {
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

	mocha.beforeEach(() => {
		eventDispatcher = new EventDispatcher();
		({noop: noopNumberNString, tracker: trackerNumberNString} = getNoopNumberNString());
		({noop: noopStringNNumber, tracker: trackerStringNNumber} = getNoopStringNNumber());
	});

	mocha.describe("addEventListener()", () => {
		mocha.it("Firing registered listener", () => {
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			eventDispatcher.notify("numberNstring", argNumber, argString);
			trackerNumberNString.verify();
		});
	
		mocha.it("Adding already added listener won't lead to firing it more than once", () => {
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			eventDispatcher.notify("numberNstring", argNumber, argString);
			trackerNumberNString.verify();
		});
	});

	mocha.describe("removeEventListener()", () => {
		mocha.it("Listeners won't be fired after removing", () => {
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			eventDispatcher.removeEventListener("numberNstring", noopNumberNString);
			eventDispatcher.notify("numberNstring", argNumber, argString);
			assert.throws(() => trackerNumberNString.verify(), assert.AssertionError);
		});
	
		mocha.it("Removing a listener actually removes it from the inner array", () => {
			eventDispatcher.addEventListener("numberNstring", noopNumberNString);
			assert.equal((eventDispatcher as any).observers.numberNstring.listeners.length, 1);
			eventDispatcher.removeEventListener("numberNstring", noopNumberNString);
			assert.equal((eventDispatcher as any).observers.numberNstring.listeners, 0);
		});
	});

	mocha.describe("onceEventListener()", () => {
		mocha.it("Fires only once", () => {
			eventDispatcher.onceEventListener("numberNstring", noopNumberNString);
			eventDispatcher.notify("numberNstring", argNumber, argString);
			eventDispatcher.notify("numberNstring", argNumber, argString);
			trackerNumberNString.verify();
		});
	});

	mocha.describe("notify()", () => {
		mocha.it.skip("Passes arguments through addEventListener()", () => {
			let tmpNumber = 0;
			let tmpString = "";
			eventDispatcher.addEventListener("numberNstring", (n, s) => {
				tmpNumber = n;
				tmpString = s;
			});
			eventDispatcher.notify("numberNstring", argNumber, argString);
			assert.equal(tmpNumber, argNumber);
			assert.equal(tmpString, argString);
		});

		mocha.it.skip("Passes arguments through onceEventListener()", () => {
			let tmpNumber = 0;
			let tmpString = "";
			eventDispatcher.onceEventListener("numberNstring", (n, s) => {
				tmpNumber = n;
				tmpString = s;
			});
			eventDispatcher.notify("numberNstring", argNumber, argString);
			assert.equal(tmpNumber, argNumber);
			assert.equal(tmpString, argString);
		});
	});

	mocha.it("Firing event of one type won't fire listeners of another", () => {
		eventDispatcher.addEventListener("numberNstring", noopNumberNString);
		eventDispatcher.addEventListener("stringNnumber", noopStringNNumber);
		eventDispatcher.notify("numberNstring", argNumber, argString);
		trackerNumberNString.verify();
		assert.throws(() => trackerStringNNumber.verify(), assert.AssertionError)
		eventDispatcher.notify("stringNnumber", argString, argNumber);
		trackerNumberNString.verify();
		trackerStringNNumber.verify();
	});

	mocha.it("Removing event of one type won't remove listeners of another", () => {
		eventDispatcher.addEventListener("numberNstring", noopNumberNString);
		eventDispatcher.addEventListener("stringNnumber", noopStringNNumber);
		eventDispatcher.removeEventListener("numberNstring", noopNumberNString);
		assert.equal((eventDispatcher as any).observers.numberNstring.listeners.length, 0);
		assert.equal((eventDispatcher as any).observers.stringNnumber.listeners.length, 1);
	});
});
