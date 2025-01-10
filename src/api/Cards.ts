import {
  Color,
  ColorOrColorless,
  RESOURCE_GENERIC_CARD_BACK,
  SYMBOL_COST,
  SYMBOL_PRINTS,
  SYMBOL_RULINGS,
  SYMBOL_SET,
  SYMBOL_TEXT,
} from "../IScry";
import Cached from "../util/Cached";
import MagicEmitter from "../util/MagicEmitter";
import MagicQuerier, {
  ApiCatalog,
  List,
  TOrArrayOfT,
} from "../util/MagicQuerier";
import { Ruling } from "./Rulings";
import { Set } from "./Sets";

export enum UniqueStrategy {
  cards,
  art,
  prints,
}

export enum Sort {
  name,
  set,
  released,
  rarity,
  color,
  usd,
  tix,
  eur,
  cmc,
  power,
  toughness,
  edhrec,
  artist,
}

export enum SortDirection {
  auto,
  asc,
  desc,
}

export interface SearchOptions {
  unique?: keyof typeof UniqueStrategy;
  order?: keyof typeof Sort;
  dir?: keyof typeof SortDirection;
  include_extras?: boolean;
  include_multilingual?: boolean;
  include_variations?: boolean;
  /**
   * The page to start on. Defaults to `1`, for first page. A page is 175 cards.
   */
  page?: number;
}

export enum Rarity {
  common,
  uncommon,
  rare,
  special,
  mythic,
  bonus,
}

export enum FrameEffect {
  legendary,
  miracle,
  nyxtouched,
  draft,
  devoid,
  tombstone,
  colorshifted,
  inverted,
  sunmoondfc,
  compasslanddfc,
  originpwdfc,
  mooneldrazidfc,
  moonreversemoondfc,
  showcase,
  extendedart,
  companion,
  etched,
  snow,
  lesson,
  shatteredglass,
  convertdfc,
  fandfc,
  upsidedowndfc,
}

export enum Game {
  paper,
  arena,
  mtgo,
}

export enum Legality {
  legal,
  not_legal,
  restricted,
  banned,
}

export enum Border {
  black,
  borderless,
  gold,
  silver,
  white,
}

export enum Layout {
  normal,
  split,
  flip,
  transform,
  modal_dfc,
  meld,
  leveler,
  saga,
  adventure,
  planar,
  scheme,
  vanguard,
  token,
  double_faced_token,
  emblem,
  augment,
  host,
  art_series,
  double_sided,
}

export enum Format {
  standard,
  future,
  historic,
  gladiator,
  pioneer,
  explorer,
  modern,
  legacy,
  pauper,
  vintage,
  penny,
  commander,
  oathbreaker,
  brawl,
  historicbrawl,
  alchemy,
  paupercommander,
  duel,
  premodern,
  oldschool,
}

export type Legalities = {
  [key in keyof typeof Format]: keyof typeof Legality;
};

export interface ImageUris {
  small: string;
  normal: string;
  large: string;
  png: string;
  art_crop: string;
  border_crop: string;
}

export interface Prices {
  usd?: string | null;
  usd_foil?: string | null;
  usd_etched?: string | null;
  eur?: string | null;
  eur_foil?: string | null;
  tix?: string | null;
}

export interface PurchaseUris {
  tcgplayer?: string | null;
  cardmarket?: string | null;
  cardhoarder?: string | null;
  [key: string]: string | null | undefined;
}

export interface RelatedUris {
  gatherer?: string | null;
  tcgplayer_decks?: string | null;
  tcgplayer_infinite_decks?: string | null;
  tcgplayer_infinite_articles?: string | null;
  edhrec?: string | null;
  mtgtop8?: string | null;
  [key: string]: string | null | undefined;
}

export enum RelatedCardComponent {
  token,
  meld_part,
  meld_result,
  combo_piece,
}

let Scry!: typeof import("../Scry");
const SYMBOL_CARD = Symbol("CARD");

export class RelatedCard {
  object: "related_card";

  id: string;
  component: keyof typeof RelatedCardComponent;
  name: string;
  type_line: string;
  uri: string;

  public static construct(card: RelatedCard) {
    Object.setPrototypeOf(card, RelatedCard.prototype);
    return card;
  }

  private [SYMBOL_CARD]?: Card;
  public async get() {
    return this[SYMBOL_CARD] ??= await Scry.Cards.byId(this.id);
  }
}

interface CardFaceMethods {
  getText(): string | null | undefined;
  getCost(): string | null | undefined;
  getImageURI(version: keyof ImageUris): string | null | undefined;
}

export interface CardFace extends CardFaceMethods {
  object: "card_face";

  artist?: string | null;
  artist_id?: string | null;
  cmc?: number | null;
  color_indicator?: Color[] | null;
  colors?: Color[] | null;
  defense?: string | null;
  flavor_text?: string | null;
  illustration_id?: string | null;
  image_uris?: ImageUris | null;
  layout?: string | null;
  loyalty?: string | null;
  mana_cost?: string | null;
  name: string;
  oracle_id?: string | null;
  oracle_text?: string | null;
  power?: string | null;
  printed_name?: string | null;
  printed_text?: string | null;
  printed_type_line?: string | null;
  toughness?: string | null;
  type_line?: string | null;
  watermark?: string | null;
}

export interface Preview {
  previewed_at?: string | null;
  source_uri?: string | null;
  source?: string | null;
}

export enum PromoType {
  tourney,
  prerelease,
  datestamped,
  planeswalkerdeck,
  buyabox,
  judgegift,
  event,
  convention,
  starterdeck,
  instore,
  setpromo,
  fnm,
  openhouse,
  league,
  draftweekend,
  gameday,
  release,
  intropack,
  giftbox,
  duels,
  wizardsplaynetwork,
  premiereshop,
  playerrewards,
  playtest,
  gateway,
  arenaleague,
}

export enum CardFinish {
  foil,
  nonfoil,
  etched,
  glossy,
}

export const CardFrame = {
  "1993": 0,
  "1997": 1,
  "2003": 2,
  "2015": 3,
  "Future": 4,
};

export enum CardStatus {
  missing,
  placeholder,
  lowres,
  highres_scan,
}

export enum CardSecurityStamp {
  oval,
  triangle,
  acorn,
  circle,
  arena,
  heart,
}

export interface CardIdentifier {
  id?: string;
  mtgo_id?: number;
  multiverse_id?: number;
  oracle_id?: string;
  illustration_id?: string;
  name?: string;
  set?: string;
  collector_number?: string;
}

export namespace CardIdentifier {
  export function byId(id: string): CardIdentifier {
    return { id };
  }

  export function byMtgoId(id: number): CardIdentifier {
    return { mtgo_id: id };
  }

  export function byMultiverseId(id: number): CardIdentifier {
    return { multiverse_id: id };
  }

  export function byOracleId(id: string): CardIdentifier {
    return { oracle_id: id };
  }

  export function byIllustrationId(id: string): CardIdentifier {
    return { illustration_id: id };
  }

  export function byName(name: string, set?: string): CardIdentifier {
    return { name, set };
  }

  export function bySet(
    set: string,
    collectorNumber: string | number,
  ): CardIdentifier {
    return { collector_number: `${collectorNumber}`, set };
  }
}

/**
 * A transformer that replaces symbols as seen in `mana_cost` and `oracle_text` in the format: `{G}`, `{8}`, `{U/W}`, etc.
 *
 * A transformer will be given a type, and a potential second type (in the case of `{T/T}`),
 * and produce a string to replace the symbol in the text.
 */
export type SymbologyTransformer = (type: string, type2?: string) => string;
let symbologyTransformer: SymbologyTransformer | string | undefined;
const REGEX_SYMBOLOGY = /{([a-z]|\d+)(?:\/([a-z]))?}/gi;

function transform(
  self: Card,
  key: keyof {
    [
      KEY in keyof Card as Card[KEY] extends string | null | undefined ? KEY
        : never
    ]: any;
  },
  map: WeakMap<SymbologyTransformer | String, string>,
) {
  const text = self[key];
  if (!text || !symbologyTransformer) {
    return text;
  }

  const transformerKey = typeof symbologyTransformer === "string"
    ? new String(symbologyTransformer)
    : symbologyTransformer;
  const value = map.get(transformerKey);
  if (value) {
    return value;
  }

  const transformed = typeof symbologyTransformer === "string"
    ? text.replace(REGEX_SYMBOLOGY, symbologyTransformer)
    : text.replace(
      REGEX_SYMBOLOGY,
      (_: string, type1: string, type2?: string) =>
        (symbologyTransformer as SymbologyTransformer)(type1, type2 ?? ""),
    );

  map.set(transformerKey, transformed);
  return transformed;
}

export type Modifier = `+${bigint}` | `-${bigint}`;

export type AttractionLight = 1 | 2 | 3 | 4 | 5 | 6;

export class Card implements CardFaceMethods {
  object: "card";

  // core fields
  arena_id?: number | null;
  id: string;
  lang: string;
  mtgo_id?: number | null;
  mtgo_foil_id?: number | null;
  multiverse_ids?: number[] | null;
  tcgplayer_id?: number | null;
  tcgplayer_etched_id?: number | null;
  cardmarket_id?: number | null;
  oracle_id: string;
  layout: keyof typeof Layout;
  prints_search_uri: string;
  rulings_uri: string;
  scryfall_uri: string;
  uri: string;

  // gameplay fields
  all_parts?: RelatedCard[] | null;
  card_faces: CardFace[];
  cmc: number;
  color_identity: Color[];
  color_indicator?: Color[] | null;
  colors?: Color[] | null;
  edhrec_rank?: number | null;
  hand_modifier?: Modifier | null;
  keywords: string[];
  legalities: Legalities;
  life_modifier?: Modifier | null;
  loyalty?: string | null;
  mana_cost?: string | null;
  name: string;
  oracle_text?: string | null;
  penny_rank?: number | null;
  power?: string | null;
  produced_mana?: ColorOrColorless[] | null;
  reserved: boolean;
  toughness?: string | null;
  type_line: string;

  // print fields
  artist?: string | null;
  artist_ids?: string[] | null;
  attraction_lights?: AttractionLight[] | null;
  booster: boolean;
  border_color: keyof typeof Border;
  card_back_id: string;
  collector_number: string;
  content_warning?: boolean | null;
  digital: boolean;
  finishes: (keyof typeof CardFinish)[];
  flavor_name?: string | null;
  flavor_text?: string | null;
  frame_effects?: (keyof typeof FrameEffect)[] | null;
  frame: keyof typeof CardFrame;
  full_art: boolean;
  games: (keyof typeof Game)[];
  highres_image: boolean;
  illustration_id?: string | null;
  image_status: keyof typeof CardStatus;
  image_uris?: ImageUris | null;
  oversized: boolean;
  prices: Prices;
  printed_name?: string | null;
  printed_text?: string | null;
  printed_type_line?: string | null;
  promo: boolean;
  /**
   * Note: This may return other values, I can't check if the possible strings have changed because the Scryfall docs
   * no longer list the possible promo types.
   */
  promo_types?: (keyof typeof PromoType)[] | null;
  purchase_uris?: PurchaseUris | null;
  rarity: keyof typeof Rarity;
  related_uris: RelatedUris;
  released_at: string;
  reprint: boolean;
  scryfall_set_uri: string;
  set_name: string;
  set_search_uri: string;
  set_type: Set["set_type"];
  set_uri: string;
  set: string;
  set_id: string;
  story_spotlight: boolean;
  textless: boolean;
  variation: boolean;
  variation_of?: string | null;
  security_stamp?: (keyof typeof CardSecurityStamp)[] | null;
  watermark?: string | null;
  preview?: Preview | null;

  public static construct(card: Card) {
    Object.setPrototypeOf(card, Card.prototype);

    if (!card.card_faces) {
      card.card_faces = [{ object: "card_face" } as CardFace];
    }

    for (const face of card.card_faces) {
      Object.setPrototypeOf(face, card);
    }

    card.all_parts?.forEach(RelatedCard.construct);

    return card;
  }

  private [SYMBOL_SET]?: Set;
  public async getSet() {
    return this[SYMBOL_SET] ??= await Scry.Sets.byId(this.set);
  }

  private [SYMBOL_RULINGS]?: Ruling[];
  public async getRulings() {
    return this[SYMBOL_RULINGS] ??= await Scry.Rulings.byId(this.id);
  }

  private [SYMBOL_PRINTS]?: Card[];
  public async getPrints() {
    if (!this[SYMBOL_PRINTS]) {
      this[SYMBOL_PRINTS] = await Scry.Cards.search(
        `oracleid:${this.oracle_id}`,
        { unique: "prints" },
      )
        .waitForAll();

      for (const card of this[SYMBOL_PRINTS]!) {
        card[SYMBOL_SET] ??= this[SYMBOL_SET];
        card[SYMBOL_RULINGS] ??= this[SYMBOL_RULINGS];
        card[SYMBOL_PRINTS] ??= this[SYMBOL_PRINTS];
      }
    }

    return this[SYMBOL_PRINTS]!;
  }

  public getTokens() {
    return !this.all_parts
      ? []
      : this.all_parts.filter((part) => part.component === "token");
  }

  /**
   * @returns `true` if this card is `legal` or `restricted` in the given format.
   */
  public isLegal(format: keyof typeof Format) {
    return this.legalities[format] === "legal" ||
      this.legalities[format] === "restricted";
  }

  /**
   * @returns `true` if this card is `not_legal` or `banned` in the given format.
   */
  public isIllegal(format: keyof typeof Format) {
    return this.legalities[format] === "not_legal" ||
      this.legalities[format] === "banned";
  }

  private [SYMBOL_TEXT]: WeakMap<SymbologyTransformer, string>;
  /**
   * @returns The `oracle_text` of this card, with symbols transformed by the transformer as set by @see {@link Cards.setSymbologyTransformer}
   */
  public getText() {
    if (!this.hasOwnProperty(SYMBOL_TEXT)) {
      this[SYMBOL_TEXT] = new WeakMap();
    }

    return transform(this, "oracle_text", this[SYMBOL_TEXT]);
  }

  private [SYMBOL_COST]: WeakMap<SymbologyTransformer, string>;
  /**
   * @returns The `mana_cost` of this card, with symbols transformed by the transformer as set by @see {@link Cards.setSymbologyTransformer}
   */
  public getCost() {
    if (!this.hasOwnProperty(SYMBOL_COST)) {
      this[SYMBOL_COST] = new WeakMap();
    }

    return transform(this, "mana_cost", this[SYMBOL_COST]);
  }

  public getImageURI(version: keyof ImageUris) {
    return this.image_uris?.[version] ??
      this.card_faces[0].image_uris?.[version];
  }

  public getFrontImageURI(version: keyof ImageUris) {
    return this.card_faces[0].image_uris?.[version] ??
      this.image_uris?.[version];
  }

  public getBackImageURI(version: keyof ImageUris) {
    return this.layout !== "transform" && this.layout !== "double_faced_token"
      ? RESOURCE_GENERIC_CARD_BACK
      : this.card_faces[1].image_uris?.[version] ?? RESOURCE_GENERIC_CARD_BACK;
  }
}

class Cards extends MagicQuerier {
  protected set Scry(scry: typeof import("../Scry")) {
    Scry = scry;
  }

  public setSymbologyTransformer(transformer?: string | SymbologyTransformer) {
    symbologyTransformer = transformer;
    return this;
  }

  public async byName(name: string, fuzzy?: boolean): Promise<Card>;
  public async byName(
    name: string,
    set?: string,
    fuzzy?: boolean,
  ): Promise<Card>;
  @Cached
  public async byName(name: string, set?: string | boolean, fuzzy = false) {
    if (typeof set === "boolean") {
      fuzzy = set;
      set = undefined;
    }

    const promise = this.queryCard("cards/named", {
      [fuzzy ? "fuzzy" : "exact"]: name,
      set,
    });

    return promise;
  }

  @Cached
  public async byId(id: string) {
    return this.queryCard(["cards", id]);
  }

  @Cached
  public async bySet(
    setCode: string | Set,
    collectorNumber: string | number,
    lang?: string,
  ) {
    const path = [
      "cards",
      typeof setCode === "string" ? setCode : setCode.code,
      collectorNumber,
    ];
    if (lang) path.push(lang);
    return this.queryCard(path);
  }

  @Cached
  public async byMultiverseId(id: number) {
    return this.queryCard(["cards/multiverse", id]);
  }

  @Cached
  public async byMtgoId(id: number) {
    return this.queryCard(["cards/mtgo", id]);
  }

  @Cached
  public async byArenaId(id: number) {
    return this.queryCard(["cards/arena", id]);
  }

  @Cached
  public async byTcgPlayerId(id: number) {
    return this.queryCard(["cards/tcgplayer", id]);
  }

  @Cached
  public async byCardmarketId(id: number) {
    return this.queryCard(["cards/cardmarket", id]);
  }

  public async random(query?: string) {
    return this.queryCard("cards/random", { q: query });
  }

  /**
   * Returns a MagicEmitter of every card in the Scryfall database that matches the given query.
   */
  public search(query: string, options?: SearchOptions): MagicEmitter<Card>;
  /**
   * Returns a MagicEmitter of every card in the Scryfall database that matches the given query.
   */
  public search(query: string, page?: number): MagicEmitter<Card>;
  /**
   * Returns a MagicEmitter of every card in the Scryfall database that matches the given query.
   */
  public search(
    query: string,
    options?: SearchOptions | number,
  ): MagicEmitter<Card>;
  public search(query: string, options?: SearchOptions | number) {
    const emitter = new MagicEmitter<Card>()
      .map(Card.construct);

    this.queryPage(emitter, "cards/search", {
      q: query,
      ...typeof options === "number" ? { page: options } : options,
    })
      .catch((err) => emitter.emit("error", err));

    return emitter;
  }

  @Cached
  public async autoCompleteName(name: string) {
    return (await this.query<ApiCatalog>("cards/autocomplete", { q: name }))
      .data;
  }

  public collection(...identifiers: CardIdentifier[]) {
    const emitter = new MagicEmitter<Card, CardIdentifier>()
      .map(Card.construct);

    void this.processCollection(emitter, identifiers);

    return emitter;
  }

  private async queryCard(
    apiPath: TOrArrayOfT<string | number | undefined>,
    query?: { [key: string]: any },
    post?: any,
  ): Promise<Card> {
    return await this.query<Card>(apiPath, query, post)
      .then(Card.construct);
  }

  private async processCollection(
    emitter: MagicEmitter<Card, CardIdentifier>,
    identifiers: CardIdentifier[],
  ) {
    for (let i = 0; i < identifiers.length; i += 75) {
      if (emitter.cancelled) break;

      // the api only supports a max collection size of 75, so we take the list of identifiers (any length)
      // and split it into 75 card-max requests
      const collectionSection = { identifiers: identifiers.slice(i, i + 75) };

      const { data, not_found } = await this.query<List<Card, CardIdentifier>>(
        "cards/collection",
        undefined,
        collectionSection,
      );

      emitter.emitAll("not_found", ...not_found ?? []);

      if (!emitter.cancelled) {
        emitter.emitAll("data", ...data);
      }

      if (emitter.willCancelAfterPage) {
        emitter.cancel();
      }
    }

    if (!emitter.cancelled) {
      emitter.emit("end");
    }

    emitter.emit("done");
  }
}

export default new Cards();
