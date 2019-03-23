import { EventEmitter } from "events";

export default class MagicEmitter<T> extends EventEmitter {
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

	public constructor () {
		super();
		this.on("end", () => {
			this._ended = true;
		});
		this.on("cancel", () => {
			this._ended = true;
		});
	}

	public on (event: "data", listener: (data: T) => any): this;
	public on (event: "end", listener: () => any): this;
	public on (event: "cancel", listener: () => any): this;
	public on (event: "error", listener: (err: Error) => any): this;
	public on (event: "done", listener: () => any): this;
	public on (event: string, listener: (...args: any[]) => any) {
		super.on(event, listener);
		return this;
	}

	public emit (event: "data", data: T): boolean;
	public emit (event: "end"): boolean;
	public emit (event: "cancel"): boolean;
	public emit (event: "error", error: Error): boolean;
	public emit (event: "done"): boolean;
	public emit (event: string, ...data: any[]) {
		return super.emit(event, ...data);
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
		return new Promise<T[]>((resolve, reject) => {
			const results: T[] = [];
			this.on("data", result => {
				results.push(result);
			});
			this.on("end", () => resolve(results));
			this.on("error", reject);
		});
	}

	public async *[Symbol.asyncIterator] () {
		const unyielded: T[] = [];
		this.on("data", data => unyielded.push(data));
		while (!this._ended) {
			await new Promise(resolve => this.on("data", resolve));
			let data: T | undefined;
			while (data = unyielded.shift()) {
				yield data;
			}
		}
	}

	public all () {
		return this[Symbol.asyncIterator]();
	}
}
