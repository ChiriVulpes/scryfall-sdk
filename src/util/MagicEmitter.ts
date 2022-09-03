import { EventEmitter } from "events";

export interface MagicArray<T, NOT_FOUND = never> extends Array<T> {
	not_found: NOT_FOUND[];
}

export default class MagicEmitter<T, NOT_FOUND = never> extends EventEmitter {
	private _ended = false;
	public get ended () {
		return this._ended;
	}

	private _cancelled = false;
	public get cancelled () {
		return this._cancelled;
	}

	private _willCancelAfterPage = false;
	public get willCancelAfterPage () {
		return this._willCancelAfterPage;
	}

	private mappers: ((value: any) => any)[] = [];

	public constructor () {
		super();
		this.on("end", () => { this._ended = true; });
		this.on("cancel", () => { this._ended = true; });
	}

	public on (event: "data", listener: (data: T) => any): this;
	public on (event: "not_found", listener: (data: NOT_FOUND) => any): this;
	public on (event: "end", listener: (...args: any[]) => any): this;
	public on (event: "cancel", listener: (...args: any[]) => any): this;
	public on (event: "error", listener: (err: Error) => any): this;
	public on (event: "done", listener: (...args: any[]) => any): this;
	public on (event: string, listener: (...args: any[]) => any) {
		super.on(event, listener);
		return this;
	}

	public emit (event: "data", data: T): boolean;
	public emit (event: "not_found", data: NOT_FOUND): boolean;
	public emit (event: "end"): boolean;
	public emit (event: "cancel"): boolean;
	public emit (event: "error", error: Error): boolean;
	public emit (event: "done"): boolean;
	public emit (event: string, ...data: any[]) {
		if (event === "data")
			return super.emit(event, this.mappers.reduce((current, mapper) => mapper(current), data[0]));
		return super.emit(event, ...data);
	}

	public emitAll (event: "data", ...data: T[]): void;
	public emitAll (event: "not_found", ...data: NOT_FOUND[]): void;
	public emitAll (event: string, ...data: any[]) {
		for (const item of data) {
			super.emit(event, event !== "data" ? item : this.mappers.reduce((current, mapper) => mapper(current), item));
			if (this._cancelled) break;
		}
	}

	public cancel () {
		this._cancelled = true;
		this.emit("cancel");
		return this;
	}

	public cancelAfterPage () {
		this._willCancelAfterPage = true;
		return this;
	}

	public async waitForAll () {
		return new Promise<MagicArray<T, NOT_FOUND>>((resolve, reject) => {
			const results: MagicArray<T, NOT_FOUND> = [] as any;
			results.not_found = [];
			this.on("data", result => { results.push(result); });
			this.on("not_found", notFound => { results.not_found.push(notFound); });
			this.on("done", () => resolve(results));
			this.on("error", reject);
		});
	}

	public [Symbol.asyncIterator] () {
		return this.generate("data");
	}

	public all () {
		return this.generate("data");
	}

	public notFound () {
		return this.generate("not_found");
	}

	public map<T2> (mapper: (value: T) => T2) {
		this.mappers.push(mapper);
		return this as any as MagicEmitter<T2, NOT_FOUND>;
	}

	private generate (event: "data"): AsyncGenerator<T, void, unknown>;
	private generate (event: "not_found"): AsyncGenerator<NOT_FOUND, void, unknown>;
	private async *generate (event: string): AsyncGenerator<T | NOT_FOUND, void, unknown> {
		// save the new data on each event
		const unyielded: any[] = [];
		this.on(event as never, data => unyielded.push(data));

		while (!this._ended) {
			// wait for the next event before yielding any new data
			await new Promise(resolve => this.once(event as never, resolve));

			let data: T | NOT_FOUND | undefined;
			while (data = unyielded.shift())
				yield data;
		}
	}
}
