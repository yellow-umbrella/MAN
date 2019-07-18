// Маятник
module.exports = new p5((P) => { with (P) {

let gravity;
let spring, ball;
let running, steps = 10;
let coeffS, massS;
let resetB, runB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    fill(255, 0, 0);
    stroke(255, 255, 255);
    
    createTitle(P, 'Маятник');
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);

    gravity = createVector(0, 1);
    running = true;
    
    massS = createSlider(0.5, 2, 1.25, 0.25);
    coeffS = createSlider(0.025, 0.25, 0.125, 0.025);
    massS.position(0, 20);
    coeffS.position(0, 20);
    
    let labelMass = createElement('label', 'Маса тіла:');
    labelMass.elt.appendChild(massS.elt);
    labelMass.position(5, 50);
    
    let labelCoeff = createElement('label', 'Жорсткість пружини:');
    labelCoeff.elt.appendChild(coeffS.elt);
    labelCoeff.position(5, 100);

    ball = new Ball();
    spring = new Spring(ball);

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
}

P.draw = function() {
    background('#1b4b34');

    if (mouseIsPressed) {
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
            if (mouseY < spring.pos.y + max(spring.links, spring.len/3)) {
                ball.pos.y = spring.pos.y + max(spring.links, spring.len/3);
            } else if (mouseY - spring.pos.y > min(spring.links*spring.linkLen, 2*spring.len)) {
                ball.pos.y = spring.pos.y + min(spring.links*spring.linkLen, 2*spring.len);
            } else {
                ball.pos.y = mouseY;
            }
            ball.vel.set(0, 0);
        }
    }
    
    if (running) {
       //for (let i = 0; i < steps; i++) {
            spring.update();
            spring.hook();
            ball.apply(gravity);
            ball.air();
            ball.update();
        //}
    }
    spring.show();
    ball.show();
}

function reset() {
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    massS.value('1.25');
    coeffS.value('0.125');
    ball = new Ball();
    spring = new Spring(ball);
}

function run() {
    if (running) {
        running = false;
        runB.html('&#xf04b;');
        runB.elt.title = 'продовжити';
    } else {
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
        this.mass = massS.value();
        this.acc = createVector();
    }

    show() {
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
    }

    update() {
        this.mass = massS.value();
        this.acc.mult(1/steps);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.pos.x = width*0.5;
        /*if (this.pos.y < spring.pos.y) {
            this.pos.y += (spring.pos.y - this.pos.y);
            this.vel.y = 0;
        }*/
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
        this.pos = createVector(width*0.5, height*0.1);
        this.ball = ball;
        this.len = 150;
        this.lenNow = 150;
        this.coeff = coeffS.value();
        this.links = 30;
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
        /*if (this.lenNow > this.linkLen*this.links) {
            console.log('(');
        }*/
    }

    update() {
        this.coeff = coeffS.value();
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

