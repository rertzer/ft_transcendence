/* import GameParam from "../classes/GameParam";
import { drawRect, drawText } from "./draw";
import Point from "../classes/Point";


function printStartMenu(pong:GameParam):void {
	if (pong.context) {
		const buffer = 0;
		drawRect({
			start: new Point({x: buffer, y: buffer}), 
			width: pong.gameWidth - 2* buffer , 
			height: pong.gameHeight - 2 * buffer, 
			color: pong.menuBackColor
		}, pong.context);

		const line1 = 'TO PLAY, PRESS';
		const line2 = 'SPACE KEY';
		drawText({
			str: line1, 
			start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 - 5}), 
			color: pong.menuTextColor, 
			font: pong.menuFont, 
			fontDecoration: pong.menuFontDecoration, 
			fontPx: pong.menuFontPx
		}, pong.context);
		drawText({
			str: line2, 
			start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 - 5 + pong.menuFontPx}), 
			color: pong.menuTextColor, 
			font: pong.menuFont, 
			fontDecoration: pong.menuFontDecoration, 
			fontPx: pong.menuFontPx
		}, pong.context); 
	}
}

export default printStartMenu; */

export {}