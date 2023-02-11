type EventEmitter = import("node:events");
let EventEmitter: typeof import("node:events");

try {
	EventEmitter = require("node:events");
} catch {

	type Listener = (...args: any[]) => void;
	const EMPTY: Listener[] = [];

	class EventEmitterAlternative implements EventEmitter {

		private _maxListeners = 10;
		private readonly _listeners: Record<string | symbol, Listener[]> = {};

		public addListener (eventName: string | symbol, listener: Listener): this {
			const listeners = this._listeners[eventName] ??= [];
			listeners.push(listener);
			if (listeners.length > this._maxListeners)
				console.warn(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${listeners.length} ${eventName.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`);
			return this;
		}

		public prependListener (eventName: string | symbol, listener: Listener): this {
			const listeners = this._listeners[eventName] ??= [];
			listeners.unshift(listener);
			if (listeners.length > this._maxListeners)
				console.warn(`MaxListenersExceededWarning: Possible EventEmitter memory leak detected. ${listeners.length} ${eventName.toString()} listeners added. Use emitter.setMaxListeners() to increase limit`);
			return this;
		}

		public removeListener (eventName: string | symbol, listener: Listener): this {
			const listeners = this._listeners[eventName];
			if (listeners) {
				const index = listeners.indexOf(listener);
				if (index >= 0) {
					if (listeners.length === 1)
						delete this._listeners[eventName];
					else
						listeners.splice(index, 1);
				}
			}

			return this;
		}

		public on (eventName: string | symbol, listener: Listener): this {
			this.addListener(eventName, listener);
			return this;
		}

		public once (eventName: string | symbol, listener: Listener): this {
			const realListener: Listener = (...args) => {
				this.removeListener(eventName, realListener);
				listener(...args);
			};
			this.addListener(eventName, realListener);
			return this;
		}

		public prependOnceListener (eventName: string | symbol, listener: Listener): this {
			const realListener: Listener = (...args) => {
				this.removeListener(eventName, realListener);
				listener(...args);
			};
			this.prependListener(eventName, realListener);
			return this;
		}

		public off (eventName: string | symbol, listener: Listener): this {
			this.removeListener(eventName, listener);
			return this;
		}

		public removeAllListeners (event?: string | symbol | undefined): this {
			if (event !== undefined)
				delete this._listeners[event];
			return this;
		}

		public emit (eventName: string | symbol, ...args: any[]): boolean {
			for (const listener of this._listeners[eventName])
				listener(...args);
			return true;
		}

		public setMaxListeners (n: number): this {
			this._maxListeners = n;
			return this;
		}

		public getMaxListeners (): number {
			return this._maxListeners;
		}

		public listeners (eventName: string | symbol): Function[] {
			const listeners = this._listeners[eventName];
			return listeners ? [...listeners] : EMPTY;
		}

		public rawListeners (eventName: string | symbol): Function[] {
			throw new Error("The rawListeners method is not available using this polyfill");
		}

		public listenerCount (eventName: string | symbol): number {
			return this._listeners[eventName]?.length ?? 0;
		}

		public eventNames (): (string | symbol)[] {
			return Object.keys(this._listeners);
		}
	}

	EventEmitter = EventEmitterAlternative as any;
}

export default EventEmitter;