# scryfall-sdk
[![npm](https://img.shields.io/npm/v/scryfall-sdk.svg?style=flat-square)](https://www.npmjs.com/package/scryfall-sdk)
[![GitHub issues](https://img.shields.io/github/issues/ChiriVulpes/scryfall-sdk.svg?style=flat-square)](https://github.com/ChiriVulpes/scryfall-sdk)
[![Travis](https://img.shields.io/travis/com/ChiriVulpes/scryfall-sdk/master.svg?style=flat-square)](https://travis-ci.com/ChiriVulpes/scryfall-sdk)

A Node.js SDK for [Scryfall](https://scryfall.com/docs/api) written in Typescript.

As of [February 22nd, 2022](./CHANGELOG.md), all features described in the [Scryfall documentation](https://scryfall.com/docs/api) are supported. If you see something that isn't supported, make an issue!


## Installation

```bat
npm install scryfall-sdk
```


## Basic Example Usage
```ts
import * as Scry from "scryfall-sdk";

// ...in some function somewhere...
const chalice = await Scry.Cards.byName("Chalice of the Void");
console.log(chalice.name, chalice.set); // "Chalice of the Void", "a25"

const prints = await chalice.getPrints();
console.log(prints.length); // 7
```

This module supports all features of Scryfall, along with automatically paginating through results, downloading bulk data streams, etc. There's also documentation on every single part of the SDK:


## [`Full Documentation`](./DOCUMENTATION.md)
### [`Scryfall-SDK Equivalents for Scryfall Routes`](./ROUTES.md)


## Contributing

Thanks for wanting to help out! Here's the setup you'll have to do:
```bat
git clone https://github.com/ChiriVulpes/scryfall-sdk
cd scryfall-sdk
npm install
```
You can now make changes to the repository. 

To compile, then test:
```bat
gulp build
```
To compile and then test on every file change:
```bat
gulp watch
```


## MIT License

[Copyright 2017-2022 Chiri Vulpes](./LICENSE)
