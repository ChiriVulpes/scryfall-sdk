# v1.5.0 (March 23rd, 2019)
- Thanks to a contribution from [somkun](https://github.com/somkun), the Scryfall SDK now uses [Axios](https://www.npmjs.com/package/axios) instead of [Request Promise](https://www.npmjs.com/package/request-promise)
- Added [`Scry.setRetry`](./DOCUMENTATION.md#setretry-attempts-number-timeout-number-canretry-error-searcherror--boolean-void-)
- There was heavy refactoring in this update. You may notice some d.ts changes, most of that is updating interfaces as per the [Scryfall documentation](https://scryfall.com/docs/api) and not exporting some interfaces/enums.

# v1.4.0 (February 14th, 2019)
- Added [`Cards.collection(...identifiers: CardIdentifier[])`](./DOCUMENTATION.md#cardscollection-collection-cardidentifier-magicemittercard-)
- Added [`Cards.byTcgPlayerId(id: number)`](./DOCUMENTATION.md#cardsbytcgplayerid-id-number-promisecard-)
- Added [`Sets.byId(id: string)`](./DOCUMENTATION.md#setsbyid-id-string-promiseset-)
- Added [`Sets.byTcgPlayerId(id: number)`](./DOCUMENTATION.md#setsbytcgplayerid-id-number-promiseset-)
- Added [`Rulings.byArenaId(id: number)`](./DOCUMENTATION.md#rulingsbyarenaid-id-number-promiseruling-)
- Added [`Catalog.artistNames()`](./DOCUMENTATION.md#catalogartistnames--promisestring-)
- Added `"done"` event to the `MagicEmitter`, which is fired when the emitter ends, errors, or is cancelled.
- Fixed a potential security issue (low severity; Scryfall would have to intentionally have served corrupted data or an attacker would have to intercept the data from Scryfall).

# v1.3.3 (November 8th, 2018)
- Fixed `RelatedUris` and `PurchaseUris` throwing errors in some configurations.

# v1.3.2 (September 16th, 2018)
- Added support for filtering [`Cards.byName()`](./DOCUMENTATION.md#cardsbyname-name-string-set-string-fuzzy--false-promisecard-) by set. [#10](https://github.com/Yuudaari/scryfall-sdk/pull/10) Thanks [dantolini](https://github.com/dantolini)!

# v1.3.1 (August 10th, 2018)
- [Added `error()`, allowing you to access the error returned by the last API call.](./DOCUMENTATION.md#error--searcherror--undefined-)

# v1.3.0 (July 31st, 2018)
- Added an optional `page` parameter to `Cards.all()`, defaulting to `1`. To get only the one page, you can call `cancelAfterPage()` on the resulting `MagicEmitter`.
- Added an optional `lang` parameter to [`Cards.bySet()`](./DOCUMENTATION.md#cardsbyset-setcode-string-collectorid-number-lang-string-promisecard-). See the [Scryfall Documentation for a list of valid languages](https://scryfall.com/docs/api/languages). 
- Added support for [`/cards/arena/:id`](./DOCUMENTATION.md#cardsbyarenaid-id-number-promisecard-)

# v1.2.1 (June 14th, 2018)
Fixed `waitForAll` throwing an uncatchable promise rejection error.

# v1.2.0 (May 30th, 2018)
Misc updates. Now using a Typescript Gulp file and Gulp@4.0

New features:
- [Search options](./DOCUMENTATION.md#cardssearch-query-string-options-searchoptions-magicemittercard-)
- [`MagicEmitter.all()`](./DOCUMENTATION.md#magicemitterall-asynciterableiteratort)
- Updated [`IScry.ts`](./src/IScry.ts) with new/updated card fields.

# v1.1.0 (March 16th, 2018)
New features:
- [Rulings](./DOCUMENTATION.md#rulings-)
  - [`Rulings.byId (id: string): Promise<Ruling[]>;` ](./DOCUMENTATION.md#rulingsbyid-id-string-promiseruling-)
  - [`Rulings.bySet (code: string, collectorId: string): Promise<Ruling[]>;` ](./DOCUMENTATION.md#rulingsbyset-code-string-collectorid-string-promiseruling-)
  - [`Rulings.byMultiverseId (id: number): Promise<Ruling[]>;` ](./DOCUMENTATION.md#rulingsbymultiverseid-id-number-promiseruling-)
  - [`Rulings.byMtgoId (id: number): Promise<Ruling[]>;` ](./DOCUMENTATION.md#rulingsbymtgoid-id-number-promiseruling-)
- [Catalogs](./DOCUMENTATION.md#catalogs-)
  - [`Catalog.artifactTypes (): Promise<string[]>;` ](./DOCUMENTATION.md#catalogartifacttypes--promisestring-)
  - [`Catalog.enchantmentTypes (): Promise<string[]>;` ](./DOCUMENTATION.md#catalogenchantmenttypes--promisestring-)
  - [`Catalog.spellTypes (): Promise<string[]>;` ](./DOCUMENTATION.md#catalogspelltypes--promisestring-)
  - [`Catalog.watermarks (): Promise<string[]>;` ](./DOCUMENTATION.md#catalogwatermarks--promisestring-)

# v1.0.2 (March 16th, 2018)
Fixed an issue that caused the first page of results to be duplicated. How did I miss that for so long?

# v1.0.1 (November 20th, 2017)
Fixed broken tests, some code cleanup

# v1.0.0 (August 26th, 2017)
Initial release
