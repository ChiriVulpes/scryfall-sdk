## Supported:

| Query | Result |
| --- | --- |
| [`/cards/named?{fuzzy\|exact}=<card name>`](./DOCUMENTATION.md#cardsbyname-name-string-fuzzy--false-promisecard-) | Card |
| [`/cards/:id`](./DOCUMENTATION.md#cardsbyid-id-string-promisecard-) | Card |
| [`/cards/:set/:collector_number(/:lang)`](./DOCUMENTATION.md#cardsbyset-setcode-string-collectorid-number-lang-string-promisecard-) | Card |
| [`/cards/multiverse/:multiverse_id`](./DOCUMENTATION.md#cardsbymultiverseid-id-number-promisecard-) | Card |
| [`/cards/mtgo/:mtgo_id`](./DOCUMENTATION.md#cardsbymtgoid-id-number-promisecard-) | Card |
| [`/cards/arena/:id`](./DOCUMENTATION.md#cardsbyarenaid-id-number-promisecard-) | Card |
| [`/cards/tcgplayer/:id`](./DOCUMENTATION.md#cardsbytcgplayerid-id-number-promisecard-) | Card |
| [`/cards/random`](./DOCUMENTATION.md#cardsrandom-id-number-promisecard-) | Card |
| [`/cards/search?q=<https://scryfall.com/docs/reference>`](./DOCUMENTATION.md#cardssearch-query-string-magicemittercard-) | List\<Card\> |
| [`/cards?page=:page`](./DOCUMENTATION.md#cardsall-page--1-magicemittercard-) | List\<Card\> |
| [`/cards/autocomplete?q=<autocomplete to a card name>`](./DOCUMENTATION.md#cardsautocompletename-name-string-promisestring-) | Catalog |
| [`/cards/collection`](./DOCUMENTATION.md#cardscollection-collection-cardidentifier-magicemittercard-) | List\<Card\> |
| [`/sets`](./DOCUMENTATION.md#setsall--promiseset-) | List\<Set\> |
| [`/sets/:code`](./DOCUMENTATION.md#setsbycode-code-string-promiseset-) | Set |
| [`/sets/:id`](./DOCUMENTATION.md#setsbyid-id-string-promiseset-) | Set |
| [`/sets/tcgplayer/:id`](./DOCUMENTATION.md#setsbytcgplayerid-id-number-promiseset-) | Set |
| [`/cards/multiverse/:id/rulings`](./DOCUMENTATION.md#rulingsbymultiverseid-id-number-promiseruling-) | List\<Ruling\> |
| [`/cards/mtgo/:id/rulings`](./DOCUMENTATION.md#rulingsbymtgoid-id-number-promiseruling-) | List\<Ruling\> |
| [`/cards/arena/:id/rulings`](./DOCUMENTATION.md#rulingsbyarenaid-id-number-promiseruling-) | List\<Ruling\> |
| [`/cards/:code/:number/rulings`](./DOCUMENTATION.md#rulingsbyset-code-string-collectorid-string-promiseruling-) | List\<Ruling\> |
| [`/cards/:id/rulings`](./DOCUMENTATION.md#rulingsbyid-id-string-promiseruling-) | List\<Ruling\> |
| [`/symbology`](./DOCUMENTATION.md#symbologyall--promisecardsymbol-) | List\<CardSymbol\> |
| [`/symbology/parse-mana?cost=<shorthand mana cost>`](./DOCUMENTATION.md#symbologyparsemana-mana-string-promisemanacost-) | ManaCost |
| [`/catalog/card-names`](./DOCUMENTATION.md#catalogcardnames--promisestring-) | Catalog |
| [`/catalog/word-bank`](./DOCUMENTATION.md#catalogwordbank--promisestring-) | Catalog |
| [`/catalog/creature-types`](./DOCUMENTATION.md#catalogcreaturetypes--promisestring-) | Catalog |
| [`/catalog/planeswalker-types`](./DOCUMENTATION.md#catalogplaneswalkertypes--promisestring-) | Catalog |
| [`/catalog/land-types`](./DOCUMENTATION.md#cataloglandtypes--promisestring-) | Catalog |
| [`/catalog/artifact-types`](./DOCUMENTATION.md#catalogartifacttypes--promisestring-) | Catalog |
| [`/catalog/enchantment-types`](./DOCUMENTATION.md#catalogenchantmenttypes--promisestring-) | Catalog |
| [`/catalog/spell-types`](./DOCUMENTATION.md#catalogspelltypes--promisestring-) | Catalog |
| [`/catalog/powers`](./DOCUMENTATION.md#catalogpowers--promisestring-) | Catalog |
| [`/catalog/toughnesses`](./DOCUMENTATION.md#catalogtoughnesses--promisestring-) | Catalog |
| [`/catalog/loyalties`](./DOCUMENTATION.md#catalogloyalties--promisestring-) | Catalog |
| [`/catalog/watermarks`](./DOCUMENTATION.md#catalogwatermarks--promisestring-) | Catalog |
| [`/homepage-links`](./DOCUMENTATION.md#cataloghomepagelinks--promisestring-) | List\<HomepageLink\> |


## Todo:

| Query | Result |
| --- | --- |