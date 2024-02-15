import { CardType, CardValue } from "../common/enum/board";
import { Card } from "./card";
import { Player } from "./player";

export class Desk {
  constructor() {
    this.cards = [];
    Object.values(CardType).forEach((type) => {
      Object.values(CardValue).forEach((value) => {
        this.cards.push({ type, value, isHidden: false });
      });
    });
  }
  cards: Card[];
  onDraw(): Card | undefined {
    return this.cards.pop();
  }
  shuffle() {
    for (let i = this.cards.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
    }
  }

  deal(players: Player[]) {}
}
