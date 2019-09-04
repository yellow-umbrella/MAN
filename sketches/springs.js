// Маятник
module.exports = new p5((P) => { with (P) {

let spring, ball, lim = 1.9, radius2mass = 20, coeff2stroke = 15, description, scl = 100;
let running, steps = 10;
let coeffS, massS;
let resetB, runB, infoB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    fill(255, 0, 0);
    stroke(255, 255, 255);
    strokeJoin(ROUND);
    
    createTitle(P, 'Пружинний маятник');
    /*description = createDiv("За допомогою повзунків можна змінювати масу м'ячика та коефіцієнт жорсткості, а на самому робочому просторі задавати видовження пружини.");
    description.position(0, 550);
    description.style('width', '200px');*/
    //description = createDescription(P, "за допомогою повзунків можна змінювати масу м'ячика та коефіцієнт жорсткості, а на самому робочому просторі задавати видовження пружини.");

    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    infoB = createInfoB(P, 'springs');

    //gravity = createVector(0, 1);
    running = true;
    
    massS = createLabeledSlider(P, [0.5, 2, 1.25, 0.25], 'Маса тiла: ', ' кг', 50);
    coeffS = createLabeledSlider(P, [0.025, 0.25, 0.125, 0.025], 'Жорсткість пружини: <br>', ' Н/м', 100, 1, 40);

    massS.input(() => {massS.update(); updateM()});
    coeffS.input(() => {coeffS.update(); updateC()});


    ball = new Ball();
    spring = new Spring(ball);

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textAlign(CENTER, CENTER);
}

P.draw = function() {
    background('#1b4b34');

    if (mouseIsPressed) {
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
            if (mouseX < spring.pos.x + (2 - lim)*spring.len) {
                ball.pos.x = spring.pos.x + (2 - lim)*spring.len;
            } else if (mouseX - spring.pos.x > min(spring.links*spring.linkLen, lim*spring.len)) {
                ball.pos.x = spring.pos.x + min(spring.links*spring.linkLen, lim*spring.len);
            } else {
                ball.pos.x = mouseX;
            }
            ball.vel.set(0, 0);
            ball.amp = abs(ball.pos.x - width/2);
            ball.history = [];
           /* ball.mass = massS.value();
            spring.coeff = coeffS.value();*/
        }

    }
    
    if (running) {
        //for (let i = 0; i < steps; i++) {
            //spring.update();
            spring.hook();
            //ball.apply(gravity);
            //ball.air();
            ball.update();
            //}
    }
    spring.show();
    ball.show();

    createShadow(P);
}

function updateM() {
    ball.mass = massS.value();
    ball.vel.set(0, 0);
    ball.radius = radius2mass*sqrt(ball.mass);
    ball.amp = abs(ball.pos.x - width/2);
    ball.history = []; 
}

function updateC() {
    spring.coeff = coeffS.value();
    ball.vel.set(0, 0);
    spring.stroke = spring.coeff*coeff2stroke;
    ball.amp = abs(ball.pos.x - width/2);
    ball.history = [];
}

function reset() {
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    massS.value('1.25');
    massS.update();
    coeffS.value('0.125');
    coeffS.update();
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
        this.pos = createVector(width*0.5, height*0.5);
        this.vel = createVector();
        this.mass = massS.value();
        this.acc = createVector();
        this.radius = radius2mass*sqrt(this.mass);
        this.history = [];
        this.amp = 1;
    }

    show() {
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
        if (running) {
            this.history.push(this.pos.x - width/2);
            if (this.history.length > 500) {
                this.history.shift();
            }
        }
        this.graph();
    }

    update() {
        //this.mass = massS.value();
        this.acc.mult(1/steps);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.pos.y = height*0.5;
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

    graph() {
        push();
        noFill();
        stroke(255);
        arrow(P, width/2-250, height-50, width/2+260, height-50);
        arrow(P, width/2-250, height, width/2-250, height-100);
        if (this.amp > 0.01) {
            beginShape();
            for (let i = 0; i < this.history.length; i++) {
                vertex(i+width/2-250, height-50-/*30*this.history[i]/this.amp*/ this.history[i]/10);
            }
            endShape();
        }
        noStroke();
        fill(255);
        let last = this.history[this.history.length-1];
        if (abs(last) < 0.01)
            last = 0;
        // console.log(last);
        text(nf(last/scl, 1, 2) + ' м', width/2-250-25, height-50-/*30*last/this.amp*/last/10);
        text('x', width/2-250-10, height-100);
        text('t', width/2+260, height-50+10);
        pop();
    }
}

class Spring {
    constructor(ball) {
        this.pos = createVector(width*0.1, height*0.5);
        this.ball = ball;
        this.len = 0.4*width;
        this.lenNow = this.len;
        this.coeff = coeffS.value();
        this.width = round(0.01*width);
        this.links = round(this.len/this.width);
        this.linkLen = Math.hypot(this.len/this.links, 2*this.width);
        this.ball.pos.x = this.pos.x + this.len;
        this.ball.radius = 1.5*this.width;
        this.stroke = this.coeff*coeff2stroke;
    }

    show() {
        let tension = p5.Vector.sub(this.ball.pos, this.pos);
        push();
        noFill();
        strokeWeight(this.stroke);
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

