/// <reference types="mocha" />

import { expect } from "chai";

import * as Scry from "../Scry";


describe("Scry", function () {
	this.timeout(10000);

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

		it("search", async () => {
			const results: Scry.Card[] = [];
			for await (const card of Scry.Cards.search("type:planeswalker").all()) {
				results.push(card);
				if (card.layout !== "normal") {
					return;
				}

				expect(card.type_line)
					.satisfies((type: string) => type.startsWith("Legendary Planeswalker") || type.startsWith("Planeswalker"));
			}

			expect(results.length).gte(97);
		});

		it("search by set", done => {
			const results: Scry.Card[] = [];
			Scry.Cards.search("s:kld", { order: "cmc" }).on("data", card => {
				if (results.length) {
					expect(card.cmc).gte(results[results.length - 1].cmc);
				}

				results.push(card);
				expect(card.set).satisfies((set: string) => set == "kld");
			}).on("end", () => {
				expect(results.length).eq(264);
				done();
			}).on("error", done);
		});

		it("all (cancel after 427 cards)", async () => {
			return new Promise((resolve, reject) => {
				let needCount = 427;
				const emitter = Scry.Cards.all();
				emitter.on("data", card => {
					needCount--;
					if (needCount == 0) {
						emitter.cancel();
					}

				}).on("end", () => {
					reject(new Error("Did not expect to reach this point"));
				}).on("cancel", () => {
					expect(needCount).eq(0);
					resolve();
				}).on("error", reject);
			});
		}).timeout(15000);

		it("random", async () => {
			const card = await Scry.Cards.random();
			expect(card).not.eq(undefined);
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

	describe("Rulings", () => {
		it("by id", async () => {
			const rulings = await Scry.Rulings.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(rulings.length).eq(2);
		});

		it("by set", async () => {
			const rulings = await Scry.Rulings.bySet("dgm", "22");
			expect(rulings.length).eq(2);
		});

		it("by multiverse id", async () => {
			const rulings = await Scry.Rulings.byMultiverseId(369030);
			expect(rulings.length).eq(2);
		});

		it("by mtgo id", async () => {
			const rulings = await Scry.Rulings.byMtgoId(48338);
			expect(rulings.length).eq(2);
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
			expect(result.length).gte(18059);
		});

		it("word bank", async () => {
			const result = await Scry.Catalog.wordBank();
			expect(result.length).gte(12892);
		});

		it("creature types", async () => {
			const result = await Scry.Catalog.creatureTypes();
			expect(result.length).gte(242);
		});

		it("planeswalker types", async () => {
			const result = await Scry.Catalog.planeswalkerTypes();
			expect(result.length).gte(42);
		});

		it("land types", async () => {
			const result = await Scry.Catalog.landTypes();
			expect(result.length).gte(13);
		});

		it("artifact types", async () => {
			const result = await Scry.Catalog.artifactTypes();
			expect(result.length).gte(6);
		});

		it("enchantment types", async () => {
			const result = await Scry.Catalog.enchantmentTypes();
			expect(result.length).gte(5);
		});

		it("spell types", async () => {
			const result = await Scry.Catalog.spellTypes();
			expect(result.length).gte(2);
		});

		it("powers", async () => {
			const result = await Scry.Catalog.powers();
			expect(result.length).gte(33);
		});

		it("toughnesses", async () => {
			const result = await Scry.Catalog.toughnesses();
			expect(result.length).gte(35);
		});

		it("loyalties", async () => {
			const result = await Scry.Catalog.loyalties();
			expect(result.length).gte(9);
		});

		it("watermarks", async () => {
			const result = await Scry.Catalog.watermarks();
			expect(result.length).gte(50);
		});
	});

	it("homepage links", async () => {
		const result = await Scry.homepageLinks();
		expect(result).satisfies(Array.isArray);
	});
});
