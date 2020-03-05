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

export interface BulkData {
	object: "bulk_data";

	id: string;
	type: string;
	name: string;
	description: string;
	permalink_uri: string;
	created_at: string;
	updated_at: string;
	compressed_size: number;
	content_type: string;
	content_encoding: string;
}

export default new class Misc extends MagicQuerier {
	public async homepageLinks () {
		return (await this.query<List<HomepageLink>>("homepage-links")).data;
	}

	public async bulkData () {
		return (await this.query<List<BulkData>>("bulk-data")).data;
	}
};
