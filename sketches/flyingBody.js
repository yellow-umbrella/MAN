//  кинуте тiло
module.exports = new p5((P) => { with (P) {

let gravity;
let ball;
let ground, vel, scl = 100;
let running = true, kicked = false;
let heightS;
let resetB, runB;
let arrows;
let rate = 50;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    stroke(255);
    frameRate(rate);

    gravity = createVector(0, 9.8*scl/(rate*rate));
    ground = height - 50;

    createTitle(P, 'Тіло, кинуте під кутом');
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    
    heightS = createSlider(0, ground-10, 0, 1);
    heightS.position(0, 20);
    let labelHeight = createElement('label', 'Початкова висота:');
    labelHeight.elt.appendChild(heightS.elt);
    labelHeight.position(5, 50);

    ball = new Ball();
    vel = createVector();

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textSize(12);

    arrows = createVector();
    new p5((P2) => drawArrows(P2, arrows), 'main');
}

P.draw = function() {
    background('#1b4b34');
    showGround();
   // console.log(nfc(frameRate(), 1));
    
    if (kicked) {
        if (ball.update()) {
            heightS.value(0);
            kicked = false;
            vel.set(0, 0);
        }
        arrows.set(ball.vel.x, ball.vel.y);
    } else {
        ball.pos.y = ground-ball.radius-heightS.value();
        arrows.set(vel.x*scl/rate, vel.y*scl/rate);
    }

    ball.show();
    
    if (mouseIsPressed && mouseY < ground-ball.radius && mouseX > 0 && mouseY > 0) {
        ball.simulate(mouseX, mouseY);
    }
}

function reset() {
    loop();
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;
    kicked = false;
    heightS.value('0');
    ball = new Ball();
    vel.setMag(0);
}

function run() {
    if (running) {
        running = false;
        runB.html('&#xf04b;');
        runB.elt.title = 'продовжити';
        noLoop();
    } else {
        loop();
        runB.html('&#xf04c;');
        running = true;
        runB.elt.title = 'зупинити';
    }
}

function showGround() {
    strokeWeight(1);
    stroke('#30825b');
    line(100, 0, 100, ground);
    stroke(255);
    line(0, ground, width, ground);
    
    fill(255);
    for (let i = 0; i*scl <= width; i++) {
        strokeWeight(4);
        stroke(255);
        point(i*scl, ground);
        if (i > 0) {
            noStroke();
            text((i - 1) + ' м', i*scl, ground + 15);
        }
    }

    fill('#30825b');
    for (let i = 1; ground - i*scl >= 0; i++) {
        strokeWeight(4);
        stroke('#30825b');
        point(100, ground - i*scl);
        noStroke();
        text(i + ' м', 75, ground - i*scl);
    }
}

P.mouseReleased = function() {
    if (mouseY < ground-ball.radius && mouseX > 0 && mouseX < width && mouseY > 0 && running) {
        ball.kick(mouseX, mouseY);
        kicked = true;
    }
}

class Ball {
    constructor() {
        this.radius = 5;
        this.pos = createVector(100, ground-this.radius);
        this.vel = createVector();
    }

    show() { 
        fill(255, 0, 0);
        stroke(255);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
    }

    update() {
        this.vel.add(gravity);
        this.pos.add(this.vel);
        if (this.pos.y > ground-this.radius) {
            this.pos.y = ground-this.radius;
            // this.vel.y *= -1;
            // this.vel.mult(0.95);
            this.vel.set(0, 0);
            return true;
        } else return false;
    }

    kick(x, y) {
        let mouse = createVector(x, y);
        mouse.sub(this.pos);
        mouse.div(20);
        this.vel = mouse;
        vel = this.vel.copy();
        vel.mult(rate/scl);
    }

    simulate(x, y) {
        let friend = new Ball();
        friend.pos = this.pos.copy();
        friend.kick(x, y);
        strokeWeight(1);
        stroke(255);
        do {
            point(friend.pos.x, friend.pos.y);
        } while (!friend.update());
    }
}
}}, 'main');

