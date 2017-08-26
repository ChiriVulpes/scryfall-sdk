/// <reference types="mocha" />

import { expect } from "chai";

import Scry = require("../Scry");


describe("Scry", function () {
	this.timeout(5000);

	describe("Cards", () => {
		it("by id", async () => {
			const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(card.name).eq("Blood Scrivener");
		});
		describe("by name,", () => {
			it("exact", async () => {
				const card = await Scry.Cards.byName("Blood Scrivener");
				expect(card.name).eq("Blood Scrivener");
			});
			it("fuzzy", async () => {
				const card = await Scry.Cards.byName("Bliid Scrivener", true);
				expect(card.name).eq("Blood Scrivener");
			});
		});
		it("by set", async () => {
			const card = await Scry.Cards.bySet("dgm", "22");
			expect(card.name).eq("Blood Scrivener");
		});
		it("by multiverse id", async () => {
			const card = await Scry.Cards.byMultiverseId(369030);
			expect(card.name).eq("Blood Scrivener");
		});
		it("by mtgo id", async () => {
			const card = await Scry.Cards.byMtgoId(48338);
			expect(card.name).eq("Blood Scrivener");
		});

		it("search", (done) => {
			const results: Scry.Card[] = [];
			Scry.Cards.search("type:planeswalker").on("data", (card) => {
				expect(card.type_line).satisfies((type: string) => type.startsWith("Planeswalker"));
				results.push(card);
			}).on("end", () => {
				expect(results.length).gte(97);
				done();
			});
		});
		it("all (cancel after 427 cards)", async () => {
			return new Promise((resolve, reject) => {
				let needCount = 427;
				const emitter = Scry.Cards.all();
				emitter.on("data", (card) => {
					needCount--;
					if (needCount == 0) emitter.cancel();
				}).on("end", () => {
					reject(new Error("Did not expect to reach this point"));
				}).on("cancel", () => {
					expect(needCount).eq(0);
					resolve();
				});
			});
		}).timeout(10000);
		it("random", async () => {
			const card = await Scry.Cards.random();
			expect(card).not.undefined;
		});
		it("autocomplete name", async () => {
			const cardNames = await Scry.Cards.autoCompleteName("bloodsc");
			expect(cardNames).include("Blood Scrivener");
		});
	});

	describe("Sets", () => {
		it("by code", async () => {
			const set = await Scry.Sets.byCode("hou");
			expect(set.name).eq("Hour of Devastation");
		});
		it("all", async () => {
			const sets = await Scry.Sets.all();
			expect(sets.length).gte(394);
		});
	});

	describe("Symbology", () => {
		it("all", async () => {
			const symbology = await Scry.Symbology.all();
			expect(symbology.length).gte(63);
		});
		it("parse mana cost", async () => {
			const manacost = await Scry.Symbology.parseMana("2ww");
			expect(manacost.cost).eq("{2}{W}{W}");
		});
	});

	describe("Catalog", () => {
		it("card names", async () => {
			const result = await Scry.Catalog.cardNames();
			expect(result.length).gte(17562);
		});
		it("creature types", async () => {
			const result = await Scry.Catalog.creatureTypes();
			expect(result.length).gte(236);
		});
		it("land types", async () => {
			const result = await Scry.Catalog.landTypes();
			expect(result.length).gte(13);
		});
		it("planeswalker types", async () => {
			const result = await Scry.Catalog.planeswalkerTypes();
			expect(result.length).gte(35);
		});
		it("word bank", async () => {
			const result = await Scry.Catalog.wordBank();
			expect(result.length).gte(12317);
		});
		it("powers", async () => {
			const result = await Scry.Catalog.powers();
			expect(result.length).gte(26);
		});
		it("toughnesses", async () => {
			const result = await Scry.Catalog.toughnesses();
			expect(result.length).gte(28);
		});
		it("loyalties", async () => {
			const result = await Scry.Catalog.loyalties();
			expect(result.length).gte(7);
		});
		it("homepage links", async () => {
			const result = await Scry.homepageLinks();
			expect(result).satisfies(Array.isArray);
		});
	});
});
