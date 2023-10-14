/* import GameParam from "../classes/GameParam";
import Player from "../classes/Player";
import Ball from "../classes/Ball";

function leftboard(pong:GameParam, ball:Ball):boolean {
    return (ball.pos.x > pong.gameWidth || ball.pos.x < 0)
}

function colision(player: Player, ball:Ball, pong:GameParam):boolean {
    const ballTop:number = ball.pos.y - pong.ballRadius;
    const ballBtm:number = ball.pos.y + pong.ballRadius;
    const ballLeft:number = ball.pos.x - pong.ballRadius;
    const ballRight:number = ball.pos.x + pong.ballRadius;

    const paddleTop:number =  player.pos.y;
    const paddleBtm:number = player.pos.y + pong.paddleHeight;
    const paddleLeft:number = player.pos.x;
    const paddleRight:number = player.pos.x + pong.paddleWidth;

    return (ballRight > paddleLeft && ballTop < paddleBtm && ballLeft < paddleRight && ballBtm > paddleTop)
}

export {colision, leftboard}; */

export {}