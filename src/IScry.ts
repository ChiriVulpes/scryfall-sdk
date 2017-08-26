export interface List<T> {
	data: T[];
	has_more: boolean;
	next_page: string | null;
	total_cards: string | null;
	warnings: string[];
}

export enum Color {
	W,
	B,
	R,
	U,
	G,
}

export enum Layout {
	normal,
	split,
	flip,
	transform,
	meld,
	leveler,
	plane,
	phenomenon,
	scheme,
	vanguard,
	emblem,
}

export interface CardFace {
	object: "card_face";
	name: string;
	mana_cost: string | null;
	type_line: string;
	oracle_text: string | null;
	power: string | null;
	toughness: string | null;
}

export enum Format {
	standard,
	modern,
	legacy,
	vintage,
	commander,
	pauper,
	frontier,
	penny,
	duel,
	"1v1",
	future,
}

export enum Legality {
	legal,
	not_legal,
	restricted,
	banned,
}

export type Legalities = {
	[key in keyof typeof Format]: keyof typeof Legality;
};

export interface CardPart {
	id: string;
	name: string;
	uri: string;
}

export enum Rarity {
	common,
	uncommon,
	rare,
	mythic,
}

// enums can't have all numeric names, so we build our own enum,
export const Frame: {[key in "1993" | "2003" | "2015" | "future"]: number } = {
	"1993": 0,
	"2003": 1,
	"2015": 2,
	future: 3,

	0: "1993",
	1: "2003",
	2: "2015",
	3: "future",
} as any;

export enum Border {
	black,
	white,
	silver,
	gold,
}

export interface ImageUris {
	small: string;
	normal: string;
	large: string;
	png: string;
}

export interface Card {
	name: string;
	mana_cost: string | null;
	cmc: number;
	type_line: string | null;
	oracle_text: string | null;
	power: string | null;
	toughness: string | null;
	loyalty: string | null;
	hand_modifier: string;
	life_modifier: string;
	colors: (keyof typeof Color)[];
	color_identity: (keyof typeof Color)[];
	layout: keyof typeof Layout;
	card_faces?: CardFace[];
	legalities: Legalities;
	reserved: boolean;

	// print fields,
	id: string;
	multiverse_id: number | null;
	mtgo_id: number | null;
	set: string;
	set_name: string;
	collector_number: string | null;
	reprint: boolean;
	all_parts: CardPart[];
	rarity: keyof typeof Rarity;
	digital: boolean;
	watermark?: string;
	flavor_text?: string;
	artist: string;
	frame: keyof typeof Frame;
	border: keyof typeof Border;
	timeshifted: boolean;
	colorshifted: boolean;
	futureshifted: boolean;
	usd: number | null;
	eur: number | null;
	tix: number | null;
	scryfall_uri: string;
	image_uri: string | null;
	image_uris: ImageUris;
	related_uris: string[];
	purchase_uris: string[];
}

export enum SetType {
	core,
	expansion,
	masters,
	masterpiece,
	from_the_vault,
	premium_deck,
	duel_deck,
	commander,
	planechase,
	conspiracy,
	archenemy,
	vanguard,
	funny,
	starter,
	box,
	promo,
	token,
}

export interface Set {
	code: string;
	name: string;
	released_at: string;
	block_code?: string;
	block?: string;
	parent_set_code?: string;
	card_count: number;
	digital: boolean;
	foil: boolean;
	icon_svg_uri: string;
	search_uri: string;
	set_type: keyof typeof SetType;
}

export interface Catalog {
	data: string[];
}

export interface CardSymbol {
	symbol: string;
	loose_variant: string;
	english: string;
	transposable: string;
	represents_mana: boolean;
	converted_mana_cost: number;
	colors: (keyof typeof Color)[];
	appears_in_mana_costs: boolean;
	funny: boolean;
}

export interface ScryError {
	status: number;
	code: string;
	type: string | null;
	details: string;
	warnings: string[] | null;
}