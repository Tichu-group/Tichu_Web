import { CardCombination, cardCombinations } from "./card";

export class Booster {

}

export function defuseBomb(currentCards: cardCombination) : boolean {
    if (currentCards.combination === cardCombinations.FOURBOMB) {
        return true;
    } else {
        return false;
    }
}

export function fourStraight(myCards:cardCombination, currentCards: cardCombination | null) : boolean {
    if (myCards.cards.length !== 4) {
        return false;
    }
    if (myCards.start){
        return myCards.isStraight({fourStraight:true});
    } else {
        if ((currentCards !== null) && currentCards.isStraight({fourStraight:true})) {
            let myFirst = 0;
            let currentFirst = 0;
            if(myCards.cards[0].pattern === 'phoenix') {
                myFirst = myCards.cards[1].number - 1;
                currentFirst = currentCards.cards[0].number;
            } else {
                myFirst = myCards.cards[0].number;
                if(currentCards.cards[0].pattern === 'phoenix') {
                    currentFirst = currentCards.cards[1].number -1;
                } else {
                    currentFirst = currentCards.cards[0].number;
                }
            }
            return (myFirst > currentFirst) && myCards.isStraight({fourStraight:true});
        } else {
            return false;
        }
    }
}

