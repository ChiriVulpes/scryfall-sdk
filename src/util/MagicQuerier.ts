import { ENDPOINT_API } from "../IScry";
import MagicEmitter from "./MagicEmitter";

let axios: typeof import("axios")["default"] | undefined;
if (typeof fetch === "undefined") {
	try {
		axios = require("axios").default;
	} catch {
		throw new Error("[scryfall-sdk] If the global `fetch` function is undefined (any node.js version older than v18), the axios peerDependency is required.");
	}
}

// the api requests 50-100 ms between calls, we go on the generous side and never wait less than 100 ms between calls
export const defaultRequestTimeout = 100;
export const minimumRequestTimeout = 50;


let lastQuery = 0;

function sleep (ms = 0) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export type TOrArrayOfT<T> = T | T[];

export interface Data<T, NOT_FOUND = never> {
	data: T[];
	not_found?: NOT_FOUND[];
}

export interface List<T, NOT_FOUND = never> extends Data<T, NOT_FOUND> {
	object: "list";
	has_more: boolean;
	next_page: string | null;
	total_cards: string | null;
	warnings: string[];
}

export interface ApiCatalog extends Data<string> { }

export interface SearchError extends Error {
	object: "error";
	code: string;
	status: number;
	details: string;
	warnings?: string[];
	attempts: number;
}

export interface RetryStrategy {
	attempts: number;
	timeout?: number;
	/**
	 * Whether even `not_found` and `bad_request` errors should be retried.
	 * @deprecated Don't use this, this is for unit tests
	 */
	forced?: boolean;
	// tslint:disable-next-line space-before-function-paren typescript autoformats this to remove the space
	canRetry?(error: SearchError): boolean;
}

export default class MagicQuerier {

	public static lastQuery = 0;
	public static retry: RetryStrategy = { attempts: 1 };
	public static agent?: string;
	public static timeout = defaultRequestTimeout;
	public static requestCount = 0;

	protected async query<T> (apiPath: TOrArrayOfT<string | number | undefined>, query?: { [key: string]: any }, post?: any): Promise<T> {
		if (Array.isArray(apiPath))
			apiPath = apiPath.join("/");

		let lastError: Error | undefined;
		let result: T | undefined;
		let retries: number;
		for (retries = 0; retries < MagicQuerier.retry.attempts; retries++) {
			({ result, lastError } = await this.tryQuery(`${apiPath}`, query, post));
			if (result || (!this.canRetry(lastError as SearchError) && !MagicQuerier.retry.forced)) break;
			await sleep(MagicQuerier.retry.timeout);
		}

		if (!result) {
			lastError ??= new Error("No data");
			(lastError as any).attempts = retries;
			throw lastError;
		}

		return result;
	}

	protected async queryPage<T> (emitter: MagicEmitter<T>, apiPath: string, query: any, page = query?.page as number | undefined ?? 1): Promise<void> {
		let error: SearchError | undefined;
		const results = await this.query<List<T>>(apiPath, { ...query, page })
			.catch(err => error = err);

		const data = results?.data ?? [];
		if (results?.object !== "list" && error === undefined) {
			emitter.emit("error", new Error("Result object is not a list"));
			return;
		}

		for (const card of data) {
			if (emitter.cancelled) break;
			emitter.emit("data", card);
		}

		if (results?.has_more && data.length !== 0) { // check if there was no data to workaround scryfall being buggy and returning true for invalid pages
			if (!emitter.cancelled) {
				if (emitter.willCancelAfterPage) emitter.cancel();
				else return this.queryPage(emitter, apiPath, query, page + 1)
					.catch(err => { emitter.emit("error", err); });
			}
		}

		if (!emitter.cancelled) emitter.emit("end");
		emitter.emit("done");
	}

	private async tryQuery (apiPath: string, query?: { [key: string]: any }, post?: any) {
		const now = Date.now();
		const timeSinceLastQuery = now - lastQuery;
		if (timeSinceLastQuery >= MagicQuerier.timeout) {
			lastQuery = now;

		} else {
			const timeUntilNextQuery = MagicQuerier.timeout - timeSinceLastQuery;
			lastQuery += timeUntilNextQuery;
			await sleep(timeUntilNextQuery);
		}

		MagicQuerier.requestCount++;

		if (axios)
			return this.queryAxios(apiPath, query, post);
		else
			return this.queryFetch(apiPath, query, post);
	}

	private async queryFetch (apiPath: string, query?: { [key: string]: any }, post?: any) {
		const cleanParams: Record<string, any> = {};
		for (const [key, value] of Object.entries(query ?? {}))
			if (value !== undefined)
				cleanParams[key] = value;
		const searchParams = query ? `?${new URLSearchParams(cleanParams).toString()}` : '';

		const url = `${ENDPOINT_API}/${apiPath}` + searchParams;

		let result: Response | undefined = await fetch(url, {
			body: JSON.stringify(post),
			headers: {
				'Content-Type': 'application/json',
				...!MagicQuerier.agent ? undefined : {
					'User-Agent': MagicQuerier.agent,
				},
				Accept: "*/*",
			},
			method: post ? "POST" : "GET",
		});

		let lastError: SearchError | undefined;
		if (result !== undefined && !result.ok) {
			const error = await result.json() as SearchError;
			lastError = new Error(error.details ?? error.code) as SearchError;
			Object.assign(lastError, error);
			result = undefined;
		}

		return { result: await result?.json(), lastError };
	}

	private async queryAxios (apiPath: string, query?: { [key: string]: any }, post?: any) {
		let lastError: SearchError | undefined;

		const result = await axios!.request({
			data: post,
			method: post ? "POST" : "GET",
			params: query,
			url: `${ENDPOINT_API}/${apiPath}`,
		}).catch(({ response }: { response: { data: any } }) => {
			const error = response.data as SearchError;
			lastError = new Error(error.details ?? error.code) as SearchError;
			Object.assign(lastError, response.data);
		}) || undefined;

		return { result: result?.data, lastError };
	}

	private canRetry (error: SearchError) {
		if (error.code === "not_found" || error.code === "bad_request") return false;
		return !MagicQuerier.retry.canRetry || MagicQuerier.retry.canRetry(error);
	}
}
