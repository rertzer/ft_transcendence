import {useEffect, useState, useContext} from "react";
import { Canvas } from "../canvas";
import gameContext from '../../gameContext';
import printStartMenu from "./printStartMenu";
import { colision,leftboard } from "./testColision";
import printGame from "./printGame";
import printWinnerMenu from "./printWinnerMenu";

function GameArea(props:any) {
	const {gameWidth, gameHeight } = useContext(gameContext);
	const [pong, setPong] = useState({
		ballRadius: 0.01,
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
		ballInitDir: {x: 0.5, y: -1},
		ballSpeedIncrease: 0.0005,
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
	
	const [players, setPlayers] = useState([{},{}]);
	const [player1, setPlayer1] = useState({
		pos: {x:0, y: 0.5 - pong.paddleHeight / 2},
		score: 0,
		scorePos: {x: 1 / 4, y: 1 / 5},
		upArrowDown:false,
    	downArrowDown:false,
		name:"Player 1",
		namePos:{x: 1 / 4, y: 0.9},
		color:'#16B84E'
	});

	const [player2, setPlayer2] = useState({
		pos: {x: 1 - pong.paddleWidth, y: (0.5 - pong.paddleHeight / 2)}, 
		score: 0,
		scorePos: {x: 3 / 4, y: 1 / 5}, 
		upArrowDown:false,
    	downArrowDown:false,
		name: "Player 2",
		namePos: {x: 3 / 4, y: 0.9},
		color: '#BB0B0B'
	});
	
	const [ball, setBall] = useState({
		pos: {x: 1 / 2, y: 1 / 2}, 
    	speed: pong.ballInitSpeed, 
    	dir: pong.ballInitDir
	});

	const resetPosition = () => {
		setBall((prev) => ({pos: {x: 1 / 2, y: 1 / 2}, speed:pong.ballInitSpeed, dir: {x: -prev.dir.x, y: prev.dir.y}}));
		setPlayer1((prev) => ({...prev, pos: {x: 0, y: 1 / 2 - pong.paddleHeight / 2}}));
		setPlayer2((prev) => ({...prev, pos: {x: 1 - pong.paddleWidth, y: 1 / 2 - pong.paddleHeight / 2}}));
	}
	
	const resetGame = () => {
		resetPosition();
		setBall(() => ({pos: {x: 1 / 2, y: 1 / 2}, speed:pong.ballInitSpeed, dir: pong.ballInitDir}));
		setPlayer1((prev) => ({...prev, score: 0}));
		setPlayer2((prev) => ({...prev, score: 0}));
	}

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
				case 'Space':
					setPong((prev) => ({...prev, play: true, endgame:false}));
					if (pong.endgame) {
						resetGame();
					}
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
		if (player1.upArrowDown) player1.pos.y = Math.max(0, player1.pos.y - pong.paddleSpeed);
		if (player1.downArrowDown) player1.pos.y = Math.min(1 - pong.paddleHeight, player1.pos.y + pong.paddleSpeed);
		if (player2.upArrowDown) player2.pos.y = Math.max(0, player2.pos.y - pong.paddleSpeed);
		if (player2.downArrowDown) player2.pos.y = Math.min(1 - pong.paddleHeight, player2.pos.y + pong.paddleSpeed);
	};
	
	const moveBall = () => {
		if (!pong.play) return ;
		
		ball.pos.x += (ball.speed / Math.sqrt(ball.dir.x**2 + ball.dir.y**2)) * ball.dir.x;
    	ball.pos.y += (ball.speed / Math.sqrt(ball.dir.x**2 + ball.dir.y**2)) * ball.dir.y;

		/*Top or bottom collision*/
		if (ball.pos.y > 1 - pong.ballRadius 
			|| ball.pos.y < pong.ballRadius) {
			ball.dir.y = - ball.dir.y;
		}
		/* Paddle colision*/
		let playerWithBall = (ball.pos.x <= 1 / 2) ? player1 : player2;
		let otherPlayer = (ball.pos.x <= 1 / 2) ? player2 : player1;
		let direction = (ball.pos.x <= 1 / 2) ? 1 : -1;
	
		if (colision(playerWithBall, ball, pong)) {
			let colisionY = (ball.pos.y - (playerWithBall.pos.y + pong.paddleHeight / 2)) / (pong.paddleHeight / 2);
			let ang = colisionY * (Math.PI / 4);
			ball.dir.x = direction * Math.cos(ang);
			ball.dir.y = Math.sin(ang);
			ball.speed += pong.ballSpeedIncrease;
		}
		if (leftboard(ball)) {
			otherPlayer.score++;
			if (otherPlayer.score == pong.goal) {
				pong.endgame = true;
			}
			pong.play = false;
			resetPosition();
		}
	}

	function render(context:CanvasRenderingContext2D):void {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height)
		movePlayers();
		moveBall();
		printGame({context:context, pong:pong, player1:player1, player2:player2, ball:ball, gameWidth:gameWidth, gameHeight:gameHeight});
		if (!pong.play && !pong.endgame) {
			printStartMenu({pong, context, gameWidth, gameHeight});
		}
		else if (pong.endgame) {
			printWinnerMenu({context, pong, player1,  player2, gameWidth, gameHeight});
		}
	}

	return (
		<Canvas draw = {render} style={styleCanvas} />
	);

};

export default GameArea
