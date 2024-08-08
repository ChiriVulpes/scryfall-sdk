import { Stream } from "stream";
import Cached from "../util/Cached";
import MagicQuerier, { List } from "../util/MagicQuerier";

let axios: typeof import("axios")["default"] | undefined;
if (typeof fetch === "undefined") {
	try {
		axios = require("axios").default;
	} catch { }
}

enum BulkDataTypes {
	oracle_cards,
	unique_artwork,
	default_cards,
	all_cards,
	rulings,
}

export type BulkDataType = keyof typeof BulkDataTypes;

export interface BulkDataDefinition {
	object: "bulk_data";

	id: string;
	uri: string;
	type: BulkDataType;
	name: string;
	description: string;
	download_uri: string;
	updated_at: string;
	size: number;
	content_type: string;
	content_encoding: string;
}

class BulkData extends MagicQuerier {

	/**
	 * Returns a stream for the given bulk data if it has been updated since the last download time. If it hasn't, returns `undefined`
	 * @param lastDownload The last time this bulk data was downloaded. If you want to re-download the data regardless of
	 * the last time it was downloaded, set this to `0`.
	 */
	public async downloadByType (type: BulkDataType, lastDownload: string | number | Date) {
		return this.download(type, lastDownload);
	}

	/**
	 * Returns a stream for the given bulk data if it has been updated since the last download time. If it hasn't, returns `undefined`
	 * @param lastDownload The last time this bulk data was downloaded. If you want to re-download the data regardless of
	 * the last time it was downloaded, set this to `0`.
	 */
	public async downloadById (id: string, lastDownload: string | number | Date) {
		return this.download(id, lastDownload);
	}

	////////////////////////////////////
	// Definitions
	//

	@Cached
	public async definitions () {
		return (await this.query<List<BulkDataDefinition>>("bulk-data")).data;
	}

	@Cached
	public async definitionByType (type: BulkDataType) {
		return this.definition(type);
	}

	@Cached
	public async definitionById (id: string) {
		return this.definition(id);
	}

	////////////////////////////////////
	// Internals
	//

	private async download (idOrType: string, lastDownload: string | number | Date) {
		const definition = await this.definition(idOrType);
		if (new Date(lastDownload).getTime() > new Date(definition.updated_at).getTime())
			return undefined;

		if (axios) {
			const result = await axios.request<Stream>({
				method: "GET",
				url: definition.download_uri,
				responseType: "stream",
			});

			return result.data;

		} else {
			const result = await fetch(definition.download_uri, {
				method: "GET",
				headers: {
					...!MagicQuerier.agent ? undefined : {
						'User-Agent': MagicQuerier.agent,
					},
					Accept: "*/*",
				},
			});

			return result.body;
		}
	}

	private definition (idOrType: string) {
		return this.query<BulkDataDefinition>(["bulk-data", idOrType]);
	}
}

export default new BulkData;