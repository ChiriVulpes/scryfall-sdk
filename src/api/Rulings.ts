import Cached from "../util/Cached";
import MagicQuerier, { List } from "../util/MagicQuerier";
import {CollectorNumber} from "./Cards";

export interface Ruling {
	source: string;
	published_at: string;
	comment: string;
}

class Rulings extends MagicQuerier {

	@Cached
	public async byId (id: string) {
		return (await this.query<List<Ruling>>(["cards", id, "rulings"])).data;
	}

	@Cached
	public async bySet (setCode: string, collectorNumber: CollectorNumber) {
		return (await this.query<List<Ruling>>(["cards", setCode, `${collectorNumber}`, "rulings"])).data;
	}

	@Cached
	public async byMultiverseId (id: number) {
		return (await this.query<List<Ruling>>(["cards/multiverse", id, "rulings"])).data;
	}

	@Cached
	public async byMtgoId (id: number) {
		return (await this.query<List<Ruling>>(["cards/mtgo", id, "rulings"])).data;
	}

	@Cached
	public async byArenaId (id: number) {
		return (await this.query<List<Ruling>>(["cards/arena", id, "rulings"])).data;
	}
}

export default new Rulings;
