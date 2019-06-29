let sketch = new p5((P) => { with (P) {
let focus;
let slider;
let ready;
let started;
let ray;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    slider = createSlider(-width/2, width/2, 25, 10);
    slider.position(5, 50);
    ready = false;
    started = false;
}


P.draw = function() {
    background(51);
    translate(width/2, height/2);
    focus = slider.value();
    if (started || ready) {
        if (started) {
            ray.diffract();
        }
        ray.show();
    }
    showLens();
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
    if (mouseY < height && mouseX > 0 && mouseX < width && mouseY < height) {
        let x = mouseX - width/2;
        let y = mouseY - height/2;
        if (ready) {
            ray.direct(x, y);
            ready = false;
            started = true;
        } else {
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
        strokeWeight(2);
        stroke('yellow');
        line(this.start.x, this.start.y, this.crack.x, this.crack.y);
        line(this.crack.x, this.crack.y, this.end.x, this.end.y);
    }
    direct(x, y) {
        this.A = this.start.y - y;
        this.B = x - this.start.x;
        this.C = x*this.start.y - this.start.x*y;
        if (this.B == 0) {

        } else {
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
