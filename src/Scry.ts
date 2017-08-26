import { EventEmitter } from "events";
import request = require("request-promise");

export * from "./IScry";
import { Card, Set } from "./IScry";

const endpoint = "https://api.scryfall.com";


function query<T>(...queryFor: string[]) {
	return request({
		uri: `${endpoint}/${queryFor.join("/")}`,
		json: true,
	}) as any as Promise<T>;
}

export class MagicEmitter<T> extends EventEmitter {
	private _cancelled = false;
	get cancelled () {
		return this._cancelled;
	}

	on (event: "data", listener: (data: T) => any): this;
	on (event: "end", listener: () => any): this;
	on (event: "cancel", listener: () => any): this;
	on (event: "error", listener: (err: Error) => any): this;
	on (event: string, listener: (...args: any[]) => any) {
		super.on(event, listener);
		return this;
	}

	emit (event: "data", data: T): boolean;
	emit (event: "end"): boolean;
	emit (event: "cancel"): boolean;
	emit (event: "error", error: Error): boolean;
	emit (event: string, ...data: any[]) {
		return super.emit(event, ...data);
	}

	cancel () {
		this._cancelled = true;
	}
}

export module Cards {
	export async function byName (name: string, fuzzy = false) {
		return query<Card>()
	}
}
