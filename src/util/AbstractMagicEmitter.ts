import { EventEmitter } from "events";

export default abstract class AbstractMagicEmitter extends EventEmitter {
	private _ended = false;
	public get ended () {
		return this._ended;
	}

	private _cancelled = false;
	public get cancelled () {
		return this._cancelled;
	}

	private _willCancelAfterPage = false;
	public get willCancelAfterPage () {
		return this._willCancelAfterPage;
	}

	public constructor () {
		super();
		this.on("end", () => {
			this._ended = true;
		});
		this.on("cancel", () => {
			this._ended = true;
		});
	}

	public cancel () {
		this._cancelled = true;
		this.emit("cancel");
		return this;
	}

	public cancelAfterPage () {
		this._willCancelAfterPage = true;
		return this;
	}

}
