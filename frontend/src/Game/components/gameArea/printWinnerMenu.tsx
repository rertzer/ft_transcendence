import { IPlayer, IGameParam } from "./interfacesGame";
import { drawRect, drawText } from "./draw";


function printWinnerMenu(params:{context:CanvasRenderingContext2D, pong:IGameParam, playerLeft:IPlayer,  playerRight:IPlayer, gameWidth:number, gameHeight:number}):void {

	drawRect({
		start: {x: 0, y: 0}, 
		width: params.gameWidth, 
		height: params.gameHeight, 
		color: params.pong.menuBackColor},
		params.context);

	let winner = (params.playerLeft.score === params.pong.goal) ? params.playerLeft.name : params.playerRight.name;

	const line1 = winner + ' WON !';
	const line2 = 'Press space key to restart';
	drawText({
		str: line1, 
		start: {x: params.gameWidth / 2, y: params.gameHeight / 2 - 5}, 
		color: params.pong.menuTextColor, 
		font: params.pong.menuFont, 
		fontDecoration: params.pong.menuFontDecoration, 
		fontPx: params.pong.menuFontPx * params.gameHeight
	}, params.context);
	drawText({
		str: line2, 
		start: {x: params.gameWidth / 2, y: params.gameHeight / 2 + (params.pong.menuFontPx * params.gameHeight) / 2}, 
		color: params.pong.menuTextColor, 
		font: params.pong.menuFont, 
		fontDecoration: params.pong.menuFontDecoration, 
		fontPx: (params.pong.menuFontPx * params.gameHeight ) / 2
	}, params.context);
}

export default printWinnerMenu;
