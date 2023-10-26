import {useEffect, useContext, useRef} from "react";
import gameContext from '../../../../context/gameContext';


export function Canvas(props:any) {

	const {draw, ...rest} = props;
	const canvasRef = useRef<HTMLInputElement>(null);
	const {setGameHeight, setGameWidth } = useContext(gameContext);
	
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
			const width = canvasRef.current?.parentElement?.clientWidth;
			if (typeof(width) !== 'undefined') {
				context.canvas.width = width;
				context.canvas.height = width /2;
				setGameWidth(width)
				setGameHeight(width / 2)
			}
			else {
				context.canvas.width = 300;
				context.canvas.height = 300 /2;
				setGameWidth(300)
				setGameHeight(300 / 2)
			}
		};
	  
		handleResize();
		window.addEventListener("resize", handleResize);
		render();

		return () => {
			window.cancelAnimationFrame(animationFrameId);
			window.removeEventListener("resize", handleResize);
		}
			
	}, [draw,setGameWidth, setGameHeight]);

	return (
		<canvas ref={canvasRef} {...rest} />
	);
};