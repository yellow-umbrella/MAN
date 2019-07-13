//  кинуте тiло
module.exports = new p5((P) => { with (P) {

let gravity, wind;
let ball;
let ground, vel, scl = 100;
let running = true;
let windS;
let resetB, runB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    stroke(255);
    frameRate('50');

    gravity = createVector(0, 9.8*scl/2500);
    ground = height - 100;
    ball = new Ball();
    vel = createVector();
    
    createTitle(P, 'Тіло, кинуте під кутом');
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    
    windS = createSlider(-10, 10, 0, 1);
    windS.position(0, 20);
    let labelWind = createElement('label', 'Вітер:');
    labelWind.elt.appendChild(windS.elt);
    labelWind.position(5, 50);

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
}

P.draw = function() {
    background('#1b4b34');
    showGround();
    
    wind = createVector(windS.value()*0.5, 0);
    ball.update();
    ball.show();
    
    if (mouseIsPressed && mouseY < ground && mouseX > 0 && mouseY > 0) {
        ball.simulate(mouseX, mouseY);
    }
    
    noStroke();
    fill(255);
    text('початкова швидкість: ' + nfc(vel.mag(), 2) + ' м/c', 5, ground + 30);
    text('  проекція на вісь Ох: ' + nfc(vel.x, 2) + ' м/c', 5, ground + 45);
    text('  проекція на вісь Оу: ' + nfc(-vel.y, 2) + ' м/c', 5, ground + 60);
}

function reset() {
    loop();
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;
    
    ball = new Ball();
    windS.value('0');
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
}

P.mouseReleased = function() {
    if (mouseY < ground && mouseX > 0 && mouseX < width && mouseY > 0 && running) {
        ball.kick(mouseX, mouseY);
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
        this.pos.add(wind);
        if (this.pos.y > ground-this.radius) {
            this.pos.y = ground-this.radius;
            this.vel.y *= -1;
            this.vel.mult(0.95);
            return true;
        } else return false;
    }

    kick(x, y) {
        let mouse = createVector(x, y);
        mouse.sub(this.pos);
        mouse.div(20);
        this.vel = mouse;
        vel = this.vel.copy();
        vel.mult(50/scl);
    }

    simulate(x, y) {
        let friend = new Ball;
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

