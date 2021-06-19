import MagicQuerier, { List } from "../util/MagicQuerier";
import { SearchOptions } from "./Cards";

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

	public getCards (options?: SearchOptions | number) {
		return this.search(`s:${(this as any as Set).code}`, { order: "set", ...typeof options === "number" ? { page: options } : options });
	}

	public search (query: string, options?: SearchOptions | number) {
		return Scry.Cards.search(`s:${(this as any as Set).code} ${query}`, options)
			.waitForAll();
	}
}

function initialiseSet (set: Set) {
	Object.setPrototypeOf(set, Set.prototype);
	return set;
}

class Sets extends MagicQuerier {

	protected set Scry (scry: typeof import("../Scry")) {
		Scry = scry;
	}

	public async all () {
		return (await this.query<List<Set>>("sets")).data
			.map(initialiseSet);
	}

	public async byCode (code: string) {
		return this.query<Set>(["sets", code])
			.then(initialiseSet);
	}

	public async byId (id: string) {
		return this.query<Set>(["sets", id])
			.then(initialiseSet);
	}

	public async byTcgPlayerId (id: number) {
		return this.query<Set>(["sets/tcgplayer", id])
			.then(initialiseSet);
	}
}

export default new Sets;
