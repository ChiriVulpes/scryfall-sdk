# scryfall-sdk
[![npm](https://img.shields.io/npm/v/scryfall-sdk.svg?style=flat-square)](https://www.npmjs.com/package/scryfall-sdk)
[![GitHub issues](https://img.shields.io/github/issues/ChiriVulpes/scryfall-sdk.svg?style=flat-square)](https://github.com/ChiriVulpes/scryfall-sdk)
[![Travis](https://img.shields.io/travis/com/ChiriVulpes/scryfall-sdk/master.svg?style=flat-square)](https://travis-ci.com/ChiriVulpes/scryfall-sdk)

A Node.js SDK for [Scryfall](https://scryfall.com/docs/api) written in Typescript.

As of [August 8th, 2024](./CHANGELOG.md), all features described in the [Scryfall documentation](https://scryfall.com/docs/api) should be supported. If you see something that isn't, make an issue!


## Installation

```bat
npm install scryfall-sdk
```

### Using a node.js version older than v18?
Install the [`axios`](https://www.npmjs.com/package/axios) dependency alongside scryfall-sdk and it will automatically use it.


## Basic Example Usage
```ts
import * as Scry from "scryfall-sdk";

// ...in some function somewhere...
const chalice = await Scry.Cards.byName("Chalice of the Void");
console.log(chalice.name, chalice.set); // "Chalice of the Void", "a25"

const prints = await chalice.getPrints();
console.log(prints.length); // 7
```

> [!IMPORTANT]  
> Scryfall [requires](https://scryfall.com/docs/api#required-headers) that all applications provide an agent, except if they are executing from web browser JavaScript.
>
> If this is true for your application, you must set your agent before making any requests:
> ```ts
> Scry.setAgent("MyAmazingAppName", "1.0.0");
> ```

## [Full Documentation](./DOCUMENTATION.md)
scryfall-sdk supports all features of Scryfall, along with automatically paginating through results, downloading bulk data streams, and more. See the [documentation](./DOCUMENTATION.md) for information on everything you can do.

Know the endpoint you want, but not sure what it looks like in scryfall-sdk? Well, you're in luck: [Scryfall-SDK Equivalents for Scryfall Routes](./ROUTES.md)


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

[Copyright 2017-2024 Chiri Vulpes](./LICENSE)
