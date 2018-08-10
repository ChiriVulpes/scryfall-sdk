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
	name: string;
	printed_name: string;
	type_line: string;
	printed_type_line: string;
	oracle_text?: string | null;
	printed_text: string;
	mana_cost: string | null;
	colors: (keyof typeof Color)[];
	color_indicator?: (keyof typeof Color)[] | null;
	power?: string | null;
	toughness?: string | null;
	loyalty?: string | null;
	flavor_text?: string | null;
	illustration_id?: string | null;
	image_uris?: ImageUris | null;
}

export enum Format {
	standard,
	future,
	frontier,
	modern,
	legacy,
	pauper,
	vintage,
	penny,
	commander,
	"1v1",
	duel,
	brawl,
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

// enums can't have all numeric names, so we build our own enum
// tslint:disable-next-line variable-name
export const Frame: { [key in "1993" | "2003" | "2015" | "Future"]: number } = {
	1993: 0,
	2003: 1,
	2015: 2,
	Future: 3,

	0: "1993",
	1: "2003",
	2: "2015",
	3: "Future",
} as any;

export enum Border {
	black,
	borderless,
	gold,
	silver,
	white,
}

export interface ImageUris {
	small: string;
	normal: string;
	large: string;
	png: string;
	art_crop: string;
	border_crop: string;
}

export interface Card {
	// core fields
	id: string;
	oracle_id: string;
	arena_id?: number;
	multiverse_ids?: number[] | null;
	mtgo_id?: number | null;
	mtgo_foil_id?: number | null;
	uri: string;
	scryfall_uri: string;
	prints_search_uri: string;
	rulings_uri: string;

	// gameplay fields
	name: string;
	layout: keyof typeof Layout;
	cmc: number;
	type_line?: string | null;
	oracle_text?: string | null;
	mana_cost?: string;
	power?: string | null;
	toughness?: string | null;
	loyalty?: string | null;
	life_modifier?: string | null;
	hand_modifier?: string | null;
	colors: (keyof typeof Color)[];
	color_indicator?: (keyof typeof Color)[] | null;
	color_identity: (keyof typeof Color)[];
	all_parts?: CardPart[] | null;
	card_faces?: CardFace[] | null;
	legalities: Legalities;
	reserved: boolean;
	foil: boolean;
	nonfoil: boolean;
	oversized: boolean;
	edhrec_rank?: number | null;

	// print fields
	set: string;
	set_name: string;
	collector_number: string;
	set_search_uri: string;
	scryfall_set_uri: string;
	image_uris?: ImageUris | null;
	highres_image: boolean;
	printed_name: string;
	printed_type_line: string;
	printed_text: string;
	reprint: boolean;
	digital: boolean;
	rarity: keyof typeof Rarity;
	flavor_text?: string | null;
	artist?: string | null;
	illustration_id?: string | null;
	frame: keyof typeof Frame;
	full_art: boolean;
	watermark?: string | null;
	border_color: keyof typeof Border;
	story_spotlight_number?: number | null;
	story_spotlight_uri?: string | null;
	timeshifted: boolean;
	colorshifted: boolean;
	futureshifted: boolean;

	// not described on scryfall api but present in results
	usd: number | null;
	eur: number | null;
	tix: number | null;
	related_uris: RelatedUris;
	purchase_uris: PurchaseUris;
}

export interface RelatedUris {
	gatherer?: string;
	tcgplayer_decks?: string;
	edhrec?: string;
	mtgtop8?: string;
	[key: string]: string;
}

export interface PurchaseUris {
	amazon?: string;
	ebay?: string;
	tcgplayer?: string;
	magiccardmarket?: string;
	cardhoarder?: string;
	card_kingdom?: string;
	mtgo_traders?: string;
	coolstuffinc?: string;
	[key: string]: string;
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

export interface ManaCost {
	cost: string;
	cmc: number;
	colors: (keyof typeof Color)[];
	colorless: boolean;
	monocolored: boolean;
	multicolored: boolean;
}

export interface HomepageLink {
	id: number;
	created_at: string;
	updated_at: string;
	priority: number;
	text: string;
	uri: string;
	badge: string;
}

export interface Ruling {
	source: string;
	published_at: string;
	comment: string;
}

export enum UniqueStrategy {
	cards,
	art,
	prints,
}

export enum Sort {
	name,
	set,
	released,
	rarity,
	color,
	usd,
	tix,
	eur,
	cmc,
	power,
	toughness,
	edhrec,
	artist,
}

export enum SortDirection {
	auto,
	asc,
	desc,
}

export interface SearchOptions {
	unique?: keyof typeof UniqueStrategy;
	order?: keyof typeof Sort;
	dir?: keyof typeof SortDirection;
	include_extras?: boolean;
	include_multilingual?: boolean;
	page?: number;
}

export interface SearchError {
	code: string;
	status: 400;
	warnings: string[];
	details: string;
}
