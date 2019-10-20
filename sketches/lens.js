// тонка лінза: промені
module.exports = new p5((P) => { with (P) {

let focus;
let rays = [];
let ready = false, maxN = 100, running = true, description, n = 5, added = true;
let focusS, clrS, mouteR;
let resetB, runB, infoB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    createTitle(P, 'Тонка лінза: Промені');
    
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    infoB = createInfoB(P, 'lens');

    mouteR = createRadio();
    mouteR.option(' Промені', 'single');
    mouteR.elt.innerHTML += '<br/>';
    mouteR.option(' Пучок променів', 'many');
    mouteR.elt.innerHTML += '<br/>';
    mouteR.option(' Предмет', 'object');
    mouteR.elt.innerHTML += '<br/>';
    mouteR.position(5, 50);
    mouteR.value('single');

    focusS = createLabeledSlider(P, [-39, 39, 5, 2], 'Фокусна вiдстань: ', ' м', 150);
    clrS = createLabeledSlider(P, [20, 60, 60, 1], 'Колір променя: ', '', 200);

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
}


P.draw = function() {
    background('#1b4b34');
    translate(width/2, height/2);
    
    focus = map(focusS.value(), -39, 39, -width/2, width/2);
    
    if (mouseIsPressed && mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && running && /*rays.length <= 10 &&*/ rays.length > 0) {
        let x = mouseX - width/2;
        let y = mouseY - height/2;
        let mouse = createVector(x, y);
        if (ready) {
            if (mouteR.value() == 'single') {
                rays[rays.length - 1].direct(x, y);
            } else if (mouteR.value() == 'many') {
                let startPoint = rays[rays.length - 1].start.copy();
                let vec = p5.Vector.sub(mouse, startPoint);
                if (vec.mag() != 0) {
                    if (!added) {
                        for (let i = 1; i < n; i++) {
                            rays.push(new Ray(startPoint.x, startPoint.y));
                        }
                        added = true;
                    }
                    vec.rotate(PI*n/180); 
                    for (let i = 1; i <= n; i++) {
                        vec.rotate(-PI/90);
                        let direction = p5.Vector.add(startPoint, vec);
                        rays[rays.length - i].direct(direction.x, direction.y);
                    }
                }
            }

        }
    }
    
    for (let ray of rays) {
        if (ray.started) {
            ray.diffract();
        }
        ray.show();
    }
        
    showLens();
    
    createShadow(P, -width/2, -height/2);
}

function reset() {
    loop();
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    ready = false;
    started = false;
    focusS.value('5');
    focusS.update();
    rays = [];
    mouteR.value('single');
    clrS.value('60');
    clrS.update();
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
    if (mouteR.value() == 'single' || mouteR.value() == 'many') {
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && running) {
            let x = mouseX - width/2;
            let y = mouseY - height/2;

            if (!ready && x < 0 && rays.length < maxN) {
                rays.push(new Ray(x, y));
                if (mouteR.value() == 'many') {
                    added = false;
                }
                ready = true;
            }
        }
    }
}

P.mouseReleased = function() {
    if (mouteR.value() == 'single' || mouteR.value() == 'many') {
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && running) {
            ready = !ready;
        }
        if (rays.length >= maxN) {
            ready = false;
        }
    }
}

class Ray {
    constructor(x, y) {
        this.start = createVector(x,y);
        this.crack = createVector(x,y);
        this.end = createVector(x,y);
        this.started = false;
        this.clr = clrS.value();
    }

    show() {
        push();
        colorMode(HSL, 360, 100, 100);
        stroke(this.clr, 100, 50, 0.4);
        strokeWeight(4);
        point(this.start.x, this.start.y);
        //strokeWeight(2);
        line(this.start.x, this.start.y, this.crack.x, this.crack.y);
        line(this.crack.x, this.crack.y, this.end.x, this.end.y);
        pop();
    }

    direct(x, y) {
        if (x <= this.start.x) {
            ready = true;
            this.started = false;
            let direction = createVector(x, y);
            let vec = p5.Vector.sub(direction, this.start);
            vec.setMag(max(width, height));
            direction = p5.Vector.add(vec, this.start);
            this.crack = direction.copy();
            this.end = direction.copy();
        } else {
            this.A = this.start.y - y;
            this.B = x - this.start.x;
            this.C = x*this.start.y - this.start.x*y;
            this.crack.x = 0;
            this.crack.y = this.C/this.B;
            this.started = true;
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

