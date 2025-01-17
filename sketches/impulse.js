// закон збереження імпульсу
module.exports = new p5((P) => { with (P) {

let balls = [];
let started = false, ready = false, chosen = -1, running = true, description;
let massS, checkbox;
let readyB, resetB, runB, infoB;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    colorMode(HSL, 360, 100, 100);
    
    createTitle(P, 'Закон збереження імпульсу');
    
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    infoB = createInfoB(P, 'impulse');
    checkbox = createToggle(P);

    massS = createLabeledSlider(P, [2, 4, 3, 0.1], 'Маса тiла: ', ' кг', 50);

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textAlign(CENTER, CENTER);
}

P.draw = function() {
    background('#1b4b34');

    if (mouseIsPressed && chosen > -1 && mouseButton === LEFT) {
        push();
        translate(balls[chosen].pos.x, balls[chosen].pos.y);
        let vec = p5.Vector.sub(createVector(mouseX, mouseY), balls[chosen].pos);
        rotate(vec.heading());
        strokeWeight(2);
        stroke('yellow');
        const dots = 30
        for (let i = 1; i <= dots; i++) {
            point(i*vec.mag()/dots,0);
        }
        pop();
    }

    for (let i = 0; i < balls.length; i++) {
        let elem = balls[i];
        if (started && running) {
            elem.update();
            elem.collision(i);
        }
        elem.show();
    }

    createShadow(P);
}

function reset() {
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;

    balls = [];
    massS.value('3');
    massS.update();
    started = false;
    ready = false;
    chosen = -1;
    checkbox.checked(true);
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

P.mouseReleased = function(){
    if (chosen > -1 && mouseButton === LEFT) {
        balls[chosen].kick(mouseX, mouseY);
        chosen = -1;
        started = true;
    } else if (chosen > -1) {
        balls[chosen].vel.set(0, 0);
        chosen = -1;
    }
}

P.mousePressed = function() {
    if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
        let check = false;
        let pos;
        if (mouseY > 6*massS.value() && mouseX > 6*massS.value() && mouseX < width - 6*massS.value() && mouseY < height - 6*massS.value()) {
            check = true;
            pos = createVector(mouseX, mouseY);
            
            for (let elem of balls) {
                let dist = p5.Vector.sub(pos, elem.pos).mag();
                if (dist < elem.radius + 6*massS.value()) {
                    check = false;
                    break;
                }
            }
        }
        
        if (check && mouseButton === LEFT) {
            balls.push(new Ball(pos.x, pos.y, balls.length));
        } else if (chosen == -1) {
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
    }
}



class Ball {
    constructor(x, y, id) {
        this.radius = 6*massS.value();
        this.mass = massS.value();
        this.pos = createVector(x, y);
        this.vel = createVector();
        this.color = color(random(0, 359), 100, 50);
        this.id = id;
    }

    show() {
        fill(this.color);
        strokeWeight(1);
        stroke(0);
        ellipse(this.pos.x, this.pos.y, this.radius*2);
        noStroke();
        if (checkbox.checked()) {
            fill(0);
            textSize(4*this.mass);
            text(nf(this.mass, 1, 1) + ' кг', this.pos.x, this.pos.y - this.mass);
            textSize(10);
            if (chosen == this.id && mouseButton == LEFT) {
                fill('yellow');
                let vel = createVector(mouseX, mouseY);
                vel.sub(this.pos);
                vel.mult(0.004);
                text(nf(vel.mag(), 1, 2) + ' м/с', this.pos.x + this.radius, this.pos.y + this.radius + 6);
            } else {
                fill(255);
                text(nf(this.vel.mag(), 1, 2) + ' м/c', this.pos.x + this.radius, this.pos.y + this.radius + 6);
            }
        }
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

