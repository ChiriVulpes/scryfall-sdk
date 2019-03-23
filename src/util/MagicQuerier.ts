import Axios from "axios";
import MagicEmitter from "./MagicEmitter";

// the path to the api
const endpoint = "https://api.scryfall.com";
// the api requests 50-100 ms between calls, we go on the generous side and never wait less than 100 ms between calls
const rateLimit = 100;


let lastQuery = 0;

function sleep (ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

type TOrArrayOfT<T> = T | T[];

export interface List<T> {
	data: T[];
	has_more: boolean;
	next_page: string | null;
	total_cards: string | null;
	warnings: string[];
}

export interface ApiCatalog {
	data: string[];
}

export interface SearchError {
	code: string;
	status: 400;
	warnings: string[];
	details: string;
}

export default class MagicQuerier {
	public static lastQuery = 0;
	public static lastError: SearchError | undefined;

	protected async query<T> (
		apiPath: TOrArrayOfT<string | number>,
		query?: { [key: string]: any },
		post?: any,
	): Promise<T> {

		const now = Date.now();
		const timeSinceLastQuery = now - lastQuery;
		if (timeSinceLastQuery >= rateLimit) {
			lastQuery = now;

		} else {
			const timeUntilNextQuery = rateLimit - timeSinceLastQuery;
			lastQuery += timeUntilNextQuery;
			await sleep(timeUntilNextQuery);
		}

		if (Array.isArray(apiPath)) {
			apiPath = apiPath.join("/");
		}

		MagicQuerier.lastError = undefined;

		const result = await Axios.request({
			data: post,
			method: post ? "POST" : "GET",
			params: query,
			url: `${endpoint}/${apiPath}`,
		}).catch(({ response }: { response: { data: any } }) => {
			MagicQuerier.lastError = response.data;
		});

		return result ? result.data : ({ data: [] } as any);
	}

	protected async queryPage<T> (emitter: MagicEmitter<T>, apiPath: string, query: any, page = 1): Promise<void> {
		const results = await this.query<List<T>>(apiPath, { ...query, page });
		for (const card of results.data) {
			if (emitter.cancelled) break;
			emitter.emit("data", card);
		}

		if (results.has_more) {
			if (!emitter.cancelled) {
				if (emitter.willCancelAfterPage) emitter.cancel();
				else return this.queryPage(emitter, apiPath, query, page + 1)
					.catch(err => { emitter.emit("error", err); });
			}
		}

		if (!emitter.cancelled) emitter.emit("end");
		emitter.emit("done");
	}
}
