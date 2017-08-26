/// <reference types="mocha" />

import { expect } from "chai";

import Magic = require("../Magic");


describe("Magic", function () {
	this.timeout(5000);

	describe("Cards", () => {
		it("find", async () => {
			const card = await Magic.Cards.find("08618f8d5ebdc0c4d381ad11f0563dfebb21f4ee");
			expect(card.name).eq("Blood Scrivener");
		});
		it("where", async () => {
			const cards = await Magic.Cards.where({
				name: `"Murder"`
			});
			expect(cards.length).gte(3);
			for (const card of cards) {
				expect(card.name).eq("Murder");
			}
		});
		it("all", (done) => {
			const results: Magic.Card[] = [];
			Magic.Cards.all({ name: "Doom Blade", pageSize: 3 }).on("data", (card) => {
				expect(card.name).eq("Doom Blade");
				results.push(card);
			}).on("end", () => {
				expect(results.length).gte(8);
				done();
			});
		});
		it("all-cancel", (done) => {
			const results: Magic.Card[] = [];
			const emitter = Magic.Cards.all({ name: "Doom Blade", pageSize: 3 });
			emitter.on("data", (card) => {
				expect(card.name).eq("Doom Blade");
				results.push(card);
				if (results.length == 5) emitter.cancel();
			}).on("end", () => {
				throw new Error("Did not expect to reach this point");
			}).on("cancel", () => {
				expect(results.length).eq(5);
				done();
			});
		});
	});

	describe("Sets", () => {
		it("find", async () => {
			const set = await Magic.Sets.find("HOU");
			expect(set.name).eq("Hour of Devastation");
		});
		it("where", async () => {
			const sets = await Magic.Sets.where({
				block: `Kaladesh`
			});
			expect(sets.length).eq(2);
			for (const set of sets) {
				expect(set.block).eq("Kaladesh");
			}
		});
		it("all", (done) => {
			let count = 0;
			Magic.Sets.all({}).on("data", () => count++).on("end", () => {
				expect(count).eq(210);
				done();
			});
		});
		it("booster", async () => {
			const booster = await Magic.Sets.generateBooster("HOU");
			expect(booster.length).gte(10).lt(30); // might as well be vague
			for (const card of booster) {
				expect(card.set).eq("HOU");
			}
		});
	});

	describe("Archive", () => {
		it("types", async () => {
			const types = await Magic.Types.all();
			expect(types.length).gte(13);
		});
		it("subtypes", async () => {
			const types = await Magic.Subtypes.all();
			expect(types.length).gte(348);
		});
		it("supertypes", async () => {
			const types = await Magic.Supertypes.all();
			expect(types.length).gte(5);
		});
		it("formats", async () => {
			const formats = await Magic.Formats.all();
			expect(formats.length).gte(36);
		});
	});
});
