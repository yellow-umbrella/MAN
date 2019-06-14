let particles = [];
let gCharge;

function setup() {
    createCanvas(windowWidth, windowHeight)
    fill(255,0,0);
    stroke(255,255,255);

    gCharge = createSlider(-2, 2, 0, 0.1);
    gCharge.position(50, height-50);
}

function draw() {
    background(51);
    for (let elem of particles) {
        elem.apply();
    }
    for (let elem of particles) {
        elem.update();
        elem.show();
        elem.collision();
    }
}

function mousePressed() {
    if (mouseX > 4 && mouseX < width-4 && mouseY > 4 && mouseY < height-4) {
        particles.push(new Particle(gCharge.value(), mouseX, mouseY));
    }
}

function keyPressed() {
    if (keyCode === 32) {
        particles.push(new Particle(random(-2, 2), random(4, width-4), random(4, height-4))); 
    }
}

class Particle {
    constructor(charge, x, y) {
        this.charge = charge;
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.acc = createVector();
    }
    show() {
        fill(this.charge<0?"blue":"red");
        strokeWeight(0.5);
        ellipse(this.pos.x, this.pos.y, 8);
    }
    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.setMag(0);
        this.check()
    } 
    apply() {
        for (let elem of particles) {
            let dist = p5.Vector.sub(this.pos, elem.pos);
            if (dist.mag() < 32) dist.setMag(32);
            let force = dist.copy();
            force.normalize();
            force.mult(elem.charge*this.charge*100);
            if (dist.mag() != 0) {
                force.mult(1/(dist.mag()*dist.mag()));
                this.acc.add(force);
            }
        }
    }
    check() {
       if (this.pos.x <= 4 || this.pos.x >= width-4) {
           this.vel.x *= -1;
       }
       if (this.pos.y <= 4 || this.pos.y >= height-4) {
        this.vel.y *= -1;
       }
    }
    collision() {
        let dist; 
        for (let elem of particles) {
            dist = this.pos.copy();
            dist.sub(elem.pos);
            if (dist.mag() <= 8) {
                let charge = this.charge + elem.charge;
                charge /= 2;
                this.charge = elem.charge = charge;
            }
        }
    }
}