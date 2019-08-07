// Маятник
module.exports = new p5((P) => { with (P) {

let gravity;
let pendulum;
let running, scl = 150;
let lenS, gravityS;
let resetB, runB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    frameRate('50');
    stroke(255, 255, 255);
    
    createTitle(P, 'Математичний маятник');
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);

    gravityS = createLabeledSlider(P, [1.6, 10, 9.8, 0.1], 'Прискорення вільного <br> падіння: ', ' м/с<sup>2</sup>', 50, 1, 40);
    lenS = createLabeledSlider(P, [height*0.1, height*0.7, height*0.4, 1].map(round), 'Довжина нитки: ', ' м', 120, scl);
    
    pendulum = new Pendulum();
    running = true;
    lenS.input(() => lenS.output.elt.value = pendulum.len = lenS.value());

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textAlign(CENTER, CENTER);
}

P.draw = function() {
    background('#1b4b34');
    
    if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && mouseIsPressed) {
        pendulum.change(mouseX, mouseY);
    } else if (running) {
        pendulum.update();
    }
    pendulum.show();
}

function reset() {
    loop();
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    gravityS.value('9.8');
    lenS.value(round(0.4*height)+'');
    pendulum = new Pendulum();
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
    constructor() {
        this.radius = 10;
        this.pivot = createVector(width/2, height/4);
        this.pos = this.pivot.copy();
        this.len = lenS.value();
        this.pos.y += this.len;
        this.angle = 0;
        this.avel = 0;
        this.mass = 1;
    }

    show() {
        this.pos.set(this.len*sin(this.angle), this.len*cos(this.angle));
        this.pos.add(this.pivot);
        stroke(255);
        fill('red');
        line(this.pivot.x, this.pivot.y, this.pos.x, this.pos.y);
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
        let start = 0.5*PI, finish = 0.5*PI - this.angle;
        if (abs(start - finish) > 1e-6) {
            if (start > finish)
                [start, finish] = [finish, start];
            const r = 70;
            noFill();
            line(this.pivot.x, this.pivot.y, this.pivot.x, this.pivot.y + 50);
            arc(this.pivot.x, this.pivot.y, r, r, start, finish); 
        }
        let str = nfc(abs(this.angle)*180/PI, 1);
        let add = textWidth(str)/2 + 4;
        noFill();
        ellipse(this.pivot.x + add, this.pivot.y - 14, 4, 4);
        fill(255);
        noStroke();
        text(str, this.pivot.x, this.pivot.y - 12);
    }

    update() {
        let acc = -(gravityS.value()*scl/2500)*sin(this.angle)/this.len;
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
        if (x < width/2) {
            this.angle *= -1;
        }
    }
}

}}, 'main');
    
    
