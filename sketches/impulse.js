// закон збереження імпульсу
let sketch = new p5((P) => { with (P) {
let balls = [];
let start;
let running;
let ready;
let chosen;
let mass;
let title;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    colorMode(HSL, 360, 100, 100);
    start = createButton('&#xf00c;');
    start.position(50, 0);
    start.mousePressed(() => {ready = balls.length !== 0;});
    mass = createSlider(2, 5, 3.5, 0.5);
    mass.position(0, 50);
    running = false;
    chosen = -1;
    title = createDiv('Закон збереження імпульсу');
    title.id('title');
}

P.draw = function() {
    background('#1b4b34');
    for (let i = 0; i < balls.length; i++) {
        let elem = balls[i];
        if (running) {
            elem.update();
            elem.collision(i);
        }
        elem.show();
    }
}

P.mousePressed = function() {
    if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
        if (ready && !running) {
            if (chosen > -1) {
                balls[chosen].kick(mouseX, mouseY);
                running = true;
            } else {
                let pos = createVector(mouseX, mouseY);
                for (let i = 0; i < balls.length; i++) {
                    let elem = balls[i];
                    let dist = p5.Vector.sub(elem.pos, pos).mag();
                    if (dist <= elem.radius) {
                        chosen = i;
                        break;
                    }
                }
            }
        } else if (!running) {
            let check = true;
            let pos = createVector(mouseX, mouseY);
            for (let elem of balls) {
                let dist = p5.Vector.sub(pos, elem.pos).mag();
                if (dist < elem.radius + 3*mass.value()) {
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
        this.radius = 3*mass.value();
        this.mass = mass.value();
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.color = color(random(0, 359), 100, 50);
    }
    show() {
        fill(this.color);
        ellipse(this.pos.x, this.pos.y, this.radius*2);
    }
    kick(x, y) {
        this.vel = createVector(x, y);
        this.vel.sub(this.pos);
        this.vel.mult(0.004);
    }
    collision(k) {
        for (let i = k+1; i < balls.length; i++) {
            let elem = balls[i];
            let dist = p5.Vector.sub(this.pos, elem.pos);
            if (dist.mag() < this.radius + elem.radius) {
                dist.setMag(this.radius + elem.radius);
                this.pos = p5.Vector.add(dist, elem.pos);
                /*let angle = this.vel.angleBetween(elem.vel);
                let angle1 = elem.vel.angleBetween(dist);
                dist.mult(-1);
                let angle2 = this.vel.angleBetween(dist);
                let a = sin(angle1)*(2*this.radius - dist.mag())/sin(angle2);
                let b = sin(angle2)*(2*this.radius - dist.mag())/sin(angle2);        TODO
                let change1 = this.vel.copy();
                let change2 = elem.vel.copy();
                change1.setMag(a);
                change2.setMag(b);
                this.pos.sub(change1);
                elem.pos.sub(change2);
                dist.setMag(2*this.radius);*/
            }
            if (dist.mag() == this.radius + elem.radius) {
                let newVel1 = createVector();
                let newVel2 = createVector();
                let direct = p5.Vector.sub(this.pos, elem.pos);
                let angle = -direct.heading();
                this.vel.rotate(angle);
                elem.vel.rotate(angle);
                newVel1.y = this.vel.y;
                newVel2.y = elem.vel.y;
                newVel1.x = ((this.mass - elem.mass)*this.vel.x + 2*elem.mass*elem.vel.x)/(this.mass + elem.mass);
                newVel2.x = ((elem.mass - this.mass)*elem.vel.x + 2*this.mass*this.vel.x)/(this.mass + elem.mass);
                newVel1.rotate(-angle);
                newVel2.rotate(-angle);
                this.vel = newVel1;
                elem.vel = newVel2;
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
}}, 'main');

document.getElementById('main').style.height = sketch.height+marginTop + 'px'
