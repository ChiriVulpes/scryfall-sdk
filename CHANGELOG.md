# v3.2.0 (September 3rd, 2022)
- Removed "homepage links" support as the API doesn't work for them anymore.
- Fixed `.cancelAfterPage().waitForAll()` never resolving.

# v3.1.0 (March 18th, 2022)
- [`Scry.Sets.all`](#setsall--promiseset-) is now cached.
- Added [`Scry.Sets.byName`](#setsbyname-name-string-fuzzy-boolean-promiseset-) and [`Scry.setFuzzySearch`](#setfuzzysearch-search-tsearch-string-targets-t-key-keyof-t--t--undefined-void-).

# v3.0.0 (February 22nd, 2022)
## Breaking Changes
- `Scry.error()` has been removed. When queries error, it now rejects the promise they return rather than returning `undefined` or `{ data: [], not_found: [] }`

## Other Changes
- Cards and sets now come with helper methods to make consuming the data a little bit more convenient.
- You can now configure the request timeout with [`Scry.setTimeout`](./DOCUMENTATION.md#settimeout-timeout-number-void-)
- Many (not all) query functions now have cached results. You can configure the cache duration with [`Scry.setCacheDuration`](./DOCUMENTATION.md#setcacheduration-timeout-number-void), and the max objects cached with [`Scry.setCacheLimit`](./DOCUMENTATION.md#setcachelimit-timeout-number-void)
- Some [Scryfall field updates](https://github.com/ChiriVulpes/scryfall-sdk/pull/42) provided by [sili3011](https://github.com/sili3011). Thanks!

# v2.1.1 (January 5th, 2020)
- Updated axios to [fix a security vulnerability](https://github.com/axios/axios/issues/3407)

# v2.1.0 (December 22nd, 2020)
- Now compiled in strict mode, which catches a bunch of [issues for consumers of the module](https://github.com/ChiriCuddles/scryfall-sdk/issues/34)
- Fixed other misc issues caught by enabling strict mode

# v2.0.0 (June 21st, 2020)
- Removed `Cards.all` method as [Scryfall has removed the endpoint from their API](https://scryfall.com/blog/updates-to-bulk-data-and-cards-deprecation-notice-217).
- `Cards.search` now supports passing a page number in place of `SearchOptions`.
- Added better support for downloading bulk data from Scryfall, accessible via `Scry.BulkData`
  - `Misc.bulkData()` is now `BulkData.definitions()`
  - Added `BulkData.definitionById`, `BulkData.definitionByType`.
  - Added `BulkData.downloadById`, `BulkData.downloadByType`, both of which take a `lastDownload` time and, if the bulk data has been updated since the last download, return a `Stream` for the download to be consumed as you see fit.

Note: In cases where you have a *proper* reason for paginating through every single card in Scryfall's database, such as displaying a paginated list to the user of your application, you can use any query which matches all cards, such as `Cards.search("year>0")`. Please respect Scryfall and only do this if you need to, though. If you just need to download all the cards, use the new and improved bulk data support!

# v1.6.4 (May 11th, 2020)
- Added `not_found` array property to `MagicEmitter.waitForAll()` return. Added `MagicEmitter.notFound()`. Based on a [PR](https://github.com/ChiriCuddles/scryfall-sdk/pull/29) by [aSlug](https://github.com/aSlug)

# v1.6.3 (March 30th, 2020)
- Changed `set_type` on Card objects to the type of Set objects' `set_type`.

# v1.6.2 (March 29th, 2020)
- Added some missing properties to the Card object.

# v1.6.1 (March 7th, 2020)
- Thanks to a [contribution](https://github.com/ChiriCuddles/scryfall-sdk/pull/26) from [codetheweb](https://github.com/codetheweb), added [support](./DOCUMENTATION.md#bulkdata--promisebulkdata-) for the [`bulk-data` endpoint](https://scryfall.com/docs/api/bulk-data).

# v1.6.0 (March 2nd, 2020)
- Updated all data interfaces to those described in [Scryfall's Docs](https://scryfall.com/docs/api).
  - Including [two updates](https://github.com/ChiriCuddles/scryfall-sdk/pull/24) by [kasorin](https://github.com/kasorin). Thanks!
- Added support for [getting `CardIdentifier`s by their oracle and illustration IDs](./DOCUMENTATION.md#cardscollection-collection-cardidentifier-magicemittercard-).
- Normalised all "null or missing" properties to actually be `null` or missing.

# v1.5.1 (May 31st, 2019)
- Updated axios to fix a security issue.

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
- Added support for filtering [`Cards.byName()`](./DOCUMENTATION.md#cardsbyname-name-string-set-string-fuzzy--false-promisecard-) by set. [#10](https://github.com/ChiriCuddles/scryfall-sdk/pull/10) Thanks [dantolini](https://github.com/dantolini)!

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
