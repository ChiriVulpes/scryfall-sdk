# v1.3.1 (August 10th, 2018)
- Added `error()`, allowing you to access the error returned by the last API call. (./README.md#error--searcherror--undefined-)

# v1.3.0 (July 31st, 2018)
- Added an optional `page` parameter to `Cards.all()`, defaulting to `1`. To get only the one page, you can call `cancelAfterPage()` on the resulting `MagicEmitter`.
- Added an optional `lang` parameter to [`Cards.bySet()`](./README.md#cardsbyset-code-string-collectorid-number-lang-string-promisecard-). See the [Scryfall Documentation for a list of valid languages](https://scryfall.com/docs/api/languages). 
- Added support for [`/cards/arena/:id`](./README.md#cardsbyarenaid-id-number-promisecard-)

# v1.2.1 (June 14th, 2018)
Fixed `waitForAll` throwing an uncatchable promise rejection error.

# v1.2.0 (May 30th, 2018)
Misc updates. Now using a Typescript Gulp file and Gulp@4.0

New features:
- [Search options](./README.md#cardssearch-query-string-options-searchoptions-magicemittercard-)
- [`MagicEmitter.all()`](./README.md#magicemitterall-asynciterableiteratort)
- Updated [`IScry.ts`](./src/IScry.ts) with new/updated card fields.

# v1.1.0 (March 16th, 2018)
New features:
- [Rulings](./README.md#rulings-)
  - [`Rulings.byId (id: string): Promise<Ruling[]>;` ](./README.md#rulingsbyid-id-string-promiseruling-)
  - [`Rulings.bySet (code: string, collectorId: string): Promise<Ruling[]>;` ](./README.md#rulingsbyset-code-string-collectorid-string-promiseruling-)
  - [`Rulings.byMultiverseId (id: number): Promise<Ruling[]>;` ](./README.md#rulingsbymultiverseid-id-number-promiseruling-)
  - [`Rulings.byMtgoId (id: number): Promise<Ruling[]>;` ](./README.md#rulingsbymtgoid-id-number-promiseruling-)
- [Catalogs](./README.md#catalogs-)
  - [`Catalog.artifactTypes (): Promise<string[]>;` ](./README.md#catalogartifacttypes--promisestring-)
  - [`Catalog.enchantmentTypes (): Promise<string[]>;` ](./README.md#catalogenchantmenttypes--promisestring-)
  - [`Catalog.spellTypes (): Promise<string[]>;` ](./README.md#catalogspelltypes--promisestring-)
  - [`Catalog.watermarks (): Promise<string[]>;` ](./README.md#catalogwatermarks--promisestring-)

# v1.0.2 (March 16th, 2018)
Fixed an issue that caused the first page of results to be duplicated. How did I miss that for so long?

# v1.0.1 (November 20th, 2017)
Fixed broken tests, some code cleanup

# v1.0.0 (August 26th, 2017)
Initial release