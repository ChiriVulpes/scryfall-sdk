import MagicQuerier, { List } from "../util/MagicQuerier";

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

export interface Set {
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
}

export default new class Sets extends MagicQuerier {
	public async all () {
		return (await this.query<List<Set>>("sets")).data;
	}

	public async byCode (code: string) {
		return this.query<Set>(["sets", code]);
	}

	public async byId (id: string) {
		return this.query<Set>(["sets", id]);
	}

	public async byTcgPlayerId (id: number) {
		return this.query<Set>(["sets/tcgplayer", id]);
	}
};
