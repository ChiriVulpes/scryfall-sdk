import Cards from "./api/Cards";
import Sets from "./api/Sets";
import { IScry } from "./IScry";
import Cached from "./util/Cached";
import MagicQuerier, { minimumRequestTimeout, SearchError } from "./util/MagicQuerier";

export { default as BulkData } from "./api/BulkData";
export * from "./api/Cards";
export { default as Cards } from "./api/Cards";
export * from "./api/Catalog";
export { default as Catalog } from "./api/Catalog";
export * from "./api/Misc";
export { default as Misc } from "./api/Misc";
export * from "./api/Rulings";
export { default as Rulings } from "./api/Rulings";
export * from "./api/Sets";
export { default as Sets } from "./api/Sets";
export * from "./api/Symbology";
export { default as Symbology } from "./api/Symbology";
export * from "./IScry";


Cards["Scry"] = exports;
Sets["Scry"] = exports;


/**
 * Sets the API calls to retry if they fail, for any reason.
 * @param attempts The number of attempts that can be made (includes the initial call).
 * @param timeout The time that the query should wait before attempting the request again.
 */
export function setRetry (attempts: number, timeout?: number, canRetry?: (error: SearchError) => boolean) {
	MagicQuerier.retry = { attempts, timeout, canRetry };
}

/**
 * Sets the API calls to be spaced by at least this amount of time. Respects the minimum requested timeout provided by Scryfall.
 */
export function setTimeout (timeout: number) {
	MagicQuerier.timeout = Math.max(minimumRequestTimeout, timeout);
}

/**
 * Clears the cache
 */
export function clearCache () {
	Cached.clear();
}

/**
 * Sets the duration that most API calls will be cached. By default, the cache duration is 1 day. 
 * To disable caching entirely, set the timeout to `0`
 */
export function setCacheDuration (ms: number) {
	Cached.setDuration(ms);
}

/**
 * Sets the maximum number of query results that can be cached at one time. By default, the maximum is 500 objects. 
 * To disable caching entirely, set the amount to `0`
 */
export function setCacheLimit (amount: number) {
	Cached.setLimit(amount);
}

export function setFuzzySearch (search?: typeof IScry["fuzzySearch"]) {
	IScry.fuzzySearch = search;
}
