// Маятник
module.exports = new p5((P) => { with (P) {

let title;
let gravity;
let spring, ball;
let coeff, mass;
let running;
let coeffS, massS;
let resetB, runB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    fill(255, 0, 0);
    stroke(255, 255, 255);
    
    title = createDiv('Маятник');
    title.id('title');
    title.elt.style.width = width + 'px';

    gravity = createVector(0, 1);
    ball = new Ball();
    spring = new Spring(ball);
    running = true;

    massS = createSlider(1, 10, 1, 1);
    coeffS = createSlider(0.025, 0.5, 0.025, 0.025);
    massS.position(5, 50);
    coeffS.position(5, 100);

    resetB = createButton('&#xf2f9;');
    resetB.position(100, 0);
    resetB.mousePressed(reset);
    resetB.elt.title = 'оновити';

    runB = createButton('&#xf04c;');
    runB.position(50, 0);
    runB.mousePressed(run);
    runB.elt.title = 'зупинити';
}

P.draw = function() {
    background('#1b4b34');

    coeff = coeffS.value();
    mass = massS.value();
    
    spring.update();
    spring.hook();
    ball.apply(gravity);
    ball.air();
    ball.update();
    spring.show();
    ball.show();
}

P.mousePressed = function() {
    if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && running) {
        ball.pos.set(mouseX, mouseY);
        ball.vel.set(0, 0);
    }
}

function reset() {
    loop();
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    massS.value('1');
    coeffS.value('0.025');
    ball = new Ball();
    spring = new Spring(ball);
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


class Ball {
    constructor() {
        this.radius = 10;
        this.pos = createVector(width*0.5, height*0.3 + 150);
        this.vel = createVector();
        this.mass = 1;
        this.acc = createVector();
    }

    show() {
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
    }

    update() {
        this.mass = mass;
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);
    }

    apply(acc) {
        this.acc.add(acc);
    }

    air() {
        let force = this.vel.copy();
	    force.mult(-0.009);
	    let acc = p5.Vector.div(force, this.mass);
	    this.apply(acc);
    }
}

class Spring {
    constructor(ball) {
        this.pos = createVector(width*0.5, height*0.3);
        this.ball = ball;
        this.len = 150;
        this.lenNow = 150;
        this.coeff = 0.025;
        this.links = 20;
        this.width = 8;
        this.linkLen = Math.hypot(this.len/this.links, 2*this.width);
    }

    show() {
        let tension = p5.Vector.sub(this.ball.pos, this.pos);
        push();
        noFill();
        translate(this.pos.x, this.pos.y);
        rotate(tension.heading());
        this.lenNow = tension.mag();
        let width = 0.5*sqrt(this.linkLen*this.linkLen - 
            (this.lenNow/this.links)*(this.lenNow/this.links));
        beginShape();
        vertex(0, 0);
        for (let i = 1; i < this.links; i++) {
            vertex(i*this.lenNow/this.links, width);
            width *= -1;
        }
        vertex(this.lenNow, 0);
        endShape();
        pop();
    }

    update() {
        this.coeff = coeff;
    }

    hook() {
        let tension = p5.Vector.sub(this.ball.pos, this.pos);
        this.lenNow = tension.mag();
        let force = -this.coeff*(this.lenNow-this.len);
	    tension.normalize();
	    tension.mult(force/this.ball.mass);
	    this.ball.apply(tension);
    }
} 
}}, 'main');

