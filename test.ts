import should from "should";
import mocha from "mocha";
import {Observer, EventDispatcher} from ".";

mocha.describe("Observer<T>", () => {
	let observer: Observer<(number: number) => void>;
	let obj: {number: number};
	let listener: (n: number) => void;

	mocha.beforeEach(() => {
		observer = new Observer;
		obj = {
			number: 0
		};
		listener = n => obj.number += n;
	});

	mocha.it("Firing registered listener", () => {
		observer.addListener(listener);
		observer.notify(12);
		should(obj.number).be.equal(12);
	});

	mocha.it("Adding already added listener won't lead to firing it more than once", () => {
		observer.addListener(listener);
		observer.addListener(listener);
		observer.notify(12);
		should(obj.number).be.equal(12);
	});

	mocha.it("Listeners won't be fired after removing", () => {
		observer.addListener(listener);
		observer.removeListener(listener);
		observer.notify(12);
		should(obj.number).be.equal(0);
	});

	mocha.it("Removing a listener actually removes it from the inner array", () => {
		observer.addListener(listener);
		should((observer as any).listeners.length).be.equal(1);
		observer.removeListener(listener);
		should((observer as any).listeners).be.empty();
	});

	mocha.it("Removing not existing listener does nothing", () => {
		observer.removeListener(listener);
	});

	mocha.it("Firing empty observer does nothing", () => {
		observer.notify(12);
	});

	mocha.it.skip("Once"); // TODO
});

mocha.describe("EventDispatcher<T>", () => {
	let eventDispatcher: EventDispatcher<{
		AfterJoin(id: number): void;
		AfterUnjoin(id: number, reason: string): void;
	}>;
	let obj: {id: number, name: string};
	let listenerAfterJoin: (id: number) => void;
	let listenerAfterUnjoin: (id: number, reason: string) => void;

	mocha.beforeEach(() => {
		eventDispatcher = new EventDispatcher;
		obj = {
			id: 0,
			name: ""
		};
		listenerAfterJoin = id => obj.id += id;
		listenerAfterUnjoin = (id, reason) => {
			obj.id += id;
			obj.name += reason;
		}
	});

	mocha.it("Firing registered listener", () => {
		eventDispatcher.addEventListener("AfterJoin", listenerAfterJoin);
		eventDispatcher.notify("AfterJoin", 12);
		should(obj.id).be.equal(12);
	});

	mocha.it("Adding already added listener won't lead to firing it more than once", () => {
		eventDispatcher.addEventListener("AfterJoin", listenerAfterJoin);
		eventDispatcher.addEventListener("AfterJoin", listenerAfterJoin);
		eventDispatcher.notify("AfterJoin", 12);
		should(obj.id).be.equal(12);
	});

	mocha.it("Listeners won't be fired after removing", () => {
		eventDispatcher.addEventListener("AfterJoin", listenerAfterJoin);
		eventDispatcher.removeEventListener("AfterJoin", listenerAfterJoin);
		eventDispatcher.notify("AfterJoin", 12);
		should(obj.id).be.equal(0);
	});

	mocha.it("Removing a listener actually removes it from the inner array", () => {
		eventDispatcher.addEventListener("AfterJoin", listenerAfterJoin);
		should((eventDispatcher as any).observers.AfterJoin.listeners.length).be.equal(1);
		eventDispatcher.removeEventListener("AfterJoin", listenerAfterJoin);
		should((eventDispatcher as any).observers.AfterJoin.listeners).be.empty();
	});

	mocha.it("Removing not existing listener does nothing", () => {
		eventDispatcher.removeEventListener("AfterJoin", listenerAfterJoin);
	});

	mocha.it("Firing empty observer does nothing", () => {
		eventDispatcher.notify("AfterJoin", 12);
	});

	mocha.it("Firing event of one type won't fire listeners of another", () => {
		eventDispatcher.addEventListener("AfterJoin", listenerAfterJoin);
		eventDispatcher.addEventListener("AfterUnjoin", listenerAfterUnjoin);
		eventDispatcher.notify("AfterJoin", 12);
		should(obj).be.deepEqual({id: 12, name: ""});
		eventDispatcher.notify("AfterUnjoin", 12, "John");
		should(obj).be.deepEqual({id: 24, name: "John"});
	});

	mocha.it("Removing event of one type won't remove listeners of another", () => {
		eventDispatcher.addEventListener("AfterJoin", listenerAfterJoin);
		eventDispatcher.addEventListener("AfterUnjoin", listenerAfterUnjoin);
		eventDispatcher.removeEventListener("AfterUnjoin", listenerAfterUnjoin);
		should((eventDispatcher as any).observers.AfterUnjoin.listeners).be.empty();
		should((eventDispatcher as any).observers.AfterJoin.listeners).not.be.empty();
	});

	mocha.it.skip("Once"); // TODO
});
