import Cards from "./api/Cards";
import Sets from "./api/Sets";
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
 * Returns the last error thrown while querying.
 */
export function error () {
	return MagicQuerier.lastError;
}

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
