import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages";

export class Game {
  public player1: WebSocket;
  public player2: WebSocket;
  public board: Chess;
  // private moves: string[];
  private startTime: Date;
  private moveCount = 0;

  constructor(player1: WebSocket, player2: WebSocket) {
    this.player1 = player1;
    this.player2 = player2;
    this.board = new Chess();
    // this.moves = [];
    this.startTime = new Date();
    this.player1.send(
      JSON.stringify({ type: INIT_GAME, payload: { color: "white" } })
    );
    this.player2.send(
      JSON.stringify({ type: INIT_GAME, payload: { color: "black" } })
    );
  }

  makeMove(socket: WebSocket, move: { from: string; to: string }) {
    // validation list
    // It is this user move ?
    // {
    //     "type":"move","move":{"from":"a2","to":"a3"}
    //   }
    console.log("move1");
    console.log("this.board.moves()", this.board.moves());
    console.log("this.moveCount", this.moveCount);
    // replace this.moveCount with this.moveCount
    // because secound user move not visible to first user
    if (this.moveCount % 2 === 0 && socket !== this.player1) {
      console.log("player1");
      return;
    }
    console.log("move2");
    console.log("this.board.moves()", this.board.moves());
    console.log("this.moveCount", this.moveCount);
    if (this.moveCount % 2 === 1 && socket !== this.player2) {
      console.log("player2");
      return;
    }
    // is this move valid ?
    try {
      this.board.move(move);
    } catch (e) {
      console.log(e);

      return;
    }
    // check if the game is over
    if (this.board.isGameOver()) {
      this.player1.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      this.player2.emit(
        JSON.stringify({
          type: GAME_OVER,
          payload: {
            winner: this.board.turn() === "w" ? "black" : "white",
          },
        })
      );
      return;
    }

    if (this.moveCount % 2 === 0) {
      console.log("this.moveCount", this.moveCount);
      this.player2.send(JSON.stringify({ type: MOVE, payload: move }));
    } else {
      this.player1.send(JSON.stringify({ type: MOVE, payload: move }));
    }
    this.moveCount++;
    // send the update board to both player
  }
}
