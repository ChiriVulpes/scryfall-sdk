import MagicQuerier from "./util/MagicQuerier";

export * from "./IScry";
export * from "./api/Cards";
export * from "./api/Catalog";
export * from "./api/Misc";
export * from "./api/Rulings";
export * from "./api/Sets";
export * from "./api/Symbology";

export { default as Cards } from "./api/Cards";
export { default as Catalog } from "./api/Catalog";
export { default as Misc } from "./api/Misc";
export { default as Rulings } from "./api/Rulings";
export { default as Sets } from "./api/Sets";
export { default as Symbology } from "./api/Symbology";

/**
 * Returns the last error thrown while querying.
 */
export function error () {
	return MagicQuerier.lastError;
}
