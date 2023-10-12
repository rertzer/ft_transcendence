import Point from "./Point";

class Ball {
    pos:Point = new Point({x: 0, y:0});
	speed:number = 0;
	dir: Point = new Point({x: 0, y:0});
	constructor(ball?: {
		pos: Point;
		speed: number,
		dir: Point}){
        if (ball){
			Object.assign(this, ball);
		}
    };
}

export default Ball;