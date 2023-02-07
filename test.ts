import "mocha";
import * as assert from "assert";
import EventDispatcher = require("./src/EventDispatcher");
import Event = require("./src/Event");

class NumberNStringEvent extends Event {

	public constructor(public readonly n: number, public readonly s: string) {
		super();
	}
}

class StringNNumberEvent extends Event {

	public constructor(public readonly s: string, public readonly number: n) {
		super();
	}
}

function getNoopNumberNString(): {tracker: assert.CallTracker; noop(event: NumberNStringEvent): void} {
	const tracker = new assert.CallTracker();
	return {
		tracker,
		noop: tracker.calls(() => {})
	};
}

function getNoopStringNNumber(): {tracker: assert.CallTracker; noop(event: StringNNumberEvent): void} {
	const tracker = new assert.CallTracker();
	return {
		tracker,
		noop: tracker.calls(() => {})
	};
}

describe("EventDispatcher<T>", () => {
	const argNumber = 12;
	const argString = "John";

	let dispatcher: EventDispatcher<[NumberNStringEvent, StringNNumberEvent]>;
	let noopNumberNString: (event: NumberNStringEvent) => void;
	let noopStringNNumber: (event: StringNNumberEvent) => void;
	let trackerNumberNString: assert.CallTracker;
	let trackerStringNNumber: assert.CallTracker;

	beforeEach(() => {
		dispatcher = new EventDispatcher();
		({noop: noopNumberNString, tracker: trackerNumberNString} = getNoopNumberNString());
		({noop: noopStringNNumber, tracker: trackerStringNNumber} = getNoopStringNNumber());
	});

	describe("addEventListener()", () => {
		it("Firing registered listener", () => {
			dispatcher.addEventListener(NumberNStringEvent, noopNumberNString);
			dispatcher.dispatch(NumberNStringEvent, new NumberNStringEvent(argNumber, argString));
			trackerNumberNString.verify();
		});
	
		it("Adding already added listener won't lead to firing it more than once", () => {
			dispatcher.addEventListener(NumberNStringEvent, noopNumberNString);
			dispatcher.addEventListener(NumberNStringEvent, noopNumberNString);
			dispatcher.dispatch(NumberNStringEvent, new NumberNStringEvent(argNumber, argString));
			trackerNumberNString.verify();
		});
	});

	describe("removeEventListener()", () => {
		it("Listeners won't be fired after removing", () => {
			dispatcher.addEventListener(NumberNStringEvent, noopNumberNString);
			dispatcher.removeEventListener(NumberNStringEvent, noopNumberNString);
			dispatcher.dispatch(NumberNStringEvent, new NumberNStringEvent(argNumber, argString));
			assert.throws(() => trackerNumberNString.verify(), assert.AssertionError);
		});
	});

	describe("onceEventListener()", () => {
		it("Fires only once", () => {
			dispatcher.onceEventListener(NumberNStringEvent, noopNumberNString);
			dispatcher.dispatch(NumberNStringEvent, new NumberNStringEvent(argNumber, argString));
			dispatcher.dispatch(NumberNStringEvent, new NumberNStringEvent(argNumber, argString));
			trackerNumberNString.verify();
		});
	});

	describe("dispatch()", () => {
		it("Passes arguments through addEventListener()", () => {
			let tmpNumber = 0;
			let tmpString = "";
			dispatcher.addEventListener(NumberNStringEvent, event => {
				tmpNumber = event.n;
				tmpString = event.s;
			});
			dispatcher.dispatch(NumberNStringEvent, new NumberNStringEvent(argNumber, argString));
			assert.equal(tmpNumber, argNumber);
			assert.equal(tmpString, argString);
		});

		it("Passes arguments through onceEventListener()", () => {
			let tmpNumber = 0;
			let tmpString = "";
			dispatcher.onceEventListener(NumberNStringEvent, event => {
				tmpNumber = event.n;
				tmpString = event.s;
			});
			dispatcher.dispatch(NumberNStringEvent, new NumberNStringEvent(argNumber, argString));
			assert.equal(tmpNumber, argNumber);
			assert.equal(tmpString, argString);
		});
	});

	it("Firing event of one type won't fire listeners of another", () => {
		dispatcher.addEventListener(NumberNStringEvent, noopNumberNString);
		dispatcher.addEventListener(StringNNumberEvent, noopStringNNumber);
		dispatcher.dispatch(NumberNStringEvent, new NumberNStringEvent(argNumber, argString));
		trackerNumberNString.verify();
		assert.throws(() => trackerStringNNumber.verify(), assert.AssertionError)
		dispatcher.dispatch(StringNNumberEvent, new StringNNumberEvent(argString, argNumber));
		trackerNumberNString.verify();
		trackerStringNNumber.verify();
	});
});
