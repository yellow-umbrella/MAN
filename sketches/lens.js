// тонка лінза: промені
let sketch = new p5((P) => { with (P) {
let focus;
let slider;
let ready;
let started;
let ray;
let resetB;
let title;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);

    slider = createSlider(-39, 39, 5, 2);
    slider.position(5, 50);

    resetB = createButton('&#xf2f9;');
    resetB.position(50, 0);
    resetB.mousePressed(reset);

    ready = false;
    started = false;
    title = createDiv('Тонка лінза: Промені');
    title.id('title');
}


P.draw = function() {
    background('#1b4b34');
    translate(width/2, height/2);
    focus = map(slider.value(), -39, 39, -width/2, width/2);
    if (started || ready) {
        if (started) {
            ray.diffract();
        }
        ray.show();
    }
    showLens();
}

function reset() {
    ready = false;
    started = false;
    slider.value('5');
}

function showLens() {
    strokeWeight(2);
    stroke(250);
    line(-width/2, 0, width/2, 0);
    line(0, -100, 0, 100);
    strokeWeight(5);
    point(-focus, 0);
    point(focus, 0);
}

P.mousePressed = function() {
    if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
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

document.getElementById('main').style.height = sketch.height+marginTop + 'px'
