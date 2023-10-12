import React, {useEffect} from 'react';
import Point from './classes/Point';
import Player from './classes/Player';
import GameParam from './classes/GameParam';
import Ball from './classes/Ball';

function drawRect(rect:{start:Point, width:number, height:number, color:string}, context:CanvasRenderingContext2D):void {
	context.fillStyle = rect.color;
	context.fillRect(rect.start.x, rect.start.y, rect.width, rect.height);
};

function drawCircle(cir:{center:Point, radius:number, color:string}, context:CanvasRenderingContext2D):void {
    context.fillStyle = cir.color;
    context.beginPath();
    context.arc(cir.center.x, cir.center.y, cir.radius, Math.PI*2, 0)
    context.closePath();
    context.fill();
};

function drawText(txt:{
    str:string, 
    start: Point, 
    color:string, 
    font:string, 
    fontDecoration: string, 
    fontPx:number}, 
	context:CanvasRenderingContext2D):void {
        const fontString = `${txt.fontDecoration}  ${txt.fontPx.toString()}Px ${txt.font}`;
        context.fillStyle = txt.color;
        context.font = fontString;
        context.textAlign = "center";
        context.fillText(txt.str, txt.start.x, txt.start.y);
}

function printGame(pong:GameParam):void{
    /* Print Background */
	if (pong.context){
		drawRect({
			start: new Point({x: 0, y: 0}), 
			width: pong.gameWidth, 
			height: pong.gameHeight, 
			color: pong.backColor
		}, pong.context);
	
		/* Print Net */
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
	
		/* Print score */
		drawText({
			str: pong.player1.score.toString(), 
			start: pong.player1.scorePos, 
			color: pong.scoreColor, 
			font: pong.scoreFont, 
			fontDecoration: pong.scoreFontDecoration, 
			fontPx: pong.scoreFontPx
		}, pong.context);
		drawText({
			str: pong.player2.score.toString(), 
			start: pong.player2.scorePos, 
			color: pong.scoreColor, 
			font: pong.scoreFont, 
			fontDecoration: pong.scoreFontDecoration,
			fontPx: pong.scoreFontPx
		}, pong.context);
	
		/* Print Player name*/
		drawText({
			str: pong.player1.name, 
			start: pong.player1.namePos, 
			color: pong.nameColor, 
			font: pong.nameFont, 
			fontDecoration: pong.nameFontDecoration, 
			fontPx: pong.nameFontPx
		}, pong.context);
		drawText({
			str: pong.player2.name, 
			start: pong.player2.namePos, 
			color: pong.nameColor, 
			font: pong.nameFont, 
			fontDecoration: pong.nameFontDecoration, 
			fontPx: pong.nameFontPx
		}, pong.context);
	
		/* Print Game elements */
		drawCircle({
			center: pong.ball.pos, 
			radius: pong.ballRadius, 
			color: pong.ballColor
		}, pong.context);
		drawRect({
		   start: pong.player1.pos, 
		   width: pong.paddleWidth, 
		   height: pong.paddleHeight, 
		   color: pong.player1.color
		}, pong.context);
		drawRect({
			start: pong.player2.pos, 
			width: pong.paddleWidth,
			height: pong.paddleHeight, 
			color: pong.player2.color
		}, pong.context);
	}
    
}

function printStartMenu(pong:GameParam):void {
	if (pong.context) {
		const buffer = 0;
		drawRect({
			start: new Point({x: buffer, y: buffer}), 
			width: pong.gameWidth - 2* buffer , 
			height: pong.gameHeight - 2 * buffer, 
			color: pong.menuBackColor
		}, pong.context);

		const line1 = 'TO PLAY, PRESS';
		const line2 = 'SPACE KEY';
		const sizeLine = pong.context.measureText(line1);
		drawText({
			str: line1, 
			start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 - 5}), 
			color: pong.menuTextColor, 
			font: pong.menuFont, 
			fontDecoration: pong.menuFontDecoration, 
			fontPx: pong.menuFontPx
		}, pong.context);
		drawText({
			str: line2, 
			start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 - 5 + pong.menuFontPx}), 
			color: pong.menuTextColor, 
			font: pong.menuFont, 
			fontDecoration: pong.menuFontDecoration, 
			fontPx: pong.menuFontPx
		}, pong.context); 
	}
}

function printWinnerMenu(pong:GameParam):void {
	if (pong.context) {
		const buffer = 0;
		drawRect({
			start: new Point({x: buffer, y: buffer}), 
			width: pong.gameWidth - 2* buffer , 
			height: pong.gameHeight - 2 * buffer, 
			color: pong.menuBackColor},
			pong.context);

		let winner = (pong.player1.score === pong.goal) ? pong.player1.name : pong.player2.name;

		const line1 = winner + ' WON !';
		const line2 = 'Press space key to restart';
		const sizeLine = pong.context.measureText(line1);
		drawText({
			str: line1, 
			start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 - 5}), 
			color: pong.menuTextColor, 
			font: pong.menuFont, 
			fontDecoration: pong.menuFontDecoration, 
			fontPx: pong.menuFontPx
		}, pong.context);
		drawText({
			str: line2, 
			start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 + pong.menuFontPx / 2}), 
			color: pong.menuTextColor, 
			font: pong.menuFont, 
			fontDecoration: pong.menuFontDecoration, 
			fontPx: pong.menuFontPx/2
		}, pong.context);
	}
}

function colision(player: Player, pong:GameParam):boolean {
    const ballTop:number = pong.ball.pos.y - pong.ballRadius;
    const ballBtm:number = pong.ball.pos.y + pong.ballRadius;
    const ballLeft:number = pong.ball.pos.x - pong.ballRadius;
    const ballRight:number = pong.ball.pos.x + pong.ballRadius;

    const paddleTop:number =  player.pos.y;
    const paddleBtm:number = player.pos.y + pong.paddleHeight;
    const paddleLeft:number = player.pos.x;
    const paddleRight:number = player.pos.x + pong.paddleWidth;

    return (ballRight > paddleLeft && ballTop < paddleBtm && ballLeft < paddleRight && ballBtm > paddleTop)
}

function leftboard(pong:GameParam):boolean {
    return (pong.ball.pos.x > pong.gameWidth || pong.ball.pos.x < 0)
}

function resetPosition(pong:GameParam):GameParam {
    pong.ball.pos = new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2});
    pong.ball.speed = pong.ballInitSpeed;
    pong.ball.dir.x = -pong.ball.dir.x;
    pong.player1.pos = new Point({x: 0, y: pong.gameHeight / 2 - pong.paddleHeight / 2});
    pong.player2.pos = new Point({x: pong.gameWidth - pong.paddleWidth, y: pong.gameHeight / 2 - pong.paddleHeight / 2});
	return (pong);
}

function resetGame(pong:GameParam):GameParam {
    pong = resetPosition(pong);
    pong.ball.dir = pong.ballInitDir;
    pong.player1.score = 0;
    pong.player2.score = 0;
	return (pong);
}

function move(pong:GameParam):GameParam {
	if (pong.context) {
		if (pong.player1.upArrowDown && pong.player1.pos.y > 0) {
			pong.player1.pos.y -= pong.paddleSpeed;
		}
		if (pong.player1.downArrowDown && pong.player1.pos.y + pong.paddleHeight < pong.gameHeight) {
			pong.player1.pos.y += pong.paddleSpeed;
		}
		if (pong.player2.upArrowDown && pong.player2.pos.y > 0) {
			pong.player2.pos.y -= pong.paddleSpeed;
		}
		if (pong.player2.downArrowDown && pong.player2.pos.y + pong.paddleHeight < pong.gameHeight) {
			pong.player2.pos.y += pong.paddleSpeed;
		}
	
		pong.ball.pos.x += (pong.ball.speed / Math.sqrt(pong.ball.dir.x**2 + pong.ball.dir.y**2)) * pong.ball.dir.x;
		pong.ball.pos.y += (pong.ball.speed / Math.sqrt(pong.ball.dir.x**2 + pong.ball.dir.y**2)) * pong.ball.dir.y;
		/*Top or bottom collision*/
		if (pong.ball.pos.y > pong.gameHeight - pong.ballRadius 
			|| pong.ball.pos.y < pong.ballRadius) {
				pong.ball.dir.y = - pong.ball.dir.y;
		}
		/* Paddle colision*/
		let playerWithBall = (pong.ball.pos.x <= pong.gameWidth / 2) ? pong.player1 : pong.player2;
		let otherPlayer = (pong.ball.pos.x <= pong.gameWidth / 2) ? pong.player2 : pong.player1;
		let direction = (pong.ball.pos.x <= pong.gameWidth / 2) ? 1 : -1;
	
		if (colision(playerWithBall, pong)) {
			let colisionY = (pong.ball.pos.y - (playerWithBall.pos.y + pong.paddleHeight / 2)) / (pong.paddleHeight / 2);
			let ang = colisionY * (Math.PI / 4);
			pong.ball.dir.x = direction * Math.cos(ang);
			pong.ball.dir.y = Math.sin(ang);
			pong.ball.speed += pong.ballSpeedIncrease;
		}
		if (leftboard(pong)) {
			otherPlayer.score++;
			if (otherPlayer.score == pong.goal) {
				pong.endgame = true;
			}
			pong.play = false;
			resetPosition(pong);
		}
	}
	return (pong);
}

function render(pong:GameParam):GameParam{
    if (pong.play){
        pong = move(pong);
    }
    printGame(pong);
    if (!pong.play && !pong.endgame) {
        printStartMenu(pong);
    }
    else if (pong.endgame) {
        printWinnerMenu(pong);
    }
	return (pong);
}

const controlDown = (event: KeyboardEvent, pong:GameParam):GameParam => {
    if (event.key === 'ArrowUp') {
        pong.player2.upArrowDown = true;
    }
    else if (event.key === 'ArrowDown') {
        pong.player2.downArrowDown = true;
    }
    else if (event.key === 'w' || event.key === 'W') {
        pong.player1.upArrowDown = true;
    }
    else if (event.key === 's' || event.key === 'S') {
        pong.player1.downArrowDown = true;
    }
    else if (event.key === ' ') {
        pong.play = true;
        if (pong.endgame) {
            resetGame(pong);
        }
        pong.endgame = false;
    }
	return (pong);
};

const controlUp = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
        player2.upArrowDown = false;
    }
    else if (event.key === 'ArrowDown') {
        player2.downArrowDown = false;
    }
    else if (event.key === 'w' || event.key === 'W') {
        player1.upArrowDown = false;
    }
    else if (event.key === 's' || event.key === 'S') {
        player1.downArrowDown = false;
    }
};

function Game() {
	useEffect(() => {
		const canvas:HTMLCanvasElement = document.getElementById("pong") as HTMLCanvasElement;
		const context = canvas.getContext("2d");
		if (context) {
			drawRect({
				start: new Point({x:0,y:0}), 
				width: 800, 
				height:500,
				color:'black',
			}, context);
		}
	});

	return (
		<canvas id="pong" width="800" height="500"></canvas>
	)
}

export default Game;