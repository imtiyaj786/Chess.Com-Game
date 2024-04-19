"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Game = void 0;
const chess_js_1 = require("chess.js");
const messages_1 = require("./messages");
class Game {
    constructor(player1, player2) {
        this.moveCount = 0;
        this.player1 = player1;
        this.player2 = player2;
        this.board = new chess_js_1.Chess();
        // this.moves = [];
        this.startTime = new Date();
        this.player1.send(JSON.stringify({ type: messages_1.INIT_GAME, payload: { color: "white" } }));
        this.player2.send(JSON.stringify({ type: messages_1.INIT_GAME, payload: { color: "black" } }));
    }
    makeMove(socket, move) {
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
        }
        catch (e) {
            console.log(e);
            return;
        }
        // check if the game is over
        if (this.board.isGameOver()) {
            this.player1.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            this.player2.emit(JSON.stringify({
                type: messages_1.GAME_OVER,
                payload: {
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            return;
        }
        if (this.moveCount % 2 === 0) {
            console.log("this.moveCount", this.moveCount);
            this.player2.send(JSON.stringify({ type: messages_1.MOVE, payload: move }));
        }
        else {
            this.player1.send(JSON.stringify({ type: messages_1.MOVE, payload: move }));
        }
        this.moveCount++;
        // send the update board to both player
    }
}
exports.Game = Game;
