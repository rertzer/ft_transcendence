import { responsiveFontSizes } from "@mui/material";
import { drawRect, drawText } from "./draw";
import { IGameParam, IPlayer } from "./interfacesGame";


function printMenu(param:{pong:IGameParam, context:CanvasRenderingContext2D, gameWidth:number, gameHeight:number, frontEndPlayerLeft:IPlayer, frontEndPlayerRight:IPlayer}):void {
	if (param.pong.gameStatus === 'PLAYING') return;
	drawRect({
		start: {x: 0, y: 0}, 
		width: param.gameWidth, 
		height: param.gameHeight, 
		color: param.pong.menuBackColor
	}, param.context);
	let line1:string = '';
	let line2:string = '';
	switch (param.pong.gameStatus){
		case 'WAITING_TO_START':
			line1 = 'READY TO START';
			line2 = 'PRESS SPACE WHEN YOU ARE READY';
			break;
		case 'WAITING_FOR_PLAYER':
			line1 = 'WAITING FOR ANOTHER';
			line2 = 'PLAYER TO CONNECT';
			break;
		case 'STARTING':
			line1 = 'STARTING';
			line2 = `in ${ 3 - Math.round(param.pong.startingCount)}`;
			break;
		case 'FINISHED':
			line1 = 'THE GAME IS FINISHED';
			line2 = `Congratulation to ${ param.frontEndPlayerLeft.score === param.pong.goal ? param.frontEndPlayerLeft.name : param.frontEndPlayerRight.name} !`;
			break;
		default:
			return; 
	}

	drawText({
		str: line1,
		start: {x: param.gameWidth / 2, y: param.gameHeight / 2 - 5}, 
		color: param.pong.menuTextColor, 
		font: param.pong.menuFont, 
		fontDecoration: param.pong.menuFontDecoration, 
		fontPx: param.pong.menuFontPx * param.gameHeight / 2
	}, param.context);
	drawText({
		str: line2, 
		start: {x: param.gameWidth / 2, y: param.gameHeight / 2 - 5 + param.pong.menuFontPx * param.gameHeight}, 
		color: param.pong.menuTextColor, 
		font: param.pong.menuFont, 
		fontDecoration: param.pong.menuFontDecoration, 
		fontPx: param.pong.menuFontPx * param.gameHeight / 3
	}, param.context); 
}

export default printMenu;
