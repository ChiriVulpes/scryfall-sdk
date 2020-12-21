import Axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import MagicEmitter from "./MagicEmitter";

// the path to the api
const endpoint = "https://api.scryfall.com";
// the api requests 50-100 ms between calls, we go on the generous side and never wait less than 100 ms between calls
const rateLimit = 100;


let lastQuery = 0;

function sleep (ms = 0) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

type TOrArrayOfT<T> = T | T[];

export interface Data<T, NOT_FOUND = never> {
	data: T[];
	not_found?: NOT_FOUND[];
}

export interface List<T, NOT_FOUND = never> extends Data<T, NOT_FOUND> {
	has_more: boolean;
	next_page: string | null;
	total_cards: string | null;
	warnings: string[];
}

export interface ApiCatalog extends Data<string> { }

export interface SearchError {
	object: "error";
	code: string;
	status: number;
	details: string;
	warnings?: string[];
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
	public static lastError: SearchError | undefined;
	public static lastRetries = 0;
	public static retry: RetryStrategy = { attempts: 1 };

	protected async query<T> (apiPath: TOrArrayOfT<string | number | undefined>, query?: { [key: string]: any }, post?: any, requestOptions?: AxiosRequestConfig): Promise<T> {

		if (Array.isArray(apiPath)) {
			apiPath = apiPath.join("/");
		}

		let lastError: SearchError | undefined;
		let result: AxiosResponse | undefined;
		let retries: number;
		for (retries = 0; retries < MagicQuerier.retry.attempts; retries++) {
			({ result, lastError } = await this.tryQuery(`${apiPath}`, query, post, requestOptions));
			if (result || (!this.canRetry(lastError!) && !MagicQuerier.retry.forced)) break;
			await sleep(MagicQuerier.retry.timeout);
		}

		MagicQuerier.lastError = lastError;
		MagicQuerier.lastRetries = retries;

		return result ? result.data : ({ data: [], not_found: [] });
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

	private async tryQuery (apiPath: string, query?: { [key: string]: any }, post?: any, requestOptions?: AxiosRequestConfig) {
		const now = Date.now();
		const timeSinceLastQuery = now - lastQuery;
		if (timeSinceLastQuery >= rateLimit) {
			lastQuery = now;

		} else {
			const timeUntilNextQuery = rateLimit - timeSinceLastQuery;
			lastQuery += timeUntilNextQuery;
			await sleep(timeUntilNextQuery);
		}

		let lastError: SearchError | undefined;

		const result = await Axios.request({
			data: post,
			method: post ? "POST" : "GET",
			params: query,
			url: `${endpoint}/${apiPath}`,
			...requestOptions,
		}).catch(({ response }: { response: { data: any } }) => {
			lastError = response.data;
		}) || undefined;

		return { result, lastError };
	}

	private canRetry (error: SearchError) {
		if (error.code == "not_found" || error.code == "bad_request") return false;
		return !MagicQuerier.retry.canRetry || MagicQuerier.retry.canRetry(error);
	}
}
