import { drawRect, drawText } from "./draw";
import { IGameParam } from "./interfacesGame";


function printStartMenu(param:{pong:IGameParam, context:CanvasRenderingContext2D, gameWidth:number, gameHeight:number}):void {
	drawRect({
		start: {x: 0, y: 0}, 
		width: param.gameWidth, 
		height: param.gameHeight, 
		color: param.pong.menuBackColor
	}, param.context);

	const line1 = 'TO PLAY, PRESS';
	const line2 = 'SPACE KEY';
	drawText({
		str: line1,
		start: {x: param.gameWidth / 2, y: param.gameHeight / 2 - 5}, 
		color: param.pong.menuTextColor, 
		font: param.pong.menuFont, 
		fontDecoration: param.pong.menuFontDecoration, 
		fontPx: param.pong.menuFontPx * param.gameHeight
	}, param.context);
	drawText({
		str: line2, 
		start: {x: param.gameWidth / 2, y: param.gameHeight / 2 - 5 + param.pong.menuFontPx * param.gameHeight}, 
		color: param.pong.menuTextColor, 
		font: param.pong.menuFont, 
		fontDecoration: param.pong.menuFontDecoration, 
		fontPx: param.pong.menuFontPx * param.gameHeight
	}, param.context); 
}

export default printStartMenu;
