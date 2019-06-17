let particles = [];
let gCharge;

function setup() {
    createCanvas(windowWidth, windowHeight)
    colorMode(HSL, 360, 100, 100);
    stroke(255);

    gCharge = createSlider(-2, 2, 0, 0.1);
    gCharge.position(50, height-50);
}

function draw() {
    background(150, 50, 30);
    for (let i = 0; i < particles.length; i++) {
        particles[i].apply(i);
    }
    for (let elem of particles) {
        elem.update();
        elem.show();
        elem.collision();
    }
}

function mousePressed() {
    if (mouseX > 4 && mouseX < width-4 && mouseY > 4 && mouseY < height-4 && particles.length < 100 
        && (mouseX > 179 || mouseX < 50) && (mouseY > height-50 || mouseY < height-71)) {
        particles.push(new Particle(gCharge.value(), mouseX, mouseY));
    }
}

function keyPressed() {
    if (keyCode === 32 && particles.length < 100) {
        for (let i = 0; i <= 100; i++)
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
        let tone;
        this.charge<0?tone = 240:tone = 0;
        let sat = map(abs(this.charge), 0, 2, 80, 50);
        if (this.charge === 0) sat = 100;
        fill(tone, 100, sat);
        strokeWeight(0.5);
        ellipse(this.pos.x, this.pos.y, 8);
    }
    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.setMag(0);
        this.check()
    } 
    apply(n) {
        for (let i = n + 1; i < particles.length; i++) {
            let elem = particles[i];
            let dist = p5.Vector.sub(this.pos, elem.pos);
            if (dist.mag() === 0 && this.charge*elem.charge > 0) {
                dist = p5.Vector.random2D();
            }
            if (dist.mag() < 32) {
                dist.setMag(32);
            }
            let force = dist.copy();
            force.normalize();
            force.mult(elem.charge*this.charge*100);
            if (dist.mag() != 0) {
                force.mult(1/(dist.mag()*dist.mag()));
                this.acc.add(force);
                force.mult(-1);
                elem.acc.add(force)
            }
        }
    }
    check() {
        if (this.pos.x < 4) {
           this.vel.x *= -1;
           this.pos.x = 4;
        }

        if (this.pos.x > width-4) {
           this.vel.x *= -1;
           this.pos.x = width - 4;
        }

        if (this.pos.y < 4) {
            this.vel.y *= -1;
            this.pos.y = 4;
         }

        if (this.pos.y > height-4) {
            this.vel.y *= -1;
            this.pos.y = height - 4;
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