import { SYMBOL_CARDS, SYMBOL_SET } from "../IScry";
import MagicQuerier, { List } from "../util/MagicQuerier";
import { Card, SearchOptions } from "./Cards";

enum SetType {
	core,
	expansion,
	masters,
	masterpiece,
	from_the_vault,
	spellbook,
	premium_deck,
	duel_deck,
	draft_innovation,
	treasure_chest,
	commander,
	planechase,
	archenemy,
	vanguard,
	funny,
	starter,
	box,
	promo,
	token,
	memorabilia,
}

type SetSearchOptions = Omit<SearchOptions, "page">;

let Scry!: typeof import("../Scry");

export class Set {
	id: string;
	code: string;
	mtgo_code?: string | null;
	tcgplayer_id?: number | null;
	name: string;
	set_type: keyof typeof SetType;
	released_at?: string | null;
	block_code?: string | null;
	block?: string | null;
	parent_set_code?: string | null;
	card_count: number;
	digital: boolean;
	foil_only: boolean;
	scryfall_uri: string;
	uri: string;
	icon_svg_uri: string;
	search_uri: string;

	public static construct (set: Set) {
		Object.setPrototypeOf(set, Set.prototype);
		return set;
	}

	private [SYMBOL_CARDS]?: Card[];
	public async getCards (options?: SetSearchOptions) {
		if (!options)
			return this[SYMBOL_CARDS] ??= await this.search(`s:${this.code}`, { order: "set" });
		return this.search(`s:${this.code}`, { order: "set", ...options });
	}

	public search (query: string, options?: SetSearchOptions) {
		return Scry.Cards.search(`s:${this.code} ${query}`, options)
			.map(card => {
				card[SYMBOL_SET] ??= this;
				return card;
			})
			.waitForAll();
	}
}

class Sets extends MagicQuerier {

	protected set Scry (scry: typeof import("../Scry")) {
		Scry = scry;
	}

	public async all () {
		return (await this.query<List<Set>>("sets")).data
			.map(Set.construct);
	}

	public async byCode (code: string) {
		return this.query<Set>(["sets", code])
			.then(Set.construct);
	}

	public async byId (id: string) {
		return this.query<Set>(["sets", id])
			.then(Set.construct);
	}

	public async byTcgPlayerId (id: number) {
		return this.query<Set>(["sets/tcgplayer", id])
			.then(Set.construct);
	}
}

export default new Sets;
