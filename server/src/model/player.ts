import { Booster } from "./boost";
import  { Card, CardCombination } from "./card";

export class Player {
    cardsInHand : Array<Card>;
    obtainedCards : Array<Card>;
    myBoosters : Array<Booster>;
    out : boolean;
    rank : number | undefined;
    smallTichu : boolean;
    largeTichu : boolean;
    // bombOwner : boolean;

    selectTradeCards() : Array<Card> {
        // 줄 카드 세장 고르기
    }

    hasMahjong() : boolean {
        // 짹 소유여부
    }

    playCards() : Array<Card> {
        // 선택한 카드 리턴
    }
}
