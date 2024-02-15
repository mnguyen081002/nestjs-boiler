"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BoardEntity = exports.Seat = exports.Desk = exports.Player = exports.Card = exports.UserEntity = exports.CardValue = exports.CardType = void 0;
var CardType;
(function (CardType) {
    CardType["HEART"] = "heart";
    CardType["DIAMOND"] = "diamond";
    CardType["CLUB"] = "club";
    CardType["SPADE"] = "spade";
})(CardType || (exports.CardType = CardType = {}));
var CardValue;
(function (CardValue) {
    CardValue["TWO"] = "2";
    CardValue["THREE"] = "3";
    CardValue["FOUR"] = "4";
    CardValue["FIVE"] = "5";
    CardValue["SIX"] = "6";
    CardValue["SEVEN"] = "7";
    CardValue["EIGHT"] = "8";
    CardValue["NINE"] = "9";
    CardValue["TEN"] = "10";
    CardValue["J"] = "J";
    CardValue["Q"] = "Q";
    CardValue["K"] = "K";
    CardValue["A"] = "A";
})(CardValue || (exports.CardValue = CardValue = {}));
var UserEntity = /** @class */ (function () {
    function UserEntity() {
    }
    return UserEntity;
}());
exports.UserEntity = UserEntity;
var Card = /** @class */ (function () {
    function Card() {
    }
    return Card;
}());
exports.Card = Card;
var Player = /** @class */ (function () {
    function Player(user) {
        this.user = user;
        this.cards = [];
    }
    Player.prototype.play = function () {
        this.canTakeTurn = true;
    };
    Player.prototype.hit = function (card) {
        if (this.cards.length < 5) {
            this.cards.push(card);
        }
        var score = this.calculateScore();
        if (score == 21 && this.cards.length === 2) {
            this.canHit = false;
            this.canStand = false;
            this.canTakeTurn = false;
            this.isOpenned = true;
        }
        if (this.cards.length === 5) {
            this.canHit = false;
        }
    };
    Player.prototype.takeTurn = function () {
        this.canStand = true;
        this.canHit = true;
    };
    Player.prototype.stand = function () {
        this.canStand = false;
        this.canHit = false;
    };
    Player.prototype.calculateScore = function () {
        var score = 0;
        this.cards.forEach(function (card) {
            if (card.value === CardValue.A) {
                if (score + 11 > 21) {
                    score += 1;
                }
                else {
                    score += 11;
                }
            }
            else if (card.value === CardValue.J ||
                card.value === CardValue.Q ||
                card.value === CardValue.K) {
                score += 10;
            }
            else {
                score += parseInt(card.value);
            }
        });
        return score;
    };
    return Player;
}());
exports.Player = Player;
var Desk = /** @class */ (function () {
    function Desk() {
        var _this = this;
        this.cards = [];
        Object.values(CardType).forEach(function (type) {
            Object.values(CardValue).forEach(function (value) {
                _this.cards.push({ type: type, value: value });
            });
        });
    }
    Desk.prototype.onDraw = function () {
        return this.cards.pop();
    };
    return Desk;
}());
exports.Desk = Desk;
var Seat = /** @class */ (function () {
    function Seat() {
        this.isOccupied = false;
    }
    return Seat;
}());
exports.Seat = Seat;
var BoardEntity = /** @class */ (function () {
    function BoardEntity() {
        this.desk = new Desk();
        this.players = [];
        this.seats = Array(2)
            .fill(null)
            .map(function (_) {
            return new Seat();
        });
    }
    BoardEntity.prototype.onJoin = function (user) {
        var p = new Player(user);
        if (this.players.length === 0) {
            this.setCasino(p);
        }
        var seat = this.seats.find(function (v) { return v.isOccupied == false; });
        if (!seat) {
            return;
        }
        seat.isOccupied = true;
        seat.player = p;
        this.players.push(p);
    };
    //   onLeave(user_id: number): void {
    //     const index = this.players.findIndex((p) => p.user.id === user_id);
    //     this.players.splice(index, 1);
    //   }
    BoardEntity.prototype.setCasino = function (player) {
        this.currentCasino = player;
    };
    BoardEntity.prototype.onDrawCard = function () {
        // TODO: Warning
        var card = this.desk.onDraw();
        this.currentPlayer.hit(card);
        return card;
    };
    BoardEntity.prototype.onHit = function () {
        return this.onDrawCard();
    };
    BoardEntity.prototype.onStand = function () {
        var index = this.players.indexOf(this.currentPlayer);
        this.currentPlayer.stand();
        var p = this.players[index + 1];
        if (p && p.canTakeTurn) {
            this.currentPlayer = p;
        }
        else {
            this.currentPlayer = this.currentCasino;
        }
        this.currentPlayer.takeTurn();
    };
    BoardEntity.prototype.onPlay = function () {
        this.players.forEach(function (p) {
            p.play();
        });
        this.currentPlayer = this.players[0];
        for (var i = 1; i <= this.players.length * 2; i++) {
            this.onDrawCard();
            this.currentPlayer = this.players[i % this.players.length];
        }
        this.currentPlayer = this.players[1];
        this.currentPlayer.takeTurn();
    };
    return BoardEntity;
}());
exports.BoardEntity = BoardEntity;
var main = function () {
    var board = new BoardEntity();
    var u1 = new UserEntity();
    u1.username = "1";
    board.onJoin(u1);
    board.onJoin(new UserEntity());
    board.onPlay();
    board.players.forEach(function (e) {
        console.log("User:", e.user.username, "Card:", e.cards);
    });
    console.log(board);
};
main();
