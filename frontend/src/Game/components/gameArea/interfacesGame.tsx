export interface IPoint {
	x:number;
    y:number;
};

export interface IBall {
	pos: IPoint;
	speed: number;
	dir: IPoint;
};

export interface IGameParam {
    ballRadius: number;
    paddleWidth: number;
    paddleHeight: number;
    netWidth:number;
    netHeight:number;
    netInterval:number;
    backColor: string;
    ballColor: string;
    netColor: string;
    scoreFont:string;
    scoreFontPx:number;
    scoreFontDecoration:string;
    scoreColor: string;
    nameFont:string;
    nameFontDecoration:string;
    nameFontPx:number;
    nameColor:string;
    ballInitSpeed: number;
    ballInitDir: IPoint;
    ballSpeedIncrease: number;
    paddleSpeed:number;
    menuBackColor:string;
    menuTextColor:string;
    menuFont:string;
    menuFontDecoration:string;
    menuFontPx:number;
    play:boolean;
    goal:number;
    endgame:boolean;
};

export interface IPlayer {
	pos: IPoint;
    score: number;
    scorePos: IPoint;
    upArrowDown:boolean;
    downArrowDown:boolean;
    name:string;
    namePos: IPoint;
    color:string;
};
