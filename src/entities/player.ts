import { CardType, CardValue } from "../common/enum/board";
import { Card } from "./card";
import { UserEntity } from "./user.entity";

export class Player {
  socket_id: string;
  user: UserEntity;
  cards: Card[];
  canStand: boolean = false;
  canHit: boolean = false;
  canTakeTurn: boolean = false;
  isReady: boolean = false;

  constructor(user: UserEntity, socket_id: string) {
    this.user = user;
    this.socket_id = socket_id;
    this.cards = [];
  }

  hiddenCards(): void {
    this.cards.forEach((card) => {
      card.type = CardType.HEART;
      card.value = CardValue.A;
      card.isHidden = true;
    });
  }

  play(): void {
    this.canTakeTurn = true;
  }

  hit(card: Card): void {
    if (!this.canHit) {
      return;
    }

    if (this.cards.length < 5) {
      this.cards.push(card);
    }

    const score = this.calculateScore();
    if (score == 21 && this.cards.length === 2) {
      this.canHit = false;
      this.canStand = false;
      this.canTakeTurn = false;
    }
    if (this.cards.length === 5) {
      this.canHit = false;
    }
  }

  takeTurn(): void {
    this.canStand = true;
    this.canHit = true;
  }

  stand(): void {
    this.canStand = false;
    this.canHit = false;
  }

  calculateScore(): number {
    let score = 0;
    this.cards.forEach((card) => {
      if (card.value === CardValue.A) {
        if (score + 11 > 21) {
          score += 1;
        } else {
          score += 11;
        }
      } else if (
        card.value === CardValue.J ||
        card.value === CardValue.Q ||
        card.value === CardValue.K
      ) {
        score += 10;
      } else {
        score += parseInt(card.value);
      }
    });

    return score;
  }
}
