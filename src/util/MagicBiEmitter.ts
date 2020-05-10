import AbstractMagicEmitter from "./AbstractMagicEmitter";

export default class MagicBiEmitter<T, Q> extends AbstractMagicEmitter {

	public on (event: "data", listener: (data: T) => any): this;
	public on (event: "not_found", listener: (data: Q) => any): this;
	public on (event: "end", listener: () => any): this;
	public on (event: "cancel", listener: () => any): this;
	public on (event: "error", listener: (err: Error) => any): this;
	public on (event: "done", listener: () => any): this;
	public on (event: string, listener: (...args: any[]) => any) {
		super.on(event, listener);
		return this;
	}

	public emit (event: "data", data: T): boolean;
	public emit (event: "not_found", data: Q): boolean;
	public emit (event: "end"): boolean;
	public emit (event: "cancel"): boolean;
	public emit (event: "error", error: Error): boolean;
	public emit (event: "done"): boolean;
	public emit (event: string, ...data: any[]) {
		return super.emit(event, ...data);
	}

	public async waitForAll () {
		return new Promise<ResultsAndFailures<T, Q>>((resolve, reject) => {
			const results: T[] = [];
			const notMatchingQueries: Q[] = [];
			this.on("data", result => {
				results.push(result);
			});
			this.on("not_found", notMatchingQuery => {
				notMatchingQueries.push(notMatchingQuery);
			});
			this.on("end", () => resolve({
                data: results,
                not_found: notMatchingQueries
            }));
			this.on("error", reject);
		});
	}

}

type ResultsAndFailures<T, Q> = { data: T[], not_found: Q[] }
