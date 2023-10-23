import {useEffect, useState, useContext} from "react";
import { Canvas } from "../canvas";
import gameContext from '../../gameContext';
import printStartMenu from "./printStartMenu";
import { colision,leftboard } from "./testColision";
import printGame from "./printGame";
import printWinnerMenu from "./printWinnerMenu";
import { gameSocket } from "../../services/gameSocketService";


/*
const connectSocket = async () => {
	if (gameSocketService.socket != null)
		return;
	const socket = await gameSocketService.connect('http://localhost:4000')
	.then((s) => {console.log("Connected with socket: ", s.id);})
	.catch((error) => {
		console.log("Error: ", error);
	});
};*/


function GameArea(props:any) {

	const {roomName, gameWidth, gameHeight, playerName, playerSide, setPlayerSide, opponentName, setOpponentName} = useContext(gameContext);
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
	
	const [playerLeft, setplayerLeft] = useState({
		pos: {x:0, y: 0.5},
		score: 0,
		scorePos: {x: 1 / 4, y: 1 / 5},
		upArrowDown:false,
    	downArrowDown:false,
		name:"Player 1",
		namePos:{x: 1 / 4, y: 0.9},
		color:'#16B84E'
	});

	const [playerRight, setplayerRight] = useState({
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
		setplayerLeft((prev) => ({...prev, pos: {x: 0, y: 1 / 2 - pong.paddleHeight / 2}}));
		setplayerRight((prev) => ({...prev, pos: {x: 1 - pong.paddleWidth, y: 1 / 2 - pong.paddleHeight / 2}}));
	}
	
	const resetGame = () => {
		resetPosition();
		setBall(() => ({pos: {x: 1 / 2, y: 1 / 2}, speed:pong.ballInitSpeed, dir: pong.ballInitDir}));
		setplayerLeft((prev) => ({...prev, score: 0}));
		setplayerRight((prev) => ({...prev, score: 0}));
	}

	useEffect(() => {
		function onConnect() {
			console.log("Connected with socket: ", gameSocket.id);
		}
		function onDisconnect() {
			console.log("Disconnected");
		}
		function onRoomJoined(data:any) {
			console.log("Room joined !");
			if (data.yourSide === 'left')
			{
				setPlayerSide('left');
				setplayerLeft((prev) => ({ ...prev, name: playerName}));
			}
		}
		function onRoomStatusChanged(data:any) {
			console.log("room_status_change");
			console.log(data);
		}
		gameSocket.on('connect', onConnect);
		gameSocket.on('disconnect', onDisconnect);
		console.log('roomName: ', roomName);
		console.log('playerName: ', playerName);
		gameSocket.emit("join_game", {roomName, playerName});
		gameSocket.on("room_joined", onRoomJoined);
		gameSocket.on('room_status_change', onRoomStatusChanged);		

		return () => {
			gameSocket.off('connect', onConnect);
			gameSocket.off('disconnect', onDisconnect);
			gameSocket.off("room_joined", onRoomJoined);
			gameSocket.off('room_status_change', onRoomStatusChanged);
		}			
			
	}, []);

	useEffect(() => {
		const handleKey = (event: KeyboardEvent) => {
			let move:boolean = false
			if (event.type === 'keydown') {
				move = true;
			}
			switch (event.code){
				case 'KeyW':
					setplayerLeft((prev) => ({ ...prev, upArrowDown: move}));
					break;
				case 'KeyS':
					setplayerLeft((prev) => ({ ...prev, downArrowDown: move}));
					break;
				case 'ArrowUp':
					setplayerRight((prev) => ({ ...prev, upArrowDown: move}));
					break;
				case 'ArrowDown':
					setplayerRight((prev) => ({ ...prev, downArrowDown: move}));
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
	}, [playerLeft, playerRight]);
	
	

	const movePlayers = () => {
		if (playerLeft.upArrowDown) playerLeft.pos.y = Math.max(0, playerLeft.pos.y - pong.paddleSpeed);
		if (playerLeft.downArrowDown) playerLeft.pos.y = Math.min(1 - pong.paddleHeight, playerLeft.pos.y + pong.paddleSpeed);
		if (playerRight.upArrowDown) playerRight.pos.y = Math.max(0, playerRight.pos.y - pong.paddleSpeed);
		if (playerRight.downArrowDown) playerRight.pos.y = Math.min(1 - pong.paddleHeight, playerRight.pos.y + pong.paddleSpeed);
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
		let playerWithBall = (ball.pos.x <= 1 / 2) ? playerLeft : playerRight;
		let otherPlayer = (ball.pos.x <= 1 / 2) ? playerRight : playerLeft;
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
			if (otherPlayer.score === pong.goal) {
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
		printGame({context:context, pong:pong, playerLeft:playerLeft, playerRight:playerRight, ball:ball, gameWidth:gameWidth, gameHeight:gameHeight});
		if (!pong.play && !pong.endgame) {
			printStartMenu({pong, context, gameWidth, gameHeight});
		}
		else if (pong.endgame) {
			printWinnerMenu({context, pong, playerLeft,  playerRight, gameWidth, gameHeight});
		}
	}

	return (
		<Canvas draw = {render} style={styleCanvas} />
	);

};

export default GameArea
