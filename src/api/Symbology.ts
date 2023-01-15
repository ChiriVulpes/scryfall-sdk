import { Color } from "../IScry";
import Cached from "../util/Cached";
import MagicQuerier, { List } from "../util/MagicQuerier";

export interface CardSymbol {
	symbol: string;
	loose_variant?: string | null;
	english: string;
	transposable: boolean;
	represents_mana: boolean;
	converted_mana_cost?: number | null;
	colors: Color[];
	appears_in_mana_costs: boolean;
	funny: boolean;
	gatherer_alternates?: string[] | null;
	svg_uri: string;
}

export interface ManaCost {
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
