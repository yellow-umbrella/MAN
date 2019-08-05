// тонка лінза: промені
module.exports = new p5((P) => { with (P) {

let focus;
let rays = [];
let ready = false, started = false, running = true;
let focusS;
let resetB, runB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    createTitle(P, 'Тонка лінза: Промені');
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);

    focusS = createSlider(-39, 39, 5, 2);
    focusS.position(0, 20);

    let labelFocus = createElement('label', 'Фокусна відстань:');
    labelFocus.elt.appendChild(focusS.elt);
    labelFocus.position(5, 50);

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
}


P.draw = function() {
    background('#1b4b34');
    translate(width/2, height/2);

    focus = map(focusS.value(), -39, 39, -width/2, width/2);

    if (mouseIsPressed && mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && running && rays.length <= 10 && rays.length > 0) {
        let x = mouseX - width/2;
        let y = mouseY - height/2;
        if (ready) {
            rays[rays.length - 1].direct(x, y);
        }
    }

    //if (started || ready) {
        for (let ray of rays) {
            if (started) {
                ray.diffract();
            }
            ray.show();
        }
    //}

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
    rays = [];
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
            //ready = false;
            //started = true;
            //rays[rays.length - 1].direct(x, y);
        } else if (x < 0 && rays.length <= 10) {
            rays.push(new Ray(x, y));
            //ready = true;
            //started = false;
        }
    }
}

P.mouseReleased = function() {
    ready = !ready;
    started = !started;
}

class Ray {
    constructor(x, y) {
        this.start = createVector(x,y);
        this.crack = createVector(x,y);
        this.end = createVector(x,y);
    }

    show() {
        stroke(255, 255, 0, 100);
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

