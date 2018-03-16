## Supported:

| Query | Result |
| --- | --- |
| [`/cards/named?{fuzzy|exact}=<card name>`](./README.md#cardsbyname-name-string-fuzzy--false-promisecard-) | Card |
| [`/cards/:id`](./README.md#cardsbyid-id-string-promisecard-) | Card |
| [`/cards/:set/:collector_number`](./README.md#cardsbyset-code-string-collectorid-string-promisecard-) | Card |
| [`/cards/multiverse/:multiverse_id`](./README.md#cardsbymultiverseid-id-number-promisecard-) | Card |
| [`/cards/mtgo/:mtgo_id`](./README.md#cardsbymtgoid-id-number-promisecard-) | Card |
| [`/cards/random`](./README.md#cardsrandom-id-number-promisecard-) | Card |
| [`/cards/search?q=<https://scryfall.com/docs/reference>`](./README.md#cardssearch-query-string-magicemittercard-) | List<Card> |
| [`/cards?page=:page`](./README.md#cardsall--magicemittercard-) | List<Card> |
| [`/cards/autocomplete?q=<autocomplete to a card name>`](./README.md#cardsautocompletename-name-string-promisestring-) | Catalog |
| [`/sets`](./README.md#setsall--promiseset-) | List<Set> |
| [`/sets/:code`](./README.md#setsbycode-code-number-promiseset-) | Set |
| [`/cards/multiverse/:id/rulings`](./README.md#rulingsbymultiverseid-id-number-promiseruling-) | List<Ruling> |
| [`/cards/mtgo/:id/rulings`](./README.md#rulingsbymtgoid-id-number-promiseruling-) | List<Ruling> |
| [`/cards/:code/:number/rulings`](./README.md#rulingsbyset-code-string-collectorid-string-promiseruling-) | List<Ruling> |
| [`/cards/:id/rulings`](./README.md#rulingsbyid-id-string-promiseruling-) | List<Ruling> |
| [`/symbology`](./README.md#symbologyall--promisecardsymbol-) | List<CardSymbol> |
| [`/symbology/parse-mana?cost=<shorthand mana cost>`](./README.md#symbologyparsemana-mana-string-promisemanacost-) | ManaCost |
| [`/catalog/card-names`](./README.md#catalogcardnames--promisestring-) | Catalog |
| [`/catalog/word-bank`](./README.md#catalogwordbank--promisestring-) | Catalog |
| [`/catalog/creature-types`](./README.md#catalogcreaturetypes--promisestring-) | Catalog |
| [`/catalog/planeswalker-types`](./README.md#catalogplaneswalkertypes--promisestring-) | Catalog |
| [`/catalog/land-types`](./README.md#cataloglandtypes--promisestring-) | Catalog |
| [`/catalog/artifact-types`](./README.md#catalogartifacttypes--promisestring-) | Catalog |
| [`/catalog/enchantment-types`](./README.md#catalogenchantmenttypes--promisestring-) | Catalog |
| [`/catalog/spell-types`](./README.md#catalogspelltypes--promisestring-) | Catalog |
| [`/catalog/powers`](./README.md#catalogpowers--promisestring-) | Catalog |
| [`/catalog/toughnesses`](./README.md#catalogtoughnesses--promisestring-) | Catalog |
| [`/catalog/loyalties`](./README.md#catalogloyalties--promisestring-) | Catalog |
| [`/catalog/watermarks`](./README.md#catalogwatermarks--promisestring-) | Catalog |
| [`/homepage-links`](./README.md#cataloghomepagelinks--promisestring-) | List<HomepageLink> |


## Todo:

| Query | Result |
| --- | --- |