import { IPlayer, IBall, IGameParam } from "./interfacesGame";
import { drawCircle, drawRect, drawText } from "./draw";

function printGame(params:{
	context:CanvasRenderingContext2D,
	pong:IGameParam, 
	player1:IPlayer, 
	player2:IPlayer, 
	ball:IBall, 
	gameWidth:number, 
	gameHeight:number}):void{
		
	// Print Net 
	let net = {x: 1 / 2 - params.pong.netWidth / 2, y: 0};
	while (net.y < 1)
	{
		drawRect({
			start:{x:net.x * params.gameWidth, y:net.y * params.gameHeight}, 
			width: params.pong.netWidth * params.gameWidth, 
			height: params.pong.netHeight * params.gameHeight,
			color: params.pong.netColor
		}, params.context);
		net.y += params.pong.netHeight + params.pong.netInterval;
	}

	// Print score
	drawText({
		str: params.player1.score.toString(), 
		start: {x: params.player1.scorePos.x * params.gameWidth,
				y: params.player1.scorePos.y * params.gameHeight}, 
		color: params.pong.scoreColor, 
		font: params.pong.scoreFont, 
		fontDecoration: params.pong.scoreFontDecoration, 
		fontPx: params.pong.scoreFontPx * params.gameHeight
	}, params.context);
	drawText({
		str: params.player2.score.toString(), 
		start: {x: params.player2.scorePos.x * params.gameWidth,
				y: params.player2.scorePos.y * params.gameHeight},  
		color: params.pong.scoreColor, 
		font: params.pong.scoreFont, 
		fontDecoration: params.pong.scoreFontDecoration,
		fontPx: params.pong.scoreFontPx * params.gameHeight
	}, params.context);

	// Print Player name
	drawText({
		str: params.player1.name, 
		start: {x: params.player1.namePos.x * params.gameWidth, 
				y: params.player1.namePos.y * params.gameHeight},
		color: params.pong.nameColor, 
		font: params.pong.nameFont, 
		fontDecoration: params.pong.nameFontDecoration, 
		fontPx: params.pong.nameFontPx * params.gameHeight
	}, params.context);
	drawText({
		str: params.player2.name, 
		start: {x: params.player2.namePos.x * params.gameWidth, 
				y: params.player2.namePos.y * params.gameHeight},
		color: params.pong.nameColor, 
		font: params.pong.nameFont, 
		fontDecoration: params.pong.nameFontDecoration, 
		fontPx: params.pong.nameFontPx * params.gameHeight
	}, params.context);
	
	// Print Game elements 
	drawCircle({
		center: {x:params.ball.pos.x *params.gameWidth, 
				y:params.ball.pos.y * params.gameHeight}, 
		radius: params.pong.ballRadius * params.gameWidth,
		color: params.pong.ballColor
	}, params.context);
	drawRect({
		start: {x:params.player1.pos.x * params.gameWidth,
				y:params.player1.pos.y * params.gameHeight}, 
		width: params.pong.paddleWidth * params.gameWidth,
		height: params.pong.paddleHeight * params.gameHeight, 
		color: params.player1.color
	}, params.context);
	drawRect({
		start: {x:params.player2.pos.x * params.gameWidth, 
			y:params.player2.pos.y * params.gameHeight}, 
		width: params.pong.paddleWidth * params.gameWidth,
		height: params.pong.paddleHeight * params.gameHeight, 
		color: params.player2.color
	}, params.context);
	
}
export default printGame;