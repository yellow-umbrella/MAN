// Маятник
module.exports = new p5((P) => { with (P) {

let gravity;
let pendulum;
let running, scl = 150, description, twoPend = false, united = false;
let lenS, gravityS, lenS1, gravityS1, checkbox1, checkbox2;
let resetB, runB, infoB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    frameRate('50');
    stroke(255, 255, 255);
    
    createTitle(P, 'Математичний маятник');

    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    infoB = createInfoB(P, 'pendulum');

    gravityS = createLabeledSlider(P, [1.6, 10, 9.8, 0.1], 'Прискорення вільного <br> падіння: ', ' м/с<sup>2</sup>', 50, 1, 40, 'orange');
    lenS = createLabeledSlider(P, [height*0.1, height*0.7, height*0.4, 1].map(round), 'Довжина нитки: ', ' м', 120, scl, 20, 'orange');
    gravityS1 = createLabeledSlider(P, [1.6, 10, 9.8, 0.1], 'Прискорення вільного <br> падіння: ', ' м/с<sup>2</sup>', 210, 1, 40, 'yellow');
    lenS1 = createLabeledSlider(P, [height*0.1, height*0.7, height*0.4, 1].map(round), 'Довжина нитки: ', ' м', 280, scl, 20, 'yellow');

    lenS1.style("visibility", "hidden");
    gravityS1.style("visibility", "hidden");
    lenS1.elt.parentElement.style.visibility = "hidden";
    gravityS1.elt.parentElement.style.visibility = "hidden";

    checkbox1 = createCheckbox(' 2 маятники', false);
    checkbox1.position(5, 165);
    checkbox2 = createCheckbox(' Накласти графіки', false);
    checkbox2.position(5, 320);
    checkbox1.changed(change);
    checkbox2.changed(() => {united = !united});
    checkbox2.style("visibility", "hidden");
    
    pendulum = new Pendulum(width/2, 'orange');
    running = true;
    lenS.input(() => {lenS.update(); pendulum.len = lenS.value(); pendulum.history = []; if (twoPend) pendulum1.history = [];});
    gravityS.input(() => {gravityS.update(); pendulum.history = []; if (twoPend) pendulum1.history = [];});
    lenS1.input(() => {lenS1.update(); pendulum1.len = lenS1.value(); pendulum1.history = []; if (twoPend) pendulum.history = [];});
    gravityS1.input(() => {gravityS1.update(); pendulum1.history = []; if (twoPend) pendulum.history = [];});

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textAlign(CENTER, CENTER);
}

P.draw = function() {
    background('#1b4b34');

    if (!twoPend) {
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && mouseIsPressed) {
            pendulum.change(mouseX, mouseY);
            pendulum.history = [];
        } else if (running) {
            pendulum.update(gravityS.value());
        }
    } else {
        if (mouseY > 0 && mouseX > 0 && mouseX < width/2 && mouseY < height && mouseIsPressed) {
            pendulum.change(mouseX, mouseY);
            pendulum.history = [];
            pendulum1.history = [];
        } else if (running) {
            pendulum.update(gravityS.value());
        }
        if (mouseY > 0 && mouseX > width/2 && mouseX < width && mouseY < height && mouseIsPressed) {
            pendulum1.change(mouseX, mouseY);
            pendulum1.history = [];
            pendulum.history = [];
        } else if (running) {
            pendulum1.update(gravityS1.value());
        }
    }

    
    if (twoPend) {
        pendulum.show(300);
        pendulum1.show(300);
    } else {
        pendulum.show(pendulum.len);
    }

    createShadow(P);
}

function change() {
    twoPend = !twoPend;
    if (twoPend) {
        gravityS.value('9.8');
        gravityS.update();
        lenS.value(round(0.4*height)+'');
        lenS.update();

        gravityS1.value('9.8');
        gravityS1.update();
        lenS1.value(round(0.4*height)+'');
        lenS1.update();

        united = false;
        pendulum = new Pendulum(width/4, 'orange');
        pendulum1 = new Pendulum(3*width/4, 'yellow');
        lenS1.style("visibility", "visible");
        gravityS1.style("visibility", "visible");
        lenS1.elt.parentElement.style.visibility = "visible";
        gravityS1.elt.parentElement.style.visibility = "visible";
        checkbox2.style("visibility", "visible");
        checkbox2.checked(false);
    } else {
        gravityS.value('9.8');
        gravityS.update();
        lenS.value(round(0.4*height)+'');
        lenS.update();

        gravityS1.value('9.8');
        gravityS1.update();
        lenS1.value(round(0.4*height)+'');
        lenS1.update();
        
        pendulum = new Pendulum(width/2, 'orange');
        lenS1.style("visibility", "hidden");
        gravityS1.style("visibility", "hidden");
        lenS1.elt.parentElement.style.visibility = "hidden";
        gravityS1.elt.parentElement.style.visibility = "hidden";
        checkbox2.style("visibility", "hidden");
    }
}

function reset() {
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    gravityS.value('9.8');
    gravityS.update();
    lenS.value(round(0.4*height)+'');
    lenS.update();

    gravityS1.value('9.8');
    gravityS1.update();
    lenS1.value(round(0.4*height)+'');
    lenS1.update();

    pendulum = new Pendulum(width/2, 'orange');
    twoPend = false;
    united = false;
    lenS1.style("visibility", "hidden");
    gravityS1.style("visibility", "hidden");
    lenS1.elt.parentElement.style.visibility = "hidden";
    gravityS1.elt.parentElement.style.visibility = "hidden";
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

class Pendulum {
    constructor(x, clr) {
        this.radius = 10;
        this.clr = clr;
        this.pivot = createVector(x, 100);
        this.pos = this.pivot.copy();
        this.len = lenS.value();
        this.pos.y += this.len;
        this.angle = 0;
        this.avel = 0;
        this.mass = 1;
        this.history = [];
        this.delta = 200;
    }

    show(coeff) {
        this.pos.set(this.len*sin(this.angle), this.len*cos(this.angle));
        this.pos.add(this.pivot);
        stroke(255);
        fill(this.clr);
        line(this.pivot.x, this.pivot.y, this.pos.x, this.pos.y);
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
        if (running) {
            this.history.push(this.pos.x - this.pivot.x);
            if (this.history.length > 2*this.delta) {
                this.history.shift();
            }
        }
        let start = 0.5*PI, finish = 0.5*PI - this.angle;
        if (abs(start - finish) > 1e-6) {
            if (start > finish)
                [start, finish] = [finish, start];
            const r = 70;
            noFill();
            line(this.pivot.x, this.pivot.y, this.pivot.x, this.pivot.y + 50);
            arc(this.pivot.x, this.pivot.y, r, r, start, finish); 
        }
        let str = nf(abs(this.angle)*180/PI, 1, 1);
        let add = textWidth(str)/2 + 4;
        noFill();
        ellipse(this.pivot.x + add, this.pivot.y - 14, 4, 4);
        fill(255);
        noStroke();
        text(str, this.pivot.x, this.pivot.y - 12);
        this.graph(coeff);
    }

    update(gravity) {
        let acc = -(gravity*scl/2500)*sin(this.angle)/this.len;
        this.avel += acc;
        this.angle += this.avel;
        this.angle = ((this.angle + PI)%TWO_PI + TWO_PI)%TWO_PI - PI;
    }

    change(x, y) {
        this.avel = 0;
        let vec = p5.Vector.sub(createVector(x, y), this.pivot);
        vec.setMag(this.len);
        this.pos = p5.Vector.add(vec, this.pivot);
        this.angle = vec.angleBetween(createVector(0, 1));
        if (x < this.pivot.x) {
            this.angle *= -1;
        }
    }

    graph(coeff) {
        push();
        noFill();
        stroke(255);
        let pivot = this.pivot.x;
        if (united) {
            pivot = width/2;
        }
        arrow(P, pivot-this.delta, height-50, pivot+this.delta+10, height-50);
        arrow(P, pivot-this.delta, height, pivot-this.delta, height-100);
        stroke(this.clr);
        beginShape();
        for (let i = 0; i < this.history.length; i++) {
            vertex(i+pivot-this.delta, height-50-30*this.history[i]/coeff);
        }
        endShape();
        noStroke();
        fill(this.clr);
        text(nf(this.history[this.history.length-1]/scl, 1, 2) + ' м', pivot-this.delta-25, height-50-30*this.history[this.history.length-1]/coeff);
        fill(255);
        text('x', pivot-this.delta-10, height-100);
        text('t', pivot+this.delta+10, height-50+10);
        pop();
    }
}

}}, 'main');
