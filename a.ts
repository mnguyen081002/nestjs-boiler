export enum CardType {
  HEART = "heart",
  DIAMOND = "diamond",
  CLUB = "club",
  SPADE = "spade",
}

export enum CardValue {
  TWO = "2",
  THREE = "3",
  FOUR = "4",
  FIVE = "5",
  SIX = "6",
  SEVEN = "7",
  EIGHT = "8",
  NINE = "9",
  TEN = "10",
  J = "J",
  Q = "Q",
  K = "K",
  A = "A",
}

export enum Status {
  WAITING,
  STARTED,
}

export class UserEntity {
  username: string;

  money: number;
}

export class Card {
  value: CardValue;
  type: CardType;
}

export class Player {
  user: UserEntity;
  cards: Card[];
  canStand: boolean = false;
  canHit: boolean = false;
  canTakeTurn: boolean = false;
  isOpenned: boolean = false;

  constructor(user: UserEntity) {
    this.user = user;
    this.cards = [];
  }

  play(): void {
    this.canTakeTurn = true;
  }

  hit(card: Card): void {
    if (this.cards.length < 5) {
      this.cards.push(card);
    }

    const score = this.calculateScore();
    if (score == 21 && this.cards.length === 2) {
      this.canHit = false;
      this.canStand = false;
      this.canTakeTurn = false;
      this.isOpenned = true;
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

export class Desk {
  constructor() {
    this.cards = [];
    Object.values(CardType).forEach((type) => {
      Object.values(CardValue).forEach((value) => {
        this.cards.push({ type, value });
      });
    });
    this.shuffle();
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
}

export class Seat {
  player: Player;
  isOccupied: boolean = false;
}

export class BoardEntity {
  players: Player[];
  desk: Desk;
  currentPlayer: Player;
  currentCasino: Player;
  seats: Seat[];
  status: Status;
  bet: number;

  constructor() {
    this.desk = new Desk();
    this.players = [];
    this.seats = Array(2)
      .fill(null)
      .map((_) => {
        return new Seat();
      });
  }

  onJoin(user: UserEntity): void {
    const p = new Player(user);
    if (this.players.length === 0) {
      this.setCasino(p);
    }
    const seat = this.seats.find((v) => v.isOccupied == false);
    if (!seat) {
      return;
    }
    seat.isOccupied = true;
    seat.player = p;
    this.players.push(p);
  }

  //   onLeave(user_id: number): void {
  //     const index = this.players.findIndex((p) => p.user.id === user_id);
  //     this.players.splice(index, 1);
  //   }

  setCasino(player: Player): void {
    this.currentCasino = player;
  }

  onDrawCard(): Card {
    // TODO: Warning
    const card = this.desk.onDraw();
    this.currentPlayer.hit(card!);
    return card!;
  }

  onHit(): Card {
    return this.onDrawCard();
  }
  // write for me this function
  onEnd(): void {
    const casinoScore = this.currentCasino.calculateScore();
    const winners: Player[] = [];
    const losers: Player[] = [];

    for (let i = 1; i < this.players.length; i++) {
      const cp = this.players[i];
      const playerScore = cp.calculateScore();
      if (playerScore > 21 && casinoScore > 21) {
        console.log("It's a tie!");
      } else if (playerScore > 21) {
        losers.push(cp);
      } else if (casinoScore > 21) {
        winners.push(cp);
      } else if (playerScore > casinoScore) {
        winners.push(cp);
      } else if (playerScore < casinoScore) {
        losers.push(cp);
      } else {
        console.log("It's a tie!");
      }
    }

    winners.forEach((e) => {
      e.user.money += this.bet;
      this.currentCasino.user.money -= this.bet;
    });

    losers.forEach((e) => {
      e.user.money -= this.bet;
      this.currentCasino.user.money += this.bet;
    });
  }

  onStand(): void {
    if (this.currentPlayer == this.currentCasino) {
    }
    const index = this.players.indexOf(this.currentPlayer);
    this.currentPlayer.stand();
    const p = this.players[index + 1];
    if (p && p.canTakeTurn) {
      this.currentPlayer = p;
    } else {
      this.currentPlayer = this.currentCasino;
    }
    this.currentPlayer.takeTurn();
  }

  onPlay(): void {
    this.desk = new Desk();
    this.players.forEach((p) => {
      p.play();
    });
    this.currentPlayer = this.players[0];

    for (let i = 1; i <= this.players.length * 2; i++) {
      this.onDrawCard();
      this.currentPlayer = this.players[i % this.players.length];
    }
    for (let i = 1; i <= this.players.length; i++) {
      if (this.players[i].canTakeTurn) {
        // TODO: nếu casio có xì dách thì có show bài không ?
        this.currentPlayer = this.players[i];
        break;
      }
    }

    if (this.currentPlayer == this.players[0] && !this.players[0].canTakeTurn) {
      // TODO: end game
    }
  }
}

const main = () => {
  const board = new BoardEntity();
  const u1 = new UserEntity();
  u1.username = "1";
  board.onJoin(u1);
  board.onJoin(new UserEntity());
  board.onPlay();

  board.players.forEach((e) => {
    console.log("User:", e, "Card:", e.cards);
  });

  board.onHit();
};

main();
