import Cached from "../util/Cached";
import MagicQuerier, { List } from "../util/MagicQuerier";

export interface HomepageLink {
	id: number;
	created_at: string;
	updated_at: string;
	priority: number;
	text: string;
	uri: string;
	badge?: string | null;
}

class Misc extends MagicQuerier {
	@Cached
	public async homepageLinks () {
		return (await this.query<List<HomepageLink>>("homepage-links")).data;
	}
}

export default new Misc;
