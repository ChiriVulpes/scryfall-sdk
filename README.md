# scryfall-sdk
[![npm](https://img.shields.io/npm/v/scryfall-sdk.svg?style=flat-square)](https://www.npmjs.com/package/scryfall-sdk)
[![GitHub issues](https://img.shields.io/github/issues/Yuudaari/scryfall-sdk.svg?style=flat-square)](https://github.com/Yuudaari/scryfall-sdk)
[![Travis](https://img.shields.io/travis/Yuudaari/scryfall-sdk.svg?style=flat-square)](https://travis-ci.org/Yuudaari/scryfall-sdk)

A Node.js SDK for https://scryfall.com/docs/api-overview written in Typescript.

As of [March 16th, 2018](./CHANGELOG.md), all features of https://scryfall.com/docs/api-methods are supported. If you see something in the Scryfall documentation that isn't supported, make an issue!

See [support readme](./SUPPORT.md).


## Table of Contents
- [Installation](#installation-)
- [Usage](#usage-)
- [Cards](#cards-)
  - [`Cards.byId (id: string): Promise<Card>;`](#cardsbyid-id-string-promisecard-)
  - [`Cards.byName (name: string, fuzzy = false): Promise<Card>;`](#cardsbyname-name-string-fuzzy--false-promisecard-)
  - [`Cards.bySet (code: string, collectorId: string): Promise<Card>;` ](#cardsbyset-code-string-collectorid-string-promisecard-)
  - [`Cards.byMultiverseId (id: number): Promise<Card>;` ](#cardsbymultiverseid-id-number-promisecard-)
  - [`Cards.byMtgoId (id: number): Promise<Card>;` ](#cardsbymtgoid-id-number-promisecard-)
  - [`Cards.search (query: string): MagicEmitter<Card>;` ](#cardssearch-query-string-magicemittercard-)
  - [`Cards.all (): MagicEmitter<Card>;` ](#cardsall--magicemittercard-)
  - [`Cards.random (id: number): Promise<Card>;` ](#cardsrandom-id-number-promisecard-)
  - [`Cards.autoCompleteName (name: string): Promise<string[]>;` ](#cardsautocompletename-name-string-promisestring-)
- [Sets](#sets-)
  - [`Sets.byCode (code: number): Promise<Set>;` ](#setsbycode-code-number-promiseset-)
  - [`Sets.all (): Promise<Set[]>;` ](#setsall--promiseset-)
- [Rulings](#rulings-)
  - [`Rulings.byId (id: string): Promise<Ruling[]>;` ](#rulingsbyid-id-string-promiseruling-)
  - [`Rulings.bySet (code: string, collectorId: string): Promise<Ruling[]>;` ](#rulingsbyset-code-string-collectorid-string-promiseruling-)
  - [`Rulings.byMultiverseId (id: number): Promise<Ruling[]>;` ](#rulingsbymultiverseid-id-number-promiseruling-)
  - [`Rulings.byMtgoId (id: number): Promise<Ruling[]>;` ](#rulingsbymtgoid-id-number-promiseruling-)
- [Symbology](#symbology-)
  - [`Symbology.all (): Promise<CardSymbol[]>;`](#symbologyall--promisecardsymbol-)
  - [`Symbology.parseMana (mana: string): Promise<ManaCost>;` ](#symbologyparsemana-mana-string-promisemanacost-)
- [Catalogs](#catalogs-)
  - [`Catalog.cardNames (): Promise<string[]>;` ](#catalogcardnames--promisestring-)
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
- [Misc](#misc-)
  - [`homepageLinks (): Promise<string[]>;`](#homepagelinks--promisestring-)
- [`MagicEmitter<T>`](#magicemittert-)
- [Contributing](#contributing-)
- [MIT License](#mit-license-)
  

## Installation [🡅](#table-of-contents)

```bat
npm install scryfall-sdk
```


## Usage [🡅](#table-of-contents)

In the documentation below, requiring the package is assumed.
```ts
import Scry = require("scryfall-sdk");
```



## Cards [🡅](#table-of-contents)

### `Cards.byId (id: string): Promise<Card>;` [🡅](#table-of-contents)

Gets a single card from its ID.

```ts
Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050").then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byName (name: string, fuzzy = false): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its name. Supports fuzzy searching, by 1-2 replacements/translations.

```ts
Scry.Cards.byName("Blood Scrivener").then(result => console.log(result.name)); // Blood Scrivener
Scry.Cards.byName("Bliid Scrivener", true).then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.bySet (code: string, collectorId: string): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its set and collector id.

```ts
Scry.Cards.bySet("dgm", "22").then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byMultiverseId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its multiverse id.

```ts
Scry.Cards.byMultiverseId(369030).then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byMtgoId (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a card based on its MTGO (sometimes called "Cat") id.

```ts
Scry.Cards.byMtgoId(48338).then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.search (query: string): MagicEmitter<Card>;` [🡅](#table-of-contents)

Queries for a card using the [Scryfall Search API](https://scryfall.com/docs/reference).

```ts
Scry.Cards.search("type:planeswalker").on("data", card => {
	console.log(card.name); 
}).on("end", () => {
	console.log("done");
});
```

### `Cards.all (): MagicEmitter<Card>;` [🡅](#table-of-contents)

From the [Scryfall documentation](https://scryfall.com/docs/api-methods#method-all-cards): 

Scryfall currently has 35,627 cards. This represents more than 150 MB of JSON data, beware your memory and storage limits if you are downloading the entire database.

Every card type is returned, including planar cards, schemes, Vanguard cards, tokens, emblems, and funny cards.

```ts
Scry.Cards.all().on("data", card => {
	console.log(card.name); 
}).on("end", () => {
	console.log("done");
});
```

### `Cards.random (id: number): Promise<Card>;` [🡅](#table-of-contents)

Gets a random card.

```ts
Scry.Cards.random().then(result => console.log(result.name));
```

### `Cards.autoCompleteName (name: string): Promise<string[]>;` [🡅](#table-of-contents)

From the [Scryfall documentation](https://scryfall.com/docs/api-methods#method-autocomplete):

Returns [an array] containing up to 25 full card names that could be autocompletions of the given string parameter q.

This method is designed for creating assistive UI elements that allow users to free-type card names.
The names are sorted with the nearest match first.

Spaces, punctuation, and capitalization are ignored.

If q is less than 2 characters long, or if no names match, the Catalog will contain 0 items (instead of returning any errors).

```ts
Scry.Cards.autoCompleteName("bloodsc").then((results) => {
	for (const result of results) {
		console.log(result);
		// Bloodscent
		// Blood Scrivener
		// Bloodscale Prowler
		// Burning-Tree Bloodscale
		// Ghor-Clan Bloodscale
	}
});
```


## Sets [🡅](#table-of-contents)

### `Sets.byCode (code: number): Promise<Set>;` [🡅](#table-of-contents)

Gets a set by its code.

```ts
Scry.Sets.byCode("hou").then(set => console.log(set.name)); // Hour of Devastation
```

### `Sets.all (): Promise<Set[]>;` [🡅](#table-of-contents)

Gets all sets.

```ts
Scry.Sets.all().then(result => console.log(result.length)); // 394
```



## Rulings [🡅](#table-of-contents)

### `Rulings.byId (id: string): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a single card from its ID.

```ts
Scry.Rulings.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050").then(result => console.log(result.length)); // 2
```

### `Rulings.bySet (code: string, collectorId: string): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its set and collector id.

```ts
Scry.Rulings.bySet("dgm", "22").then(result => console.log(result.length)); // 2
```

### `Rulings.byMultiverseId (id: number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its multiverse id.

```ts
Scry.Rulings.byMultiverseId(369030).then(result => console.log(result.length)); // 2
```

### `Rulings.byMtgoId (id: number): Promise<Ruling[]>;` [🡅](#table-of-contents)

Gets the rulings for a card based on its MTGO (sometimes called "Cat") id.

```ts
Scry.Rulings.byMtgoId(48338).then(result => console.log(result.length)); // 2
```


## Symbology [🡅](#table-of-contents)

### `Symbology.all (): Promise<CardSymbol[]>;` [🡅](#table-of-contents)

Gets all [card symbols](https://scryfall.com/docs/api-overview#type-card-symbol).

```ts
Scry.Symbology.all().then(result => console.log(result.length)); // 63
```

### `Symbology.parseMana (mana: string): Promise<ManaCost>;` [🡅](#table-of-contents)

From the [Scryfall documentation](https://scryfall.com/docs/api-methods#method-parse-mana): 

Parses the given mana cost parameter and returns Scryfall’s interpretation.

The server understands most community shorthand for mana costs (such as `2WW` for `{2}{W}{W}`). Symbols can also be out of order, lowercase, or have multiple colorless costs (such as `2{g}2` for `{4}{G}`).

```ts
Scry.Symbology.parseMana("7wg").then(result => console.log(result.cost)); // {7}{W}{G}
```


## Catalogs [🡅](#table-of-contents)

### `Catalog.cardNames (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.cardNames().then(result => console.log(result.length)); // 18059
```

### `Catalog.wordBank (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.wordBank().then(result => console.log(result.length)); // 12892
```

### `Catalog.creatureTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.creatureTypes().then(result => console.log(result.length)); // 242
```

### `Catalog.planeswalkerTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.planeswalkerTypes().then(result => console.log(result.length)); // 42
```

### `Catalog.landTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.landTypes().then(result => console.log(result.length)); // 13
```

### `Catalog.artifactTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.artifactTypes().then(result => console.log(result.length)); // 6
```

### `Catalog.enchantmentTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.enchantmentTypes().then(result => console.log(result.length)); // 5
```

### `Catalog.spellTypes (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.spellTypes().then(result => console.log(result.length)); // 2
```

### `Catalog.powers (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.powers().then(result => console.log(result.length)); // 33
```

### `Catalog.toughnesses (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.toughnesses().then(result => console.log(result.length)); // 35
```

### `Catalog.loyalties (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.loyalties().then(result => console.log(result.length)); // 9
```

### `Catalog.watermarks (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.Catalog.watermarks().then(result => console.log(result.length)); // 50
```


## Misc [🡅](#table-of-contents)

### `homepageLinks (): Promise<string[]>;` [🡅](#table-of-contents)

```ts
Scry.homepageLinks().then(result => console.log(result.length)); // 4
```



## `MagicEmitter<T>` [🡅](#table-of-contents)

### `MagicEmitter.on(event: "data", listener: (data: T) => any): MagicEmitter;`

Adds a listener for when data has been received. This method returns the emitter object.

### `MagicEmitter.on(event: "end", listener: () => any): MagicEmitter;`

Adds a listener for when all data has been received. This method returns the emitter object.

### `MagicEmitter.on(event: "cancel", listener: () => any): MagicEmitter;`

Adds a listener for when emitting data has been cancelled. This method returns the emitter object.

### `MagicEmitter.on(event: "error", listener: (err: Error) => any): MagicEmitter;`

Adds a listener for when the emitter errors. This method returns the emitter object.

### `MagicEmitter.cancel(): void;`

Cancels emitting data. Only emits the "cancel" event, not the "end" event.

### `MagicEmitter.waitForAll(): Promise<T[]>;`

Returns a promise for an Array of T, fulfilled after the end event is emitted.




## Contributing [🡅](#table-of-contents)

Thanks for wanting to help out! Here's the setup you'll have to do:
```bat
git clone https://github.com/Yuudaari/scryfall-sdk
git clone https://github.com/Yuudaari/tslint.json
cd scryfall-sdk
npm install
```
You can now make changes to the repository. 

To compile:
```bat
gulp ts
```
To test:
```bat
gulp mocha
```
To compile, then test:
```bat
gulp compile-test
```
To compile and then test on every file change:
```bat
gulp watch
```

If you want to make large, complex changes, make an issue before creating a PR. If I disagree with the changes you want to make, and you've already made them all in a PR, it'll feel a lot worse than being shot down in an issue, before you've written it all.

Pull Requests may be rejected if outside of the scope of the SDK, or not following the formatting rules. If tslint complains, I will complain. Please don't be mad.

If you add a new feature, please include a test for it in your PR.

Thanks again!




## MIT License [🡅](#table-of-contents)

[Copyright 2017-2018 Mackenzie McClane](./LICENSE)
