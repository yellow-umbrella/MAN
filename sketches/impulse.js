let balls = [];
let start;
let running;
let ready;
let borderH;
let borderV;

function setup() {
    createCanvas(windowWidth, windowHeight);
    fill(255,0,0);
    start = createButton('&#xf2f9;'); //change
    start.position(15, 15);
    start.mousePressed(() => {ready = balls.length !== 0;});
    running = false;
    borderH = 50;
    borderV = 50;
}

function draw() {
    background(51);
    line(0, borderH, borderV, borderH);
    line(borderV, 0, borderV, borderH);
    for (let i = 0; i < balls.length; i++) {
        let elem = balls[i];
        if (running) {
            elem.update();
            elem.collision(i);
        }
        elem.show();
    }
}

function mousePressed() {
    if (mouseX > borderV || mouseY > borderH) {
        if (ready && !running) {
            balls[0].kick(mouseX, mouseY);
            running = true;
        } else if (!running) {
            let check = true;
            let pos = createVector(mouseX, mouseY);
            for (let elem of balls) {
                let dist = p5.Vector.sub(pos, elem.pos).mag();
                if (dist < 2*elem.radius) {
                    check = false;
                    break;
                }
            }
            if (check) {
                balls.push(new Ball(pos.x, pos.y));
            }
        }
    }
}

class Ball {
    constructor(x, y) {
        this.radius = 10;
        this.mass = 3;
        this.pos = createVector(x, y);
        this.vel = createVector();
    }
    show() {
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
    }
    kick(x, y) {
        this.vel = createVector(x, y);
        this.vel.sub(this.pos);
        this.vel.mult(0.0035);
    }
    collision(k) {
        for (let i = k+1; i < balls.length; i++) {
            let elem = balls[i];
            let dist = p5.Vector.sub(this.pos, elem.pos);
            if (dist.mag() < 2*this.radius) {
                dist.setMag(2*this.radius);
                this.pos = p5.Vector.add(dist, elem.pos);
            }
            if (dist.mag() == 2*this.radius) {
                let newVel1 = p5.Vector.sub(elem.vel, this.vel); //to do
                newVel1.mult(2*this.mass/(this.mass + elem.mass));
                let newVel2 = p5.Vector.sub(this.vel, elem.vel);
                newVel2.mult(2*elem.mass/(this.mass + elem.mass));
                this.vel.add(newVel1);
                elem.vel.add(newVel2);
            }
        }
    }
    update() {
        this.pos.add(this.vel);
        this.check();
    }

    check() {
        if (this.pos.x < this.radius) {
            this.vel.x *= -1;
            this.pos.x = this.radius;
         }
 
         if (this.pos.x > width - this.radius) {
            this.vel.x *= -1;
            this.pos.x = width - this.radius;
         }
 
         if (this.pos.y < this.radius) {
             this.vel.y *= -1;
             this.pos.y = this.radius;
          }
 
         if (this.pos.y > height - this.radius) {
             this.vel.y *= -1;
             this.pos.y = height - this.radius;
          }
    }
}