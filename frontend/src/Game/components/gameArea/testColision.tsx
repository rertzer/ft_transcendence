import { IBall, IPlayer, IGameParam } from "./interfacesGame";

function leftboard(ball:IBall):boolean {
    return (ball.pos.x > 1 || ball.pos.x < 0)
}

function colision(player: IPlayer, ball:IBall, pong:IGameParam):boolean {
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

export {colision, leftboard};