import Cached from "../util/Cached";
import MagicQuerier, { ApiCatalog } from "../util/MagicQuerier";

class Catalog extends MagicQuerier {
	@Cached
	public async cardNames () {
		return (await this.query<ApiCatalog>("catalog/card-names")).data;
	}

	@Cached
	public async artistNames () {
		return (await this.query<ApiCatalog>("catalog/artist-names")).data;
	}

	@Cached
	public async wordBank () {
		return (await this.query<ApiCatalog>("catalog/word-bank")).data;
	}

	@Cached
	public async creatureTypes () {
		return (await this.query<ApiCatalog>("catalog/creature-types")).data;
	}

	@Cached
	public async planeswalkerTypes () {
		return (await this.query<ApiCatalog>("catalog/planeswalker-types")).data;
	}

	@Cached
	public async landTypes () {
		return (await this.query<ApiCatalog>("catalog/land-types")).data;
	}

	@Cached
	public async artifactTypes () {
		return (await this.query<ApiCatalog>("catalog/artifact-types")).data;
	}

	@Cached
	public async enchantmentTypes () {
		return (await this.query<ApiCatalog>("catalog/enchantment-types")).data;
	}

	@Cached
	public async spellTypes () {
		return (await this.query<ApiCatalog>("catalog/spell-types")).data;
	}

	@Cached
	public async powers () {
		return (await this.query<ApiCatalog>("catalog/powers")).data;
	}

	@Cached
	public async toughnesses () {
		return (await this.query<ApiCatalog>("catalog/toughnesses")).data;
	}

	@Cached
	public async loyalties () {
		return (await this.query<ApiCatalog>("catalog/loyalties")).data;
	}

	@Cached
	public async watermarks () {
		return (await this.query<ApiCatalog>("catalog/watermarks")).data;
	}
}

export default new Catalog;
