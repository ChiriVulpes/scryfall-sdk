# scryfall-sdk
[![npm](https://img.shields.io/npm/v/scryfall-sdk.svg?style=flat-square)](https://www.npmjs.com/package/scryfall-sdk)
[![GitHub issues](https://img.shields.io/github/issues/Yuudaari/scryfall-sdk.svg?style=flat-square)](https://github.com/Yuudaari/scryfall-sdk)
[![Travis](https://img.shields.io/travis/Yuudaari/scryfall-sdk.svg?style=flat-square)](https://travis-ci.org/Yuudaari/scryfall-sdk)

A Node.js SDK for https://scryfall.com/docs/api-overview written in Typescript.

As of [February 14th, 2019](./CHANGELOG.md), all features of https://scryfall.com/docs/api-methods are supported. If you see something in the Scryfall documentation that isn't supported, make an issue! See [support readme](./SUPPORT.md).


## Installation

```bat
npm install scryfall-sdk
```


## [`Documentation`](./DOCUMENTATION.md)


## Contributing

Thanks for wanting to help out! Here's the setup you'll have to do:
```bat
git clone https://github.com/Yuudaari/scryfall-sdk
git clone https://github.com/Yuudaari/tslint.json
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

If you want to make large, complex changes, make an issue before creating a PR. If I disagree with the changes you want to make, and you've already made them all in a PR, it'll feel a lot worse than being shot down in an issue, before you've written it all.

Pull Requests may be rejected if outside of the scope of the SDK, or not following the formatting rules. If tslint complains, I will complain. Please don't be mad.

If you add a new feature, please include a test for it in your PR.

Thanks again!




## MIT License

[Copyright 2017-2019 Mackenzie McClane](./LICENSE)
