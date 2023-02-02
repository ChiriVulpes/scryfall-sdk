import MagicEmitter from "../util/MagicEmitter";
import MagicQuerier from "../util/MagicQuerier";

export enum MigrationStrategy {
	/**
	 * You should update your records to replace the given old Scryfall ID with the new ID. The old ID is being discarded, and an existing record should be used to replace all instances of it.
	 */
	Merge = "merge",
	/**
	 * The given UUID is being discarded, and no replacement data is being provided. This likely means the old records are fully invalid. This migration exists to provide evidence that cards were removed from Scryfall’s database.
	 */
	Delete = "delete",
}

export interface Migration {
	uri: string;
	id: string;
	performed_at: string;
	migration_strategy: MigrationStrategy;
	old_scryfall_id: string;
	new_scryfall_id?: string | null;
	note?: string | null;
}

class Migrations extends MagicQuerier {
	public all (page?: number) {
		const emitter = new MagicEmitter<Migration>();

		this.queryPage(emitter, "migrations", {}, page)
			.catch(err => emitter.emit("error", err));

		return emitter;
	}

	public async byId (id: string) {
		return this.query<Migration>(["migrations", id]);
	}
}

export default new Migrations;
