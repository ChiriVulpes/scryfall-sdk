/// <reference types="mocha" />

import * as chai from "chai";
import * as chaiAsPromised from "chai-as-promised";
import { Stream } from "stream";
import * as Scry from "../Scry";
import { Card, ENDPOINT_FILE_1, RESOURCE_GENERIC_CARD_BACK, SymbologyTransformer } from "../Scry";
import Cached from "../util/Cached";
import MagicQuerier from "../util/MagicQuerier";

const expect = chai.expect;
chai.use(chaiAsPromised);


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
				await expect(Scry.Cards.byName("Bliid Scrivener")).rejected.then((value: any) =>
					expect(typeof value === "object" && !!value && value.status === 404).true);
			});

			it("fuzzy", async () => {
				const card = await Scry.Cards.byName("Bliid Scrivener", true);
				expect(card?.name).eq("Blood Scrivener");
				await expect(Scry.Cards.byName("rstdrdtst", true)).rejected.then((value: any) =>
					expect(typeof value === "object" && !!value && value.status === 404).true);
			});

			it("with set filter", async () => {
				const card = await Scry.Cards.byName("Loxodon Warhammer", "MRD");
				expect(card.name).eq("Loxodon Warhammer");
				expect(card.set).eq("mrd");
			});

			it("fuzzy with set filter", async () => {
				const card = await Scry.Cards.byName("Warhammer", "MRD", true);
				expect(card?.name).eq("Loxodon Warhammer");
				expect(card?.set).eq("mrd");
			});
		});

		it("by set", async () => {
			const card = await Scry.Cards.bySet("dgm", 22);
			expect(card.name).eq("Blood Scrivener");
		});

		it("by set - string collectorNumber", async () => {
			const card = await Scry.Cards.bySet("unf", "200a");
			expect(card.name).eq("Balloon Stand");
		});

		it("by multiverse id", async () => {
			const card = await Scry.Cards.byMultiverseId(369030);
			expect(card.name).eq("Blood Scrivener");
		});

		it("by mtgo id", async () => {
			const card = await Scry.Cards.byMtgoId(48338);
			expect(card.name).eq("Blood Scrivener");
		});

		it("by arena id", async () => {
			const card = await Scry.Cards.byArenaId(67330);
			expect(card.name).eq("Yargle, Glutton of Urborg");
		});

		it("by tcg player id", async () => {
			const card = await Scry.Cards.byTcgPlayerId(1030);
			expect(card.name).eq("Ankh of Mishra");
		});

		it("by cardmarket id", async () => {
			const card = await Scry.Cards.byCardmarketId(681770);
			expect(card.name).eq("Phyrexian Fleshgorger");
		});

		it("in lang", async () => {
			const card = await Scry.Cards.bySet("dom", 1, "ja");
			expect(card.printed_name).eq("ウルザの後継、カーン");
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
			}

			expect(results.length).gte(97);
		});

		it("search waitForAll", async () => {
			const matches = await Scry.Cards.search("!smoker").waitForAll();
			expect(matches.length).eq(0);
		});

		it("search by set", async () => new Promise<void>((resolve, reject) => {
			const results: Scry.Card[] = [];
			Scry.Cards.search("s:kld", { order: "cmc" }).on("data", card => {
				try {
					if (results.length) {
						expect(card.cmc).gte(results[results.length - 1].cmc);
					}

					results.push(card);
					expect(card.set).satisfies((set: string) => set == "kld");
					resolve();
				} catch (err) {
					reject(err);
				}
			}).on("end", () => {
				try {
					expect(results.length).eq(264);
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
		}).timeout(15000);

		it("random", async () => {
			const card = await Scry.Cards.random();
			expect(card).not.eq(undefined);
		});

		it("autocomplete name", async () => {
			const cardNames = await Scry.Cards.autoCompleteName("bloodsc");
			expect(cardNames).include("Blood Scrivener");
		});

		it("should allow cancelling after a single page of results", async () => {
			const result = await Scry.Cards.search("cmc>0").cancelAfterPage().waitForAll();
			expect(result.length).eq(175);
		});

		it("should return an empty array on an invalid search", async () => {
			const result = await Scry.Cards.search("cmc>cmc").cancelAfterPage().waitForAll();
			expect(result.length).eq(0);
		});

		describe("Collection", () => {

			it("by id", async () => {
				const collection = [
					Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-6c09921c0075"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Crush Dissent");
			});

			it("by multiverse id", async () => {
				const collection = [
					Scry.CardIdentifier.byMultiverseId(462293),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Contentious Plan");
			});

			it("by mtgo id", async () => {
				const collection = [
					Scry.CardIdentifier.byMtgoId(71692),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Bond of Insight");
			});

			it("by oracle id", async () => {
				const collection = [
					Scry.CardIdentifier.byOracleId("394c6de5-7957-4a0b-a6b9-ee0c707cd022"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Forgotten Cave");
			});

			it("by illustration id", async () => {
				const collection = [
					Scry.CardIdentifier.byIllustrationId("99f43949-049e-41e2-bf4c-e22e11790012"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("GO TO JAIL");
			});

			it("by name", async () => {
				const collection = [
					Scry.CardIdentifier.byName("Blood Scrivener"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Blood Scrivener");
			});

			it("by name & set", async () => {
				const collection = [
					Scry.CardIdentifier.byName("Lightning Bolt", "prm"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Lightning Bolt");
				expect(cards[0].set).eq("prm");
			});

			it("by set", async () => {
				const collection = [
					Scry.CardIdentifier.bySet("mrd", "150"),
				];
				const cards = await Scry.Cards.collection(...collection).waitForAll();
				expect(cards.length).eq(1);
				expect(cards[0].name).eq("Chalice of the Void");
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
			});
		});

		describe("methods", () => {
			it("getSet", async () => {
				const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
				const set = await card.getSet();
				expect(set.code).eq("dgm");
			});

			it("getRulings", async () => {
				const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
				const rulings = await card.getRulings();
				expect(rulings.length).eq(2);
			});

			it("getPrints", async () => {
				let prints!: Card[];
				function validatePrints () {
					expect(prints.length).gte(7);
					for (const print of prints)
						expect(print.name).eq("Chalice of the Void");
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
				card = await Scry.Cards.byId("8c39f9b4-02b9-4d44-b8d6-4fd02ebbb0c5");
				expect(card.isLegal("standard")).false; // not legal
				expect(card.isLegal("vintage")).true; // restricted
			});

			it("isIllegal", async () => {
				let card = await Scry.Cards.byId("3462a3d0-5552-49fa-9eb7-100960c55891");
				expect(card.isIllegal("legacy")).true; // banned
				expect(card.isIllegal("penny")).true; // not legal
				expect(card.isIllegal("vintage")).false; // legal
				card = await Scry.Cards.byId("8c39f9b4-02b9-4d44-b8d6-4fd02ebbb0c5");
				expect(card.isIllegal("standard")).true; // not legal
				expect(card.isIllegal("vintage")).false; // restricted
			});

			it("getText", async () => {
				const card = await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b");
				Scry.Cards.setSymbologyTransformer(":mana-$1$2:");
				expect(card.getText()).eq(":mana-1::mana-U:, :mana-T:: Target creature gains flying until end of turn.");
			});

			it("getCost", async () => {
				const map = new Map<Card, string>();
				map.set(await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b"), ":mana-U:");
				map.set(await Scry.Cards.byId("3e7da55c-7f05-46b2-aa3c-17f8d5df46bb"), ":mana-12:");
				map.set(await Scry.Cards.byId("a3f64ad2-4041-421d-baa2-206cedcecf0e"), ":mana-1::mana-WB::mana-WB:");

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

			it("getImageURI", async () => {
				let card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
				expect(card.getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722`);
				card = await Scry.Cards.byId("c4ac7570-e74e-4081-ac53-cf41e695b7eb");
				expect(card.getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
			});

			it("getFrontImageURI", async () => {
				let card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
				expect(card.getFrontImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722`);
				card = await Scry.Cards.byId("c4ac7570-e74e-4081-ac53-cf41e695b7eb");
				expect(card.getFrontImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
			});

			it("getBackImageURI", async () => {
				let card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
				expect(card.getBackImageURI("normal")).eq(RESOURCE_GENERIC_CARD_BACK);
				card = await Scry.Cards.byId("c4ac7570-e74e-4081-ac53-cf41e695b7eb");
				expect(card.getBackImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
			});

			describe("on faces", () => {
				it("getText", async () => {
					const card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
					Scry.Cards.setSymbologyTransformer(":mana-$1$2:");
					expect(card.getText()).undefined;
					expect(card.card_faces.length).eq(2);
					expect(card.card_faces[0].getText()).eq("Counter target spell unless its controller pays :mana-3:.");
					expect(card.card_faces[1].getText()).eq("Aftermath (Cast this spell only from your graveyard. Then exile it.)\nUp to three target lands don't untap during their controller's next untap step.");
				});

				it("getCost", async () => {
					const card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
					Scry.Cards.setSymbologyTransformer(":mana-$1$2:");
					expect(card.getCost()).eq(":mana-2::mana-U: // :mana-2::mana-R:");
					expect(card.card_faces.length).eq(2);
					expect(card.card_faces[0].getCost()).eq(":mana-2::mana-U:");
					expect(card.card_faces[1].getCost()).eq(":mana-2::mana-R:");
				});

				it("getImageURI", async () => {
					let card = await Scry.Cards.byId("d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7");
					expect(card.card_faces.length).eq(2);
					expect(card.card_faces[0].getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722`);
					expect(card.card_faces[1].getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/front/d/2/d2f3035c-ca27-40f3-ad73-c4e54bb2bcd7.jpg?1549941722`);
					card = await Scry.Cards.byId("c4ac7570-e74e-4081-ac53-cf41e695b7eb");
					expect(card.card_faces.length).eq(2);
					expect(card.card_faces[0].getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/front/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
					expect(card.card_faces[1].getImageURI("normal")).eq(`${ENDPOINT_FILE_1}/normal/back/c/4/c4ac7570-e74e-4081-ac53-cf41e695b7eb.jpg?1562563598`);
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
		});

		it("by id", async () => {
			const set = await Scry.Sets.byId("65ff168b-bb94-47a5-a8f9-4ec6c213e768");
			expect(set.name).eq("Hour of Devastation");
		});

		it("by tgc player id", async () => {
			const set = await Scry.Sets.byTcgPlayerId(1934);
			expect(set.name).eq("Hour of Devastation");
		});

		it("all", async () => {
			const sets = await Scry.Sets.all();
			expect(sets.length).gte(394);
		});

		describe("byName", () => {
			it("exact", async () => {
				const result = await Scry.Sets.byName("hour of devastation");
				expect(result?.name).eq("Hour of Devastation");
				await expect(Scry.Sets.byName("hou")).rejected.then((value: any) =>
					expect(typeof value === "object" && !!value && value.status === 404).true);
			});

			it("fuzzy", async () => {
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				const fuzzysort = (require as any)("fuzzysort");
				// eslint-disable-next-line @typescript-eslint/no-unsafe-call
				Scry.setFuzzySearch((search, targets, key) => fuzzysort.go(search, targets, { key })[0]?.obj);
				const result = await Scry.Sets.byName("hou", true);
				expect(result?.name).eq("Hour of Devastation");
				await expect(Scry.Sets.byName("lskadjflaskdjfsladkfj", true)).rejected.then((value: any) =>
					expect(typeof value === "object" && !!value && value.status === 404).true);
			});
		});

		describe("methods", () => {
			it("getCards", async () => {
				const set = await Scry.Sets.byCode("hou");
				const cards = await set.getCards();
				expect(cards.length).eq(199);
			});

			it("search", async () => {
				const set = await Scry.Sets.byCode("hou");
				const cards = await set.search("type:planeswalker");
				for (const card of cards)
					expect(card.type_line)
						.satisfies((type: string) => type.startsWith("Legendary Planeswalker") || type.startsWith("Planeswalker"));

				expect(cards.length).eq(4);
			});
		});
	});

	describe("Rulings", () => {
		it("by id", async () => {
			const rulings = await Scry.Rulings.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(rulings.length).gte(2);
		});

		it("by set", async () => {
			const rulings = await Scry.Rulings.bySet("dgm", "22");
			expect(rulings.length).gte(2);
		});

		it("by multiverse id", async () => {
			const rulings = await Scry.Rulings.byMultiverseId(369030);
			expect(rulings.length).gte(2);
		});

		it("by mtgo id", async () => {
			const rulings = await Scry.Rulings.byMtgoId(48338);
			expect(rulings.length).gte(2);
		});

		it("by arena id", async () => {
			const rulings = await Scry.Rulings.byArenaId(67204);
			expect(rulings.length).gte(3);
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

		it("artist names", async () => {
			const result = await Scry.Catalog.artistNames();
			expect(result.length).gte(676);
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

		it("keyword-abilities", async () => {
			const result = await Scry.Catalog.keywordAbilities();
			expect(result.length).gte(176);
		});

		it("keyword-actions", async () => {
			const result = await Scry.Catalog.keywordActions();
			expect(result.length).gte(46);
		});

		it("ability-words", async () => {
			const result = await Scry.Catalog.abilityWords();
			expect(result.length).gte(49);
		});
	});

	describe("Bulk Data", () => {
		let definitions: Scry.BulkDataDefinition[];

		describe("definitions", () => {
			it("all", async () => {
				definitions = await Scry.BulkData.definitions();

				expect(definitions).satisfies(Array.isArray);
				expect(definitions.length).gte(5);
			});

			it("by id", async () => {
				const result = await Scry.BulkData.definitionById(definitions[0].id);

				expect(result.object).eq("bulk_data");
				expect(result.size).gte(10000);
			});

			it("by type", async () => {
				const result = await Scry.BulkData.definitionByType("all_cards");

				expect(result.object).eq("bulk_data");
				expect(result.type).eq("all_cards");
				expect(result.size).gte(10000);
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

	describe("migrations", () => {
		it("all", async () => {
			const migrations = await Scry.Migrations.all().waitForAll();
			expect(migrations.length).gte(433);
		});

		it("by id", async () => {
			const migration = await Scry.Migrations.byId("2c970867-aec5-4d55-91ac-3a117b0da4c4");
			expect(migration.old_scryfall_id).eq("d5bab733-6f20-4def-af19-534b3f9f54c4");
		});
	});

	describe("on errors", () => {
		it("should retry", async () => {
			const then = Date.now();
			const attempts = 3;
			const timeout = 1000;
			Scry.setRetry(attempts, timeout);
			MagicQuerier.retry.forced = true;
			await expect(Scry.Cards.byMultiverseId("bananas" as any)).rejected.then(value =>
				expect(typeof value === "object" && value && value.status === 404).true);
			MagicQuerier.retry.forced = false;
			expect(Date.now() - then).gt(attempts * timeout);
		});

		// todo figure out tests for the "can retry" stuff that doesn't rely on enabling 404/400 errors
	});

	describe("cache", () => {
		it("should support custom cache times and disabling caching by setting the cache time to 0", async function () {
			this.timeout(10000 * 3);
			Cached.clear();
			Cached.resetCacheDuration();
			Cached.resetLimit();
			expect(Cached.getObjectsCount()).eq(0, "Cache not cleared");
			const card1 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			const card2 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(Cached.getObjectsCount()).eq(1, "Default cache duration, wrong number of cards cached");
			expect(card1).eq(card2, "Default cache duration, card not cached");
			Scry.setCacheDuration(0);
			expect(Cached.getObjectsCount()).eq(0, "Disabled caching, cards still cached");
			const card3 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(card3).not.eq(card1, "Disabled caching, card cached");
			expect(Cached.getObjectsCount()).eq(0, "Disabled caching, card cached");
			Scry.setCacheDuration(1000 * 10);
			const card4 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			const card5 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(card4).eq(card5, "10 second cache duration, card not cached");
			expect(Cached.getObjectsCount()).eq(1, "10 second cache duration, wrong number of cards cached");
			expect(Cached.isGarbageCollectorRunning()).true;
			await new Promise(resolve => setTimeout(resolve, 1000 * 13));
			expect(Cached.isGarbageCollectorRunning()).false;
			expect(Cached.getObjectsCount()).eq(0, "10 second cache duration, cards still cached");
			const card6 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			expect(card6).not.eq(card4, "10 second cache duration, waited for expiry, card still cached");
		});

		it("should support custom cache limits and disabling caching by setting the cache limit to 0", async function () {
			this.timeout(10000 * 3);
			Cached.clear();
			Cached.resetCacheDuration();
			Cached.resetLimit();
			expect(Cached.getObjectsCount()).eq(0, "Cache not cleared");
			Scry.setCacheDuration(1000 * 10);
			const card1 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			const card2 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			const card3 = await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b");
			const card4 = await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b");
			expect(Cached.getObjectsCount()).eq(2, "Default cache amount, wrong number of cards cached");
			expect(card1).eq(card2, "Default cache amount, first card not cached");
			expect(card3).eq(card4, "Default cache amount, second card not cached");
			Scry.setCacheLimit(0);
			expect(Cached.getObjectsCount()).eq(0, "Disabled caching, cards still cached");
			Scry.setCacheLimit(1);
			const card5 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			const card6 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			const card7 = await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b");
			expect(Cached.getObjectsCount()).eq(1, "Max 1 cards cached, wrong number cached");
			const card8 = await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b");
			const card9 = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
			const card10 = await Scry.Cards.byId("41bd76f3-299d-4bc0-a603-2cc7db7dac7b");
			expect(Cached.getObjectsCount()).eq(1, "Max 1 cards cached, wrong number cached");
			expect(card5).eq(card6, "Max 1, first card not cached");
			expect(card7).eq(card8, "Max 1, second card not cached");
			expect(card9).not.eq(card6, "Max 1, first card still cached");
			expect(card10).not.eq(card8, "Max 1, second card still cached");
		});
	});

	this.afterAll(() => {
		Scry.setCacheDuration(0);
	});
});
