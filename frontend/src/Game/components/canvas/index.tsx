import React, {useEffect, useRef} from "react";

export function Canvas(props:any) {

	const {draw, ...rest} = props;
	const canvasRef = useRef(null);
	
	useEffect(()=> {
		const canvas = canvasRef.current;
		// @ts-ignore: Object is possibly 'null'.
		const context:CanvasRenderingContext2D = canvas.getContext('2d');

		//let frameCount:number = 0;
    	let animationFrameId:number;

		const render = () => {
			//frameCount++;
			//draw(context, frameCount);
			draw(context);
			animationFrameId = window.requestAnimationFrame(render);
		  }

		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
		  }
			
	}, [draw]);
	

	return (
		<canvas ref={canvasRef} {...rest} />
	);
};