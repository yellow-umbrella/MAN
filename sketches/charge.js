let sketch = new p5((P) => { with (P) {
let particles = [];
let gCharge;
let resetB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop)
    colorMode(HSL, 360, 100, 100);
    stroke(255);

    gCharge = createSlider(-2, 2, 0, 0.1);
    gCharge.position(5, 50);

    resetB = createButton('&#xf2f9;');
    resetB.position(50, 0);
    resetB.mousePressed(reset);
}

P.draw = function() {
    background('#1b4b34');
    for (let i = 0; i < particles.length; i++) {
        particles[i].apply(i);
    }
    for (let elem of particles) {
        elem.update();
        elem.show();
        elem.collision();
    }
}

P.mousePressed = function() {
    if (mouseX > 4 && mouseX < width-4 && mouseY > 4 && mouseY < height-4 && particles.length < 100) {
        particles.push(new Particle(gCharge.value(), mouseX, mouseY));
    }
}

P.keyPressed = function() {
    if (keyCode === 32 && particles.length == 0) {
        for (let i = 0; i < 100; i++)
        particles.push(new Particle(random(-2, 2), random(4, width-4), random(4, height-4))); 
    }
}

function reset() {
    particles = [];
    gCharge.value('0');
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
}}, 'main');

document.getElementById('main').style.height = sketch.height+marginTop + 'px'
