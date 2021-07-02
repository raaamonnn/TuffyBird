// SELECT CVS
const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// GAME VARS AND CONSTS
let frames = 0;
let then = new Date().getTime();
let interval = 1000 / 60;
let pattern = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
let current = 0;
let cheats = false;
let coinValue = 1;

const DEGREE = Math.PI/180;

// LOAD SPRITE IMAGE
const sprite = new Image();
sprite.src = "img/sprite.png";
const dSprite = new Image();
dSprite.src = "img/dogeSprite.png";
const cSprite = new Image();
cSprite.src = "img/coin.png";
// LOAD BACKGROUND IMAGE
const bg = new Image();
bg.src = "img/bg.png";

const bg2 = new Image();


const eleph = new Image();
eleph.src = "img/TuffyClear.png";

const elanim = new Image();
elanim.src = "img/TuffyAnimate.png";

const easyButton = new Image();
easyButton.src = "img/easyB.png";
const hardButton = new Image();
hardButton.src = "img/hardB.png";

// LOAD SOUNDS

const scoreSound = "audio/sfx_point.wav";
const flapSound = "audio/sfx_flap.wav";


const HIT = new Audio();
HIT.volume = 0.5;
HIT.src = "audio/sfx_hit.wav";

const SWOOSHING = new Audio();
SWOOSHING.src = "audio/sfx_swooshing.wav";

const DIE = new Audio();
DIE.src = "audio/sfx_die.wav";

const CHEAT = new Audio();
CHEAT.volume = 0.5;
CHEAT.src = "audio/cheat.wav";

const bMusic = new Audio();
bMusic.volume = 0.1;
bMusic.src = "audio/song.mp4";

// function gets a random number between the specific min and max
function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}

// GAME STATE
const state = {
    current : 0,
    getReady : 0,
    game : 1,
    over : 2
}

const gSetting =
{
    frame1 : 200,
    frame2 : 150,
    frame3 : 90,
    frame4 : 80,
    gap1 : 150,
    gap2 : 130,
    score1 : 5,
    score2 : 10,
    score3 : 20,
    score4 : 100,

    isMenu : false,
    isPlaying : false,

    pressEasy : function()
    {
        this.gap1 = 170;
        this.gap2 = 150;
        this.frame1 = 210;
        this.frame2 = 160;
        this.frame3 = 100;
        this.frame4 = 90;
        this.score1 = 5;
        this.score2 = 10;
        this.score3 = 20;
        this.score4 = 40;
    },

    pressHard : function()
    {
        this.gap1 = 130;
        this.gap2 = 110;
        this.frame1 = 180;
        this.frame2 = 130;
        this.frame3 = 70;
        this.frame4 = 60;
        this.score1 = 3;
        this.score2 = 8;
        this.score3 = 15;
        this.score4 = 25;
    }
}

// START BUTTON COORD
const startBtn = {
    x : 120,
    y : 260,
    w : 83,
    h : 29,

    press : function()
    {
        pipes.reset();
        coins.reset();
        tuffy.speedReset();
        score.reset();
        medals.reset();
        state.current = state.getReady;
    }
}

const gameControl =
{
    easyW : 83,
    easyH : 29,

    hardX : 120,
    hardY : 295,
    hardW : 83,
    hardH : 29,

    spX : 240,
    spY : 518,
    sppX : 572,
    sppY : 263,
    sW : 20,
    sH : 20,

    pmX : 295,
    pmY : 5,

    draw : function(){
        if(state.current == state.over)
        {
            if(gSetting.isMenu)
            {
                ctx.drawImage(hardButton, this.hardX, this.hardY, this.hardW, this.hardH);
                ctx.drawImage(easyButton, startBtn.x, startBtn.y, this.easyW, this.easyH);
            }

            if(gSetting.isPlaying){
                ctx.drawImage(dSprite, this.spX, this.spY, this.sW, this.sH, this.pmX, this.pmY, this.sW, this.sH);
            }
            else {
                ctx.drawImage(dSprite, this.sppX, this.sppY, this.sW, this.sH, this.pmX, this.pmY, this.sW, this.sH);
            }
        }
    }
}

// CONTROL THE GAME
cvs.addEventListener("click", function(evt){
    switch(state.current){
        case state.getReady:
            state.current = state.game;
            SWOOSHING.play();
            break;
        case state.game:
            if(tuffy.y - tuffy.radius <= 0) return;
            tuffy.flap();
            const FLAP = new Audio();
            FLAP.src = flapSound;
            FLAP.play();
            break;
        case state.over:
            let rect = cvs.getBoundingClientRect();
            let clickX = evt.clientX - rect.left;
            let clickY = evt.clientY - rect.top;

            if(clickX >= gameControl.pmX && clickX <= gameControl.pmX + gameControl.sW && 
                clickY >= gameControl.pmY && clickY <= gameControl.pmY + gameControl.sH){

                if(gSetting.isPlaying)
                    bMusic.pause();
                else
                    bMusic.play();

                gSetting.isPlaying = !gSetting.isPlaying;
                HIT.play();
            }

            if(!gSetting.isMenu)
            {
                // CHECK IF WE CLICK ON THE START BUTTON
                if(clickX >= startBtn.x && clickX <= startBtn.x + startBtn.w &&
                     clickY >= startBtn.y && clickY <= startBtn.y + startBtn.h){
                    gSetting.isMenu = !gSetting.isMenu;
                }
            }
            else
            {
                gSetting.isMenu = !gSetting.isMenu;

                if(clickX >= startBtn.x && clickX <= startBtn.x + gameControl.easyW && 
                    clickY >= startBtn.y && clickY <= startBtn.y + gameControl.easyH){
                    gSetting.pressEasy();
                    startBtn.press();
                    HIT.play();
                }

                if(clickX >= gameControl.hardX && clickX <= gameControl.hardX + gameControl.hardW && 
                    clickY >= gameControl.hardY && clickY <= gameControl.hardY + gameControl.hardH){
                    gSetting.pressHard();
                    startBtn.press();
                    HIT.play();
                }
            }
            break;
    }
});

const background = {
    x1: 0,
    x2: 1023,
    y: -100,
    width: 1023,
    height: cvs.height,

    dx : 1,

    draw : function(){
        ctx.drawImage(bg, this.x1, this.y, this.width, this.height);
        ctx.drawImage(bg2, this.x2, this.y, this.width, this.height);
    },

    update: function(){
        if(state.current == state.game){
            if(background.x1 <= -background.width + this.dx) {
                background.x1 = background.width;
            }
            else {
                background.x1 -= this.dx;
            }

            if(background.x2 <= -background.width + this.dx){
                background.x2 = background.width;
            }
            else (background.x2 -= this.dx);
        }
        else
        {
            background.x1 = 0;
            background.x2 = 1023;
            background.y  = -100;
            background.width = 1023;
            background.height = 480;
        }
    }
}

const foreground = {
    sX: 276,
    sY: 0,
    w: 224,
    h: 112,
    x: 0,
    y: cvs.height - 112,

    dx : 2,

    draw : function(){
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x + this.w, this.y, this.w, this.h);
    },

    update: function(){
        if(state.current == state.game){
            this.x = (this.x - this.dx)%(this.w/2);
        }
    }
}

const tuffy = {
    animation : [
        {sX: 414, sY : 114},
        {sX: 414, sY : 160},
    ],
    x : 50,
    y : 100,
    w : 64, 
    h : 64,

    radius : 12,

    frame : 0,

    gravity : 0.25,
    jump : 4.6,
    speed : 0,
    rotation : 0,

    draw : function(){
        let bird = this.animation[this.frame];

        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);
        ctx.drawImage(sprite, bird.sX, bird.sY, this.w, this.h,- this.w/2, - this.h/2, this.w, this.h);

        ctx.restore();
    },

    flap : function(){
        this.speed = - this.jump;
    },

    update: function(){
        // IF THE GAME STATE IS GET READY STATE, THE BIRD MUST FLAP SLOWLY
        this.period = state.current == state.getReady ? 10 : 5;
        // WE INCREMENT THE FRAME BY 1, EACH PERIOD
        this.frame += frames%this.period == 0 ? 1 : 0;
        // FRAME GOES FROM 0 To 4, THEN AGAIN TO 0
        this.frame = this.frame%this.animation.length;

        if(state.current == state.getReady){
            this.y = 150; // RESET POSITION OF THE BIRD AFTER GAME OVER
            this.rotation = 0 * DEGREE;
        }else{
            this.speed += this.gravity;
            this.y += this.speed;

            if(this.y + this.h/2 >= cvs.height - foreground.h){
                this.y = cvs.height - foreground.h - this.h/2;
                if(state.current == state.game){
                    state.current = state.over;
                    DIE.play();
                }
            }

            // IF THE SPEED IS GREATER THAN THE JUMP MEANS THE BIRD IS FALLING DOWN
            if(this.speed >= this.jump){
                this.rotation = 90 * DEGREE;
                this.frame = 1;
            }else{
                this.rotation = -25 * DEGREE;
            }
        }

    },
    speedReset : function(){
        this.speed = 0;
    }
}

// GET READY MESSAGE
const getReady = {
    sX : 0,
    sY : 228,
    w : 173,
    h : 152,
    x : cvs.width/2 - 173/2,
    y : 80,

    draw: function(){
        if(state.current == state.getReady){
            ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
        }
    }

}

// GAME OVER MESSAGE
const gameOver = {
    sX : 175,
    sY : 228,
    w : 225,
    h : 202,
    x : cvs.width/2 - 225/2,
    y : 90,

    draw: function(){
        if(state.current == state.over){

            if(gSetting.isMenu){
                ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h - 30, this.x, this.y, this.w, this.h - 30);
            }
            else{
                ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            }
        }
    }

}
// Coins
const coins = {
    position: [],
    sX: 0,
    sY : 4,
    w : 37,
    h : 37,
    maxYPos: 150,
    maxXPos: 100,
    dx: 2,

    draw : function(){
        // spawns a coin at the beginning
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];
            ctx.drawImage(cSprite, this.sX, this.sY, this.w, this.h, p.x, p.y, this.w, this.h);
        }
    },

    update: function(){
        if(state.current !== state.game) return;

        if(score.value < gSetting.score1) {
            if(frames%gSetting.frame1 == 0){
                this.position.push({
                    x : this.maxXPos * ( Math.random() + 1),
                    y : this.maxYPos * ( Math.random() + 1)
                });
            }
        }

        else if(score.value < gSetting.score2) {
            if(frames%gSetting.frame2 == 0){
                this.position.push({
                    x : this.maxXPos * ( Math.random() + 1),
                    y : this.maxYPos * ( Math.random() + 1)
                });
            }
        }
        else if (score.value < gSetting.score3) {
            if(frames%gSetting.frame3 == 0){
                this.position.push({
                    x : this.maxXPos * ( Math.random() + 1),
                    y : this.maxYPos * ( Math.random() + 1)
                });
            }
        }
        else if (score.value < gSetting.score4) {
            if(frames%gSetting.frame4 == 0){
                this.position.push({
                    x : this.maxXPos * ( Math.random() + 1),
                    y : this.maxYPos * ( Math.random() + 1)
                });
            }
        }

        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];

            // COLLISION DETECTION
            // coin
            if(tuffy.x + tuffy.radius > p.x
                && tuffy.x - tuffy.radius < p.x + this.w && tuffy.y + tuffy.radius > p.y
                && tuffy.y - tuffy.radius < p.y + this.h){
                this.position.shift();
                score.value += coinValue;
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
                const SCORE_S = new Audio();
                SCORE_S.src = scoreSound;
                SCORE_S.volume = 0.3;
                SCORE_S.play();
            }

            // MOVE THE COINS TO THE LEFT
            p.x -= this.dx;

        }
    },



    reset : function(){
        this.position = [];
    }

}


// PIPES
const pipes = {
    position : [],

    top : {
        sX : 553,
        sY : 0
    },
    bottom:{
        sX : 502,
        sY : 0
    },

    w : 53,
    h : 400,
    gap : 150,
    maxYPos : -150,
    dx : 2,

    draw : function(){
        for(let i  = 0; i < this.position.length; i++){
            let p = this.position[i];

            let topYPos = p.y;
            let bottomYPos = p.y + this.h + this.gap;

            // top pipe
            ctx.drawImage(sprite, this.top.sX, this.top.sY, this.w, this.h, p.x, topYPos, this.w, this.h);

            // bottom pipe
            ctx.drawImage(sprite, this.bottom.sX, this.bottom.sY, this.w, this.h, p.x, bottomYPos, this.w, this.h);
        }
    },

    update: function(){
            if(state.current !== state.game) return;

            if(score.value < gSetting.score1) {
                pipes.gap = gSetting.gap1;
                if(frames%gSetting.frame1 == 0){
                    this.position.push({
                        x : cvs.width,
                        y : this.maxYPos * ( Math.random() + 1)
                    });
                }
            }
            else if(score.value < gSetting.score2) {
                if(frames%gSetting.frame2 == 0){
                    pipes.gap = gSetting.gap2;
                    this.position.push({
                        x : cvs.width,
                        y : this.maxYPos * ( Math.random() + 1)
                    });
                }
            }
            else if (score.value < gSetting.score3) {
                if(frames%gSetting.frame3 == 0){
                    pipes.gap = getRandomArbitrary(111,129);
                    this.position.push({
                        x : cvs.width,
                        y : this.maxYPos * ( Math.random() + 1)
                    });
                }
            }
            else if (score.value < gSetting.score4) {
                if(frames%gSetting.frame4 == 0){
                    pipes.gap = getRandomArbitrary(100,110);
                    this.position.push({
                        x : cvs.width,
                        y : this.maxYPos * ( Math.random() + 1)
                    });
                }
            }
            
        for(let i = 0; i < this.position.length; i++){
            let p = this.position[i];

            let bottomPipeYPos = p.y + this.h + this.gap;

            // COLLISION DETECTION
            // TOP PIPE
            if(tuffy.x + tuffy.radius > p.x && tuffy.x - tuffy.radius < p.x + this.w && tuffy.y + tuffy.radius > p.y && tuffy.y - tuffy.radius < p.y + this.h){
                state.current = state.over;
                HIT.play();
            }
            // BOTTOM PIPE
            if(tuffy.x + tuffy.radius > p.x && tuffy.x - tuffy.radius < p.x + this.w && tuffy.y + tuffy.radius > bottomPipeYPos && tuffy.y - tuffy.radius < bottomPipeYPos + this.h){
                state.current = state.over;
                HIT.play();
            }

            // MOVE THE PIPES TO THE LEFT
            p.x -= this.dx;

            // if the pipes go beyond canvas, we delete them from the array
            if(p.x + this.w <= 0){
                this.position.shift();
                score.value += 1;
                const SCORE_S = new Audio();
                SCORE_S.src = scoreSound;
                SCORE_S.volume = 0.3;
                SCORE_S.play();
                score.best = Math.max(score.value, score.best);
                localStorage.setItem("best", score.best);
            }
        }
    },

    reset : function(){
        this.position = [];
    }

}

// SCORE
const score= {
    best : parseInt(localStorage.getItem("best")) || 0,
    value : 0,
    coinVal: 0,

    draw : function(){
        ctx.fillStyle = "#FFF";
        ctx.strokeStyle = "#000";

        if(state.current == state.game){
            ctx.lineWidth = 2;
            ctx.font = "35px Teko";
            ctx.fillText(this.value, cvs.width/2, 50);
            ctx.strokeText(this.value, cvs.width/2, 50);

        }else if(state.current == state.over){
            // SCORE VALUE
            ctx.font = "25px Teko";
            ctx.fillText(this.value, 225, 186);
            ctx.strokeText(this.value, 225, 186);
            // BEST SCORE
            ctx.fillText(this.best, 225, 228);
            ctx.strokeText(this.best, 225, 228);
        }
    },

    reset : function(){
        this.value = 0;
        this.coinVal = 0;
    }
}

//MEDALS
const medals = {
    sX: 359,
    sY: 112,
    w: 45,
    h: 45,
    x: 73,      //X cord of where to draw
    y: 177,     //Y cord of where to draw

    draw: function () {
        if(score.value >= 30){
            this.sX = 359
            this.sY = 158;
        } else if (score.value >= 20){
            this.sX = 311;
            this.sY = 158;
        } else if (score.value >= 10){
            this.sX = 359;
            this.sY = 112;
        } else if (score.value >= 5){
            this.sX = 311;
            this.sY = 112;
        }

        if(score.value >= 5)
        {
            if (state.current == state.over) {
                ctx.drawImage(sprite, this.sX, this.sY, this.w, this.h, this.x, this.y, this.w, this.h);
            }
        }
    },

    reset : function(){
        this.sY = 112;
    }
}

//CHEAT CODE
const keyHandler = function (event) {

	// If the key isn't in the pattern, or isn't the current key in the pattern, reset
	if (pattern.indexOf(event.key) < 0 || event.key !== pattern[current]) {
		current = 0;
		return;
	}

	// Update how much of the pattern is complete
	current++;

	// If complete, alert and reset
	if (pattern.length === current) {
		current = 0;
        cheats = !cheats;
        if(cheats){
            coinValue = 5;
            eleph.src = "img/Konami.png";
            bg.src = "img/special.jpg";
            bg2.src = "img/special.jpg";
        } else {
            coinValue = 1;
            eleph.src = "img/TuffyClear.png";
            bg.src = "img/bg.png";
            bg2.src = "img/csuf-2.png";
        }
        CHEAT.play();
	}
    

};

document.addEventListener('keydown', keyHandler, false);

function draw(){
    ctx.fillStyle = "#70c5ce";
    ctx.fillRect(0, 0, cvs.width, cvs.height);

    background.draw();
    coins.draw();
    pipes.draw();
    foreground.draw();
    tuffy.draw();
    getReady.draw();
    gameOver.draw();
    score.draw();
    medals.draw();
    gameControl.draw();
}

function update(){
    background.update();
    foreground.update();
    pipes.update();
    coins.update();
    //tuffy.update();
    let now = new Date().getTime();
    let delta = now - then;
    if (delta > interval) {
        tuffy.update();
        then = now - (delta % interval);
    }
}

function main(){
    update();
    draw();
    frames++;
    requestAnimationFrame(main);
}
main();
