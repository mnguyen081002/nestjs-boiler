import { Logger } from "@nestjs/common";
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
  WsResponse,
} from "@nestjs/websockets";
import { from, Observable } from "rxjs";
import { map } from "rxjs/operators";
import { Server } from "socket.io";
import { BoardEntity } from "../../entities/board.entity";
import { UserEntity } from "../../entities/user.entity";
import { UserService } from "../user/user.service";
import { Socket } from "socket.io";
import { Status } from "../../common/enum/board";
import { Player } from "../../entities/player";
@WebSocketGateway({
  cors: {
    origin: "*",
  },
  path: "/api/socket.io",
})
export class BoardGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  private board: BoardEntity;
  constructor(private userServive: UserService) {
    this.board = new BoardEntity();
  }

  @WebSocketServer() io: Server;

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    this.board.onLeave(client.id);
  }
  private logger: Logger = new Logger(BoardGateway.name);

  async handleConnection(client: Socket, ...args: any[]) {
    const queryParams = client.handshake.query;
    if (!queryParams) {
      client.emit("error", {
        message: "Chưa đăng nhập",
      });
    }
    if (!this.board.isSeatAvaiable()) {
      client.emit("error", { message: "Đã hết chỗ trống" });
      return;
    }
    if (this.board.players.find((p) => p.user.username === queryParams.username)) {
      console.log(this.board.seats.map((s) => s.player?.user.username));
      console.log(queryParams.username);

      client.emit("error", { message: "Bạn đã tham gia bằng tab khác" });
      return;
    }
    const u = await this.userServive.findOneOrCreateByUsername(queryParams.username as string);
    this.board.onJoin(u, client.id);
    client.to("blackjack").emit("player_join", {
      user: u,
      players: this.board.players,
    });
    client.join("blackjack");
    client.emit("board_info", {
      board: this.board,
    });
    this.logger.log(`Client connected: ${client.id}, ${u.username}`);
  }
  afterInit(server: any) {
    this.logger.log("Init socket");
  }
  @WebSocketServer()
  server: Server;

  @SubscribeMessage("ready")
  findAll(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    if (this.board.status !== Status.WAITING) {
      return;
    }
    const player = this.board.players.find((p) => p.socket_id === client.id);
    if (!player) {
      return;
    }
    player.isReady = true;
    if (this.board.players.length === 2 && this.board.players.every((p) => p.isReady)) {
      this.board.onStart();

      for (const p of this.board.players) {
        this.io.to(p.socket_id).emit("game_start", {
          players: this.board.players.map((p1) => {
            let pp = { ...p1 };

            if (p.socket_id !== p1.socket_id) {
              pp.cards = p1.cards.map((c) => {
                return { ...c, isHidden: true };
              });
            }
            return pp;
          }),
          score: p.calculateScore(),
        });
      }
    }
  }

  @SubscribeMessage("hit")
  hit(@MessageBody() data: string, @ConnectedSocket() client: Socket) {
    const player = this.board.players.find((p) => p.socket_id === client.id);
    if (!player) {
      return;
    }
    if (!this.board.onDrawCard()) {
      return;
    }

    client.emit("player_hit", {
      player,
      players: this.board.players,
      desk_count: this.board.desk.cards.length,
    });

    player.hiddenCards();
    client.to("blackjack").emit("player_hit", {
      player,
      players: this.board.players,
      desk_count: this.board.desk.cards.length,
    });
  }
}
