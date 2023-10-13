import Point from './Point';

class Player {
    pos: Point = new Point({x: 0, y:0});
    score: number = 0;
    scorePos: Point = new Point({x: 0, y:0});
    upArrowDown:boolean = false;
    downArrowDown:boolean = false;
    name:string = '';
    namePos: Point = new Point({x: 0, y:0});
    color:string = '';
    constructor(player?: {
		pos: Point;
		scorePos: Point,
		name:string,
		namePos: Point,
		color:string,
	}){
		if(player) {
			Object.assign(this, player);
		}
    };
}
export default Player;