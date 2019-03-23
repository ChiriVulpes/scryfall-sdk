import { Color } from "../IScry";
import MagicEmitter from "../util/MagicEmitter";
import MagicQuerier, { ApiCatalog, List } from "../util/MagicQuerier";

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
	sunmoondfc,
	compasslanddfc,
	originpwdfc,
	mooneldrazidfc,
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
	meld,
	leveler,
	saga,
	planar,
	scheme,
	vanguard,
	token,
	double_faced_token,
	emblem,
	augment,
	host,
}

enum Format {
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
	usd: string | null;
	usd_foil: string | null;
	eur: string | null;
	tix: string | null;
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
	[key: string]: string | undefined;
}

export interface RelatedUris {
	gatherer?: string;
	tcgplayer_decks?: string;
	edhrec?: string;
	mtgtop8?: string;
	[key: string]: string | undefined;
}

export interface CardPart {
	id: string;
	name: string;
	uri: string;
}

export interface CardFace {
	object: "card_face";

	artist?: string | null;
	color_indicator?: Color[] | null;
	colors: Color[];
	flavor_text?: string | null;
	illustration_id?: string | null;
	image_uris?: ImageUris | null;
	loyalty?: string | null;
	mana_cost: string;
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

export interface Card {
	object: "card";

	// core fields
	arena_id?: number;
	id: string;
	lang: string;
	mtgo_id?: number | null;
	mtgo_foil_id?: number | null;
	multiverse_ids?: number[] | null;
	tcgplayer_id?: number | null;
	oracle_id: string;
	prints_search_uri: string;
	rulings_uri: string;
	scryfall_uri: string;
	uri: string;

	// gameplay fields
	all_parts?: CardPart[] | null;
	card_faces?: CardFace[] | null;
	cmc: number;
	colors: Color[];
	color_identity: Color[];
	color_indicator?: Color[] | null;
	edhrec_rank?: number | null;
	foil: boolean;
	hand_modifier?: string | null;
	layout: keyof typeof Layout;
	legalities: Legalities;
	life_modifier?: string | null;
	loyalty?: string | null;
	mana_cost?: string;
	name: string;
	nonfoil: boolean;
	oracle_text?: string | null;
	oversized: boolean;
	power?: string | null;
	reserved: boolean;
	toughness?: string | null;
	type_line?: string | null;

	// print fields
	artist?: string | null;
	border_color: keyof typeof Border;
	collector_number: string;
	digital: boolean;
	flavor_text?: string | null;
	frame_effect: keyof typeof FrameEffect;
	frame: 1993 | 1997 | 2003 | 2015 | "Future";
	full_art: boolean;
	games: (keyof typeof Game)[];
	highres_image: boolean;
	illustration_id?: string | null;
	image_uris?: ImageUris | null;
	prices: Prices;
	printed_name?: string | null;
	printed_text?: string | null;
	printed_type_line?: string | null;
	promo: boolean;
	purchase_uris: PurchaseUris;
	rarity: keyof typeof Rarity;
	related_uris: RelatedUris;
	released_at: string;
	reprint: boolean;
	scryfall_set_uri: string;
	set_name: string;
	set_search_uri: string;
	set_uri: string;
	set: string;
	story_spotlight: boolean;
	watermark?: string | null;
}

export interface CardIdentifier {
	id?: string;
	mtgo_id?: number;
	multiverse_id?: number;
	name?: string;
	set?: string;
	collector_number?: string;
}

export module CardIdentifier {
	export function byId (id: string): CardIdentifier {
		return { id };
	}

	export function byMtgoId (id: number): CardIdentifier {
		return { mtgo_id: id };
	}

	export function byMultiverseId (id: number): CardIdentifier {
		return { multiverse_id: id };
	}

	export function byName (name: string, set?: string): CardIdentifier {
		return { name, set };
	}

	export function bySet (set: string, collectorNumber: string | number): CardIdentifier {
		return { collector_number: `${collectorNumber}`, set };
	}
}

export default new class Cards extends MagicQuerier {
	public async byName (name: string, fuzzy?: boolean): Promise<Card>;
	public async byName (name: string, set?: string, fuzzy?: boolean): Promise<Card>;
	public async byName (name: string, set?: string | boolean, fuzzy: boolean = false) {
		if (typeof set === "boolean") {
			fuzzy = set;
			set = undefined;
		}

		return this.query<Card>("cards/named", {
			[fuzzy ? "fuzzy" : "exact"]: name,
			set,
		});
	}

	public async byId (id: string) {
		return this.query<Card>(["cards", id]);
	}

	public async bySet (setCode: string, collectorNumber: number, lang?: string) {
		return this.query<Card>(["cards", setCode, collectorNumber, lang]);
	}

	public async byMultiverseId (id: number) {
		return this.query<Card>(["cards/multiverse", id]);
	}

	public async byMtgoId (id: number) {
		return this.query<Card>(["cards/mtgo", id]);
	}

	public async byArenaId (id: number) {
		return this.query<Card>(["cards/arena", id]);
	}

	public async byTcgPlayerId (id: number) {
		return this.query<Card>(["cards/tcgplayer", id]);
	}

	public async random () {
		return this.query<Card>("cards/random");
	}

	public search (query: string, options?: SearchOptions) {
		const emitter = new MagicEmitter<Card>();

		this.queryPage(emitter, "cards/search", { q: query, ...options })
			.catch(err => emitter.emit("error", err));

		return emitter;
	}

	/**
	 * Returns a MagicEmitter of every card in the Scryfall database.
	 * @param page The page to start on. Defaults to `1`, for first page. A page is 175 cards.
	 */
	public all (page = 1) {
		const emitter = new MagicEmitter<Card>();

		this.queryPage(emitter, "cards", {}, page)
			.catch(err => emitter.emit("error", err));

		return emitter;
	}

	public async autoCompleteName (name: string) {
		return (await this.query<ApiCatalog>("cards/autocomplete", { q: name })).data;
	}

	public collection (...identifiers: CardIdentifier[]) {
		const emitter = new MagicEmitter<Card>();

		this.processCollection(emitter, identifiers);

		return emitter;
	}

	private async processCollection (emitter: MagicEmitter<Card>, identifiers: CardIdentifier[]) {
		for (let i = 0; i < identifiers.length; i += 75) {
			if (emitter.cancelled) break;

			// the api only supports a max collection size of 75, so we take the list of identifiers (any length)
			// and split it into 75 card-max requests
			const collectionSection = { identifiers: identifiers.slice(i, i + 75) };

			const data = (await this.query<List<Card>>("cards/collection", undefined, collectionSection)).data;

			for (const card of data) {
				emitter.emit("data", card);
				if (emitter.cancelled) break;
			}

			if (emitter.willCancelAfterPage) emitter.cancel();
		}

		if (!emitter.cancelled) emitter.emit("end");
		emitter.emit("done");
	}
};
