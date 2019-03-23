import { Color } from "../IScry";
import MagicQuerier, { List } from "../util/MagicQuerier";

export interface CardSymbol {
	symbol: string;
	loose_variant: string;
	english: string;
	transposable: string;
	represents_mana: boolean;
	converted_mana_cost: number;
	colors: Color[];
	appears_in_mana_costs: boolean;
	funny: boolean;
}

export interface ManaCost {
	cost: string;
	cmc: number;
	colors: Color[];
	colorless: boolean;
	monocolored: boolean;
	multicolored: boolean;
}

export default new class Symbology extends MagicQuerier {
	public async all () {
		return (await this.query<List<CardSymbol>>("symbology")).data;
	}

	public async parseMana (shorthand: string) {
		return this.query<ManaCost>("symbology/parse-mana", { cost: shorthand });
	}
};
