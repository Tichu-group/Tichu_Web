/**
import { SpecialCard } from './card';
 * Tichu cards
 * https://namu.wiki/w/%ED%8B%B0%EC%B8%84
 */

/*
export enum cardCombinations {
    SINGLE = 'single',
    PAIR = 'pair',
    TRIPLET = 'triplet',
    FULLHOUSE = 'fullhouse',
    STRAIGHT = 'straight',
    STEPS = 'steps',
    FOURBOMB = 'fourBomb',
    STRAIGHTBOMB = 'straightBomb'
};
*/

export type NormalPattern = 'jade' | 'sword' | 'pagoda' | 'star';
export type SpecialPattern = 'dog' | 'phoenix' | 'mahjong' | 'dragon';
export type Pattern = NormalPattern | SpecialPattern;

function isSpecialPattern(pattern: Pattern): boolean {
  if (
    pattern === 'dog' ||
    pattern === 'phoenix' ||
    pattern === 'mahjong' ||
    pattern === 'dragon'
  ) {
    return true;
  }
  return false;
}

export class Card {
  private type: 'normal' | 'special';
  pattern: Pattern;
  number: number; // mahjong = 1, dog & dragon = 0, phoenix = any (0 if not decided yet)
  private score: number; // 점수

  constructor(pattern: Pattern, number?: number) {
    if (isSpecialPattern(pattern)) {
      if (number) {
        throw new Error('card creation failed');
      }
      this.type = 'special';
      this.pattern = pattern;
      this.number = pattern === 'mahjong' ? 1 : 0;
      this.score = pattern === 'dragon' ? 25 : pattern === 'phoenix' ? -25 : 0;
    } else {
      if (!number || !Number.isInteger(number) || number < 2 || number > 14) {
        throw new Error('card creation failed');
      }
      this.type = 'normal';
      this.pattern = pattern;
      this.number = number;
      this.score = number === 5 ? 5 : number === 10 || number === 13 ? 10 : 0;
    }
  }

  isSpecialCard(): boolean {
    return this.type === 'special';
  }

  hasNumber(): boolean {
    return this.number !== 0;
  }

  lessThan(other: Card): boolean {
    if (this.hasNumber() && other.hasNumber()) {
      return this.number < other.number;
    } else {
      throw new Error('incomparable cards');
    }
  }

  getScore() {
    return this.score;
  }
}

export abstract class CardCombination {
  cards: Array<Card>;
  start: boolean;

  abstract lessThan(other: CardCombination): boolean;
}

export class Single extends CardCombination {
  constructor({
    cards,
    start = false
  }: {
    cards: Array<Card>;
    start?: boolean;
  }) {
    super();
    if (!Single.isSuited(cards)) {
      throw new Error('card combination matching failed');
    }
    this.cards = cards; //card array
    this.start = start; //trick의 시작 combination인지
  }

  static isSuited(cards: Array<Card>): boolean {
    return cards.length === 1;
  }

  lessThan(other: Single): boolean {
    if (this.cards[0].hasNumber() && other.cards[0].hasNumber()) {
      return this.cards[0].lessThan(other.cards[0]);
    } else if (
      this.cards[0].hasNumber() &&
      other.cards[0].pattern === 'dragon'
    ) {
      return true;
    } else if (
      this.cards[0].pattern === 'dragon' &&
      other.cards[0].hasNumber()
    ) {
      return false;
    } else {
      throw new Error('incomparable cards');
    }
  }
}

export class Pair extends CardCombination {
  constructor({
    cards,
    start = false
  }: {
    cards: Array<Card>;
    start?: boolean;
  }) {
    super();
    if (!Pair.isSuited(cards)) {
      throw new Error('card combination matching failed');
    }
    this.cards = cards;
    this.start = start;
  }

  static isSuited(cards: Array<Card>): boolean {
    if (cards.length !== 2) return false;
    if (!cards[0].hasNumber() || !cards[1].hasNumber()) return false;
    return cards[0].number === cards[1].number;
  }

  lessThan(other: Pair): boolean {
    return this.cards[0].lessThan(other.cards[0]);
  }
}

export class Triplet extends CardCombination {
  constructor({
    cards,
    start = false
  }: {
    cards: Array<Card>;
    start?: boolean;
  }) {
    super();
    if (!Triplet.isSuited(cards)) {
      throw new Error('card combination matching failed');
    }
    this.cards = cards;
    this.start = start;
  }

  static isSuited(cards: Array<Card>): boolean {
    if (cards.length !== 3) return false;
    if (!cards[0].hasNumber() || !cards[1].hasNumber() || !cards[2].hasNumber())
      return false;
    return (
      cards[0].number === cards[1].number && cards[0].number === cards[2].number
    );
  }

  lessThan(other: Triplet): boolean {
    return this.cards[0].lessThan(other.cards[0]);
  }
}

export class Straight extends CardCombination {
  constructor({
    cards,
    start = false
  }: {
    cards: Array<Card>;
    start?: boolean;
  }) {
    super();
    if (!Straight.isSuited(cards)) {
      throw new Error('card combination matching failed');
    }
    this.cards = cards;
    this.start = start;
  }

  static isSuited(cards: Array<Card>): boolean {
    if (cards.length < 5) return false;
    cards.sort((a: Card, b: Card): number => {
      return a.number - b.number;
    });
    var curNum = 0;
    for (let card of cards) {
      if (!card.hasNumber()) return false;
      if (curNum === 0) curNum = card.number;
      else {
        if (curNum + 1 !== card.number) return false;
        curNum += 1;
      }
    }
    return true;
  }

  lessThan(other: Straight): boolean {
    return this.cards[0].lessThan(other.cards[0]);
  }
}

export class Fullhouse extends CardCombination {
  constructor({
    cards,
    start = false
  }: {
    cards: Array<Card>;
    start?: boolean;
  }) {
    super();
    if (!Fullhouse.isSuited(cards)) {
      throw new Error('card combination matching failed');
    }
    this.cards = cards;
    this.start = start;
  }

  static isSuited(cards: Array<Card>): boolean {
    if (cards.length !== 5) return false;
    for (let card of cards) {
      if (!card.hasNumber()) return false;
    }
    cards.sort((a: Card, b: Card): number => {
      return a.number - b.number;
    });
    if (cards[1].number !== cards[2].number) {
      let temp: Card = cards[0];
      let temp2: Card = cards[1];
      cards[0] = cards[2];
      cards[1] = cards[3];
      cards[2] = cards[4];
      cards[3] = temp;
      cards[4] = temp2;
    }
    if (
      cards[0].number === cards[1].number &&
      cards[0].number === cards[2].number &&
      cards[3].number === cards[4].number
    ) {
      return true;
    }
    return false;
  }

  lessThan(other: Fullhouse): boolean {
    return this.cards[0].lessThan(other.cards[0]);
  }
}

export class Step extends CardCombination {
  constructor({
    cards,
    start = false
  }: {
    cards: Array<Card>;
    start?: boolean;
  }) {
    super();
    if (!Step.isSuited(cards)) {
      throw new Error('card combination matching failed');
    }
    this.cards = cards;
    this.start = start;
  }

  static isSuited(cards: Array<Card>): boolean {
    if (cards.length % 2 !== 0) return false;
    for (let card of cards) {
      if (!card.hasNumber()) return false;
    }
    cards.sort((a: Card, b: Card): number => {
      return a.number - b.number;
    });
    for (let i = 0; i < cards.length; i += 2) {
      if (i > 0 && cards[i - 1].number + 1 !== cards[i].number) {
        return false;
      }
      if (cards[i].number !== cards[i + 1].number) return false;
    }
    return true;
  }

  lessThan(other: Step): boolean {
    return this.cards[0].lessThan(other.cards[0]);
  }
}

/////////////////////////////////////////////////
// Available Combination List                  //
/////////////////////////////////////////////////

var vaildCombination = new Map<string, typeof Single>();

export function initVaildCombination(): void {
  vaildCombination.set('single', Single);
  vaildCombination.set('pair', Pair);
  vaildCombination.set('triplet', Triplet);
  vaildCombination.set('straight', Straight);
  vaildCombination.set('fullhouse', Fullhouse);
  vaildCombination.set('step', Step);
}

export function findCombination(cards: Array<Card>): {
  combinationType: string;
  combination: CardCombination;
} {
  for (let item of vaildCombination) {
    if (item[1].isSuited(cards)) {
      return { combinationType: item[0], combination: new item[1]({ cards }) };
    }
  }
  throw new Error('Invalid combination');
}
