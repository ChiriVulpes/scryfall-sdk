import { EventEmitter } from "events";
import request = require("request-promise");

export * from "./IScry";
import { Card, CardSymbol, HomepageLink, List, ManaCost, Set } from "./IScry";


// the path to the api
const endpoint = "https://api.scryfall.com";
// the api requests 50-100 ms between calls, we go on the generous side and never wait less than 100 ms between calls
const rateLimit = 100;



let lastQuery = 0;

function sleep (ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function queryApi<T>(apiPath: string | number | (string | number)[], query?: { [key: string]: any }) {
	if (Array.isArray(apiPath)) apiPath = apiPath.join("/");

	const now = Date.now();
	const timeSinceLastQuery = now - lastQuery;
	if (timeSinceLastQuery >= rateLimit) {
		lastQuery = now;
	} else {
		const timeUntilNextQuery = rateLimit - timeSinceLastQuery;
		lastQuery += timeUntilNextQuery;
		await sleep(timeUntilNextQuery);
	}

	return request({
		uri: `${endpoint}/${apiPath}`,
		json: true,
		qs: query,
	}) as any as Promise<T>;
}

export class MagicEmitter<T> extends EventEmitter {
	private _cancelled = false;
	get cancelled () {
		return this._cancelled;
	}

	public on (event: "data", listener: (data: T) => any): this;
	public on (event: "end", listener: () => any): this;
	public on (event: "cancel", listener: () => any): this;
	public on (event: "error", listener: (err: Error) => any): this;
	public on (event: string, listener: (...args: any[]) => any) {
		super.on(event, listener);
		return this;
	}

	public emit (event: "data", data: T): boolean;
	public emit (event: "end"): boolean;
	public emit (event: "cancel"): boolean;
	public emit (event: "error", error: Error): boolean;
	public emit (event: string, ...data: any[]) {
		return super.emit(event, ...data);
	}

	public cancel () {
		this._cancelled = true;
		this.emit("cancel");
	}

	public async waitForAll () {
		return new Promise<T[]>((resolve, reject) => {
			const results: T[] = [];
			this.on("data", (result) => {
				results.push(result);
			});
			this.on("end", () => resolve(results));
		});
	}
}

export module Cards {
	export async function byName (name: string, fuzzy = false) {
		return queryApi<Card>("cards/named", {
			[fuzzy ? "fuzzy" : "exact"]: name,
		});
	}

	export async function byId (id: string) {
		return queryApi<Card>(["cards", id]);
	}

	export async function bySet (setCode: string, collectorNumber: string) {
		return queryApi<Card>(["cards", setCode, collectorNumber]);
	}

	export async function byMultiverseId (id: number) {
		return queryApi<Card>(["cards/multiverse", id]);
	}

	export async function byMtgoId (id: number) {
		return queryApi<Card>(["cards/mtgo", id]);
	}

	export async function random () {
		return queryApi<Card>("cards/random");
	}

	async function getPage<T>(emitter: MagicEmitter<T>, apiPath: string, query: any, page = 1) {
		const results = await queryApi<List<T>>(apiPath, { ...query, page });
		for (const card of results.data) {
			emitter.emit("data", card);
		}
		if (results.has_more) {
			if (!emitter.cancelled) getPage(emitter, apiPath, query, page + 1).catch(err => emitter.emit("error", err));
		} else {
			emitter.emit("end");
		}
	}

	export function search (search: string) {
		const emitter = new MagicEmitter<Card>();

		getPage(emitter, "cards/search", { q: search }).catch(err => emitter.emit("error", err));

		return emitter;
	}

	export function all () {
		const emitter = new MagicEmitter<Card>();

		getPage(emitter, "cards", {}).catch(err => emitter.emit("error", err));

		return emitter;
	}

	export async function autoCompleteName (name: string) {
		return (await queryApi<ApiCatalog>("cards/autocomplete", { q: name })).data;
	}
}

export module Sets {
	export async function all () {
		return (await queryApi<List<Set>>("sets")).data;
	}

	export async function byCode (code: string) {
		return queryApi<Set>(["sets", code]);
	}
}

export module Symbology {
	export async function all () {
		return (await queryApi<List<CardSymbol>>("symbology")).data;
	}

	export async function parseMana (shorthand: string) {
		return queryApi<ManaCost>("symbology/parse-mana", { cost: shorthand });
	}
}


interface ApiCatalog {
	data: string[];
}
export module Catalog {
	export async function cardNames () {
		return (await queryApi<ApiCatalog>("catalog/card-names")).data;
	}

	export async function creatureTypes () {
		return (await queryApi<ApiCatalog>("catalog/creature-types")).data;
	}

	export async function landTypes () {
		return (await queryApi<ApiCatalog>("catalog/land-types")).data;
	}

	export async function planeswalkerTypes () {
		return (await queryApi<ApiCatalog>("catalog/planeswalker-types")).data;
	}

	export async function wordBank () {
		return (await queryApi<ApiCatalog>("catalog/word-bank")).data;
	}

	export async function powers () {
		return (await queryApi<ApiCatalog>("catalog/powers")).data;
	}

	export async function toughnesses () {
		return (await queryApi<ApiCatalog>("catalog/toughnesses")).data;
	}

	export async function loyalties () {
		return (await queryApi<ApiCatalog>("catalog/loyalties")).data;
	}
}

export async function homepageLinks () {
	return (await queryApi<List<HomepageLink>>("homepage-links")).data;
}
