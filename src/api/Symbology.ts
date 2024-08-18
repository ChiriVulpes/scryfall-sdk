import { Color } from "../IScry";
import Cached from "../util/Cached";
import MagicQuerier, { List } from "../util/MagicQuerier";

export interface CardSymbol {
	object: "card_symbol";

	symbol: string;
	loose_variant?: string | null;
	english: string;
	transposable: boolean;
	represents_mana: boolean;
	mana_value?: number | null;
	appears_in_mana_costs: boolean;
	funny: boolean;
	colors: Color[];
	hybrid: boolean;
	phyrexian: boolean;
	gatherer_alternates?: string[] | null;
	svg_uri?: string | null;
}

export interface ManaCost {
	object: "mana_cost";

	cost: string;
	cmc: number;
	colors: Color[];
	colorless: boolean;
	monocolored: boolean;
	multicolored: boolean;
}

class Symbology extends MagicQuerier {
	@Cached
	public async all () {
		return (await this.query<List<CardSymbol>>("symbology")).data;
	}

	@Cached
	public async parseMana (shorthand: string) {
		return this.query<ManaCost>("symbology/parse-mana", { cost: shorthand });
	}
}

export default new Symbology;
