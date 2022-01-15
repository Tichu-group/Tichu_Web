import { Booster } from "./boost";
import { Card, CardCombination, cardCombinations } from "./card";
import { Player } from "./player";

export class Game {
    players : Array<Player>;
    winningScore : number;
    team02Score : number;
    team13Score : number;
    boostersInField : Array<Booster>;
    usedBoosters : Array<Booster>;
    boostersInDeck : Array<Booster>;

    //Round
    activeBooster : Array<Booster>;
    availableCombinations : cardCombinations;
    call : number | undefined;
    deck : Array<Card>;
    startPlayer : number;

    shuffleCards() : Array<Card> {
        // 카드 셔플
    }

    distributeCards(players : Array<Player>, cardsNum : number) {
        // this.deck에서 cardsNum에 따라 카드 배분
    }

    tradeCards() {
        for (let i = 0; i < 4; i++){
            cards = this.players[i].selectTradeCards()
            //선택된 카드 나눠주기 
        }
    }

    // Trick
    runTrick() {
        let cardsInField = new Array<CardCombination>();
        let currentPlayer = this.startPlayer;
        let topPlayer = -1;
        while (currentPlayer != topPlayer) {
            let cards = this.players[currentPlayer].playCards();
            // card 조합 확인
            // topPlayer, currentPlayer 변경 => player.out이 true이면 패스
            // cardInField에 카드 조합 추가
            // 한 명 밖에 안남았을 경우 종료 (endRoud 호출?)
        }
        // topPlayer에게 cardsInField를 obtainedCards에 추가
        // startPlayer 변경
    }

    endRound() {
        // 한 명만 안남았을 경우
        // 한 팀인 두 명 남았을 경우
    }

    runRound() {

    }

    calculatePoints() {

    }

    endGame() {
        // 목표점수 달성 여부
    }

}