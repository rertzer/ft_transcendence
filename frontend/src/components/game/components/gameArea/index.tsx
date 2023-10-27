import {useEffect, useState, useContext} from "react";
import { Canvas } from "../canvas";
import gameContext from '../../../../context/gameContext';
import printMenu from "./printMenu";
import printGame from "./printGame";
import { gameSocket } from "../../services/gameSocketService";
import { GameStatus, IPlayer } from "./interfacesGame";

function GameArea(props:any) {
	const {roomName, gameWidth, gameHeight, playerName } = useContext(gameContext);
	const [timeLastFrame, setTimeLastFrame] = useState(new Date());
	const [idPlayerMove, setIdPlayerMove] = useState(0);
	const [myPlayerMoves, setMyPlayerMoves] = useState<{idPlayerMove: number, dy:number}[]>([]);

	const [pong, setPong] = useState({
		idRoom: '',
		ballRadius: 0,
		paddleWidth: 0,
		paddleHeight: 0,
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
		ballInitSpeed: 0,
		ballInitDir: {x: 0.5, y: -1},
		ballSpeedIncrease: 0,
		paddleSpeed: 0,
		play: false,
		menuBackColor: 'rgba(255,255,255,0.8)',
		menuTextColor: '#000000',
		menuFont: 'sans-serif',
		menuFontDecoration: 'bold',
		menuFontPx: 0.07,
		goal: 0,
		endgame: false,
		gameStatus:'WAITING_FOR_PLAYER' as GameStatus, 
		startingCount:0
	});

	const styleCanvas = {width:gameWidth, height:gameHeight, backgroundColor: pong.backColor};

	const [frontEndPlayerLeft, setFrontEndPlayerLeft] = useState({
		posY: 0.5,
		score: 0,
		scorePos: {x: 1 / 4, y: 1 / 5},
		upArrowDown:false,
		downArrowDown:false,
		name:"",
		namePos:{x: 1 / 4, y: 0.9},
		color:'#16B84E', 
		socketId: '',
		readyToPlay:false
	});

	const [frontEndPlayerRight, setFrontEndPlayerRight] = useState({
		posY: 0.5, 
		score: 0,
		scorePos: {x: 3 / 4, y: 1 / 5}, 
		upArrowDown:false,
    	downArrowDown:false,
		name: "",
		namePos: {x: 3 / 4, y: 0.9},
		color: '#BB0B0B', 
		socketId: '', 
		readyToPlay:false
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

		function upDatePlayerPos(){

		}

		function onGameState(data:any) {
			
			setBall((prev) => ({ ...prev, pos: data.ball.pos, dir:data.ball.dir, speed:data.ball.speed}))
			/** Ici je dois regarder l'id de move que le back me renvoie, supprimer tous les mouvements du tableau qui sont 
			 * avant cet id, puis appliquer les mouvements qui restent a chacun.  */
			upDatePlayerPos();
			setFrontEndPlayerLeft((prev) => ({ ...prev, posY: data.posYLeft, score: data.scoreLeft, readyToPlay:data.playerLeft.readyToPlay}));
			setFrontEndPlayerRight((prev) => ({ ...prev, posY: data.posYRight, score: data.scoreRight, readyToPlay:data.playerRight.readyToPlay}));
			setPong((prev) => ({ ...prev, gameStatus:data.gameStatus, startingCount: data.startingCount}))
		}

		function onRoomStatus(data:any) {
			setPong((prev) => ({...prev, 
				idRoom: data.idRoom,
				ballRadius: data.gameParam.ballRadius,
				paddleWidth: data.gameParam.paddleWidth,
				paddleHeight: data.gameParam.paddleHeight,
				ballInitSpeed: data.gameParam.ballInitSpeed,
				ballInitDir: {x:data.gameParam.ballInitDir.x, y:data.gameParam.ballInitDir.y},
				ballSpeedIncrease: data.gameParam.ballSpeedIncrease,
				paddleSpeed:data.gameParam.paddleSpeed,
				goal:data.gameParam.goal,
				gameStatus : data.gameStatus
			}));
			if (typeof(data.playerLeft.name) !== 'undefined' && typeof(data.playerLeft.socketId) !== 'undefined') {
				setFrontEndPlayerLeft((prev) => ({...prev, 
				name: data.playerLeft.name, 
				socketId: data.playerLeft.socketId}));
			}
			else {
				setFrontEndPlayerLeft((prev) => ({...prev, 
					name: '', 
					socketId: ''}))
			}
			if (typeof(data.playerRight.name) !== 'undefined' && typeof(data.playerRight.socketId) !== 'undefined') {
				setFrontEndPlayerRight((prev) => ({...prev, 
				name: data.playerRight.name, 
				socketId: data.playerRight.socketId}));
			}
			else {
				setFrontEndPlayerRight((prev) => ({...prev, 
					name: '', 
					socketId: ''}))
			}
		}

		gameSocket.on('connect', onConnect);
		gameSocket.on('disconnect', onDisconnect);
		gameSocket.emit("join_game", {roomName, playerName});
		gameSocket.on('game_state', onGameState);
		gameSocket.on('room_status', onRoomStatus);

		return () => {
			gameSocket.off('connect', onConnect);
			gameSocket.off('disconnect', onDisconnect);
			gameSocket.off('game_state', onGameState);
			gameSocket.off('room_status', onRoomStatus);
		}			
			
	}, [playerName, roomName ]);

/** Client interpolation .. \
 * il faut que j'enregistre le mouse down ou mouse up cote front. et dans la boucle du jeu, 
 * je regarde si c'est down et si c'est le cas, je deplace mon joueur et j'envoie un message pour dire que j'ai fait le 
 * deplacement, avec un id de mouvement. et je stocke en local les mouvements realises. 
 * 
 * Au niveau du back, je deplace immediatement le joueur quand je suis au courant de l'event, et pas a chaque tour de boucle de back. 
 * 
 * Quand je recoit les infos sur les positions de la part de mon seurveur, je recoit aussi l'id du dernier mouvement qu'il a pris en compte. 
 * Du coup, dans mon tableau, je supprime les mouvements faits par le seurveurs dans la liste des mouvements du player. 
 * Et je rajoute a la position que me donne le serveurs, les mouvements suivants avant d'afficher l'image. 
 * 
 * Gestion des FPS des clients. 
 * Sur les DELL de l'ecole les annimations canvas sont render avec un fps de 60. Mais sur mon mac, je suis a 120. Du coup si j'envoie un 
 * event pour dire de me deplacer a chaque tour de boucle, je vais aller deux fois plus vite... 
 * ==> solution, calculer le temps ecoule entre deux tours de boucle et si c'est trop faible, ne rien faire cette fois ci.
 * 
 */
	useEffect(() => {
		const handleKey = (event: KeyboardEvent) => {
			let move:boolean = false;
			if (event.type === 'keydown') {
				move = true;
			}
			const mySide = frontEndPlayerLeft.socketId === gameSocket.id ? 'left' : 'right';
			switch (event.code){
				case 'KeyW':
					mySide === 'left' ? setFrontEndPlayerLeft((prev) => ({...prev, upArrowDown: move})) : setFrontEndPlayerRight((prev) => ({...prev, upArrowDown: move}))
					break;
				case 'KeyS':
					mySide === 'left' ? setFrontEndPlayerLeft((prev) => ({...prev, downArrowDown: move})) : setFrontEndPlayerRight((prev) => ({...prev, downArrowDown: move}))
					break;
				case 'ArrowUp':
					mySide === 'left' ? setFrontEndPlayerLeft((prev) => ({...prev, upArrowDown: move})) : setFrontEndPlayerRight((prev) => ({...prev, upArrowDown: move}))
					break;
				case 'ArrowDown':
					mySide === 'left' ? setFrontEndPlayerLeft((prev) => ({...prev, downArrowDown: move})) : setFrontEndPlayerRight((prev) => ({...prev, downArrowDown: move}))
					break;
				case 'Space':
					gameSocket.emit('keyevent', {key:'Space'});
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

	function moveMyPlayerImediately() {
		const now = new Date();
		const timePastSinceLastFrame = now.getTime() - timeLastFrame.getTime();
		if (timePastSinceLastFrame < 15) return;
		setTimeLastFrame(now);

		if (pong.gameStatus !== 'PLAYING') return;

		let MyPlayer:IPlayer;
		frontEndPlayerLeft.socketId === gameSocket.id ? MyPlayer = frontEndPlayerLeft : MyPlayer = frontEndPlayerRight;
		let MyPlayerMove = {
			idPlayerMove : idPlayerMove,
			dy:0
		};
		if (MyPlayer.upArrowDown || MyPlayer.downArrowDown) {
			if (MyPlayer.upArrowDown) {
				MyPlayer.posY = Math.max(pong.paddleHeight / 2, MyPlayer.posY - pong.paddleSpeed);
				MyPlayerMove.dy -= pong.paddleSpeed;
				gameSocket.emit('keyevent', {key:'KeyW', idPlayerMove:idPlayerMove});
			}
			if (MyPlayer.downArrowDown) {
				MyPlayer.posY = Math.min(1 - pong.paddleHeight / 2,  MyPlayer.posY + pong.paddleSpeed);
				MyPlayerMove.dy += pong.paddleSpeed;
				gameSocket.emit('keyevent', {key:'KeyS', idPlayerMove:idPlayerMove});
			}
			myPlayerMoves.push(MyPlayerMove);
			setMyPlayerMoves(myPlayerMoves);
			console.log(myPlayerMoves);
			setIdPlayerMove(idPlayerMove + 1);
		}
	};

	function render(context:CanvasRenderingContext2D):void {
		moveMyPlayerImediately();
		context.clearRect(0, 0, context.canvas.width, context.canvas.height)
		printGame({context:context, pong:pong, playerLeft:frontEndPlayerLeft, playerRight:frontEndPlayerRight, ball:ball, gameWidth:gameWidth, gameHeight:gameHeight});
		printMenu({pong:pong, context:context, gameWidth:gameWidth, gameHeight:gameHeight, frontEndPlayerLeft:frontEndPlayerLeft, frontEndPlayerRight:frontEndPlayerRight,});
	}

	return (
		<>
			<Canvas draw = {render} style={styleCanvas} />
			<div><strong>You play on the {frontEndPlayerLeft.socketId === gameSocket.id ? 'left' : 'right'} !</strong></div>
			<div><strong>Ball speed {ball.speed} </strong></div>
		</>
	);
};

export default GameArea

/*			<div> <strong>Pong : </strong><br/>{JSON.stringify(pong, null, 4)}</div>
			<div> <strong>PlayerLeft : </strong><br/>{JSON.stringify(frontEndPlayerLeft, null, 4)}</div>
			<div> <strong>PlayerRight : </strong><br/>{JSON.stringify(frontEndPlayerRight, null, 4)}</div>
*/
