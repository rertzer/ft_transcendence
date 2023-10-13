class Point {
    x:number = 0;
    y:number= 0;
    constructor(point?: {
		x:number, 
		y:number}){
		if (point) {
			Object.assign(this, point);
		}
    };
};
export default Point;



