import { drawRect, drawText } from "./draw";
import { IGameParam } from "./interfacesGame";


function printStartMenu(pong:IGameParam, context:CanvasRenderingContext2D, gameWidth:number, gameHeight:number ):void {
	drawRect({
		start: {x: 0, y: 0}, 
		width: gameWidth, 
		height: gameHeight, 
		color: pong.menuBackColor
	}, context);

	const line1 = 'TO PLAY, PRESS';
	const line2 = 'SPACE KEY';
	drawText({
		str: line1,
		start: {x: gameWidth / 2, y: gameHeight / 2 - 5}, 
		color: pong.menuTextColor, 
		font: pong.menuFont, 
		fontDecoration: pong.menuFontDecoration, 
		fontPx: pong.menuFontPx * gameHeight
	}, context);
	drawText({
		str: line2, 
		start: {x: gameWidth / 2, y: gameHeight / 2 - 5 + pong.menuFontPx * gameHeight}, 
		color: pong.menuTextColor, 
		font: pong.menuFont, 
		fontDecoration: pong.menuFontDecoration, 
		fontPx: pong.menuFontPx * gameHeight
	}, context); 
}

export default printStartMenu;
