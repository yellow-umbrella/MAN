// тонка лінза: промені
module.exports = new p5((P) => { with (P) {

let title;
let focus;
let ray;
let ready, started, running;
let focusS;
let resetB, runB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    
    title = createDiv('Тонка лінза: Промені');
    title.id('title');
    title.elt.style.width = width + 'px';

    running = true;

    focusS = createSlider(-39, 39, 5, 2);
    focusS.position(5, 50);

    resetB = createButton('&#xf2f9;');
    resetB.position(105, 0);
    resetB.mousePressed(reset);
    resetB.elt.title = 'оновити';

    runB = createButton('&#xf04c;');
    runB.position(55, 0);
    runB.mousePressed(run);
    runB.elt.title = 'зупинити';

    ready = false;
    started = false;
}


P.draw = function() {
    background('#1b4b34');
    translate(width/2, height/2);

    focus = map(focusS.value(), -39, 39, -width/2, width/2);

    if (started || ready) {
        if (started) {
            ray.diffract();
        }
        ray.show();
    }

    showLens();
}

function reset() {
    loop();
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    ready = false;
    started = false;
    focusS.value('5');
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

function showLens() {
    strokeWeight(2);
    stroke(250);
    line(-width/2, 0, width/2, 0);
    line(0, -100, 0, 100);
    strokeWeight(5);
    point(-focus, 0);
    point(focus, 0);
    strokeWeight(2);
    if (focus > 0) {
        line(0, 100, -5, 95);
        line(0, 100, 5, 95);
        line(0, -100, -5, -95);
        line(0, -100, 5, -95);
    } else {
        line(0, -100, -5, -105);
        line(0, -100, 5, -105);
        line(0, 100, -5, 105);
        line(0, 100, 5, 105);
    }
    for (let i = -height/2; i <= height/2; i += 15) {
        line(0, i, 0, i + 5);
    }
}

P.mousePressed = function() {
    if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && running) {
        let x = mouseX - width/2;
        let y = mouseY - height/2;

        if (ready) {
            ready = false;
            started = true;
            ray.direct(x, y);
        } else if (x < 0) {
            ray = new Ray(x, y);
            ready = true;
            started = false;
        }
    }
}

class Ray {
    constructor(x, y) {
        this.start = createVector(x,y);
        this.crack = createVector(x,y);
        this.end = createVector(x,y);
    }

    show() {
        stroke('yellow');
        strokeWeight(4);
        point(this.start.x, this.start.y);
        strokeWeight(2);
        line(this.start.x, this.start.y, this.crack.x, this.crack.y);
        line(this.crack.x, this.crack.y, this.end.x, this.end.y);
    }

    direct(x, y) {
        if (x <= this.start.x) {
            ready = true;
            started = false;
        } else {
            this.A = this.start.y - y;
            this.B = x - this.start.x;
            this.C = x*this.start.y - this.start.x*y;
            this.crack.x = 0;
            this.crack.y = this.C/this.B;
        }
    }

    diffract() {
        let x = focus;
        let y = (this.C - this.A*x)/this.B;
        y -= this.crack.y;
        let A = this.crack.y - y;
        let B = x - this.crack.x;
        let C = x*this.crack.y - this.crack.x*y;
        this.end.y = (C - A*(width/2))/B;
        this.end.x = width/2;
    }
}
}}, 'main');

