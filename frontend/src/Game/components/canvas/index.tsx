import {useEffect, useContext, useRef} from "react";
import gameContext from '../../gameContext';


export function Canvas(props:any) {

	const {draw, ...rest} = props;
	const canvasRef = useRef(null);
	const {gameWidth, setGameHeight, setGameWidth, gameHeight } = useContext(gameContext);
	
	useEffect(()=> {
		const canvas = canvasRef.current;
		// @ts-ignore: Object is possibly 'null'.
		const context:CanvasRenderingContext2D = canvas.getContext('2d');
    	let animationFrameId:number;

		const render = () => {
			draw(context);
			animationFrameId = window.requestAnimationFrame(render);
		}

		const handleResize = () => {
			context.canvas.width = window.innerWidth * 0.8;
			context.canvas.height = (window.innerWidth * 0.8) /2;
			setGameHeight(context.canvas.height);
			setGameWidth(context.canvas.width);
		};
	  
		handleResize();
		window.addEventListener("resize", handleResize);
		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
		}
			
	}, [draw]);

	return (
		<canvas ref={canvasRef} {...rest} />
	);
};