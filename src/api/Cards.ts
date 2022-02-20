import { Color, RESOURCE_GENERIC_CARD_BACK, SYMBOL_COST, SYMBOL_PRINTS, SYMBOL_RULINGS, SYMBOL_SET, SYMBOL_TEXT } from "../IScry";
import MagicEmitter from "../util/MagicEmitter";
import MagicQuerier, { ApiCatalog, List } from "../util/MagicQuerier";
import { Ruling } from "./Rulings";
import { Set } from "./Sets";

enum UniqueStrategy {
	cards,
	art,
	prints,
}

enum Sort {
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

enum SortDirection {
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
	include_variations?: boolean;
	/**
	 * The page to start on. Defaults to `1`, for first page. A page is 175 cards.
	 */
	page?: number;
}

enum Rarity {
	common,
	uncommon,
	rare,
	mythic,
}

enum FrameEffect {
	legendary,
	miracle,
	nyxtouched,
	draft,
	devoid,
	tombstone,
	colorshifted,
	inverted,
	sunmoondfc,
	compasslanddfc,
	originpwdfc,
	mooneldrazidfc,
	moonreversemoondfc,
	showcase,
	extendedart,
}

enum Game {
	paper,
	arena,
	mtgo,
}

enum Legality {
	legal,
	not_legal,
	restricted,
	banned,
}

enum Border {
	black,
	borderless,
	gold,
	silver,
	white,
}

enum Layout {
	normal,
	split,
	flip,
	transform,
	modal_dfc,
	meld,
	leveler,
	saga,
	adventure,
	planar,
	scheme,
	vanguard,
	token,
	double_faced_token,
	emblem,
	augment,
	host,
	art_series,
	double_sided,
}

enum Format {
	standard,
	future,
	historic,
	pioneer,
	modern,
	legacy,
	pauper,
	vintage,
	penny,
	commander,
	brawl,
	duel,
	oldschool,
}

export type Legalities = {
	[key in keyof typeof Format]: keyof typeof Legality;
};

export interface ImageUris {
	small: string;
	normal: string;
	large: string;
	png: string;
	art_crop: string;
	border_crop: string;
}

export interface Prices {
    usd?: string | null;
    usd_foil?: string | null;
    usd_etched?: string | null;
    eur?: string | null;
    eur_foil?: string | null;
    tix?: string | null;
}

export interface PurchaseUris {
	tcgplayer?: string | null;
	cardmarket?: string | null;
	cardhoarder?: string | null;
	[key: string]: string | null | undefined;
}

export interface RelatedUris {
	gatherer?: string | null;
	tcgplayer_decks?: string | null;
	edhrec?: string | null;
	mtgtop8?: string | null;
	[key: string]: string | null | undefined;
}

enum RelatedCardComponent {
	token,
	meld_part,
	meld_result,
	combo_piece,
}

let Scry!: typeof import("../Scry");
const SYMBOL_CARD = Symbol("CARD");

export class RelatedCard {
	object: "related_card";

	id: string;
	component: keyof typeof RelatedCardComponent;
	name: string;
	type_line: string;
	uri: string;

	public static construct (card: RelatedCard) {
		Object.setPrototypeOf(card, RelatedCard.prototype);
		return card;
	}

	private [SYMBOL_CARD]?: Card;
	public async get () {
		return this[SYMBOL_CARD] ??= await Scry.Cards.byId(this.id);
	}
}

interface CardFaceMethods {
	getText (): string | null | undefined;
	getCost (): string | null | undefined;
	getImageURI (version: keyof ImageUris): string | null | undefined;
}

export interface CardFace extends CardFaceMethods {
	object: "card_face";

	artist?: string | null;
	color_indicator?: Color[] | null;
	colors?: Color[] | null;
	flavor_text?: string | null;
	illustration_id?: string | null;
	image_uris?: ImageUris | null;
	loyalty?: string | null;
	mana_cost?: string | null;
	name: string;
	oracle_text?: string | null;
	power?: string | null;
	printed_name?: string | null;
	printed_text?: string | null;
	printed_type_line?: string | null;
	toughness?: string | null;
	type_line: string;
	watermark?: string | null;
}

export interface Preview {
	previewed_at?: string | null;
	source_uri?: string | null;
	source?: string | null;
}

enum PromoType {
	tourney,
	prerelease,
	datestamped,
	planeswalkerdeck,
	buyabox,
	judgegift,
	event,
	convention,
	starterdeck,
	instore,
	setpromo,
	fnm,
	openhouse,
	league,
	draftweekend,
	gameday,
	release,
	intropack,
	giftbox,
	duels,
	wizardsplaynetwork,
	premiereshop,
	playerrewards,
	gateway,
	arenaleague
}

export interface CardIdentifier {
	id?: string;
	mtgo_id?: number;
	multiverse_id?: number;
	oracle_id?: string;
	illustration_id?: string;
	name?: string;
	set?: string;
	collector_number?: string;
}

export namespace CardIdentifier {
	export function byId (id: string): CardIdentifier {
		return { id };
	}

	export function byMtgoId (id: number): CardIdentifier {
		return { mtgo_id: id };
	}

	export function byMultiverseId (id: number): CardIdentifier {
		return { multiverse_id: id };
	}

	export function byOracleId (id: string): CardIdentifier {
		return { oracle_id: id };
	}

	export function byIllustrationId (id: string): CardIdentifier {
		return { illustration_id: id };
	}

	export function byName (name: string, set?: string): CardIdentifier {
		return { name, set };
	}

	export function bySet (set: string, collectorNumber: string | number): CardIdentifier {
		return { collector_number: `${collectorNumber}`, set };
	}
}

/**
 * A transformer that replaces symbols as seen in `mana_cost` and `oracle_text` in the format: `{G}`, `{8}`, `{U/W}`, etc. 
 * 
 * A transformer will be given a type, and a potential second type (in the case of `{T/T}`), 
 * and produce a string to replace the symbol in the text.
 */
export type SymbologyTransformer = (type: string, type2?: string) => string;
let symbologyTransformer: SymbologyTransformer | string | undefined;
const REGEX_SYMBOLOGY = /{([a-z]|\d+)(?:\/([a-z]))?}/gi;

function transform (self: Card,
	key: keyof { [KEY in keyof Card as Card[KEY] extends string | null | undefined ? KEY : never]: any },
	map: WeakMap<SymbologyTransformer | String, string>) {

	const text = self[key];
	if (!text || !symbologyTransformer)
		return text;

	const transformerKey = typeof symbologyTransformer === "string" ? new String(symbologyTransformer) : symbologyTransformer;
	const value = map.get(transformerKey);
	if (value)
		return value;

	const transformed = typeof symbologyTransformer === "string"
		? text.replace(REGEX_SYMBOLOGY, symbologyTransformer)
		: text.replace(REGEX_SYMBOLOGY, (_: string, type1: string, type2?: string) => (symbologyTransformer as SymbologyTransformer)(type1, type2 ?? ""));

	map.set(transformerKey, transformed);
	return transformed;
}

export class Card implements CardFaceMethods {
	object: "card";

	// core fields
	arena_id?: number | null;
	id: string;
	lang: string;
	mtgo_id?: number | null;
	mtgo_foil_id?: number | null;
	multiverse_ids?: number[] | null;
	tcgplayer_id?: number | null;
	tcgplayer_etched_id?: number | null;
	cardmarket_id?: number | null;
	oracle_id: string;
	prints_search_uri: string;
	rulings_uri: string;
	scryfall_uri: string;
	uri: string;

	// gameplay fields
	all_parts?: RelatedCard[] | null;
	card_faces: CardFace[];
	cmc: number;
	color_identity: Color[];
	color_indicator?: Color[] | null;
	colors?: Color[] | null;
	edhrec_rank?: number | null;
	foil: boolean;
	hand_modifier?: string | null;
	keywords: string[];
	layout: keyof typeof Layout;
	legalities: Legalities;
	life_modifier?: string | null;
	loyalty?: string | null;
	mana_cost?: string | null;
	name: string;
	nonfoil: boolean;
	oracle_text?: string | null;
	oversized: boolean;
	power?: string | null;
	produced_mana?: Color[] | null;
	reserved: boolean;
	toughness?: string | null;
	type_line: string;

	// print fields
	artist?: string | null;
	artist_ids?: string[] | null;
	booster: boolean;
	border_color: keyof typeof Border;
	card_back_id: string;
	collector_number: string;
	content_warning: boolean | null;
	digital: boolean;
	finishes: Array<"foil" | "nonfoil" | "etched" | "glossy">;
	flavor_name?: string | null;
	flavor_text?: string | null;
	frame_effects?: (keyof typeof FrameEffect)[] | null;
	frame: "1993" | "1997" | "2003" | "2015" | "Future";
	full_art: boolean;
	games: (keyof typeof Game)[];
	highres_image: boolean;
	illustration_id?: string | null;
	image_status: "missing" | "placeholder" | "lowres" | "highres_scan";
	image_uris?: ImageUris | null;
	prices: Prices;
	printed_name?: string | null;
	printed_text?: string | null;
	printed_type_line?: string | null;
	promo: boolean;
	promo_types?: (keyof typeof PromoType)[] | null;
	purchase_uris: PurchaseUris;
	rarity: keyof typeof Rarity;
	related_uris: RelatedUris;
	released_at: string;
	reprint: boolean;
	scryfall_set_uri: string;
	set_name: string;
	set_search_uri: string;
	set_type: Set["set_type"];
	set_uri: string;
	set: string;
	story_spotlight: boolean;
	textless: boolean;
	variation: boolean;
	variation_of?: string | null;
	watermark?: string | null;
	preview?: Preview | null;

	public static construct (card: Card) {
		Object.setPrototypeOf(card, Card.prototype);

		if (!card.card_faces)
			card.card_faces = [{ object: "card_face" } as CardFace];

		for (const face of card.card_faces)
			Object.setPrototypeOf(face, card);

		card.all_parts?.forEach(RelatedCard.construct);

		return card;
	}

	private [SYMBOL_SET]?: Set;
	public async getSet () {
		return this[SYMBOL_SET] ??= await Scry.Sets.byId(this.set);
	}

	private [SYMBOL_RULINGS]?: Ruling[];
	public async getRulings () {
		return this[SYMBOL_RULINGS] ??= await Scry.Rulings.byId(this.id);
	}

	private [SYMBOL_PRINTS]?: Card[];
	public async getPrints () {
		if (!this[SYMBOL_PRINTS]) {
			this[SYMBOL_PRINTS] = await Scry.Cards.search(`oracleid:${this.oracle_id}`, { unique: "prints" })
				.waitForAll();

			for (const card of this[SYMBOL_PRINTS]!) {
				card[SYMBOL_SET] ??= this[SYMBOL_SET];
				card[SYMBOL_RULINGS] ??= this[SYMBOL_RULINGS];
				card[SYMBOL_PRINTS] ??= this[SYMBOL_PRINTS];
			}
		}

		return this[SYMBOL_PRINTS]!;
	}

	public getTokens () {
		return !this.all_parts ? []
			: this.all_parts.filter(part => part.component === "token");
	}

	/**
	 * @returns `true` if this card is `legal` or `restricted` in the given format.
	 */
	public isLegal (format: keyof typeof Format) {
		return this.legalities[format] === "legal" || this.legalities[format] === "restricted";
	}

	/**
	 * @returns `true` if this card is `not_legal` or `banned` in the given format.
	 */
	public isIllegal (format: keyof typeof Format) {
		return this.legalities[format] === "not_legal" || this.legalities[format] === "banned";
	}

	private [SYMBOL_TEXT]: WeakMap<SymbologyTransformer, string>;
	/**
	 * @returns The `oracle_text` of this card, with symbols transformed by the transformer as set by @see {@link Cards.setSymbologyTransformer}
	 */
	public getText () {
		if (!this.hasOwnProperty(SYMBOL_TEXT))
			this[SYMBOL_TEXT] = new WeakMap;

		return transform(this, "oracle_text", this[SYMBOL_TEXT]);
	}

	private [SYMBOL_COST]: WeakMap<SymbologyTransformer, string>;
	/**
	 * @returns The `mana_cost` of this card, with symbols transformed by the transformer as set by @see {@link Cards.setSymbologyTransformer}
	 */
	public getCost () {
		if (!this.hasOwnProperty(SYMBOL_COST))
			this[SYMBOL_COST] = new WeakMap;

		return transform(this, "mana_cost", this[SYMBOL_COST]);
	}

	public getImageURI (version: keyof ImageUris) {
		return this.image_uris?.[version]
			?? this.card_faces[0].image_uris?.[version];
	}

	public getFrontImageURI (version: keyof ImageUris) {
		return this.card_faces[0].image_uris?.[version]
			?? this.image_uris?.[version];
	}

	public getBackImageURI (version: keyof ImageUris) {
		return this.layout !== "transform" && this.layout !== "double_faced_token"
			? RESOURCE_GENERIC_CARD_BACK
			: this.card_faces[1].image_uris?.[version] ?? RESOURCE_GENERIC_CARD_BACK;
	}
}

class Cards extends MagicQuerier {

	protected set Scry (scry: typeof import("../Scry")) {
		Scry = scry;
	}

	public setSymbologyTransformer (transformer?: string | SymbologyTransformer) {
		symbologyTransformer = transformer;
		return this;
	}

	public async byName (name: string, fuzzy?: boolean): Promise<Card>;
	public async byName (name: string, set?: string, fuzzy?: boolean): Promise<Card>;
	public async byName (name: string, set?: string | boolean, fuzzy = false) {
		if (typeof set === "boolean") {
			fuzzy = set;
			set = undefined;
		}

		return this.query<Card>("cards/named", {
			[fuzzy ? "fuzzy" : "exact"]: name,
			set,
		})
			.then(Card.construct);
	}

	public async byId (id: string) {
		return this.query<Card>(["cards", id])
			.then(Card.construct);
	}

	public async bySet (setCode: string | Set, collectorNumber: number, lang?: string) {
		const path = ["cards", typeof setCode === "string" ? setCode : setCode.code, collectorNumber];
		if (lang) path.push(lang);
		return this.query<Card>(path)
			.then(Card.construct);
	}

	public async byMultiverseId (id: number) {
		return this.query<Card>(["cards/multiverse", id])
			.then(Card.construct);
	}

	public async byMtgoId (id: number) {
		return this.query<Card>(["cards/mtgo", id])
			.then(Card.construct);
	}

	public async byArenaId (id: number) {
		return this.query<Card>(["cards/arena", id])
			.then(Card.construct);
	}

	public async byTcgPlayerId (id: number) {
		return this.query<Card>(["cards/tcgplayer", id])
			.then(Card.construct);
	}

	public async random () {
		return this.query<Card>("cards/random")
			.then(Card.construct);
	}

	/**
	 * Returns a MagicEmitter of every card in the Scryfall database that matches the given query.
	 */
	public search (query: string, options?: SearchOptions | number) {
		const emitter = new MagicEmitter<Card>()
			.map(Card.construct);

		this.queryPage(emitter, "cards/search", { q: query, ...typeof options === "number" ? { page: options } : options })
			.catch(err => emitter.emit("error", err));

		return emitter;
	}

	public async autoCompleteName (name: string) {
		return (await this.query<ApiCatalog>("cards/autocomplete", { q: name })).data;
	}

	public collection (...identifiers: CardIdentifier[]) {
		const emitter = new MagicEmitter<Card, CardIdentifier>()
			.map(Card.construct);

		void this.processCollection(emitter, identifiers);

		return emitter;
	}

	private async processCollection (emitter: MagicEmitter<Card, CardIdentifier>, identifiers: CardIdentifier[]) {
		for (let i = 0; i < identifiers.length; i += 75) {
			if (emitter.cancelled) break;

			// the api only supports a max collection size of 75, so we take the list of identifiers (any length)
			// and split it into 75 card-max requests
			const collectionSection = { identifiers: identifiers.slice(i, i + 75) };

			const { data, not_found } = await this.query<List<Card, CardIdentifier>>("cards/collection", undefined, collectionSection);

			emitter.emitAll("not_found", ...not_found ?? []);

			if (!emitter.cancelled)
				emitter.emitAll("data", ...data);

			if (emitter.willCancelAfterPage)
				emitter.cancel();
		}

		if (!emitter.cancelled)
			emitter.emit("end");

		emitter.emit("done");
	}
}

export default new Cards;
