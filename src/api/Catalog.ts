import MagicQuerier, { ApiCatalog } from "../util/MagicQuerier";

export default new class Catalog extends MagicQuerier {
	public async cardNames () {
		return (await this.query<ApiCatalog>("catalog/card-names")).data;
	}

	public async artistNames () {
		return (await this.query<ApiCatalog>("catalog/artist-names")).data;
	}

	public async wordBank () {
		return (await this.query<ApiCatalog>("catalog/word-bank")).data;
	}

	public async creatureTypes () {
		return (await this.query<ApiCatalog>("catalog/creature-types")).data;
	}

	public async planeswalkerTypes () {
		return (await this.query<ApiCatalog>("catalog/planeswalker-types")).data;
	}

	public async landTypes () {
		return (await this.query<ApiCatalog>("catalog/land-types")).data;
	}

	public async artifactTypes () {
		return (await this.query<ApiCatalog>("catalog/artifact-types")).data;
	}

	public async enchantmentTypes () {
		return (await this.query<ApiCatalog>("catalog/enchantment-types")).data;
	}

	public async spellTypes () {
		return (await this.query<ApiCatalog>("catalog/spell-types")).data;
	}

	public async powers () {
		return (await this.query<ApiCatalog>("catalog/powers")).data;
	}

	public async toughnesses () {
		return (await this.query<ApiCatalog>("catalog/toughnesses")).data;
	}

	public async loyalties () {
		return (await this.query<ApiCatalog>("catalog/loyalties")).data;
	}

	public async watermarks () {
		return (await this.query<ApiCatalog>("catalog/watermarks")).data;
	}
};
