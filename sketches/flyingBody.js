let sketch = new p5((P) => { with (P) {

let title;
let gravity, wind;
let ball;
let ground, vel, scl = 100;
let running;
let windS;
let resetB, runB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    fill(255,0,0);
    stroke(255,255,255);
    frameRate('50');

    title = createDiv('Тіло, кинуте під кутом');
    title.id('title');
    
    gravity = createVector(0, 9.8*scl/2500);
    ground = height - 100;
    ball = new Ball();
    vel = createVector();
    running = true;
    
    resetB = createButton('&#xf2f9;');
    resetB.position(100, 0);
    resetB.mousePressed(reset);
    resetB.elt.title = 'оновити';

    runB = createButton('&#xf04c;');
    runB.position(50, 0);
    runB.mousePressed(run);
    runB.elt.title = 'зупинити';
    
    windS = createSlider(-10, 10, 0, 1);
    windS.position(5, 50);
}

P.draw = function() {
    background('#1b4b34');
    line(0, ground, width, ground);

    strokeWeight(4);
    for (let i = 0; i <= width; i += scl) {
        point(i, ground);
    }
    strokeWeight(1);
    wind = createVector(windS.value()*0.5, 0);
    ball.update();
    ball.show();

    if (mouseIsPressed && mouseY < ground && mouseX > 0 && mouseY > 0) {
        ball.simulate(mouseX, mouseY);
    }

    text(nfc(vel.mag(), 2), 5, ground + 10);
    text(nfc(vel.x, 2), 5, ground + 20);
    text(nfc(-vel.y, 2), 5, ground + 30);
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
        do {
            point(friend.pos.x, friend.pos.y);
        } while (!friend.update());
    }
}
}}, 'main');

document.getElementById('main').style.height = sketch.height+marginTop + 'px'


