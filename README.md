# mtg-sdk-typescript
[![npm](https://img.shields.io/npm/v/mtgsdk-ts.svg?style=flat-square)](https://www.npmjs.com/package/mtgsdk-ts)
[![GitHub issues](https://img.shields.io/github/issues/Yuudaari/mtg-sdk-typescript.svg?style=flat-square)](https://github.com/Yuudaari/mtg-sdk-typescript)
[![Travis](https://img.shields.io/travis/Yuudaari/mtg-sdk-typescript.svg?style=flat-square)](https://travis-ci.org/Yuudaari/mtg-sdk-typescript)

An sdk for https://magicthegathering.io/ written in Typescript. Works for JavaScript and TypeScript development.

As of July 31st, 2017, all features of https://magicthegathering.io/ are supported.


## Installation

```bat
npm install mtgsdk-ts
```

## Examples
In the following examples, requiring the package is assumed.
```ts
import Magic = require("mtgsdk-ts");
```

### `Cards.find (id: string): Promise<Card>;` 

Gets a single card from its ID.

```ts
Magic.Cards.find("08618f8d5ebdc0c4d381ad11f0563dfebb21f4ee").then(result => console.log(result.name)); // Blood Scrivener
```


### `Cards.where (filter: CardFilter): Promise<Card[]>;`

Gets multiple cards. Truncated to 100 cards. If more than 100 cards are needed, see `Cards.all` below.

In the following example, the cards are filtered by name. To see all options, visit [the API documentation](https://docs.magicthegathering.io/#api_v1cards_list).
```ts
Magic.Cards.where({name: "Nicol"}).then(results => {
	for (const card of results) console.log(card.name);
});
```


### `Cards.all (filter: CardFilter): MagicEmitter<Card>;`

Gets all cards. You can set the number of cards to include in each "page" of results, and the page to start on (the first page is 1, not 0). [See here for more information about the MagicEmitter](#magicemittert).

In the following example, the cards are filtered by type. To see all options, visit [the API documentation](https://docs.magicthegathering.io/#api_v1cards_list).
```ts
Magic.Cards.all({type: "Planeswalker", page: 2, pageSize: 30}).on("data", card => {
	console.log(card.name); 
}).on("end", () => {
	console.log("done");
});
```

### `Sets.find (id: string): Promise<Set>;` 

Gets a single set from its ID.

```ts
Magic.Sets.find("HOU").then(result => console.log(result.name)); // Hour of Devastation
```


### `Sets.where (block: SetFilter): Promise<Set[]>;`

Gets multiple sets.

In the following example, the sets are filtered by block. To see all options, visit [the API documentation](https://docs.magicthegathering.io/#api_v1sets_list).
```ts
Magic.Sets.where({block: "Kaladesh"}).then(results => {
	for (const set of results) console.log(set.name);
});
```


### `Sets.all (filter: SetFilter): MagicEmitter<Set>;`

Gets all sets. You can set the number of sets to include in each "page" of results, and the page to start on (the first page is 1, not 0). [See here for more information about the MagicEmitter](#magicemittert).

In the following example, the sets are not filtered, but can be. To see all options, visit [the API documentation](https://docs.magicthegathering.io/#api_v1sets_list).
```ts
Magic.Sets.all({page: 5, pageSize: 30}).on("data", set => {
	console.log(set.name);
}).on("end", () => {
	console.log("done");
});
```

### `Sets.generateBooster (id: string): Promise<Card[]>;` 

Generates a booster from the cards of a set.

```ts
Magic.Sets.generateBooster("HOU").then(result => {
	for (const card of result) console.log(card.name);
});
```


### `Types.all (): Promise<string[]>;` 

Gets a list of all Types that have been printed.

```ts
Magic.Types.all().then(result => {
	for (const type of result) console.log(type);
});
```

### `Subtypes.all (): Promise<string[]>;` 

Gets a list of all Subtypes that have been printed.

```ts
Magic.Subtypes.all().then(result => {
	for (const type of result) console.log(type);
});
```

### `Supertypes.all (): Promise<string[]>;` 

Gets a list of all Supertypes that have been printed.

```ts
Magic.Supertypes.all().then(result => {
	for (const type of result) console.log(type);
});
```

### `Formats.all (): Promise<string[]>;` 

Gets a list of all official Formats.

```ts
Magic.Formats.all().then(result => {
	for (const format of result) console.log(format);
});
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


## Contributing

Thanks for wanting to help out! Here's the setup you'll have to do:
```bat
git clone https://github.com/Yuudaari/mtg-sdk-typescript
git clone https://github.com/Yuudaari/tslint.json
cd mtg-sdk-typescript
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
