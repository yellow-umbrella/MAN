// закон збереження імпульсу
let sketch = new p5((P) => { with (P) {

let title;
let balls = [];
let started, ready, chosen, running;
let massS;
let readyB, resetB, runB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    colorMode(HSL, 360, 100, 100);
    
    title = createDiv('Закон збереження імпульсу');
    title.id('title');
    
    started = false;
    chosen = -1;
    ready = false;
    running = true;

    resetB = createButton('&#xf2f9;');
    resetB.position(100, 0);
    resetB.mousePressed(reset);
    resetB.elt.title = 'оновити';

    readyB = createButton('&#xf00c;');
    readyB.position(150, 0);
    readyB.mousePressed(() => {ready = balls.length !== 0;});
    readyB.elt.title = 'підтвердити';

    runB = createButton('&#xf04c;');
    runB.position(50, 0);
    runB.mousePressed(run);
    runB.elt.title = 'зупинити';

    massS = createSlider(2, 5, 3.5, 0.25);
    massS.position(0, 50);
}

P.draw = function() {
    background('#1b4b34');
    for (let i = 0; i < balls.length; i++) {
        let elem = balls[i];
        if (started && running) {
            elem.update();
            elem.collision(i);
        }
        elem.show();
    }
}

function reset() {
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    balls = [];
    massS.value('3.5');
    started = false;
    ready = false;
    chosen = -1;
}

function run() {
    if (running) {
        running = false;
        runB.html('&#xf04b;');
        runB.elt.title = 'продовжити';
    } else {
        runB.html('&#xf04c;');
        running = true;
        runB.elt.title = 'зупинити';
    }
}

P.mousePressed = function() {
    if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && !started) {
        if (ready) {
            if (chosen > -1) {
                balls[chosen].kick(mouseX, mouseY);
                started = true;
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
        } else {
            let check = true;
            let pos = createVector(mouseX, mouseY);

            for (let elem of balls) {
                let dist = p5.Vector.sub(pos, elem.pos).mag();
                if (dist < elem.radius + 3*massS.value()) {
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
        this.radius = 3*massS.value();
        this.mass = massS.value();
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
