/* import GameParam from "../classes/GameParam";
import Point from "../classes/Point";
import Ball from "../classes/Ball";
import Player from "../classes/Player";
import {drawCircle, drawRect, drawText} from './draw';

function printGame(pong:GameParam, ball:Ball, player1:Player, player2:Player):void{
    // Print Background
	if (pong.context){
		drawRect({
			start: new Point({x: 0, y: 0}), 
			width: pong.gameWidth, 
			height: pong.gameHeight, 
			color: pong.backColor
		}, pong.context);
	
		// Print Net 
		let net = new Point({x: pong.gameWidth / 2 - pong.netWidth / 2, y: 0});
		while (net.y< pong.gameHeight)
		{
			drawRect({
				start:net, 
				width: pong.netWidth, 
				height: pong.netHeight,
				color: pong.netColor
			}, pong.context);
			net.y += pong.netHeight + pong.netInterval;
		}
	
		// Print score
		drawText({
			str: player1.score.toString(), 
			start: player1.scorePos, 
			color: pong.scoreColor, 
			font: pong.scoreFont, 
			fontDecoration: pong.scoreFontDecoration, 
			fontPx: pong.scoreFontPx
		}, pong.context);
		drawText({
			str: player2.score.toString(), 
			start: player2.scorePos, 
			color: pong.scoreColor, 
			font: pong.scoreFont, 
			fontDecoration: pong.scoreFontDecoration,
			fontPx: pong.scoreFontPx
		}, pong.context);
	
		// Print Player name
		drawText({
			str: player1.name, 
			start: player1.namePos, 
			color: pong.nameColor, 
			font: pong.nameFont, 
			fontDecoration: pong.nameFontDecoration, 
			fontPx: pong.nameFontPx
		}, pong.context);
		drawText({
			str: player2.name, 
			start: player2.namePos, 
			color: pong.nameColor, 
			font: pong.nameFont, 
			fontDecoration: pong.nameFontDecoration, 
			fontPx: pong.nameFontPx
		}, pong.context);
	
		// Print Game elements 
		drawCircle({
			center: ball.pos, 
			radius: pong.ballRadius,
			color: pong.ballColor
		}, pong.context);
		drawRect({
		   start: player1.pos, 
		   width: pong.paddleWidth, 
		   height: pong.paddleHeight, 
		   color: player1.color
		}, pong.context);
		drawRect({
			start: player2.pos, 
			width: pong.paddleWidth,
			height: pong.paddleHeight, 
			color: player2.color
		}, pong.context);
	}
}

export default printGame; */
export {}