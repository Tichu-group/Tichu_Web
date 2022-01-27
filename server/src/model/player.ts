import { Booster } from './boost';
import { Card, CardCombination } from './card';

export class Player {
  private name: string = 'Unknown';
  private cardsInHand: Array<Card> = [];
  private obtainedCards: Array<Card> = [];
  private myBoosters: Array<Booster> = [];
  private out: boolean = false;
  private rank: number | undefined; // 필요한가?
  private smallTichu: boolean = false;
  private largeTichu: boolean = false;
  // bombOwner : boolean;

  initPlayer() {
    this.cardsInHand = [];
    this.obtainedCards = [];
    this.out = false;
    this.smallTichu = false;
    this.largeTichu = false;
  }

  selectTradeCards(): Array<Card> {
    // 줄 카드 세장 고르기
  }

  hasMahjong(): boolean {
    // 필요할까?
    // 짹 소유여부
  }

  playCards(): Array<Card> {
    // 선택한 카드 리턴
  }

  askLargeTichu() {}

  askSmallTichu() {}

  getName() {
    return this.name;
  }
  setName(name: string) {
    this.name = name;
  }
  getCardsInHand() {
    return this.cardsInHand;
  }
  addCardsInHand(cards: Array<Card>) {
    this.cardsInHand = [...this.cardsInHand, ...cards];
  }
  getObtainedCards() {
    return this.obtainedCards;
  }
  setObtainedCards(cards: Array<Card>) {
    this.obtainedCards = cards;
  }
  getMyBoosters() {
    return this.myBoosters;
  }
  setMyBoosters(boosters: Array<Booster>) {
    this.myBoosters = boosters;
  }
  isOut() {
    return this.out;
  }
  setOut(out: boolean) {
    this.out = out;
  }
  isSmallTichu() {
    return this.smallTichu;
  }
  isLargeTichu() {
    return this.largeTichu;
  }
}
