import { IPlayer, IBall, IGameParam, IObstacles } from "./interfacesGame";
import { drawCircle, drawRect, drawText } from "./draw";

function printGame(params:{
	context:CanvasRenderingContext2D,
	pong:IGameParam, 
	playerLeft:IPlayer, 
	playerRight:IPlayer, 
	balls:IBall[], 
	obstacles: IObstacles[],
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

	// Print Game elements
	params.balls?.forEach((ball) => {
		if (ball.active === false) return;
		drawCircle({
			center: {x:ball.pos.x * params.gameWidth, 
					y:ball.pos.y * params.gameHeight}, 
			radius: params.pong.ballRadius * params.gameWidth,
			color: params.pong.ballColor
		}, params.context);
	});

	params.obstacles?.forEach((obstacle) => {
		drawRect({
			start: {x:obstacle.posx * params.gameWidth, 
					y:obstacle.posy * params.gameHeight}, 
			width: obstacle.width * params.gameWidth,
			height: obstacle.height * params.gameHeight, 
			color: '#00BFFF'
		}, params.context);
	});
	
	drawRect({
		start: {x:0,
				y:(params.playerLeft.posY - params.pong.paddleHeight / 2) * params.gameHeight}, 
		width: params.pong.paddleWidth * params.gameWidth,
		height: params.pong.paddleHeight * params.gameHeight, 
		color: params.playerLeft.color
	}, params.context);
	drawRect({
		start: {x:(1 - params.pong.paddleWidth) * params.gameWidth, 
			y:(params.playerRight.posY - params.pong.paddleHeight / 2) * params.gameHeight}, 
		width: params.pong.paddleWidth * params.gameWidth,
		height: params.pong.paddleHeight * params.gameHeight, 
		color: params.playerRight.color
	}, params.context);

	// Print score
	drawText({
		str: params.playerLeft.score.toString(),
		start: {x: params.playerLeft.scorePos.x * params.gameWidth,
				y: params.playerLeft.scorePos.y * params.gameHeight},
		color: params.pong.scoreColor,
		font: params.pong.scoreFont,
		fontDecoration: params.pong.scoreFontDecoration,
		fontPx: params.pong.scoreFontPx * params.gameHeight
	}, params.context);
	drawText({
		str: params.playerRight.score.toString(),
		start: {x: params.playerRight.scorePos.x * params.gameWidth,
				y: params.playerRight.scorePos.y * params.gameHeight},
		color: params.pong.scoreColor,
		font: params.pong.scoreFont,
		fontDecoration: params.pong.scoreFontDecoration,
		fontPx: params.pong.scoreFontPx * params.gameHeight
	}, params.context);

	// Print Player name
	drawText({
		str: params.playerLeft.name,
		start: {x: params.playerLeft.namePos.x * params.gameWidth,
				y: params.playerLeft.namePos.y * params.gameHeight},
		color: params.pong.nameColor,
		font: params.pong.nameFont,
		fontDecoration: params.pong.nameFontDecoration,
		fontPx: params.pong.nameFontPx * params.gameHeight
	}, params.context);
	drawText({
		str: params.playerRight.name,
		start: {x: params.playerRight.namePos.x * params.gameWidth,
				y: params.playerRight.namePos.y * params.gameHeight},
		color: params.pong.nameColor,
		font: params.pong.nameFont,
		fontDecoration: params.pong.nameFontDecoration,
		fontPx: params.pong.nameFontPx * params.gameHeight
	}, params.context);

	
}
export default printGame;
