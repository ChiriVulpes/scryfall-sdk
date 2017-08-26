# scryfall-sdk
[![npm](https://img.shields.io/npm/v/mtgsdk-ts.svg?style=flat-square)](https://www.npmjs.com/package/mtgsdk-ts)
[![GitHub issues](https://img.shields.io/github/issues/Yuudaari/scryfall-sdk.svg?style=flat-square)](https://github.com/Yuudaari/scryfall-sdk)
[![Travis](https://img.shields.io/travis/Yuudaari/scryfall-sdk.svg?style=flat-square)](https://travis-ci.org/Yuudaari/scryfall-sdk)

A Node.js SDK for https://scryfall.com/docs/api-overview written in Typescript.

As of July 31st, 2017, all features of https://magicthegathering.io/ are supported.


## Installation

```bat
npm install scryfall-sdk
```

## Examples
In the following examples, requiring the package is assumed.
```ts
import Scry = require("scryfall-sdk");
```

### `Cards.byId (id: string): Promise<Card>;` 

Gets a single card from its ID.

```ts
Scry.Cards.byId("9ea8179a-d3c9-4cdc-a5b5-68cc73279050").then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byName (name: string, fuzzy = false): Promise<Card>;` 

Gets a card based on its name. Supports fuzzy searching, by 1-2 replacements/translations.

```ts
Scry.Cards.byName("Blood Scrivener").then(result => console.log(result.name)); // Blood Scrivener
Scry.Cards.byName("Bliid Scrivener", true).then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.bySet (code: string, collectorId: string): Promise<Card>;` 

Gets a card based on its set and collector id.

```ts
Scry.Cards.bySet("dgm", "22").then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byMultiverseId (id: number): Promise<Card>;` 

Gets a card based on its multiverse id.

```ts
Scry.Cards.byMultiverseId(369030).then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.byMtgoId (id: number): Promise<Card>;` 

Gets a card based on its MTGO (sometimes called "Cat") id.

```ts
Scry.Cards.byMtgoId(48338).then(result => console.log(result.name)); // Blood Scrivener
```

### `Cards.search (query: string): MagicEmitter<Card>;` 

Queries for a card using the [Scryfall Search API](https://scryfall.com/docs/reference).

```ts
Scry.Cards.search("type:planeswalker").on("data", card => {
	console.log(card.name); 
}).on("end", () => {
	console.log("done");
});
```

### `Cards.all (): MagicEmitter<Card>;` 

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

### `Cards.random (id: number): Promise<Card>;` 

Gets a random card.

```ts
Scry.Cards.random().then(result => console.log(result.name));
```

### `Cards.autoCompleteName (name: string): Promise<string[]>;` 

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

### `Sets.byCode (code: number): Promise<Set>;` 

Gets a set by its code.

```ts
Scry.Sets.byCode("hou").then(set => console.log(set.name)); // Hour of Devastation
```

### `Sets.all (): Promise<Set[]>;` 

Gets all sets.

```ts
Scry.Sets.all().then(result => console.log(result.length)); // 394
```

### `Symbology.all (): Promise<CardSymbol[]>;` 

Gets all [card symbols](https://scryfall.com/docs/api-overview#type-card-symbol).

```ts
Scry.Symbology.all().then(result => console.log(result.length)); // 63
```

### `Symbology.parseMana (mana: string): Promise<ManaCost>;` 

From the [Scryfall documentation](https://scryfall.com/docs/api-methods#method-parse-mana): 

Parses the given mana cost parameter and returns Scryfall’s interpretation.

The server understands most community shorthand for mana costs (such as `2WW` for `{2}{W}{W}`). Symbols can also be out of order, lowercase, or have multiple colorless costs (such as `2{g}2` for `{4}{G}`).

```ts
Scry.Symbology.parseMana("7wg").then(result => console.log(result.cost)); // {7}{W}{G}
```

### `Catalog.cardNames (): Promise<string[]>;` 

```ts
Scry.Catalog.cardNames().then(result => console.log(result.length)); // 17562
```

### `Catalog.creatureTypes (): Promise<string[]>;` 

```ts
Scry.Catalog.creatureTypes().then(result => console.log(result.length)); // 236
```

### `Catalog.landTypes (): Promise<string[]>;` 

```ts
Scry.Catalog.landTypes().then(result => console.log(result.length)); // 13
```

### `Catalog.planeswalkerTypes (): Promise<string[]>;` 

```ts
Scry.Catalog.planeswalkerTypes().then(result => console.log(result.length)); // 35
```

### `Catalog.wordBank (): Promise<string[]>;` 

```ts
Scry.Catalog.wordBank().then(result => console.log(result.length)); // 12317
```

### `Catalog.powers (): Promise<string[]>;` 

```ts
Scry.Catalog.powers().then(result => console.log(result.length)); // 26
```

### `Catalog.toughnesses (): Promise<string[]>;` 

```ts
Scry.Catalog.toughnesses().then(result => console.log(result.length)); // 28
```

### `Catalog.loyalties (): Promise<string[]>;` 

```ts
Scry.Catalog.loyalties().then(result => console.log(result.length)); // 7
```

### `Catalog.homepageLinks (): Promise<string[]>;` 

```ts
Scry.Catalog.homepageLinks().then(result => console.log(result.length)); // 4
```

## `MagicEmitter<T>`

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

### `MagicEmitter.waitForAll(): Promise<T[]>;

Returns a promise for an Array of T, fulfilled after the end event is emitted.

## Contributing

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



## MIT License

[Copyright 2017 Mackenzie McClane](./LICENSE)
