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
	name: string;
	mtgo_code: string;
	tcgplayer_id: number;
	released_at?: string;
	block_code?: string;
	block?: string;
	parent_set_code?: string;
	card_count: number;
	digital: boolean;
	foil_only: boolean;
	icon_svg_uri: string;
	search_uri: string;
	set_type: keyof typeof SetType;
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
