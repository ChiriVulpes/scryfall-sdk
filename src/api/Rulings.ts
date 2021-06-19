import MagicQuerier, { List } from "../util/MagicQuerier";

export interface Ruling {
	source: string;
	published_at: string;
	comment: string;
}

class Rulings extends MagicQuerier {

	public async byId (id: string) {
		return (await this.query<List<Ruling>>(["cards", id, "rulings"])).data;
	}

	public async bySet (setCode: string, collectorNumber: string | number) {
		return (await this.query<List<Ruling>>(["cards", setCode, `${collectorNumber}`, "rulings"])).data;
	}

	public async byMultiverseId (id: number) {
		return (await this.query<List<Ruling>>(["cards/multiverse", id, "rulings"])).data;
	}

	public async byMtgoId (id: number) {
		return (await this.query<List<Ruling>>(["cards/mtgo", id, "rulings"])).data;
	}

	public async byArenaId (id: number) {
		return (await this.query<List<Ruling>>(["cards/arena", id, "rulings"])).data;
	}
}

export default new Rulings;
