import MagicQuerier, { SearchError } from "./util/MagicQuerier";

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
