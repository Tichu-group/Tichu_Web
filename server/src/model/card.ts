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

export enum specialCards {
    DOG = 'dog',
    PHOENIX = 'phoenix',
    MAHJONG = 'mahjong',
    DRAGON = 'dragon'
};

type cardPattern = string | specialCards;

export class Card {
    number: number;
    pattern: string;
    value: number; // 점수

    constructor({number = 0, pattern = '', value = 0}:
        {number?: number, pattern?: cardPattern, value?: number}) {
        this.number = number;
        this.pattern = pattern;
        this.value = value;
    }

    isSpecialCard() {
        return (this.pattern === 'dog') || (this.pattern === 'phoenix')
        || (this.pattern === 'mahjong') || (this.pattern === 'dragon');
    }

    // 부등호 overloading

}

export class CardCombination {
    combination : cardCombinations;
    cards : Array<Card>;
    start : boolean;

    constructor({combination, cards, start = false}:
        {combination: cardCombinations, cards: Array<Card>, start?: boolean}) {
        this.combination = combination; //combination type
        this.cards = cards; //card array
        this.start = start; //trick의 시작 combination인지
    }

    static isStraight({cards, fourStraight = false}: {cards: Array<Card> ,fourStraight?: boolean}): boolean {
        if ((!fourStraight) && (cards.length < 5)){
            return false;
        }
        let myCardNum = 0;
        for (let i = 0; i < this.cards.length; i++) {
            if (this.cards[i].isSpecialCard()) {
                if(this.cards[i].pattern !== 'phoenix') {
                    return false;
                } else {
                    if (myCardNum === 0) {
                        myCardNum = this.cards[i+1].number - 1;
                    } else {
                        myCardNum += 1;
                    }
                }
            } else {
                if (myCardNum === 0) {
                    myCardNum = this.cards[i].number;
                } else {
                    if (this.cards[i].number - 1 === myCardNum){
                        myCardNum += 1;
                    } else {
                        return false;
                    }
                }
            }
        }
        return true;
    }

    // 카드 조합 확인 (타입별로) input: Array<Card> => output: boolean
    // => constructor 만들때 조합 가능 여부 확인 (error throw => try catch)
    // 조합 별 세기 비교 => 부등호로

}