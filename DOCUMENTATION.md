## Table of Contents
- [Usage](#usage-)
  - [`Scry.setAgent (agent: string, version: string): void;`](#scrysetagent-agent-string-version-string-void-)
- [Cards](#cards-)
  - [`Cards.byId (id: string): Promise<Card>;`](#cardsbyid-id-string-promisecard-)
  - [`Cards.byName (name: string, set?: string, fuzzy = false): Promise<Card>;`](#cardsbyname-name-string-set-string-fuzzy--false-promisecard-)
  - [`Cards.bySet (setCode: string, collectorNumber: string | number, lang?: string): Promise<Card>;`](#cardsbyset-setcode-string-collectornumber-string--number-lang-string-promisecard-)
  - [`Cards.byMultiverseId (id: number): Promise<Card>;` ](#cardsbymultiverseid-id-number-promisecard-)
  - [`Cards.byMtgoId (id: number): Promise<Card>;` ](#cardsbymtgoid-id-number-promisecard-)
  - [`Cards.byArenaId (id: number): Promise<Card>;` ](#cardsbyarenaid-id-number-promisecard-)
  - [`Cards.byTcgPlayerId (id: number): Promise<Card>;` ](#cardsbytcgplayerid-id-number-promisecard-)
  - [`Cards.byCardmarketId (id: number): Promise<Card>;` ](#cardsbycardmarketid-id-number-promisecard-)
  - [`Cards.search (query: string, options?: SearchOptions | number): MagicEmitter<Card>;` ](#cardssearch-query-string-options-searchoptions--number-magicemittercard-)
  - [`Cards.random (query?: string): Promise<Card>;` ](#cardsrandom-query-string-promisecard-)
  - [`Cards.autoCompleteName (name: string): Promise<string[]>;` ](#cardsautocompletename-name-string-promisestring-)
  - [`Cards.collection (...collection: CardIdentifier[]): MagicEmitter<Card>;`](#cardscollection-collection-cardidentifier-magicemittercard-)
  - [`Cards.setSymbologyTransformer (transformer?: string | SymbologyTransformer): void`](#cardssetsymbologytransformer-transformer-string--symbologytransformer-void-)
  - [`Card`](#card-)
    - [`Card.getSet (): Promise<Set>`](#cardgetset--promiseset-)
    - [`Card.getPrints (): Promise<Card[]>`](#cardgetprints--promisecard-)
    - [`Card.getRulings (): Promise<Ruling[]>`](#cardgetrulings--promiserulings-)
    - [`Card.isLegal (format: Format): boolean`](#cardislegal-format-format-boolean-)
    - [`Card.isIllegal (format: Format): boolean`](#cardisillegal-format-format-boolean-)
    - [`Card.getText (): string | null`](#cardgettext--string--null-)
    - [`Card.getCost (): string | null`](#cardgetcost--string--null-)
- [Sets](#sets-)
  - [`Sets.byCode (code: string): Promise<Set>;` ](#setsbycode-code-string-promiseset-)
  - [`Sets.byId (id: string): Promise<Set>;` ](#setsbyid-id-string-promiseset-)
  - [`Sets.byTcgPlayerId (id: number): Promise<Set>;` ](#setsbytcgplayerid-id-number-promiseset-)
  - [`Sets.byName (name: string, fuzzy?: boolean): Promise<Set>;` ](#setsbyname-name-string-fuzzy-boolean-promiseset-)
  - [`Sets.all (): Promise<Set[]>;` ](#setsall--promiseset-)
  - [`Set`](#set-)
    - [`Set.getCards (): Promise<Card[]>`](#setgetcards--promisecard-)
    - [`Set.search (query: string, options?: SearchOptions): Promise<Card[]>`](#setsearch-query-string-options-searchoptions-promisecard-)
- [Rulings](#rulings-)
  - [`Rulings.byId (id: string): Promise<Ruling[]>;` ](#rulingsbyid-id-string-promiseruling-)
  - [`Rulings.bySet (code: string, collectorNumber: string | number): Promise<Ruling[]>;` ](#rulingsbyset-code-string-collectornumber-string--number-promiseruling-)
  - [`Rulings.byMultiverseId (id: number): Promise<Ruling[]>;` ](#rulingsbymultiverseid-id-number-promiseruling-)
  - [`Rulings.byMtgoId (id: number): Promise<Ruling[]>;` ](#rulingsbymtgoid-id-number-promiseruling-)
  - [`Rulings.byArenaId (id: number): Promise<Ruling[]>;` ](#rulingsbyarenaid-id-number-promiseruling-)
- [Symbology](#symbology-)
  - [`Symbology.all (): Promise<CardSymbol[]>;`](#symbologyall--promisecardsymbol-)
  - [`Symbology.parseMana (mana: string): Promise<ManaCost>;` ](#symbologyparsemana-mana-string-promisemanacost-)
- [Catalogs](#catalogs-)
  - [`Catalog.cardNames (): Promise<string[]>;` ](#catalogcardnames--promisestring-)
  - [`Catalog.artistNames (): Promise<string[]>;` ](#catalogartistnames--promisestring-)
  - [`Catalog.wordBank (): Promise<string[]>;`](#catalogwordbank--promisestring-)
  - [`Catalog.creatureTypes (): Promise<string[]>;`  ](#catalogcreaturetypes--promisestring-)
  - [`Catalog.planeswalkerTypes (): Promise<string[]>;` ](#catalogplaneswalkertypes--promisestring-)
  - [`Catalog.landTypes (): Promise<string[]>;`](#cataloglandtypes--promisestring-)
  - [`Catalog.artifactTypes (): Promise<string[]>;` ](#catalogartifacttypes--promisestring-)
  - [`Catalog.enchantmentTypes (): Promise<string[]>;` ](#catalogenchantmenttypes--promisestring-)
  - [`Catalog.spellTypes (): Promise<string[]>;` ](#catalogspelltypes--promisestring-)
  - [`Catalog.powers (): Promise<string[]>;` ](#catalogpowers--promisestring-)
  - [`Catalog.toughnesses (): Promise<string[]>;`](#catalogtoughnesses--promisestring-)
  - [`Catalog.loyalties (): Promise<string[]>;`  ](#catalogloyalties--promisestring-)
  - [`Catalog.watermarks (): Promise<string[]>;` ](#catalogwatermarks--promisestring-)
  - [`Catalog.keywordAbilities (): Promise<string[]>;` ](#catalogkeywordabilities--promisestring-)
  - [`Catalog.keywordActions (): Promise<string[]>;` ](#catalogkeywordactions--promisestring-)
  - [`Catalog.abilityWords (): Promise<string[]>;` ](#catalogabilitywords--promisestring-)
  - [`Catalog.supertypes (): Promise<string[]>;` ](#catalogsupertypes--promisestring-)
- [Bulk Data](#bulk-data-)
  - [`BulkData.downloadByType (type: BulkDataType): Promise<Stream | undefined>;`](#bulkdatadownloadbytype-type-bulkdatatype-promisestream--undefined-)
  - [`BulkData.downloadById (id: string): Promise<Stream | undefined>;`](#bulkdatadownloadbyid-id-string-promisestream--undefined-)
  - [`BulkData.definitions (): Promise<BulkDataDefinition[]>;`](#bulkdatadefinitions--promisebulkdatadefinition-)
  - [`BulkData.definitionByType (type: BulkDataType): Promise<BulkDataDefinition>;`](#bulkdatadefinitionbytype-type-bulkdatatype-promisebulkdatadefinition-)
  - [`BulkData.definitionById (id: string): Promise<BulkDataDefinition>;`](#bulkdatadefinitionbyid-id-string-promisebulkdatadefinition-)
- [Migrations](#migrations-)
  - [`Migrations.all (page?: number): MagicEmitter<Migration>;`](#migrationsall-page-number-magicemittermigration-)
  - [`Migrations.byId (id: string): Promise<Migration>;`](#migrationsall-id-string-promisemigration-)
- [Misc](#misc-)
  - [`setTimeout (timeout: number): void;`](#settimeout-timeout-number-void-)
  - [Caching](#caching-)
  - [`setRetry (attempts: number, timeout?: number, canRetry?: (error: SearchError) => boolean): void;`](#setretry-attempts-number-timeout-number-canretry-error-searcherror--boolean-void-)
  - [`setFuzzySearch (search: <T>(search: string, targets: T[], key: keyof T) => T | undefined): void;`](#setfuzzysearch-search-tsearch-string-targets-t-key-keyof-t--t--undefined-void-)
  - [`MagicEmitter<T, NOT_FOUND>`](#magicemittert-not_found-)



## Usage [🡅](#table-of-contents)

In the documentation below, requiring the package is assumed.
```ts
import Scry = require("scryfall-sdk");
```

### Using a node.js version older than v18?
Install the [`axios`](https://www.npmjs.com/package/axios) dependency alongside scryfall-sdk and it will automatically use it.

### `Scry.setAgent (agent: string, version: string): void;` [🡅](#table-of-contents)
> [!IMPORTANT]  
> Scryfall *requires* that all applications provide an agent, except if they are executing on clientside in a browser.
```ts
Scry.setAgent("MyAmazingAppName", "1.0.0");
```

## Cards [🡅](#table-of-contents)

### `Cards.byId (id: string): Promise<Card>;` [🡅](#table-of-contents)

Gets a single card from its ID.

```ts
const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
console.log(card.name); // Blood Scrivener
```

### `Cards.byName (name: string, set?: string, fuzzy = false): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its name. Supports fuzzy searching, by 1-2 replacements/translations.

```ts
let card = await Scry.Cards.byName("Blood Scrivener");
console.log(card.name); // Blood Scrivener

card = await Scry.Cards.byName("Bliid Scrivener", true);
console.log(card.name); // Blood Scrivener

card = await Scry.Cards.byName("Loxodon Warhammer", "MRD");
console.log(card.name, card.set); // Loxodon Warhammer, mrd

card = await Scry.Cards.byName("Warhammer", "MRD", true);
console.log(card.name, card.set); // Loxodon Warhammer, mrd
```

### `Cards.bySet (setCode: string, collectorNumber: string | number, lang?: string): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its set and collector id. You can use the optional `lang` argument to get cards in another language. See the [Scryfall Documentation for a list of all languages](https://scryfall.com/docs/api/languages).

```ts
let card = await Scry.Cards.bySet("dgm", 22);
console.log(card.name, card.printed_name); // Blood Scrivener, undefined

card = await Scry.Cards.bySet("dgm", 22, "ja");
console.log(card.name, card.printed_name); // Blood Scrivener, 血の公証人
```

### `Cards.byMultiverseId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its multiverse id.

```ts
const card = await Scry.Cards.byMultiverseId(369030);
console.log(card.name); // Blood Scrivener
```

### `Cards.byMtgoId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its MTGO (sometimes called "Cat") id.

```ts
const card = await Scry.Cards.byMtgoId(48338);
console.log(card.name); // Blood Scrivener
```

### `Cards.byArenaId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its MTG Arena id.

```ts
const card = await Scry.Cards.byArenaId(67330);
console.log(card.name); // Yargle, Glutton of Urborg
```

### `Cards.byTcgPlayerId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its TCG Player id.

```ts
const card = await Scry.Cards.byTcgPlayerId(1030);
console.log(card.name); // Ankh of Mishra
```

### `Cards.byCardmarketId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its Cardmarket id.

```ts
const card = await Scry.Cards.byCardmarketId(681770);
console.log(card.name); // Phyrexian Fleshgorger
```

### `Cards.search (query: string, options?: SearchOptions | number): MagicEmitter<Card>;` [🡅](#table-of-contents)

Queries for a card using the [Scryfall Search API](https://scryfall.com/docs/syntax).

```ts
Scry.Cards.search("type:planeswalker")
  .on("data", card => {
    console.log(card.name);
  })
  .on("end", () => {
    console.log("done");
  });
```

For information on how to provide extra options, see the [`/get/cards/search` page](https://scryfall.com/docs/api/cards/search) on Scryfall. You can also reference the `SearchOptions` interface in [`Cards.ts`](./src/api/Cards.ts)

This query returns a [`MagicEmitter`](#magicemittert-).

The page parameter is the page of results that the query will begin at. A page is 175 cards, and cannot be changed. To get only the one page you requested, you can do the following:

```ts
const cardsFromPage7 = await Scry.Cards.search("type:creature", 7).cancelAfterPage().waitForAll();
console.log(cardsFromPage7.length); // 175
```

### `Cards.random (query?: string): Promise<Card>;` [🡅](#table-of-contents)

Gets a random card.

```ts
const card = Scry.Cards.random();
console.log(card.name); // some random card from all of magic
```

Passing a query string parameter filters the pool of possible cards using the [Scryfall Search API](https://scryfall.com/docs/syntax) before selecting the random one to return.

```ts
const card = Scry.Cards.random("type:planeswalker");
console.log(card.name); // some random planeswalker card
```

### `Cards.autoCompleteName (name: string): Promise<string[]>;` [🡅](#table-of-contents)

From the [Scryfall documentation](https://scryfall.com/docs/api/cards/autocomplete):
> Returns [an array] containing up to 20 full English card names that could be autocompletions of the given string parameter.
> 
> This method is designed for creating assistive UI elements that allow users to free-type card names.
> 
> The names are sorted with the nearest match first, highly favoring results that begin with your given string.
> 
> Spaces, punctuation, and capitalization are ignored.
> 
> If the given string parameter is less than 2 characters long, or if no names match, the Catalog will contain 0 items (instead of returning any errors).

```ts
const results = await Scry.Cards.autoCompleteName("bloodsc");
results.forEach(console.log);
// Bloodscent
// Blood Scrivener
// Bloodscale Prowler
// Burning-Tree Bloodscale
// Ghor-Clan Bloodscale
```

### `Cards.collection (...collection: CardIdentifier[]): MagicEmitter<Card>;` [🡅](#table-of-contents)

Takes a list of "card identifiers", which describe a card, and returns their actual card objects.

This method is useful for decks and even entire collections. Scryfall has a limit of 75 cards, but this API will split your request into multiple API calls, allowing requests of *as many cards as you want*.

In order to assist with manual requests, this method comes with a new set of factories by the name `CardIdentifier`. These are:
- `Scry.CardIdentifier.byId(id: string): CardIdentifier;`
- `Scry.CardIdentifier.byMultiverseId(id: number): CardIdentifier;`
- `Scry.CardIdentifier.byMtgoId(id: number): CardIdentifier;`
- `Scry.CardIdentifier.byOracleId(id: string): CardIdentifier;`
- `Scry.CardIdentifier.byIllustrationId(id: string): CardIdentifier;`
- `Scry.CardIdentifier.byName(string: string, set?: string): CardIdentifier;`
- `Scry.CardIdentifier.byName(string: string, set?: string): CardIdentifier;`
- `Scry.CardIdentifier.bySet(set: string, collectorNumber: string | number): CardIdentifier;`

Example:
```ts
const collection = [
    Scry.CardIdentifier.byId("94c70f23-0ca9-425e-a53a-6c09921c0075"),
    Scry.CardIdentifier.byMultiverseId(462293),
    Scry.CardIdentifier.byMtgoId(71692),
    Scry.CardIdentifier.byOracleId("394c6de5-7957-4a0b-a6b9-ee0c707cd022"),
    Scry.CardIdentifier.byIllustrationId("99f43949-049e-41e2-bf4c-e22e11790012"),
    Scry.CardIdentifier.byName("Blood Scrivener"),
    Scry.CardIdentifier.byName("Lightning Bolt", "prm"),
    Scry.CardIdentifier.bySet("mrd", "150"),
];

const cards = await Scry.Cards.collection(...collection).waitForAll();
// every card identifier has been mapped to its real card object

for (const card of cards) {
    console.log(card.name);
}
// Crush Dissent
// Contentious Plan
// Bond of Insight
// Forgotten Cave
// GO TO JAIL
// Blood Scrivener
// Lightning Bolt
// Chalice of the Void
```

## `Cards.setSymbologyTransformer (transformer?: string | SymbologyTransformer): void;` [🡅](#table-of-contents)

Applies a symbology transformer to Card objects. Card objects contain a `mana_cost` and an `oracle_text` field, and these fields contain symbology formatted like `{U}`, `{8}`, `{B/W}`. A symbology transformer, if applied, will replace each symbol with something else.

For performance, the symbology transformer is currently only applied in [`Card.getText`](#cardgettext--string--null-) and [`Card.getCost`](#cardgetcost--string--null-)

In the following example, a symbology transformer is added which can replace symbology with Discord emoji equivalents as seen in [Manamoji for Discord](https://github.com/scryfall/manamoji-discord):

```ts
// $1 = first type or quantity, $2 = second type or empty string
Scry.Cards.setSymbologyTransformer(":mana$1$2:");
// equivalent to:
Scry.Cards.setSymbologyTransformer((type1, type2) => `:mana-${type1}${type2}:`);

// Input: {1}{W/B}{W/B}
// Output: :mana1::manaWB::manaWB:
```

## `Card` [🡅](#table-of-contents)

### `Card.getSet (): Promise<Set>;` [🡅](#table-of-contents)

Returns the set this card is associated with.

```ts
const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
const set = await card.getSet();
console.log(set.code); // dgm
```

### `Card.getPrints (): Promise<Card[]>;` [🡅](#table-of-contents)

Returns all prints of this card.

```ts
const card = await Scry.Cards.byId("1f0d2e8e-c8f2-4b31-a6ba-6283fc8740d4");
const prints = await card.getPrints();
console.log(prints.length); // 7
```

### `Card.getRulings (): Promise<Ruling[]>;` [🡅](#table-of-contents)

Returns an array of all rulings for this card.

```ts
const card = await Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
const rulings = await card.getRulings();
console.log(rulings.length); // 2
```

### `Card.isLegal (format: Format): boolean;` [🡅](#table-of-contents)

Returns whether this card is `legal` or `restricted` in the given format.

```ts
const card = await Scry.Cards.byId("3462a3d0-5552-49fa-9eb7-100960c55891");
console.log(card.isLegal("legacy")); // false
console.log(card.isLegal("penny")); // false
console.log(card.isLegal("vintage")); // true
```

### `Card.isIllegal (format: Format): boolean;` [🡅](#table-of-contents)

Returns whether this card is `not_legal` or `banned` in the given format.

```ts
const card = await Scry.Cards.byId("8c39f9b4-02b9-4d44-b8d6-4fd02ebbb0c5");
console.log(card.isIllegal("standard")); // true
console.log(card.isIllegal("vintage")); // false
```

### `Card.getText (): string | null;` [🡅](#table-of-contents)
Returns the `oracle_text` of this card, if present, with any symbology transformed by the symbology transformer set in [`Cards.setSymbologyTransformer`](#cardssetsymbologytransformer-transformer-string--symbologytransformer-void-).

This method is also present on card faces (`Card.card_faces`).

```ts
Scry.Cards.setSymbologyTransformer(":mana$1$2:");
const card = await Scry.Cards.byId("be0e3547-d8cb-4b68-a396-8c8fbc3b2b1c");
card.getText(); // :mana3::manaG:: Put a +1/+1 counter on Jungle Delver.
```

### `Card.getCost (): string | null;` [🡅](#table-of-contents)
Returns the `oracle_text` of this card, if present, with any symbology transformed by the symbology transformer set in [`Cards.setSymbologyTransformer`](#cardssetsymbologytransformer-transformer-string--symbologytransformer-void-).

This method is also present on card faces (`Card.card_faces`).

```ts
Scry.Cards.setSymbologyTransformer(":mana$1$2:");
const card = await Scry.Cards.byId("a3f64ad2-4041-421d-baa2-206cedcecf0e");
card.getCost(); // :mana1::manaWB::manaWB:
```



## Sets [🡅](#table-of-contents)

### `Sets.byCode (code: string): Promise<Set>;` [🡅](#table-of-contents)

Gets a set by its code.

```ts
const set = await Scry.Sets.byCode("hou");
console.log(set.name); // Hour of Devastation
```

### `Sets.byId (id: string): Promise<Set>;` [🡅](#table-of-contents)

Gets a set by its Scryfall ID.

```ts
const set = await Scry.Sets.byId("65ff168b-bb94-47a5-a8f9-4ec6c213e768");
console.log(set.name); // Hour of Devastation
```

### `Sets.byTcgPlayerId (id: number): Promise<Set>;` [🡅](#table-of-contents)

Gets a set by its TCG Player ID, also known as the `groupId` on [TCGPlayer's API](https://docs.tcgplayer.com/docs).

```ts
const set = await Scry.Sets.byTcgPlayerId(1934);
console.log(set.name); // Hour of Devastation
```

### `Sets.byName (name: string, fuzzy?: boolean): Promise<Set>;` [🡅](#table-of-contents)

Gets a set by its name. The fuzzy search option is provided, but is not implemented into this module and must be provided via [`Scry.setFuzzySearch`](#setfuzzysearch-search-tsearch-string-targets-t-key-keyof-t--t--undefined-void-). If fuzzy search is enabled, but a search function has not been provided, an exact match will be returned instead.

```ts
const set = await Scry.Sets.byName("hour of devastation");
console.log(set.name); // Hour of Devastation
const set = await Scry.Sets.byName("hou", true); // requires `Scry.setFuzzySearch`
console.log(set.name); // Hour of Devastation
```

### `Sets.all (): Promise<Set[]>;` [🡅](#table-of-contents)

Gets all sets.

```ts
const set = await Scry.Sets.all();
console.log(set.length); // 394
```

## `Set` [🡅](#table-of-contents)
All sets returned by the SDK have the following methods.

### `Set.getCards (): Promise<Card[]>;` [🡅](#table-of-contents)

Gets all the cards in this set.

```ts
const set = await Scry.Sets.byCode("hou");
const cards = await set.getCards();
console.log(cards.length); // 199
```

### `Set.search (query: string, options?: SearchOptions): Promise<Card[]>;` [🡅](#table-of-contents)

Gets all cards in this set that match the given query.

```ts
const set = await Scry.Sets.byCode("hou");
const cards = await set.search("type:planeswalker");
console.log(cards.length); // 4
```



## Rulings [🡅](#table-of-contents)

### `Rulings.byId (id: string): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a single card from its ID.

```ts
const rulings = await Scry.Rulings.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050");
console.log(rulings.length); // 2
```

### `Rulings.bySet (code: string, collectorNumber: string | number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its set and collector id.

```ts
const rulings = await Scry.Rulings.bySet("dgm", "22");
console.log(rulings.length); // 2
```

### `Rulings.byMultiverseId (id: number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its multiverse id.

```ts
const rulings = await Scry.Rulings.byMultiverseId(369030);
console.log(rulings.length); // 2
```

### `Rulings.byMtgoId (id: number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its MTGO (sometimes called "Cat") id.

```ts
const rulings = await Scry.Rulings.byMtgoId(48338);
console.log(rulings.length); // 2
```

### `Rulings.byArenaId (id: number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its Arena id.

```ts
const rulings = await Scry.Rulings.byArenaId(67204);
console.log(rulings.length); // 3
```



## Symbology [🡅](#table-of-contents)

### `Symbology.all (): Promise<CardSymbol[]>;` [🡅](#table-of-contents)

Gets all [card symbols](https://scryfall.com/docs/api/card-symbols).

```ts
const symbology = await Scry.Symbology.all();
console.log(symbology.length); // 63
```

### `Symbology.parseMana (mana: string): Promise<ManaCost>;` [🡅](#table-of-contents)

From the [Scryfall documentation](https://scryfall.com/docs/api/card-symbols/parse-mana):

Parses the given mana cost parameter and returns Scryfall’s interpretation.

The server understands most community shorthand for mana costs (such as `2WW` for `{2}{W}{W}`). Symbols can also be out of order, lowercase, or have multiple colorless costs (such as `2{g}2` for `{4}{G}`).

```ts
const manaCost = await Scry.Symbology.parseMana("7wg");
console.log(manaCost.cost); // {7}{W}{G}
```



## Catalogs [🡅](#table-of-contents)

### `Catalog.cardNames (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const cardNames = await Scry.Catalog.cardNames();
console.log(cardNames.length); // 18059
```

### `Catalog.artistNames (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const artistNames = await Scry.Catalog.artistNames();
console.log(artistNames.length); // 676
```

### `Catalog.wordBank (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const wordBank = await Scry.Catalog.wordBank();
console.log(wordBank.length); // 12892
```

### `Catalog.creatureTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const creatureTypes = await Scry.Catalog.creatureTypes();
console.log(creatureTypes.length); // 242
```

### `Catalog.planeswalkerTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const planeswalkerTypes = await Scry.Catalog.planeswalkerTypes();
console.log(planeswalkerTypes.length); // 42
```

### `Catalog.landTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const landTypes = await Scry.Catalog.landTypes();
console.log(landTypes.length); // 13
```

### `Catalog.artifactTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const artifactTypes = await Scry.Catalog.artifactTypes();
console.log(artifactTypes.length); // 6
```

### `Catalog.enchantmentTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const enchantmentTypes = await Scry.Catalog.enchantmentTypes();
console.log(enchantmentTypes.length); // 5
```

### `Catalog.spellTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const spellTypes = await Scry.Catalog.spellTypes();
console.log(spellTypes.length); // 2
```

### `Catalog.powers (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const powers = await Scry.Catalog.powers();
console.log(powers.length); // 33
```

### `Catalog.toughnesses (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const toughnesses = await Scry.Catalog.toughnesses();
console.log(toughnesses.length); // 35
```

### `Catalog.loyalties (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const loyalties = await Scry.Catalog.loyalties();
console.log(loyalties.length); // 9
```

### `Catalog.watermarks (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const watermarks = await Scry.Catalog.watermarks();
console.log(watermarks.length); // 50
```

### `Catalog.keywordAbilities (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const keywordAbilities = await Scry.Catalog.keywordAbilities();
console.log(keywordAbilities.length); // 176
```

### `Catalog.keywordActions (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const keywordActions = await Scry.Catalog.keywordActions();
console.log(keywordActions.length); // 46
```

### `Catalog.abilityWords (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const abilityWords = await Scry.Catalog.abilityWords();
console.log(abilityWords.length); // 49
```

### `Catalog.supertypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
const supertypes = await Scry.Catalog.supertypes();
console.log(supertypes.length); // 7
```


## Bulk Data [🡅](#table-of-contents)

### `BulkData.downloadByType (type: BulkDataType): Promise<Stream | undefined>;` [🡅](#table-of-contents)
Returns a stream for a bulk data file by its type, or `undefined` if the bulk data file hasn't been updated since the last download time.

```ts
/**
 * if you're downloading the file from scryfall and storing it on disk, usually you'll want to get the file modification date here.
 * if you want to redownload the file regardless of the last time it was updated, just put `0` here.
 */
const lastDownloadTime: number;
const download = await Scry.BulkData.downloadByType("rulings", lastDownloadTime);
console.log(download); // either a stream or undefined
```

Example with saving the file to disk, assuming the usage of a promisified fs module:
```ts
// redownload rulings.json if it's been updated since the last download
const rulingsJsonStats = await fs.stat("rulings.json");
const rulingsStream = await Scry.BulkData.downloadByType("rulings", rulingsJsonStats.mtimeMs);
if (rulingsStream)
    rulingsStream.pipe(fs.createWriteStream("rulings.json"));
```

### `BulkData.downloadById (id: string): Promise<Stream | undefined>;` [🡅](#table-of-contents)
Returns a stream for a bulk data file by its id, or `undefined` if the bulk data file hasn't been updated since the last download time.

```ts
const id = "<an id here>"; // a UUID identifying the bulk data definition
const download = await Scry.BulkData.downloadById(id, lastDownloadTime);
console.log(download); // either a stream or undefined
```

### `BulkData.definitions (): Promise<BulkDataDefinition[]>;` [🡅](#table-of-contents)
Returns the definitions of all bulk data files that Scryfall is currently providing.

```ts
const definitions = await Scry.BulkData.definitions();
console.log(definitions.length); // 5
```

### `BulkData.definitionByType (type: BulkDataType): Promise<BulkDataDefinition>;` [🡅](#table-of-contents)
Returns a single bulk data file definition by its type.

```ts
const definition = await Scry.BulkData.definitionByType("rulings");
console.log(definition.object, definition.type); // "bulk_data rulings"
```

### `BulkData.definitionById (id: string): Promise<BulkDataDefinition>;` [🡅](#table-of-contents)
Returns a single bulk data file definition by its id.

```ts
const id = "<an id here>"; // a UUID identifying the bulk data definition
const definition = await Scry.BulkData.definitionById(id);
console.log(definition.object, definition.type); // "bulk_data rulings"
```


## Migrations [🡅](#table-of-contents)
When Scryfall discovers invalid cards, they're removed and reported through the migrations API. Using scryfall-sdk, you can iterate through the recent migrations and update local data as necessary.

### `Migrations.all (page?: number): MagicEmitter<Migration>;` [🡅](#table-of-contents)

```ts
// Somewhere in your application, store the last time you checked migrations.
declare lastMigrationCheck: Date;

// To apply migrations:
for await (const migration of Scry.Migrations.all()) {
    if (new Date(migration.performed_at) < lastMigrationCheck)
        // This migration is older than the last time migrations were checked, so it can be safely ignored.
        // Since migrations are returned newest-first, the moment you've run into an old migration, you can safely exit.
        break; 
        
    // This migration is new, so it needs to be applied.
    // Here you'd update any local data — for example, stored Scryfall IDs — for the removed cards.
    // For example, say your application stores decks that your clients have created via Scryfall IDs,
    // but Scryfall has removed one or more of the cards in your clients' decks.
    // Your migration code would go through those Scryfall IDs to see if any of them match this migration,
    // and either delete them from the deck (in case of the `migration_strategy` being `delete`)
    // or replace the ID with the new ID (in case of the `migration_strategy` being `merge`)
}

// Update lastMigrationCheck with the current time.
```

### `Migrations.byId (id: string): Promise<Migration>;` [🡅](#table-of-contents)
I'm not sure when exactly this would be necessary, but in case you ever need it, you can query Scryfall for details on a specific migration by its migration ID.

```ts
const migration = await Scry.Migrations.byId("2c970867-aec5-4d55-91ac-3a117b0da4c4");
console.log(migration.migration_strategy); // "delete"
```



## Misc [🡅](#table-of-contents)

### `setRetry (attempts: number, timeout?: number, canRetry?: (error: SearchError) => boolean): void;` [🡅](#table-of-contents)

Sets the retry attempts & timeout for future API calls.

If a call errors because of a 404 or 400 (not found/bad request), then it will not retry.

Example usage:
```ts
// allow 3 attempts for each query, with a timeout of 1000 ms (1 sec) between each
Scry.setRetry(3, 1000);
// some api requests here

// allow 3 attempts, a timeout of 1000 ms, and only retry if the error code is "some_code"
Scry.setRetry(3, 1000, error => error.code == "some_code");
// some api requests here
```


### `setTimeout (timeout: number): void;` [🡅](#table-of-contents)

Sets the length of time that must pass between API calls. By default, 100ms is used. This method will prevent you from setting the timeout to a shorter time than 50ms, which is the minimum time between calls that Scryfall requests.

Example usage:
```ts
// wait 1 second between api calls
Scry.setTimeout(1000);
```


### Caching [🡅](#table-of-contents)

Many, but not all query functions cache their results. For example, trying to get a card by ID twice will return the cached copy, rather than requesting it from Scryfall again. Each query's result is cached individually, so it won't be re-downloaded until the cached value expires.

#### Notes:
- By default, scryfall-sdk uses a cache duration of 1 hour.
- The minimum supported cache time is 10 seconds. Putting a value lower than this disables caching entirely.
- **A cached value expiring does not immediately remove it.** If your application needs to conserve memory, consider lowering the cache limit with `setCacheMaxObjects`. If this is keeping your application open, use `Scry.clearCache()`

#### `setCacheDuration (timeout: number): void;` [🡅](#table-of-contents)

Example usage:
```ts
// cache for five hours
Scry.setCacheDuration(1000 * 60 * 60 * 5);
// disable caching
Scry.setCacheDuration(0);
```

#### `setCacheLimit (amount: number): void;` [🡅](#table-of-contents)

Sets the maximum number of query results that can be cached at one time. By default, the maximum is 500 objects. 
To disable caching entirely, set the amount to `0`.

Example usage:
```ts
// cache only the 10 most recent queries
Scry.setCacheLimit(10);
// disable caching
Scry.setCacheLimit(0);
```

#### `setFuzzySearch (search: <T>(search: string, targets: T[], key: keyof T) => T | undefined): void;` [🡅](#table-of-contents)

Sets a fuzzy search function for use in [`Scry.Sets.byName`](#setsbyname-name-string-fuzzy-boolean-promiseset-), and, potentially, other methods implemented in the future.

Example usage using [`fuzzysort`](https://www.npmjs.com/package/fuzzysort):
```ts
Scry.setFuzzySearch((search, targets, key) => {
  // `search` is the user-inputted string
  // `targets` are the objects to search through (in `Scry.Sets.byName` these are `Set` objects)
  // `key` is the key in the targets to search on
  return fuzzysort.go(search, targets, { key })[0]?.obj;
});
```


### `MagicEmitter<T, NOT_FOUND>` [🡅](#table-of-contents)

### `MagicEmitter.on(event: "data", listener: (data: T) => any): MagicEmitter;`

Adds a listener for when data has been received. This method returns the emitter object.

### `MagicEmitter.on(event: "not_found", listener: (notFound: NOT_FOUND) => any): MagicEmitter;`

Adds a listener for when the API returned that it was unable to find something. This method returns the emitter object.

### `MagicEmitter.on(event: "end", listener: () => any): MagicEmitter;`

Adds a listener for when all data has been received. This method returns the emitter object.

### `MagicEmitter.on(event: "cancel", listener: () => any): MagicEmitter;`

Adds a listener for when emitting data has been cancelled. This method returns the emitter object.

### `MagicEmitter.on(event: "error", listener: (err: Error) => any): MagicEmitter;`

Adds a listener for when the emitter errors. This method returns the emitter object.

### `MagicEmitter.on(event: "done", listener: () => any): MagicEmitter;`

Adds a listener for when the emitter is done: either after finishing, erroring, or being cancelled. This method returns the emitter object.

### `MagicEmitter.cancel(): void;`

Cancels emitting data. Only emits the `"cancel"` event, not the `"end"` event.

### `MagicEmitter.waitForAll(): Promise<T[] & { not_found: NOT_FOUND[] }>;`

Returns a promise for an array of `T`, fulfilled after the end event is emitted. If the API returns that it was unable to find anything, it's returned in a `not_found` array property on the array of `T`. (Note that this property is excluded when using `JSON.stringify` on the array)

### `MagicEmitter.all(): AsyncGenerator<T, void, unknown>;`

Returns an async iterator that will yield each T when it receives it.

Example usage:

```ts
for await (const card of Scry.Cards.search("type:planeswalker").all()) {
    console.log(card.name);
}
```

### `MagicEmitter.notFound(): AsyncGenerator<NOT_FOUND, void, unknown>;`

Returns an async generator that will yield each "not found" value when it receives it.

Example usage:

```ts
for await (const identifier of Scry.Cards.collection({ id: "00000000-0000-0000-0000-000000000000" }).notFound()) {
    console.log(identifier);
}
```
