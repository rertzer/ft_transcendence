import Point from '../classes/Point';

function drawRect(rect:{start:Point, width:number, height:number, color:string}, context:CanvasRenderingContext2D):void {
	context.fillStyle = rect.color;
	context.fillRect(rect.start.x, rect.start.y, rect.width, rect.height);
};

function drawCircle(cir:{center:Point, radius:number, color:string}, context:CanvasRenderingContext2D):void {
    context.fillStyle = cir.color;
    context.beginPath();
    context.arc(cir.center.x, cir.center.y, cir.radius, Math.PI*2, 0)
    context.closePath();
    context.fill();
};

function drawText(txt:{
    str:string, 
    start: Point, 
    color:string, 
    font:string, 
    fontDecoration: string, 
    fontPx:number}, 
	context:CanvasRenderingContext2D):void {
        const fontString = `${txt.fontDecoration}  ${txt.fontPx.toString()}Px ${txt.font}`;
        context.fillStyle = txt.color;
        context.font = fontString;
        context.textAlign = "center";
        context.fillText(txt.str, txt.start.x, txt.start.y);
}

export {drawCircle, drawRect, drawText};