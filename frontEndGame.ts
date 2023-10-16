/** Classes */
const canvas:HTMLCanvasElement = document.getElementById("pong") as HTMLCanvasElement;
const context = canvas.getContext("2d");


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
}

class Player {
    pos: Point = new Point({x: 0, y:0});
    score: number = 0;
    scorePos: Point = new Point({x: 0, y:0});
    upArrowDown:boolean = false;
    downArrowDown:boolean = false;
    name:string = '';
    namePos: Point = new Point({x: 0, y:0});
    color:string = '';
    constructor(player?: {
		pos: Point;
		scorePos: Point,
		name:string,
		namePos: Point,
		color:string,
	}){
		if(player) {
			Object.assign(this, player);
		}
    };
}

class Game {
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

    constructor(game?: {
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
	}){
		if(game) { 
            Object.assign(this, game);
        }
    };
};

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

/**
 * Initialisation of variables
 */

const framePerSec = 50;
const pong:Game = new Game({
    gameWidth: canvas.width,
    gameHeight: canvas.height,
    ballRadius: 7,
    paddleWidth: 10,
    paddleHeight: canvas.height / 4,
    scoreWidth: canvas.width / 8,
    scoreHeight: canvas.height / 4,
    netWidth: 2,
    netHeight: 10,
    netInterval: 5,
    backColor: '#000000',
    ballColor: '#f2c546',
    netColor: '#FFFFFF',
    scoreColor: '#FFFFFF',
    scoreFont: 'sans-serif',
    scoreFontDecoration: '',
    scoreFontPx: 75,
    nameFont: 'sans-serif',
    nameFontDecoration: 'italic',
    nameFontPx: 20,
    nameColor: '#FFFFFF',
    ballInitSpeed: 5,
    ballInitDir: new Point({x: 1, y: -1}),
    ballSpeedIncrease: 0.2,
    paddleSpeed: 7,
    play: false,
    menuBackColor: 'rgba(255,255,255,0.8)',
    menuTextColor: '#000000',
    menuFont: 'sans-serif',
    menuFontDecoration: 'bold',
    menuFontPx: 35,
    goal: 3,
    endgame: false,
})

let ball: Ball = new Ball({
    pos: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2}), 
    speed: pong.ballInitSpeed, 
    dir: pong.ballInitDir
    });

let player1: Player = new Player({
    pos:new Point({x:0, y: pong.gameHeight / 2 - pong.paddleHeight / 2}),
    scorePos: new Point({x: pong.gameWidth / 4, y:pong.gameHeight / 5}), 
    name:"Player 1",
    namePos:new Point({x: pong.gameWidth / 4, y: pong.gameHeight - 20} ), 
    color:'#16B84E'
    });

let player2: Player = new Player({
    pos: new Point({x: pong.gameWidth - pong.paddleWidth, y: pong.gameHeight / 2 - pong.paddleHeight / 2}), 
    scorePos: new Point({x: 3 * pong.gameWidth / 4, y: pong.gameHeight / 5}), 
    name: "Player 2",
    namePos: new Point({x: 3 * pong.gameWidth / 4, y: pong.gameHeight - 20}), 
    color: '#BB0B0B'
    });

/**
 * Functions 
 */

function drawRect(rect:{start:Point, width:number, height:number, color:string}):void {
    context.fillStyle = rect.color;
    context.fillRect(rect.start.x, rect.start.y, rect.width, rect.height);
};

function drawCircle(cir:{center:Point, radius:number, color:string}):void {
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
    fontPx:number}):void {
        const fontString = `${txt.fontDecoration}  ${txt.fontPx.toString()}Px ${txt.font}`;
        context.fillStyle = txt.color;
        context.font = fontString;
        context.textAlign = "center";
        context.fillText(txt.str, txt.start.x, txt.start.y);
}

function printGame():void{
    /* Print Background */
    drawRect({
        start: new Point({x: 0, y: 0}), 
        width: pong.gameWidth, 
        height: pong.gameHeight, 
        color: pong.backColor
    });

    /* Print Net */
    let net = new Point({x: pong.gameWidth / 2 - pong.netWidth / 2, y: 0});
    while (net.y< pong.gameHeight)
    {
        drawRect({
            start:net, 
            width: pong.netWidth, 
            height: pong.netHeight,
            color: pong.netColor
        });
        net.y += pong.netHeight + pong.netInterval;
    }

    /* Print score */
    drawText({
        str: player1.score.toString(), 
        start: player1.scorePos, 
        color: pong.scoreColor, 
        font: pong.scoreFont, 
        fontDecoration: pong.scoreFontDecoration, 
        fontPx: pong.scoreFontPx
    });
    drawText({
        str: player2.score.toString(), 
        start: player2.scorePos, 
        color: pong.scoreColor, 
        font: pong.scoreFont, 
        fontDecoration: pong.scoreFontDecoration,
        fontPx: pong.scoreFontPx
    });

    /* Print Player name*/
    drawText({
        str: player1.name, 
        start: player1.namePos, 
        color: pong.nameColor, 
        font: pong.nameFont, 
        fontDecoration: pong.nameFontDecoration, 
        fontPx: pong.nameFontPx
    });
    drawText({
        str: player2.name, 
        start: player2.namePos, 
        color: pong.nameColor, 
        font: pong.nameFont, 
        fontDecoration: pong.nameFontDecoration, 
        fontPx: pong.nameFontPx
    });

    /* Print Game elements */
    drawCircle({
        center: ball.pos, 
        radius: pong.ballRadius, 
        color: pong.ballColor
    });
    drawRect({
       start: player1.pos, 
       width: pong.paddleWidth, 
       height: pong.paddleHeight, 
       color: player1.color
    });
    drawRect({
        start: player2.pos, 
        width: pong.paddleWidth,
        height: pong.paddleHeight, 
        color: player2.color
    });
}

function printStartMenu():void {
    const buffer = 0;
    drawRect({
        start: new Point({x: buffer, y: buffer}), 
        width: pong.gameWidth - 2* buffer , 
        height: pong.gameHeight - 2 * buffer, 
        color: pong.menuBackColor
    });

    const line1 = 'TO PLAY, PRESS';
    const line2 = 'SPACE KEY';
    const sizeLine = context.measureText(line1);
    drawText({
        str: line1, 
        start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 - 5}), 
        color: pong.menuTextColor, 
        font: pong.menuFont, 
        fontDecoration: pong.menuFontDecoration, 
        fontPx: pong.menuFontPx
    });
    drawText({
        str: line2, 
        start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 - 5 + pong.menuFontPx}), 
        color: pong.menuTextColor, 
        font: pong.menuFont, 
        fontDecoration: pong.menuFontDecoration, 
        fontPx: pong.menuFontPx
    }); 
}

function printWinnerMenu():void {
    const buffer = 0;
    drawRect({
        start: new Point({x: buffer, y: buffer}), 
        width: pong.gameWidth - 2* buffer , 
        height: pong.gameHeight - 2 * buffer, 
        color: pong.menuBackColor});

    let winner = (player1.score === pong.goal) ? player1.name : player2.name;

    const line1 = winner + ' WON !';
    const line2 = 'Press space key to restart';
    const sizeLine = context.measureText(line1);
    drawText({
        str: line1, 
        start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 - 5}), 
        color: pong.menuTextColor, 
        font: pong.menuFont, 
        fontDecoration: pong.menuFontDecoration, 
        fontPx: pong.menuFontPx
    });
    drawText({
        str: line2, 
        start: new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2 + pong.menuFontPx / 2}), 
        color: pong.menuTextColor, 
        font: pong.menuFont, 
        fontDecoration: pong.menuFontDecoration, 
        fontPx: pong.menuFontPx/2
    }); 
}

function colision(player: Player):boolean {
    const ballTop:number = ball.pos.y - pong.ballRadius;
    const ballBtm:number = ball.pos.y + pong.ballRadius;
    const ballLeft:number = ball.pos.x - pong.ballRadius;
    const ballRight:number = ball.pos.x + pong.ballRadius;

    const paddleTop:number =  player.pos.y;
    const paddleBtm:number = player.pos.y + pong.paddleHeight;
    const paddleLeft:number = player.pos.x;
    const paddleRight:number = player.pos.x + pong.paddleWidth;

    return (ballRight > paddleLeft && ballTop < paddleBtm && ballLeft < paddleRight && ballBtm > paddleTop)
}

function leftboard():boolean {
    return (ball.pos.x > pong.gameWidth || ball.pos.x < 0)
}

function resetPosition():void {
    ball.pos = new Point({x: pong.gameWidth / 2, y: pong.gameHeight / 2});
    ball.speed = pong.ballInitSpeed;
    ball.dir.x = -ball.dir.x;
    player1.pos = new Point({x: 0, y: pong.gameHeight / 2 - pong.paddleHeight / 2});
    player2.pos = new Point({x: pong.gameWidth - pong.paddleWidth, y: pong.gameHeight / 2 - pong.paddleHeight / 2});
}

function resetGame():void {
    resetPosition();
    ball.dir = pong.ballInitDir;
    player1.score = 0;
    player2.score = 0;
}

function move():void {
    if (player1.upArrowDown && player1.pos.y > 0) {
        player1.pos.y -= pong.paddleSpeed;
    }
    if (player1.downArrowDown && player1.pos.y + pong.paddleHeight < pong.gameHeight) {
        player1.pos.y += pong.paddleSpeed;
    }
    if (player2.upArrowDown && player2.pos.y > 0) {
        player2.pos.y -= pong.paddleSpeed;
    }
    if (player2.downArrowDown && player2.pos.y + pong.paddleHeight < pong.gameHeight) {
        player2.pos.y += pong.paddleSpeed;
    }

    ball.pos.x += (ball.speed / Math.sqrt(ball.dir.x**2 + ball.dir.y**2)) * ball.dir.x;
    ball.pos.y += (ball.speed / Math.sqrt(ball.dir.x**2 + ball.dir.y**2)) * ball.dir.y;
    /*Top or bottom collision*/
    if (ball.pos.y > pong.gameHeight - pong.ballRadius 
        || ball.pos.y < pong.ballRadius) {
        ball.dir.y = - ball.dir.y;
    }
    /* Paddle colision*/
    let playerWithBall = (ball.pos.x <= pong.gameWidth / 2) ? player1 : player2;
    let otherPlayer = (ball.pos.x <= pong.gameWidth / 2) ? player2 : player1;
    let direction = (ball.pos.x <= pong.gameWidth / 2) ? 1 : -1;

    if (colision(playerWithBall)) {
        let colisionY = (ball.pos.y - (playerWithBall.pos.y + pong.paddleHeight / 2)) / (pong.paddleHeight / 2);
        let ang = colisionY * (Math.PI / 4);
        ball.dir.x = direction * Math.cos(ang);
        ball.dir.y = Math.sin(ang);
        ball.speed += pong.ballSpeedIncrease;
    }
    if (leftboard()) {
        otherPlayer.score++;
        if (otherPlayer.score == pong.goal) {
            pong.endgame = true;
        }
        pong.play = false;
        resetPosition();
    }
}

function render():void {
    if (pong.play){
        move();
    }
    printGame();
    if (!pong.play && !pong.endgame) {
        printStartMenu();
    }
    else if (pong.endgame) {
        printWinnerMenu();
    }
}

const controlDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
        player2.upArrowDown = true;
    }
    else if (event.key === 'ArrowDown') {
        player2.downArrowDown = true;
    }
    else if (event.key === 'w' || event.key === 'W') {
        player1.upArrowDown = true;
    }
    else if (event.key === 's' || event.key === 'S') {
        player1.downArrowDown = true;
    }
    else if (event.key === ' ') {
        pong.play = true;
        if (pong.endgame) {
            resetGame();
        }
        pong.endgame = false;
    }
};

const controlUp = (event: KeyboardEvent) => {
    if (event.key === 'ArrowUp') {
        player2.upArrowDown = false;
    }
    else if (event.key === 'ArrowDown') {
        player2.downArrowDown = false;
    }
    else if (event.key === 'w' || event.key === 'W') {
        player1.upArrowDown = false;
    }
    else if (event.key === 's' || event.key === 'S') {
        player1.downArrowDown = false;
    }
};
window.addEventListener('keydown', controlDown);
window.addEventListener('keyup', controlUp);

setInterval(render, 1000/framePerSec);

function Pong() {
   
    return (
        <div> <canvas id="pong" width="800" height="500"></canvas>
        </div>
    );
}

export default Pong;

