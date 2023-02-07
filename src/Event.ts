export = Event;

const SYMBOL_INTERNAL = Symbol();

/**
 * Basic class that other event classes should inherit from.
 */
class Event {

	protected [SYMBOL_INTERNAL]: any;
}
