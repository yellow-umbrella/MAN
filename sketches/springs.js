// Маятник
module.exports = new p5((P) => { with (P) {

let spring1, ball1, spring2, ball2, twoSpr = false, united = false, lim = 1.9, radius2mass = 20, coeff2stroke = 15, description, scl = 100;
let running, steps = 10;
let coeffS1, massS1, coeffS2, massS2, checkbox1, checkbox2;
let resetB, runB, infoB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    fill(255, 0, 0);
    stroke(255, 255, 255);
    strokeJoin(ROUND);
    
    createTitle(P, 'Пружинний маятник');
    
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    infoB = createInfoB(P, 'springs');

    running = true;
    
    massS1 = createLabeledSlider(P, [0.5, 2, 1.25, 0.25], 'Маса тiла: ', ' кг', 50, 1, 20, 'orange');
    coeffS1 = createLabeledSlider(P, [0.025, 0.25, 0.125, 0.025], 'Жорсткість пружини: <br>', ' Н/м', 100, 1, 40, 'orange');
    massS2 = createLabeledSlider(P, [0.5, 2, 1.25, 0.25], 'Маса тiла: ', ' кг', 200, 1, 20, 'yellow');
    coeffS2 = createLabeledSlider(P, [0.025, 0.25, 0.125, 0.025], 'Жорсткість пружини: <br>', ' Н/м', 250, 1, 40, 'yellow');

    massS2.style("visibility", "hidden");
    coeffS2.style("visibility", "hidden");
    massS2.elt.parentElement.style.visibility = "hidden";
    coeffS2.elt.parentElement.style.visibility = "hidden";

    checkbox1 = createCheckbox('2 маятники', false);
    checkbox1.position(5, 160);
    checkbox2 = createCheckbox('Накласти графіки', false);
    checkbox2.position(5, 320);
    checkbox1.changed(change);
    checkbox2.changed(() => {united = !united});
    checkbox2.style("visibility", "hidden");

    massS1.input(() => {massS1.update(); updateM1()});
    coeffS1.input(() => {coeffS1.update(); updateC1()});
    massS2.input(() => {massS2.update(); updateM2()});
    coeffS2.input(() => {coeffS2.update(); updateC2()});

    ball1 = new Ball(0.25*height, 'orange', massS1.value());
    spring1 = new Spring(ball1, coeffS1.value());

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textAlign(CENTER, CENTER);
}

P.draw = function() {
    background('#1b4b34');

    if (mouseIsPressed) {
        if (!twoSpr) {
            if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
                if (mouseX < spring1.pos.x + (2 - lim)*spring1.len) {
                    ball1.pos.x = spring1.pos.x + (2 - lim)*spring1.len;
                } else if (mouseX - spring1.pos.x > min(spring1.links*spring1.linkLen, lim*spring1.len)) {
                    ball1.pos.x = spring1.pos.x + min(spring1.links*spring1.linkLen, lim*spring1.len);
                } else {
                    ball1.pos.x = mouseX;
                }
                ball1.vel.set(0, 0);
                ball1.amp = abs(ball1.pos.x - width/2);
                ball1.history = [];
            }    
        } else {
            if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height*0.25) {
                if (mouseX < spring1.pos.x + (2 - lim)*spring1.len) {
                    ball1.pos.x = spring1.pos.x + (2 - lim)*spring1.len;
                } else if (mouseX - spring1.pos.x > min(spring1.links*spring1.linkLen, lim*spring1.len)) {
                    ball1.pos.x = spring1.pos.x + min(spring1.links*spring1.linkLen, lim*spring1.len);
                } else {
                    ball1.pos.x = mouseX;
                }
                ball1.vel.set(0, 0);
                ball1.amp = abs(ball1.pos.x - width/2);
                ball1.history = [];
                ball2.history = [];
            }
            if (mouseY > height*0.25 && mouseX > 0 && mouseX < width && mouseY < height*0.5) {
                if (mouseX < spring2.pos.x + (2 - lim)*spring2.len) {
                    ball2.pos.x = spring2.pos.x + (2 - lim)*spring2.len;
                } else if (mouseX - spring2.pos.x > min(spring2.links*spring2.linkLen, lim*spring2.len)) {
                    ball2.pos.x = spring2.pos.x + min(spring2.links*spring2.linkLen, lim*spring2.len);
                } else {
                    ball2.pos.x = mouseX;
                }
                ball2.vel.set(0, 0);
                ball2.amp = abs(ball2.pos.x - width/2);
                ball2.history = [];
                ball1.history = [];
            }
        }

    }
    
    if (running) {
        spring1.hook();
        ball1.update();
        if (twoSpr) {
            spring2.hook();
            ball2.update();
        }
    }

    spring1.show();
    ball1.show();

    if (twoSpr) {
        spring2.show();
        ball2.show();
    }

    createShadow(P);
}

function change() {
    twoSpr = !twoSpr;
    if (twoSpr) {
        united = false;

        massS1.value('1.25');
        massS1.update();
        coeffS1.value('0.125');
        coeffS1.update();
        ball1 = new Ball(0.125*height, 'orange', massS1.value());
        spring1 = new Spring(ball1, coeffS1.value());

        massS2.value('1.25');
        massS2.update();
        coeffS2.value('0.125');
        coeffS2.update();
        ball2 = new Ball(0.375*height, 'yellow', massS2.value());
        spring2 = new Spring(ball2, coeffS2.value());
        
        massS2.style("visibility", "visible");
        coeffS2.style("visibility", "visible");
        massS2.elt.parentElement.style.visibility = "visible";
        coeffS2.elt.parentElement.style.visibility = "visible";
        checkbox2.style("visibility", "visible");
        checkbox2.checked(false);
    } else {
        massS1.value('1.25');
        massS1.update();
        coeffS1.value('0.125');
        coeffS1.update();
        ball1 = new Ball(0.25*height, 'orange', massS1.value());
        spring1 = new Spring(ball1, coeffS1.value());
        
        massS2.style("visibility", "hidden");
        coeffS2.style("visibility", "hidden");
        massS2.elt.parentElement.style.visibility = "hidden";
        coeffS2.elt.parentElement.style.visibility = "hidden";
        checkbox2.style("visibility", "hidden");
    }
}

function updateM1() {
    ball1.mass = massS1.value();
    ball1.vel.set(0, 0);
    ball1.radius = radius2mass*sqrt(ball1.mass);
    ball1.amp = abs(ball1.pos.x - width/2);
    ball1.history = []; 
    if (twoSpr) {
        ball2.history = [];
    }
}

function updateM2() {
    ball2.mass = massS2.value();
    ball2.vel.set(0, 0);
    ball2.radius = radius2mass*sqrt(ball2.mass);
    ball2.amp = abs(ball2.pos.x - width/2);
    ball2.history = []; 
    if (twoSpr) {
        ball1.history = [];
    }
}

function updateC1() {
    spring1.coeff = coeffS1.value();
    ball1.vel.set(0, 0);
    spring1.stroke = spring1.coeff*coeff2stroke;
    ball1.amp = abs(ball1.pos.x - width/2);
    ball1.history = [];
    if (twoSpr) {
        ball2.history = [];
    }
}

function updateC2() {
    spring2.coeff = coeffS2.value();
    ball2.vel.set(0, 0);
    spring2.stroke = spring2.coeff*coeff2stroke;
    ball2.amp = abs(ball2.pos.x - width/2);
    ball2.history = [];
    if (twoSpr) {
        ball1.history = [];
    }
}

function reset() {
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    massS1.value('1.25');
    massS1.update();
    coeffS1.value('0.125');
    coeffS1.update();
    ball1 = new Ball(0.25*height, 'orange', massS1.value());
    spring1 = new Spring(ball1, coeffS1.value());
    
    massS2.style("visibility", "hidden");
    coeffS2.style("visibility", "hidden");
    massS2.elt.parentElement.style.visibility = "hidden";
    coeffS2.elt.parentElement.style.visibility = "hidden";
    checkbox2.style("visibility", "hidden");
    checkbox1.checked(false);
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
    constructor(y, clr, mass) {
        this.pos = createVector(width*0.5, y);
        this.vel = createVector();
        this.mass = mass;
        this.acc = createVector();
        this.radius = radius2mass*sqrt(this.mass);
        this.history = [];
        this.amp = 1;
        this.delta = 250;
        this.clr = clr;
        this.savedHeight = y;
    }

    show() {
        fill(this.clr);
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
        if (running) {
            this.history.push(this.pos.x - width/2);
            if (this.history.length > 2*this.delta) {
                this.history.shift();
            }
        }
        this.graph();
    }

    update() {
        this.acc.mult(1/steps);
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.pos.y = this.savedHeight;
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
        let pivot = 0.5*height + this.pos.y;
        if (united) {
            pivot = height*0.75;
        }
        arrow(P, width/2-this.delta, pivot, width/2+this.delta+10, pivot);
        arrow(P, width/2-this.delta, pivot+50, width/2-this.delta, pivot-50);
        stroke(this.clr);
        if (this.amp > 0.01) {
            beginShape();
            for (let i = 0; i < this.history.length; i++) {
                vertex(i+width/2-this.delta, pivot-this.history[i]/10);
            }
            endShape();
        }
        noStroke();
        fill(this.clr);
        let last = this.history[this.history.length-1];
        if (abs(last) < 0.01)
        last = 0;

        text(nf(last/scl, 1, 2) + ' м', width/2-250-25, pivot-last/10);
        fill(255);
        text('x', width/2-this.delta-10, pivot-50);
        text('t', width/2+this.delta+10, pivot+10);
        pop();
    }
}

class Spring {
    constructor(ball, coeff) {
        this.pos = createVector(width*0.1, ball.pos.y);
        this.ball = ball;
        this.len = 0.4*width;
        this.lenNow = this.len;
        this.coeff = coeff;
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

