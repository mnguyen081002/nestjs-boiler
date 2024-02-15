import { Column, Entity, OneToOne, OneToMany, ManyToMany } from "typeorm";
import { BaseEntity } from "../common/abstract.entity";
import { UserEntity } from "./user.entity";
import { CardType, CardValue, Status } from "../common/enum/board";
import { Desk } from "./desk";
import { Player } from "./player";
import { Card } from "./card";
// blackjack

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
  status: Status = Status.WAITING;
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

  isSeatAvaiable(): boolean {
    return this.seats.find((v) => v.isOccupied == false) != undefined;
  }

  onJoin(user: UserEntity, socket_id: string): void {
    const p = new Player(user, socket_id);
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

  onLeave(socket_id: string): void {
    const index = this.players.findIndex((p) => p.socket_id === socket_id);
    this.players.splice(index, 1);

    const i = this.seats.findIndex((p) => p.player?.socket_id === socket_id);
    this.seats[i] = {
      player: undefined,
      isOccupied: false,
    };
  }

  setCasino(player: Player): void {
    this.currentCasino = player;
  }

  onDrawCard(): boolean {
    if (!this.currentPlayer.canHit) {
      return false;
    }
    // TODO: Warning null exeption
    const card = this.desk.onDraw();
    this.currentPlayer.hit(card!);
    return true;
  }

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

  onStart(): void {
    this.desk = new Desk();
    this.desk.shuffle();
    this.status = Status.STARTED;
    this.players.forEach((p) => {
      p.play();
    });
    this.currentPlayer = this.players[0];
    for (let i = 1; i <= this.players.length * 2; i++) {
      this.currentPlayer.takeTurn();
      this.onDrawCard();
      this.currentPlayer.stand();
      this.currentPlayer = this.players[i % this.players.length];
    }
    for (let i = 1; i <= this.players.length; i++) {
      if (this.players[i].canTakeTurn) {
        // TODO: nếu casio có xì dách thì có show bài không ?
        this.currentPlayer = this.players[i];
        // this.currentPlayer.takeTurn();
        break;
      }
    }

    this.currentPlayer.takeTurn();

    if (this.currentPlayer == this.players[0] && !this.players[0].canTakeTurn) {
      // TODO: end game
    }
  }
}
