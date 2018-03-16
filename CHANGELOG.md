# v1.0.0 (August 26th, 2017)
Initial release

# v1.0.1 (November 20th, 2017)
Fixed broken tests, some code cleanup

# v1.0.2 (March 16th, 2018)
Fixed an issue that caused the first page of results to be duplicated. How did I miss that for so long?

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