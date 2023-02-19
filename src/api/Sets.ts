import { IScry, SYMBOL_CARDS, SYMBOL_SET } from "../IScry";
import Cached from "../util/Cached";
import MagicQuerier, { List, TOrArrayOfT } from "../util/MagicQuerier";
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

	@Cached
	public async all () {
		return (await this.query<List<Set>>("sets")).data
			.map(Set.construct);
	}

	@Cached
	public async byCode (code: string) {
		return this.querySet(["sets", code]);
	}

	@Cached
	public async byId (id: string) {
		return this.querySet(["sets", id]);
	}

	@Cached
	public async byTcgPlayerId (id: number) {
		return this.querySet(["sets/tcgplayer", id]);
	}

	/**
	 * @param fuzzy This parameter only works if you've previously set a fuzzy comparer with `Scry.setFuzzySearch`. Otherwise it only returns exact matches.
	 */
	@Cached
	public async byName (name: string, fuzzy?: boolean) {
		const all = await this.all();
		let result: Set | undefined;
		if (fuzzy && IScry.fuzzySearch)
			result = IScry.fuzzySearch(name, all, "name");
		else {
			name = name.toLowerCase();
			result = all.find(set => set.name.toLowerCase() === name);
		}

		if (result)
			return result;

		const error = new Error(`No sets found matching “${name}”`) as any;
		error.status = 404;
		error.code = "not_found";
		throw error;
	}

	private async querySet (apiPath: TOrArrayOfT<string | number | undefined>, query?: { [key: string]: any }, post?: any): Promise<Set> {
		return await this.query<Set>(apiPath, query, post)
			.then(Set.construct);
	}
}

export default new Sets;
