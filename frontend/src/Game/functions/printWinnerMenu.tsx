import GameParam from "../classes/GameParam";
import { drawRect, drawText } from "./draw";
import Point from "../classes/Point";
import Player from "../classes/Player";

function printWinnerMenu(pong:GameParam, player1:Player,  player2:Player):void {
	if (pong.context) {
		const buffer = 0;
		drawRect({
			start: new Point({x: buffer, y: buffer}), 
			width: pong.gameWidth - 2* buffer , 
			height: pong.gameHeight - 2 * buffer, 
			color: pong.menuBackColor},
			pong.context);

		let winner = (player1.score === pong.goal) ? player1.name : player2.name;

		const line1 = winner + ' WON !';
		const line2 = 'Press space key to restart';
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
			start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 + pong.menuFontPx / 2}), 
			color: pong.menuTextColor, 
			font: pong.menuFont, 
			fontDecoration: pong.menuFontDecoration, 
			fontPx: pong.menuFontPx/2
		}, pong.context);
	}
}

export default printWinnerMenu;