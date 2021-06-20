export const ENDPOINT_API = "https://api.scryfall.com";
export const ENDPOINT_FILE_1 = "https://c1.scryfall.com/file";
export const ENDPOINT_FILE_2 = "https://c2.scryfall.com/file";
export const ENDPOINT_FILE_3 = "https://c3.scryfall.com/file";
export const RESOURCE_GENERIC_CARD_BACK = `${ENDPOINT_FILE_2}/scryfall-errors/missing.jpg` as const;

export const SYMBOL_TEXT = Symbol("TEXT");
export const SYMBOL_COST = Symbol("COST");
export const SYMBOL_SET = Symbol("SET");
export const SYMBOL_RULINGS = Symbol("RULINGS");
export const SYMBOL_PRINTS = Symbol("PRINTS");
export const SYMBOL_CARDS = Symbol("CARDS");

enum Colors {
	W,
	B,
	R,
	U,
	G,
}

export type Color = keyof typeof Colors;
