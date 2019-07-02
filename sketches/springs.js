let sketch = new p5((P) => { with (P) {
let spring;
let ball;
let gravity;
let sliderCoeff;
let coeff;
let sliderMass;
let mass;
let button;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    fill(255, 0, 0);
    stroke(255, 255, 255);

    gravity = createVector(0, 1);
    ball = new Ball();
    spring = new Spring(ball);

    sliderMass = createSlider(1, 10, 1, 1);
    sliderCoeff = createSlider(0.025, 0.5, 0.025, 0.025);
    sliderMass.position(5, 50);
    sliderCoeff.position(5, 100);

    button = createButton('&#xf2f9;');
    button.position(50, 0);
    button.mousePressed(reset);
}

P.draw = function() {
    background('#1b4b34');

    coeff = sliderCoeff.value();
    mass = sliderMass.value();
    
    spring.update();
    spring.hook();
    ball.apply(gravity);
    ball.air();
    ball.update();
    spring.show();
    ball.show();
}

P.mousePressed = function() {
    if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
        ball.pos.set(mouseX, mouseY);
        ball.vel.set(0, 0);
    }
}

function reset() {
    sliderMass.value('1');
    sliderCoeff.value('0.025');
    ball = new Ball();
    spring = new Spring(ball);
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
    }

    show() {
        line(this.pos.x, this.pos.y, 
            this.ball.pos.x, this.ball.pos.y);
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

document.getElementById('main').style.height = sketch.height+marginTop + 'px'
