import {useEffect, useState, useContext} from "react";
import { Canvas } from "../canvas";
import gameContext from '../../gameContext';
import printStartMenu from "./printStartMenu";
import printGame from "./printGame";
import printWinnerMenu from "./printWinnerMenu";
import { gameSocket } from "../../services/gameSocketService";
import { GameStatus } from "./interfacesGame";

function GameArea(props:any) {

	const {roomName, gameWidth, gameHeight, playerName, playerSide, setPlayerSide, opponentName, setOpponentName} = useContext(gameContext);
	const [pong, setPong] = useState({
		idRoom: '',
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
		ballSpeedIncrease: 0.00005,
		paddleSpeed: 0.01,
		play: false,
		menuBackColor: 'rgba(255,255,255,0.8)',
		menuTextColor: '#000000',
		menuFont: 'sans-serif',
		menuFontDecoration: 'bold',
		menuFontPx: 0.07,
		goal: 3,
		endgame: false,
		gameStatus:'WAITING' as GameStatus
	});
	/* besoin d'initialiser les valeurs du Game Param avec les valeurs envoyes par la backend pour celles qui sont importante pour le game */

	const styleCanvas = {width:gameWidth, height:gameHeight, backgroundColor: pong.backColor};
	
	const [frontEndPlayerLeft, setFrontEndPlayerLeft] = useState({
		posY: 0.5,
		score: 0,
		scorePos: {x: 1 / 4, y: 1 / 5},
		upArrowDown:false,
    	downArrowDown:false,
		name:"",
		namePos:{x: 1 / 4, y: 0.9},
		color:'#16B84E'
	});

	const [frontEndPlayerRight, setFrontEndPlayerRight] = useState({
		posY: 0.5, 
		score: 0,
		scorePos: {x: 3 / 4, y: 1 / 5}, 
		upArrowDown:false,
    	downArrowDown:false,
		name: "",
		namePos: {x: 3 / 4, y: 0.9},
		color: '#BB0B0B'
	});
	
	const [ball, setBall] = useState({
		pos: {x: 1 / 2, y: 1 / 2}, 
    	speed: pong.ballInitSpeed, 
    	dir: pong.ballInitDir
	});
	
	useEffect(() => {
		function onConnect() {
			console.log("Connected with socket: ", gameSocket.id);
			console.log(window.devicePixelRatio)
		}
		function onDisconnect() {
			console.log("Disconnected");
		}
		function onRoomStatusChanged(data:any) {
			console.log("room_status_change");
			console.log(data);
			if (data.yourSide === 'left') {
				setPlayerSide('left');
				setFrontEndPlayerLeft((prev) => ({ ...prev, name: playerName}));
				if (typeof(data.opponentName) != 'undefined') setFrontEndPlayerRight((prev) => ({ ...prev, name: data.opponentName}));
			}
			else {
				setPlayerSide('right');
				setFrontEndPlayerRight((prev) => ({ ...prev, name: playerName}));
				if (typeof(data.opponentName) != 'undefined') setFrontEndPlayerLeft((prev) => ({ ...prev, name: data.opponentName}));
			}
		}

		function onGameStatus(data:any) {
			setBall((prev) => ({ ...prev, pos: data.ball.pos, dir:data.ball.dir, speed:data.ball.speed}))
			setFrontEndPlayerLeft((prev) => ({ ...prev, posY: data.posYLeft, score: data.scoreLeft}));
			setFrontEndPlayerRight((prev) => ({ ...prev, posY: data.posYRight, score: data.scoreRight}));
			setPong((prev) => ({ ...prev, gameStatus:data.gameStatus, idRoom: data.idRoom}))
		}
		gameSocket.on('connect', onConnect);
		gameSocket.on('disconnect', onDisconnect);
		console.log('roomName: ', roomName);
		console.log('playerName: ', playerName);
		gameSocket.emit("join_game", {roomName, playerName});
		gameSocket.on('room_status_change', onRoomStatusChanged);
		gameSocket.on('game_status', onGameStatus);

		return () => {
			gameSocket.off('connect', onConnect);
			gameSocket.off('disconnect', onDisconnect);
			gameSocket.off('room_status_change', onRoomStatusChanged);
			gameSocket.off('game_status', onGameStatus);
		}			
			
	}, [playerName, roomName, setPlayerSide ]);

	useEffect(() => {
		const resetGame = () => {
			setBall(() => ({pos: {x: 1 / 2, y: 1 / 2}, speed:pong.ballInitSpeed, dir: pong.ballInitDir}));
			setFrontEndPlayerLeft((prev) => ({...prev, posY: 1 / 2, score: 0}));
			setFrontEndPlayerRight((prev) => ({...prev, posY: 1 / 2, score: 0}));
		}

		const handleKey = (event: KeyboardEvent) => {
			let move:boolean = false
			if (event.type === 'keydown') {
				move = true;
			}
			switch (event.code){
				case 'KeyW':
					gameSocket.emit('keyevent', {move:move, key:'KeyW'});
					break;
				case 'KeyS':
					gameSocket.emit('keyevent', {move:move, key:'KeyS'});
					break;
				case 'ArrowUp':
					gameSocket.emit('keyevent', {move:move, key:'ArrowUp'});
					break;
				case 'ArrowDown':
					gameSocket.emit('keyevent', {move:move, key:'ArrowDown'});
					break;
				case 'Space': /*A GERER DANS LE BACK END*/
					gameSocket.emit('keyevent', {move:move, key:'Space'});
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
	}, [frontEndPlayerLeft.posY, frontEndPlayerRight.posY, pong.endgame, pong.ballInitSpeed, pong.ballInitDir]);

	function render(context:CanvasRenderingContext2D):void {
		context.clearRect(0, 0, context.canvas.width, context.canvas.height)
		printGame({context:context, pong:pong, playerLeft:frontEndPlayerLeft, playerRight:frontEndPlayerRight, ball:ball, gameWidth:gameWidth, gameHeight:gameHeight});
		if (!pong.play && !pong.endgame) {
			printStartMenu({pong, context, gameWidth, gameHeight});
		}
		else if (pong.endgame) {
			printWinnerMenu({context:context, pong:pong, playerLeft:frontEndPlayerLeft,  playerRight:frontEndPlayerRight, gameWidth:gameWidth, gameHeight:gameHeight});
		}
	}

	return (
		<Canvas draw = {render} style={styleCanvas} />
	);

};

export default GameArea
