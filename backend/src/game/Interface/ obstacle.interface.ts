export interface Obstacle {
	id:number;
	pos: {x:number, y:number};
	width:number;
	height:number;
	img:string;
	lives:number;
}