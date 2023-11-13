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
		render();
		return () => {
			window.cancelAnimationFrame(animationFrameId);
		}
	}, [draw]);

	useEffect(()=> {
		const canvas = canvasRef.current;
		// @ts-ignore: Object is possibly 'null'.
		const context:CanvasRenderingContext2D = canvas.getContext('2d');
		//ATTENTION LE RESIZE NE FONCTIONNE QUE POUR ELARGIR LA PAGE, IL FAUDRAIT VOIR AVEC THIBAUT POUR GERER EN CSS LA TAILLE DE L'ELEMENT GAMEAREA 
		const handleResize = () => {
			const width = canvasRef.current?.parentElement?.clientWidth;
			const height = canvasRef.current?.parentElement?.clientHeight;
			if (typeof(width) !== 'undefined' && typeof(height) !== 'undefined') {
				context.canvas.width = width;
				context.canvas.height = height;
				setGameWidth(width)
				setGameHeight(height)
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
		return () => {
			window.removeEventListener("resize", handleResize);
		}
	},[]);

	return (
		<canvas ref={canvasRef} {...rest} style={{position: 'relative', width: '100%', heigth: '100%',}}  />
	);
};