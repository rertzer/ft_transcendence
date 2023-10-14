import React, {useEffect, useState, useContext} from "react";
import { Canvas } from "../canvas";
import gameContext from '../../gameContext';
import { IBall, IGameParam, IPoint, IPlayer } from "./interfacesGame";
import { drawCircle, drawRect, drawText } from "./draw";

function GameArea(props:any) {

	const {gameWidth, gameHeight } = useContext(gameContext);

	const pong:IGameParam = {
		gameWidth: gameWidth,
		gameHeight: gameHeight, 
		ballRadius: 7,
		paddleWidth: 10,
		paddleHeight: gameHeight / 4,
		scoreWidth: gameWidth / 8,
		scoreHeight: gameHeight / 4,
		netWidth: 2,
		netHeight: 10,
		netInterval: 5,
		backColor: '#000000',
		ballColor: '#f2c546',
		netColor: '#FFFFFF',
		scoreColor: '#FFFFFF',
		scoreFont: 'sans-serif',
		scoreFontDecoration: '',
		scoreFontPx: 12,
		nameFont: 'sans-serif',
		nameFontDecoration: 'italic',
		nameFontPx: 12,
		nameColor: '#FFFFFF',
		ballInitSpeed: 5,
		ballInitDir: {x: 1, y: -1},
		ballSpeedIncrease: 0.2,
		paddleSpeed: 7,
		play: false,
		menuBackColor: 'rgba(255,255,255,0.8)',
		menuTextColor: '#000000',
		menuFont: 'sans-serif',
		menuFontDecoration: 'bold',
		menuFontPx: 12,
		goal: 3,
		endgame: false,
	};
	
	const [player1, setPlayer1] = useState({
		pos: {x:0, y: pong.gameHeight / 2 - pong.paddleHeight / 2},
		score: 0,
		scorePos: {x: pong.gameWidth / 4, y:pong.gameHeight / 5},
		upArrowDown:false,
    	downArrowDown:false,
		name:"Player 1",
		namePos:{x: pong.gameWidth / 4, y: pong.gameHeight - 20},
		color:'#16B84E'
		})

	const [player2, setPlayer2] = useState({
		pos: {x: pong.gameWidth - pong.paddleWidth, y: pong.gameHeight / 2 - pong.paddleHeight / 2}, 
		score: 0,
		scorePos: {x: 3 * pong.gameWidth / 4, y: pong.gameHeight / 5}, 
		upArrowDown:false,
    	downArrowDown:false,
		name: "Player 2",
		namePos: {x: 3 * pong.gameWidth / 4, y: pong.gameHeight - 20},
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

		//Move the player
		if (player1.upArrowDown && player1.pos.y > 0) {
			player1.pos.y -= pong.paddleSpeed;
		}
		if (player1.downArrowDown && player1.pos.y + pong.paddleHeight < pong.gameHeight) {
			player1.pos.y += pong.paddleSpeed;
		}
		if (player2.upArrowDown && player2.pos.y > 0) {
			player2.pos.y -= pong.paddleSpeed;
		}
		if (player2.downArrowDown && player2.pos.y + pong.paddleHeight < pong.gameHeight) {
			player2.pos.y += pong.paddleSpeed;
		}
		
		window.addEventListener('keydown', handleKey);
		window.addEventListener('keyup', handleKey);
		return (() => {
			window.removeEventListener('keydown', handleKey)
			window.removeEventListener('keyup', handleKey)
		});
	}, [player1, player2]);

	const [position, setPosition] = useState({ x: 0, y: 0 });
	
	useEffect(() => {
		const handleMove = () => {
			const newX = position.x + 5;
			const newY = position.y + 5;
			setPosition({ x: newX, y: newY });
		};
    	window.addEventListener('click', handleMove);
  		return () => window.removeEventListener('click', handleMove);
	}, [position]);

	const styleCanvas = {width:gameWidth, height:gameHeight, backgroundColor:'purple'};
	
	function printGame(context:CanvasRenderingContext2D):void{
		context.clearRect(0, 0, context.canvas.width, context.canvas.height)
		
		// Print Background
		drawRect({
			start: {x: 0, y: 0}, 
			width: pong.gameWidth, 
			height: pong.gameHeight, 
			color: pong.backColor
		}, context);
		
		// Print Net 
		let net = {x: pong.gameWidth / 2 - pong.netWidth / 2, y: 0};
		while (net.y< pong.gameHeight)
		{
			drawRect({
				start:net, 
				width: pong.netWidth, 
				height: pong.netHeight,
				color: pong.netColor
			}, context);
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
		}, context);
		drawText({
			str: player2.score.toString(), 
			start: player2.scorePos, 
			color: pong.scoreColor, 
			font: pong.scoreFont, 
			fontDecoration: pong.scoreFontDecoration,
			fontPx: pong.scoreFontPx
		}, context);
	
		// Print Player name
		drawText({
			str: player1.name, 
			start: player1.namePos, 
			color: pong.nameColor, 
			font: pong.nameFont, 
			fontDecoration: pong.nameFontDecoration, 
			fontPx: pong.nameFontPx
		}, context);
		drawText({
			str: player2.name, 
			start: player2.namePos, 
			color: pong.nameColor, 
			font: pong.nameFont, 
			fontDecoration: pong.nameFontDecoration, 
			fontPx: pong.nameFontPx
		}, context);
		
		// Print Game elements 
		/*drawCircle({
			center: ball.pos, 
			radius: pong.ballRadius,
			color: pong.ballColor
		}, pong.context);*/
		drawRect({
			start: player1.pos, 
			width: pong.paddleWidth, 
			height: pong.paddleHeight, 
			color: player1.color
		}, context);
		drawRect({
			start: player2.pos, 
			width: pong.paddleWidth,
			height: pong.paddleHeight, 
			color: player2.color
		}, context);
	}

	return (
		<Canvas draw = {printGame} style={styleCanvas} />
	);

};

export default GameArea
