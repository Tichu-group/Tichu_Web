import { Booster } from './boost';
import { Card, CardCombination, findCombination } from './card';
import { Player } from './player';

export class Game {
  players: Array<Player> = [];
  winningScore: number = 0;
  winner: Array<number>;
  team02Score: number = 0;
  team13Score: number = 0;
  boostersInField: Array<Booster> = [];
  usedBoosters: Array<Booster> = [];
  boosterDeck: Array<Booster>;

  activeBooster: Array<Booster> = [];
  call: number;
  deck: Array<Card>;
  startPlayer: number;
  rank: Array<number> = [];

  shuffleCards() {
    // 카드 셔플
    let cards: Array<Card> = [];
    // add special cards
    const dog = new Card('dog');
    const phoenix = new Card('phoenix');
    const mahjong = new Card('mahjong');
    const dragon = new Card('dragon');
    cards.push(dog, phoenix, mahjong, dragon);
    // add number cards
    for (let i = 2; i <= 14; i++) {
      cards.push(new Card('jade', i));
      cards.push(new Card('sword', i));
      cards.push(new Card('pagoda', i));
      cards.push(new Card('star', i));
    }
    // shuffle
    let currentIndex = cards.length;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
      // Pick a remaining element...
      let randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [cards[currentIndex], cards[randomIndex]] = [
        cards[randomIndex],
        cards[currentIndex]
      ];
    }

    this.deck = cards;
  }

  handCards(cardsNum: number) {
    // this.deck에서 cardsNum에 따라 카드 배분
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < cardsNum; j++) {
        const card = this.deck.pop();
        if (card !== undefined) {
          this.players[i].addCardsInHand([card]);
          if (card.pattern === 'mahjong') {
            this.startPlayer = i;
          }
        }
      }
    }
  }

  tradeCards() {
    //선택된 카드 나눠주기
    for (let i = 0; i < 4; i++) {
      const cards = this.players[i].selectTradeCards();
      for (let j = 1; j < 4; j++) {
        this.players[(i + j) % 4].addCardsInHand([cards[j]]);
      }
    }
  }

  drawBoosters() {
    if (this.boostersInField.length === 0) {
      for (let i = 0; i < 4; i++) {
        let booster = this.boosterDeck.pop();
        if (booster !== undefined) {
          this.boostersInField.push(booster);
        }
      }
    }
  }

  findNextPlayer(currentPlayer: number): number {
    let nextPlayer = currentPlayer;
    for (let i = 1; i < 4; i++) {
      if (!this.players[(nextPlayer + i) % 4].isOut()) {
        nextPlayer = (nextPlayer + i) % 4;
        break;
      }
    }
    return nextPlayer;
  }

  // TODO : call 있을 때 가능한 조합 있으면 내도록 강제
  // return topPlayer
  runTrick(): number {
    let cardsInField: Array<CardCombination> = [];
    let currentPlayer = this.startPlayer;
    let topPlayer = -1;
    let combinationOfTrick = '';
    while (currentPlayer != topPlayer) {
      // 이번 trick에서 나간 player일 경우
      // 아직 out 처리를 안했기 때문에 다음 player로 바로 패스
      if (this.players[currentPlayer].getCardsInHand().length === 0) {
        currentPlayer = this.findNextPlayer(currentPlayer);
        continue;
      }
      // start trick
      if (topPlayer === -1) {
        const cards = this.players[currentPlayer].playCards();
        const { combinationType, combination } = findCombination(cards);
        combinationOfTrick = combinationType;
        topPlayer = currentPlayer;
        combination.start = true;
        cardsInField.push(combination);
      } else {
        let available = false;
        while (!available) {
          const cards = this.players[currentPlayer].playCards();
          if (cards.length !== 0) {
            const { combinationType, combination } = findCombination(cards);
            if (combinationOfTrick !== combinationType) {
              continue;
            }
            if (!cardsInField[-1].lessThan(combination)) {
              continue;
            }
            topPlayer = currentPlayer;
            cardsInField.push(combination);
            available = true;
          } else {
            // pass하면 빈 array
            available = true;
          }
        }
      }
      // currentPlayer out 여부 (등수)
      if (this.players[currentPlayer].getCardsInHand().length === 0) {
        this.rank.push(currentPlayer);
        // currentPlayer를 out으로 처리하면 trick while문이
        // 무한루프를 돌 수도 있기 때문에 나중에 한번에 처리
      }
      currentPlayer = this.findNextPlayer(currentPlayer);
    }
    // players out 여부
    for (let i = 0; i < 4; i++) {
      if (
        !this.players[i].isOut() &&
        this.players[i].getCardsInHand().length === 0
      ) {
        this.players[i].setOut(true);
      }
    }
    // topPlayer에게 cardsInField를 obtainedCards에 추가
    for (let i = 0; i < cardsInField.length; i++) {
      this.players[topPlayer].setObtainedCards([
        ...this.players[topPlayer].getObtainedCards(),
        ...cardsInField[i].cards
      ]);
    }

    return topPlayer;
  }

  changeStartPlayer(topPlayer: number) {
    if (this.players[topPlayer].isOut()) {
      this.startPlayer = this.findNextPlayer(topPlayer);
    } else {
      this.startPlayer = topPlayer;
    }
  }

  runRound() {
    let tichuPlayer = -1; // (Large/Small) tichu를 처음으로 부른 사람
    this.rank = [];
    this.call = -1;
    for (let i = 0; i < 4; i++) {
      this.players[i].initPlayer();
    }
    this.drawBoosters();
    this.shuffleCards();
    this.handCards(8);
    for (let i = 0; i < 4; i++) {
      this.players[i].askLargeTichu();
      if (tichuPlayer === -1 && this.players[i].isLargeTichu()) {
        tichuPlayer = i;
      }
    }

    // tichuPlayer != -1 이면 booster 선택

    this.handCards(6);
    this.tradeCards();

    let playable = true;
    while (playable) {
      let topPlayer = this.runTrick();
      this.changeStartPlayer(topPlayer);
      playable = !this.endRound();
    }
    this.calculatePoints();

    // tichuPlayer != -1 && boostersInField.length != 0 이면 booster 선택
  }

  endRound(): boolean {
    let end = false;
    // 한 명만 안남았을 경우
    if (this.rank.length === 3) {
      end = true;
    }
    // 한 팀인 두 명 남았을 경우
    if (this.rank.length === 2 && this.rank[0] % 2 === this.rank[1] % 2) {
      end = true;
    }
    if (end) {
      for (let i = 0; i < 4; i++) {
        if (!this.players[i].isOut()) {
          this.players[i].setOut(true);
          this.rank.push(i);
        }
      }
    }
    return end;
  }

  calculatePoints() {
    let score: [number, number] = [0, 0]; // [team02, team13]
    for (let i = 0; i < 4; i++) {
      if (this.rank[i] === undefined) {
        throw new Error('Player does not exist');
      }
    }
    // 1,2등 같은 팀
    if (this.rank[0] % 2 === this.rank[1] % 2) {
      score[this.rank[0] % 2] += 200;
    } else {
      // 1,2등 다른 팀
      for (let i = 0; i < 3; i++) {
        const cards = this.players[this.rank[i]].getObtainedCards();
        for (let j = 0; j < cards.length; j++) {
          score[this.rank[i] % 2] += cards[j].getScore();
        }
      }
      const obtainedCards = this.players[this.rank[3]].getObtainedCards();
      const cardsInHand = this.players[this.rank[3]].getCardsInHand();
      for (let i = 0; i < obtainedCards.length; i++) {
        score[this.rank[0] % 2] += obtainedCards[i].getScore();
      }
      for (let i = 0; i < cardsInHand.length; i++) {
        score[(this.rank[3] + 1) % 2] += cardsInHand[i].getScore();
      }
    }

    // small / large tichu 성공 여부
    for (let i = 0; i < 4; i++) {
      if (this.players[i].isSmallTichu()) {
        if (this.rank[0] === i) {
          score[i % 2] += 100;
        } else {
          score[i % 2] -= 100;
        }
      }
      if (this.players[i].isLargeTichu()) {
        if (this.rank[0] === i) {
          score[i % 2] += 200;
        } else {
          score[i % 2] -= 200;
        }
      }
    }
    this.team02Score += score[0];
    this.team13Score += score[1];
  }

  runGame() {
    // TODO : 이름 받아서 player에 저장
    const player1 = new Player();
    const player2 = new Player();
    const player3 = new Player();
    const player4 = new Player();

    this.players.push(player1);
    this.players.push(player2);
    this.players.push(player3);
    this.players.push(player4);

    // winning score => 방 만들 때 설정

    let finish = false;
    while (!finish) {
      this.runRound();
      finish = this.endGame();
    }
  }

  endGame(): boolean {
    // 목표점수 달성 여부
    let end = false;
    if (this.team02Score >= this.winningScore) {
      end = true;
    }
    if (this.team13Score >= this.winningScore) {
      end = true;
    }
    if (end === true) {
      if (this.team02Score > this.team13Score) {
        this.winner = [0, 2];
      } else if (this.team13Score > this.team02Score) {
        this.winner = [1, 3];
      } else {
        this.winner = [0, 1, 2, 3];
      }
    }
    return false;
  }
}
