/// <reference types="mocha" />

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { Stream } from "stream";
import { BulkDataDefinition } from "../api/BulkData";
import { Card, SymbologyTransformer } from "../api/Cards";
import { ENDPOINT_FILE_1, RESOURCE_GENERIC_CARD_BACK } from "../IScry";
import * as Scry from "../Scry";
import MagicQuerier from "../util/MagicQuerier";

const expect = chai.expect;
chai.use(chaiAsPromised);


describe("Scry", function () {
	this.timeout(10000);

	describe("Cards", () => {
		it("by id", async () => {
			const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(card.name).eq("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		describe("by name,", () => {
			it("exact", async () => {
				const card = await Scry.Cards.byName("Blood Scrivener");
				expect(card.name).eq("Blood Scrivener");
				expect(Scry.error()).eq(undefined);
			});

			it("fuzzy", async () => {
				let card = await Scry.Cards.byName("Bliid Scrivener", true);
				expect(card?.name).eq("Blood Scrivener");
				expect(Scry.error()).eq(undefined);
				card = await Scry.Cards.byName("rstdrdtst", true);
				expect(card).eq(undefined);
				expect(Scry.error()).satisfies((value: any) => typeof value === "object" && !!value && value.status === 404);
			});

			it("with set filter", async () => {
				const card = await Scry.Cards.byName("Loxodon Warhammer", "MRD");
				expect(card.name).eq("Loxodon Warhammer");
				expect(card.set).eq("mrd");
				expect(Scry.error()).eq(undefined);
			});

			it("fuzzy with set filter", async () => {
				const card = await Scry.Cards.byName("Warhammer", "MRD", true);
				expect(card?.name).eq("Loxodon Warhammer");
				expect(card?.set).eq("mrd");
				expect(Scry.error()).eq(undefined);
			});
		});

		it("by set", async () => {
			const card = await Scry.Cards.bySet("dgm", 22);
			expect(card.name).eq("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		it("by multiverse id", async () => {
			const card = await Scry.Cards.byMultiverseId(369030);
			expect(card.name).eq("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		it("by mtgo id", async () => {
			const card = await Scry.Cards.byMtgoId(48338);
			expect(card.name).eq("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		it("by arena id", async () => {
			const card = await Scry.Cards.byArenaId(67330);
			expect(card.name).eq("Yargle, Glutton of Urborg");
			expect(Scry.error()).eq(undefined);
		});

		it("by tcg player id", async () => {
			const card = await Scry.Cards.byTcgPlayerId(1030);
			expect(card.name).eq("Ankh of Mishra");
			expect(Scry.error()).eq(undefined);
		});

		it("in lang", async () => {
			const card = await Scry.Cards.bySet("dom", 1, "ja");
			expect(card.printed_name).eq("ウルザの後継、カーン");
			expect(Scry.error()).eq(undefined);
		});

		it("search", async () => {
			const results: Scry.Card[] = [];
			for await (const card of Scry.Cards.search("type:planeswalker").all()) {
				if (card.layout !== "normal") {
					return;
				}

				results.push(card);

				expect(card.type_line)
					.satisfies((type: string) => type.startsWith("Legendary Planeswalker") || type.startsWith("Planeswalker"));
				expect(Scry.error()).eq(undefined);
			}

			expect(results.length).gte(97);
			expect(Scry.error()).eq(undefined);
		});

		it("search waitForAll", async () => {
			const matches = await Scry.Cards.search("!smoker").waitForAll();
			expect(matches.length).eq(0);
			expect(Scry.error()).not.eq(undefined);
		});

		it("search by set", async () => new Promise<void>((resolve, reject) => {
			const results: Scry.Card[] = [];
			Scry.Cards.search("s:kld", { order: "cmc" }).on("data", card => {
				try {
					if (results.length) {
						expect(card.cmc).gte(results[results.length - 1].cmc);
						expect(Scry.error()).eq(undefined);
					}

					results.push(card);
					expect(card.set).satisfies((set: string) => set == "kld");
					expect(Scry.error()).eq(undefined);
					resolve();
				} catch (err) {
					reject(err);
				}
			}).on("end", () => {
				try {
					expect(results.length).eq(264);
					expect(Scry.error()).eq(undefined);
					resolve();
				} catch (err) {
					reject(err);
				}
			}).on("error", reject);
		}))
			.timeout(20000);

		it("search type:creature (cancel after 427 cards)", async () => {
			return new Promise((resolve, reject) => {
				let needCount = 427;
				const emitter = Scry.Cards.search("type:creature");
				emitter.on("data", () => {
					needCount--;
					if (needCount == 0) {
						emitter.cancel();
					}

				}).on("end", () => {
					reject(new Error("Did not expect to reach this point"));
				}).on("cancel", () => {
					expect(needCount).eq(0);
					expect(Scry.error()).eq(undefined);
					resolve();
				}).on("error", reject);
			});
		}).timeout(15000);

		it("should support pagination of searches", async () => {
			let firstPageCard: Scry.Card;
			let secondPageCard: Scry.Card;

			await Promise.all([
				new Promise((resolve, reject) => {
					const emitter = Scry.Cards.search("type:creature");
					emitter.on("data", card => (firstPageCard = card, emitter.cancel()))
						.on("end", () => reject(new Error("Did not expect to reach this point")))
						.on("cancel", resolve)
						.on("error", reject);
				}),
				new Promise((resolve, reject) => {
					const emitter = Scry.Cards.search("type:creature", 2).cancelAfterPage();
					emitter.on("data", card => secondPageCard = card)
						.on("end", () => reject(new Error("Did not expect to reach this point")))
						.on("cancel", resolve)
						.on("error", reject);
				}),
			]);

			expect(firstPageCard!.id).not.eq(secondPageCard!.id);
			expect(Scry.error()).eq(undefined);
		}).timeout(15000);

		it("random", async () => {
			const card = await Scry.Cards.random();
			expect(card).not.eq(undefined);
			expect(Scry.error()).eq(undefined);
		});

		it("autocomplete name", async () => {
			const cardNames = await Scry.Cards.autoCompleteName("bloodsc");
			expect(cardNames).include("Blood Scrivener");
			expect(Scry.error()).eq(undefined);
		});

		it("should return an empty array on an invalid search", async () => {
			const result = await Scry.Cards.search("cmc>cmc").cancelAfterPage().waitForAll();
			expect(result.length).eq(0);
			expect(Scry.error()).not.eq(undefined);
		});

		describe("Collection", () => {

			it("by id", async () => {
				const collection = [
					Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-6c09921c0075"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Crush Dissent");
				expect(Scry.error()).eq(undefined);
			});

			it("by multiverse id", async () => {
				const collection = [
					Scry.CardIdentifier.byMultiverseId(462293),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Contentious Plan");
				expect(Scry.error()).eq(undefined);
			});

			it("by mtgo id", async () => {
				const collection = [
					Scry.CardIdentifier.byMtgoId(71692),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Bond of Insight");
				expect(Scry.error()).eq(undefined);
			});

			it("by oracle id", async () => {
				const collection = [
					Scry.CardIdentifier.byOracleId("394c6de5-7957-4a0b-a6b9-ee0c707cd022"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Forgotten Cave");
				expect(Scry.error()).eq(undefined);
			});

			it("by illustration id", async () => {
				const collection = [
					Scry.CardIdentifier.byIllustrationId("99f43949-049e-41e2-bf4c-e22e11790012"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("GO TO JAIL");
				expect(Scry.error()).eq(undefined);
			});

			it("by name", async () => {
				const collection = [
					Scry.CardIdentifier.byName("Blood Scrivener"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Blood Scrivener");
				expect(Scry.error()).eq(undefined);
			});

			it("by name & set", async () => {
				const collection = [
					Scry.CardIdentifier.byName("Lightning Bolt", "prm"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Lightning Bolt");
				expect(cards[0].set).eq("prm");
				expect(Scry.error()).eq(undefined);
			});

			it("by set", async () => {
				const collection = [
					Scry.CardIdentifier.bySet("mrd", "150"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Chalice of the Void");
				expect(Scry.error()).eq(undefined);
			});

			it("by multiverse id, 100 cards", async () => {
				const collection = [];
				for (let i = 1; i < 101; i++) {
					collection.push(Scry.CardIdentifier.byMultiverseId(i));
				}

				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(100);
				for (let i = 0; i < 100; i++) {
					expect(cards[i].multiverse_ids).includes(i + 1);
				}
				expect(Scry.error()).eq(undefined);
			});

			it("by id with invalid", async () => {
				const collection = [
					Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-6c09921c0075"),
					Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-111111111111"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Crush Dissent");
				expect(cards.not_found.length).eq(1);
				expect(cards.not_found[0].id).eq("94c70f23-0ca9-425e-a53a-111111111111")
				expect(Scry.error()).eq(undefined);
			});
		});

		describe("methods", () => {
			it("getSet", async () => {
				const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
				const set = await card.getSet();
				expect(set.code).eq("dgm");
				expect(Scry.error()).eq(undefined);
			});

			it("getRulings", async () => {
				const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
				const rulings = await card.getRulings();
				expect(rulings.length).eq(2);
				expect(Scry.error()).eq(undefined);
			});

			it("getText", async () => {
				const card = await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b");
				Scry.Cards.setSymbologyTransformer(":mana-$1$2:");
				expect(card.getText()).eq(":mana-1::mana-U:, :mana-T:: Target creature gains flying until end of turn.");
				expect(Scry.error()).eq(undefined);
			});

			it("getCost", async () => {
				const map = new Map<Card, string>();
				map.set(await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b"), ":mana-U:");
				expect(Scry.error()).eq(undefined);
				map.set(await Scry.Cards.byId("3e7da55c-7f05-46b2-aa3c-17f8d5df46bb"), ":mana-12:");
				expect(Scry.error()).eq(undefined);
				map.set(await Scry.Cards.byId("a3f64ad2-4041-421d-baa2-206cedcecf0e"), ":mana-1::mana-WB::mana-WB:");
				expect(Scry.error()).eq(undefined);

				const transformers: (string | SymbologyTransformer)[] = [
					":mana-$1$2:",
					(type1, type2) => `:mana-${type1}${type2}:`,
				];
				for (const transformer of transformers) {
					Scry.Cards.setSymbologyTransformer(transformer);
					for (const [card, expected] of map)
						expect(card.getCost()).eq(expected);
				}
			});

			it("getPrints", async () => {
				let prints!: Card[];
				function validatePrints () {
					expect(prints.length).gte(7);
					for (const print of prints)
						expect(print.name).eq("Chalice of the Void");
					expect(Scry.error()).eq(undefined);
				}

				const card = await Scry.Cards.byId("1f0d2e8e-c8f2-4b31-a6ba-6283fc8740d4");
				MagicQuerier.requestCount = 0;
				for (let i = 0; i < 5; i++) {
					prints = await card.getPrints();
					validatePrints();
				}

				expect(MagicQuerier.requestCount).eq(1, "Unnecessary requests");
				prints = await prints[0].getPrints();
				validatePrints();

				expect(MagicQuerier.requestCount).eq(1, "Unnecessary requests");
			});

			it("isLegal", async () => {
				let card = await Scry.Cards.byId("3462a3d0-5552-49fa-9eb7-100960c55891");
				expect(card.isLegal("legacy")).false; // banned
				expect(card.isLegal("penny")).false; // not legal
				expect(card.isLegal("vintage")).true; // legal
				expect(Scry.error()).eq(undefined);
				card = await Scry.Cards.byId("8c39f9b4-02b9-4d44-b8d6-4fd02ebbb0c5");
				expect(card.isLegal("standard")).false; // not legal
				expect(card.isLegal("vintage")).true; // restricted
				expect(Scry.error()).eq(undefined);
			});

			it("isIllegal", async () => {
				let card = await Scry.Cards.byId("3462a3d0-5552-49fa-9eb7-100960c55891");
				expect(card.isIllegal("legacy")).true; // banned
				expect(card.isIllegal("penny")).true; // not legal
				expect(card.isIllegal("vintage")).false; // legal
				expect(Scry.error()).eq(undefined);
				card = await Scry.Cards.byId("8c39f9b4-02b9-4d44-b8d6-4fd02ebbb0c5");
				expect(card.isIllegal("standard")).true; // not legal
				expect(card.isIllegal("vintage")).false; // restricted
				expect(Scry.error()).eq(undefined);
			});

			it("getImageURI", async () => {
				let card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
				expect(card.getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722`);
				card = await Scry.Cards.byId("c4ac7570-e74e-4081-ac53-cf41e695b7eb");
				expect(card.getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
			});

			it("getFrontImageURI", async () => {
				let card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
				expect(card.getFrontImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722`);
				card = await Scry.Cards.byId("c4ac7570-e74e-4081-ac53-cf41e695b7eb");
				expect(card.getFrontImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
			});

			it("getBackImageURI", async () => {
				let card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
				expect(card.getBackImageURI("normal")).eq(RESOURCE_GENERIC_CARD_BACK);
				card = await Scry.Cards.byId("c4ac7570-e74e-4081-ac53-cf41e695b7eb");
				expect(card.getBackImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
			});

			describe("on faces", () => {
				it("getText", async () => {
					const card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
					Scry.Cards.setSymbologyTransformer(":mana-$1$2:");
					expect(card.getText()).undefined;
					expect(card.card_faces.length).eq(2);
					expect(card.card_faces[0].getText()).eq("Counter target spell unless its controller pays :mana-3:.");
					expect(card.card_faces[1].getText()).eq("Aftermath (Cast this spell only from your graveyard. Then exile it.)\nUp to three target lands don't untap during their controller's next untap step.");
					expect(Scry.error()).eq(undefined);
				});

				it("getCost", async () => {
					const card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
					Scry.Cards.setSymbologyTransformer(":mana-$1$2:");
					expect(card.getCost()).eq(":mana-2::mana-U: // :mana-2::mana-R:");
					expect(card.card_faces.length).eq(2);
					expect(card.card_faces[0].getCost()).eq(":mana-2::mana-U:");
					expect(card.card_faces[1].getCost()).eq(":mana-2::mana-R:");
					expect(Scry.error()).eq(undefined);
				});

				it("getImageURI", async () => {
					let card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
					expect(card.card_faces.length).eq(2);
					expect(card.card_faces[0].getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722`);
					expect(card.card_faces[1].getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722`);
					card = await Scry.Cards.byId("c4ac7570-e74e-4081-ac53-cf41e695b7eb");
					expect(card.card_faces.length).eq(2);
					expect(card.card_faces[0].getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
					expect(card.card_faces[1].getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/scryfall-cards/normal/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
				});
			});

			describe("related cards", () => {
				it("get", async () => {
					const card = await Scry.Cards.byId("e634baa3-2cdd-412a-9407-c347fe46f9b8");
					const tokens = card.getTokens();
					expect(tokens.length).eq(2);
					expect(tokens.map(token => token.name)).members(["Human Soldier", "Dinosaur"]);
					const tokenCards = await Promise.all(tokens.map(token => token.get()));
					expect(tokenCards.length).eq(2);
					expect(tokenCards.map(card => card.oracle_text)).members(["", "Haste"]);
				})
			});
		});
	});

	describe("Sets", () => {
		it("by code", async () => {
			const set = await Scry.Sets.byCode("hou");
			expect(set.name).eq("Hour of Devastation");
			expect(Scry.error()).eq(undefined);
		});

		it("by id", async () => {
			const set = await Scry.Sets.byId("65ff168b-bb94-47a5-a8f9-4ec6c213e768");
			expect(set.name).eq("Hour of Devastation");
			expect(Scry.error()).eq(undefined);
		});

		it("by tgc player id", async () => {
			const set = await Scry.Sets.byTcgPlayerId(1934);
			expect(set.name).eq("Hour of Devastation");
			expect(Scry.error()).eq(undefined);
		});

		it("all", async () => {
			const sets = await Scry.Sets.all();
			expect(sets.length).gte(394);
			expect(Scry.error()).eq(undefined);
		});

		describe("methods", () => {
			it("getCards", async () => {
				const set = await Scry.Sets.byCode("hou");
				const cards = await set.getCards();
				expect(cards.length).eq(199);
				expect(Scry.error()).eq(undefined);
			});

			it("search", async () => {
				const set = await Scry.Sets.byCode("hou");
				const cards = await set.search("type:planeswalker");
				for (const card of cards)
					expect(card.type_line)
						.satisfies((type: string) => type.startsWith("Legendary Planeswalker") || type.startsWith("Planeswalker"));

				expect(cards.length).eq(4);
				expect(Scry.error()).eq(undefined);
			});
		});
	});

	describe("Rulings", () => {
		it("by id", async () => {
			const rulings = await Scry.Rulings.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(rulings.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("by set", async () => {
			const rulings = await Scry.Rulings.bySet("dgm", "22");
			expect(rulings.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("by multiverse id", async () => {
			const rulings = await Scry.Rulings.byMultiverseId(369030);
			expect(rulings.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("by mtgo id", async () => {
			const rulings = await Scry.Rulings.byMtgoId(48338);
			expect(rulings.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("by arena id", async () => {
			const rulings = await Scry.Rulings.byArenaId(67204);
			expect(rulings.length).gte(3);
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("Symbology", () => {
		it("all", async () => {
			const symbology = await Scry.Symbology.all();
			expect(symbology.length).gte(63);
			expect(Scry.error()).eq(undefined);
		});

		it("parse mana cost", async () => {
			const manacost = await Scry.Symbology.parseMana("2ww");
			expect(manacost.cost).eq("{2}{W}{W}");
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("Catalog", () => {
		it("card names", async () => {
			const result = await Scry.Catalog.cardNames();
			expect(result.length).gte(18059);
			expect(Scry.error()).eq(undefined);
		});

		it("artist names", async () => {
			const result = await Scry.Catalog.artistNames();
			expect(result.length).gte(676);
			expect(Scry.error()).eq(undefined);
		});

		it("word bank", async () => {
			const result = await Scry.Catalog.wordBank();
			expect(result.length).gte(12892);
			expect(Scry.error()).eq(undefined);
		});

		it("creature types", async () => {
			const result = await Scry.Catalog.creatureTypes();
			expect(result.length).gte(242);
			expect(Scry.error()).eq(undefined);
		});

		it("planeswalker types", async () => {
			const result = await Scry.Catalog.planeswalkerTypes();
			expect(result.length).gte(42);
			expect(Scry.error()).eq(undefined);
		});

		it("land types", async () => {
			const result = await Scry.Catalog.landTypes();
			expect(result.length).gte(13);
			expect(Scry.error()).eq(undefined);
		});

		it("artifact types", async () => {
			const result = await Scry.Catalog.artifactTypes();
			expect(result.length).gte(6);
			expect(Scry.error()).eq(undefined);
		});

		it("enchantment types", async () => {
			const result = await Scry.Catalog.enchantmentTypes();
			expect(result.length).gte(5);
			expect(Scry.error()).eq(undefined);
		});

		it("spell types", async () => {
			const result = await Scry.Catalog.spellTypes();
			expect(result.length).gte(2);
			expect(Scry.error()).eq(undefined);
		});

		it("powers", async () => {
			const result = await Scry.Catalog.powers();
			expect(result.length).gte(33);
			expect(Scry.error()).eq(undefined);
		});

		it("toughnesses", async () => {
			const result = await Scry.Catalog.toughnesses();
			expect(result.length).gte(35);
			expect(Scry.error()).eq(undefined);
		});

		it("loyalties", async () => {
			const result = await Scry.Catalog.loyalties();
			expect(result.length).gte(9);
			expect(Scry.error()).eq(undefined);
		});

		it("watermarks", async () => {
			const result = await Scry.Catalog.watermarks();
			expect(result.length).gte(50);
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("Bulk Data", () => {
		let definitions: BulkDataDefinition[];

		describe("definitions", () => {
			it("all", async () => {
				definitions = await Scry.BulkData.definitions();

				expect(definitions).satisfies(Array.isArray);
				expect(definitions.length).gte(5);
				expect(Scry.error()).eq(undefined);
			});

			it("by id", async () => {
				const result = await Scry.BulkData.definitionById(definitions[0].id);

				expect(result.object).eq("bulk_data");
				expect(result.compressed_size).gte(10000);
			});

			it("by type", async () => {
				const result = await Scry.BulkData.definitionByType("all_cards");

				expect(result.object).eq("bulk_data");
				expect(result.type).eq("all_cards");
				expect(result.compressed_size).gte(10000);
			});
		});

		describe("download", () => {

			before(async () => {
				definitions = await Promise.all(definitions.map(definition => Scry.BulkData.definitionById(definition.id)));
			});

			describe("by id", () => {
				it("no matter the last download time", async () => {
					const result = await Scry.BulkData.downloadById(definitions[0].id, 0);
					expect(result).instanceOf(Stream);
				});

				it("with the last download time more recent than the last update time", async () => {
					const result = await Scry.BulkData.downloadById(definitions[0].id, new Date(definitions[0].updated_at).getTime() + 10);
					expect(result).eq(undefined);
				});
			});

			describe("by type", () => {
				it("no matter the last download time", async () => {
					const result = await Scry.BulkData.downloadByType("rulings", 0);
					expect(result).instanceOf(Stream);
				});

				it("with the last download time more recent than the last update time", async () => {
					const rulingsDefinition = await Scry.BulkData.definitionByType("rulings");
					const result = await Scry.BulkData.downloadByType("rulings", new Date(rulingsDefinition.updated_at).getTime() + 10);
					expect(result).eq(undefined);
				});
			});
		});
	});

	describe("Misc", () => {
		it("homepage links", async () => {
			const result = await Scry.Misc.homepageLinks();
			expect(result).satisfies(Array.isArray);
			expect(Scry.error()).eq(undefined);
		});
	});

	describe("on errors", () => {
		it("should return the error", async () => {
			await expect(Scry.Cards.byMultiverseId("bananas" as any)).rejected;
			expect(Scry.error()).not.eq(undefined);
		});

		it("should overwrite the previous error", async () => {
			await expect(Scry.Cards.byMultiverseId("bananas" as any)).rejected;
			expect(Scry.error()).not.eq(undefined);
			await Scry.Cards.byMtgoId(48338);
			expect(Scry.error()).eq(undefined);
		});

		it("should retry", async () => {
			const then = Date.now();
			const attempts = 3;
			const timeout = 1000;
			Scry.setRetry(attempts, timeout);
			MagicQuerier.retry.forced = true;
			await expect(Scry.Cards.byMultiverseId("bananas" as any)).rejected;
			MagicQuerier.retry.forced = false;
			expect(Scry.error()).not.eq(undefined);
			expect(MagicQuerier.lastRetries).eq(attempts);
			expect(Date.now() - then).gt(attempts * timeout);
		});

		// todo figure out tests for the "can retry" stuff that doesn't rely on enabling 404/400 errors
	});
});
