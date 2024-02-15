import { CardType, CardValue } from "../common/enum/board";

export class Card {
  value: CardValue;
  type: CardType;
  isHidden: boolean = false;
}
