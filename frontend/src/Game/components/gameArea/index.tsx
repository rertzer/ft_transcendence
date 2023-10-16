import React, {useEffect, useState, useContext} from "react";
import { Canvas } from "../canvas";
import gameContext from '../../gameContext';
import { IBall, IGameParam, IPoint, IPlayer } from "./interfacesGame";
import { drawCircle, drawRect, drawText } from "./draw";
import printStartMenu from "./printStartMenu";

function GameArea(props:any) {
	const {gameWidth, gameHeight } = useContext(gameContext);
	const [pong, setPong] = useState({
		ballRadius: 0.02,
		paddleWidth: 0.02,
		paddleHeight: 0.25,
		netWidth: 0.005,
		netHeight: 0.05,
		netInterval: 0.025,
		backColor: '#000000',
		ballColor: '#f2c546',
		netColor: '#FFFFFF',
		scoreColor: '#FFFFFF',
		scoreFont: 'sans-serif',
		scoreFontDecoration: '',
		scoreFontPx: 0.07,
		nameFont: 'sans-serif',
		nameFontDecoration: 'italic',
		nameFontPx: 0.05,
		nameColor: '#FFFFFF',
		ballInitSpeed: 0.006,
		ballInitDir: {x: 1, y: -1},
		ballSpeedIncrease: 0.2,
		paddleSpeed: 0.01,
		play: false,
		menuBackColor: 'rgba(255,255,255,0.8)',
		menuTextColor: '#000000',
		menuFont: 'sans-serif',
		menuFontDecoration: 'bold',
		menuFontPx: 0.07,
		goal: 3,
		endgame: false,});
	
	const styleCanvas = {width:gameWidth, height:gameHeight, backgroundColor: pong.backColor};

	const [player1, setPlayer1] = useState({
		pos: {x:0, y: 0.5 - pong.paddleHeight / 2},
		score: 0,
		scorePos: {x: 1 / 4, y: 1 / 5},
		upArrowDown:false,
    	downArrowDown:false,
		name:"Player 1",
		namePos:{x: 1 / 4, y: 0.9},
		color:'#16B84E'
		})

	const [player2, setPlayer2] = useState({
		pos: {x: 1 - pong.paddleWidth, y: (0.5 - pong.paddleHeight / 2)}, 
		score: 0,
		scorePos: {x: 3 / 4, y: 1 / 5}, 
		upArrowDown:false,
    	downArrowDown:false,
		name: "Player 2",
		namePos: {x: 3 / 4, y: 0.9},
		color: '#BB0B0B'
		})

	useEffect(() => {
		const handleKey = (event: KeyboardEvent) => {
			let move:boolean = false
			if (event.type === 'keydown') {
				move = true;
			}
			switch (event.code){
				case 'KeyW':
					setPlayer1((prev) => ({ ...prev, upArrowDown: move}));
					break;
				case 'KeyS':
					setPlayer1((prev) => ({ ...prev, downArrowDown: move}));
					break;
				case 'ArrowUp':
					setPlayer2((prev) => ({ ...prev, upArrowDown: move}));
					break;
				case 'ArrowDown':
					setPlayer2((prev) => ({ ...prev, downArrowDown: move}));
					break;
				default:
					return; 
			}
		};

		window.addEventListener('keydown', handleKey);
		window.addEventListener('keyup', handleKey);
		return (() => {
			window.removeEventListener('keydown', handleKey)
			window.removeEventListener('keyup', handleKey)
		});
	}, [player1, player2]);
	
	const movePlayers = () => {
		if (player1.upArrowDown) player1.pos.y =  Math.max(0, player1.pos.y - pong.paddleSpeed);
		if (player1.downArrowDown) player1.pos.y = Math.min(1 - pong.paddleHeight, player1.pos.y + pong.paddleSpeed);
		if (player2.upArrowDown) player2.pos.y = Math.max(0, player2.pos.y - pong.paddleSpeed);
		if (player2.downArrowDown) player2.pos.y = Math.min(1 - pong.paddleHeight, player2.pos.y + pong.paddleSpeed);
	};

	function printGame(context:CanvasRenderingContext2D):void{
		context.clearRect(0, 0, context.canvas.width, context.canvas.height)
		movePlayers();
				
		// Print Net 
		let net = {x: 1 / 2 - pong.netWidth / 2, y: 0};
		while (net.y < 1)
		{
			drawRect({
				start:{x:net.x * gameWidth, y:net.y * gameHeight}, 
				width: pong.netWidth * gameWidth, 
				height: pong.netHeight * gameHeight,
				color: pong.netColor
			}, context);
			net.y += pong.netHeight + pong.netInterval;
		}
	
		// Print score
		drawText({
			str: player1.score.toString(), 
			start: {x: player1.scorePos.x * gameWidth, y: player1.scorePos.y * gameHeight}, 
			color: pong.scoreColor, 
			font: pong.scoreFont, 
			fontDecoration: pong.scoreFontDecoration, 
			fontPx: pong.scoreFontPx * gameHeight
		}, context);
		drawText({
			str: player2.score.toString(), 
			start: {x: player2.scorePos.x * gameWidth, y: player2.scorePos.y * gameHeight},  
			color: pong.scoreColor, 
			font: pong.scoreFont, 
			fontDecoration: pong.scoreFontDecoration,
			fontPx: pong.scoreFontPx * gameHeight
		}, context);
	
		// Print Player name
		drawText({
			str: player1.name, 
			start: {x: player1.namePos.x * gameWidth, y: player1.namePos.y * gameHeight},
			color: pong.nameColor, 
			font: pong.nameFont, 
			fontDecoration: pong.nameFontDecoration, 
			fontPx: pong.nameFontPx * gameHeight
		}, context);
		drawText({
			str: player2.name, 
			start: {x: player2.namePos.x * gameWidth, y: player2.namePos.y * gameHeight},
			color: pong.nameColor, 
			font: pong.nameFont, 
			fontDecoration: pong.nameFontDecoration, 
			fontPx: pong.nameFontPx * gameHeight
		}, context);
		
		// Print Game elements 
		/*drawCircle({
			center: ball.pos, 
			radius: pong.ballRadius,
			color: pong.ballColor
		}, pong.context);*/
		drawRect({
			start: {x:player1.pos.x * gameWidth, y:player1.pos.y * gameHeight}, 
			width: pong.paddleWidth * gameWidth,
			height: pong.paddleHeight * gameHeight, 
			color: player1.color
		}, context);
		drawRect({
			start: {x:player2.pos.x * gameWidth, y:player2.pos.y * gameHeight}, 
			width: pong.paddleWidth * gameWidth,
			height: pong.paddleHeight * gameHeight, 
			color: player2.color
		}, context);
		printStartMenu(pong, context, gameWidth, gameHeight);

	}

	return (
		<Canvas draw = {printGame} style={styleCanvas} />
	);

};

export default GameArea
