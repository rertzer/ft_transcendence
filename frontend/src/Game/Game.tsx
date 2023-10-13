import React, {useEffect, useState} from 'react';
/* import Point from './classes/Point';
import Player from './classes/Player';
import GameParam from './classes/GameParam';
import Ball from './classes/Ball'; */
//import {drawCircle, drawRect, drawText} from './functions/draw';
import printGame from './functions/printGame';
import printStartMenu from './functions/printStartMenu';
import printWinnerMenu from './functions/printWinnerMenu';
import socketService from './services/socketService';
import { JoinRoom } from './components/joinRoom';
import GameContext, { IGameContextProps } from './gameContext';
import { GameCanvas } from './components/gameCamvas';
//import { colision, leftboard } from './functions/testColision';


/*function Game() {
	const [pong, setGameParam] = useState({} as GameParam);
	const [player1, setPlayer1] = useState({} as Player);
	const [player2, setPlayer2] = useState({} as Player);
	const [ball, setBall] = useState({} as Ball);
	//const [framePerSec, setFramePerSec] = useState(50);

	useEffect(() => {
		const canvas:HTMLCanvasElement = document.getElementById("pong") as HTMLCanvasElement;
		const context = canvas.getContext("2d");
		setGameParam(new GameParam({
			context: context,
			gameWidth: canvas.width,
			gameHeight: canvas.height,
			ballRadius: 7,
			paddleWidth: 10,
			paddleHeight: canvas.height / 4,
			scoreWidth: canvas.width / 8,
			scoreHeight: canvas.height / 4,
			netWidth: 2,
			netHeight: 10,
			netInterval: 5,
			backColor: '#000000',
			ballColor: '#f2c546',
			netColor: '#FFFFFF',
			scoreColor: '#FFFFFF',
			scoreFont: 'sans-serif',
			scoreFontDecoration: '',
			scoreFontPx: 75,
			nameFont: 'sans-serif',
			nameFontDecoration: 'italic',
			nameFontPx: 20,
			nameColor: '#FFFFFF',
			ballInitSpeed: 5,
			ballInitDir: new Point({x: 1, y: -1}),
			ballSpeedIncrease: 0.2,
			paddleSpeed: 7,
			play: false,
			menuBackColor: 'rgba(255,255,255,0.8)',
			menuTextColor: '#000000',
			menuFont: 'sans-serif',
			menuFontDecoration: 'bold',
			menuFontPx: 35,
			goal: 3,
			endgame: false,
		}));
		console.log('coucou');
		setPlayer1(new Player({
			pos:new Point({x:0, y: pong.gameHeight / 2 - pong.paddleHeight / 2}),
			scorePos: new Point({x: pong.gameWidth / 4, y:pong.gameHeight / 5}), 
			name:"Player 1",
			namePos:new Point({x: pong.gameWidth / 4, y: pong.gameHeight - 20} ), 
			color:'#16B84E'
			}));
		setPlayer2(new Player({
			pos: new Point({x: pong.gameWidth - pong.paddleWidth, y: pong.gameHeight / 2 - pong.paddleHeight / 2}), 
			scorePos: new Point({x: 3 * pong.gameWidth / 4, y: pong.gameHeight / 5}), 
			name: "Player 2",
			namePos: new Point({x: 3 * pong.gameWidth / 4, y: pong.gameHeight - 20}), 
			color: '#BB0B0B'
			}));
		setBall(new Ball({
				pos: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2}), 
				speed: pong.ballInitSpeed, 
				dir: pong.ballInitDir
				}));
	}, []);


	function render():void {
		printGame(pong, ball, player1, player2);
		if (!pong.play && !pong.endgame) {
			printStartMenu(pong);
		}
		else if (pong.endgame) {
			printWinnerMenu(pong, player1, player2);
		}
	}

	useEffect(() => {
		const intervalId = setInterval(() => {
			render();
		}, 10);
		return () => {
			clearInterval(intervalId);
		}
	}, []);

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
			//Top or bottom collision
			if (pong.ball.pos.y > pong.gameHeight - pong.ballRadius 
				|| pong.ball.pos.y < pong.ballRadius) {
					pong.ball.dir.y = - pong.ball.dir.y;
			}
			// Paddle colision
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

	return (
		<canvas id="pong" width="800" height="500"></canvas>
	)
}*/
const connectSocket = async () => {
	const socket = await socketService.connect('http://localhost:4000')
	.then((s) => {console.log("Connected with socket: ", s.id);})
	.catch((error) => {
		console.log("Error: ", error);
	});
};

function Game() {
	const [isInRoom, setInRoom] = useState(false);

	useEffect(() => {
		connectSocket();
	}, []);

	const gameContextValue :IGameContextProps = {
		isInRoom, 
		setInRoom,
	};
	
	return (
		<GameContext.Provider value={gameContextValue}>
			{!isInRoom && <JoinRoom />}
			{isInRoom && <GameCanvas />}
		</GameContext.Provider>
	)
}


export default Game;