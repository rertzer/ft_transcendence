import Point from './Point';
import Player from './Player';
import Ball from './Ball';

class GameParam {
    context: (CanvasRenderingContext2D | null ) = null;
	gameWidth: number = 0;
    gameHeight: number = 0;
    ballRadius: number = 0;
    paddleWidth: number = 0;
    paddleHeight: number = 0;
    scoreWidth: number = 0;
    scoreHeight: number = 0;
    netWidth:number = 0;
    netHeight:number = 0;
    netInterval:number = 0;
    backColor: string = '';
    ballColor: string ='';
    netColor: string ='';
    scoreFont:string ='';
    scoreFontPx:number = 0;
    scoreFontDecoration:string ='';
    scoreColor: string ='';
    nameFont:string ='';
    nameFontDecoration:string ='';
    nameFontPx:number = 0;
    nameColor:string ='';
    ballInitSpeed: number = 0;
    ballInitDir: Point = new Point({x: 0, y:0});
    ballSpeedIncrease: number = 0;
    paddleSpeed:number = 0;
    menuBackColor:string ='';
    menuTextColor:string ='';
    menuFont:string ='';
    menuFontDecoration:string ='';
    menuFontPx:number = 0;
    play:boolean = false;
    goal:number = 0;
    endgame:boolean = false;
	player1: Player = new Player();
	player2: Player = new Player();
	ball: Ball = new Ball();

    constructor(game?: {
		context: CanvasRenderingContext2D,
        gameWidth: number,
        gameHeight: number,
        ballRadius: number,
        paddleWidth: number,
        paddleHeight: number,
        scoreWidth: number,
        scoreHeight: number,
        netWidth:number,
        netHeight:number,
        netInterval:number,
        backColor: string,
        ballColor: string,
        netColor: string,
        scoreFont:string,
        scoreFontPx:number,
        scoreFontDecoration:string,
        scoreColor: string,
        nameFont:string,
        nameFontDecoration:string,
        nameFontPx:number,
        nameColor:string,
        ballInitSpeed: number,
        ballInitDir: Point,
        ballSpeedIncrease: number,
        paddleSpeed:number,
        menuBackColor:string,
        menuTextColor:string,
        menuFont:string,
        menuFontDecoration:string,
        menuFontPx:number,
        play:boolean,
        goal:number,
        endgame:boolean,
		player1: Player,
		player2: Player,
		ball: Ball,
	}){
		if(game) { 
            Object.assign(this, game);
        }
    };
};

export default GameParam;