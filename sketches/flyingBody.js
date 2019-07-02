let sketch = new p5((P) => { with (P) {
let gravity;
let ball;
let ground;
let resetB;
let slider;
let wind;
let vel;
let scl = 100;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    fill(255,0,0);
    stroke(255,255,255);
    frameRate('50');
    
    gravity = createVector(0, 9.8*scl/2500);
    ground = height - 100;
    ball = new Ball();
    vel = createVector();
    
    resetB = createButton('&#xf2f9;');
    resetB.position(50, 0);
    resetB.mousePressed(reset);
    
    slider = createSlider(-10, 10, 0, 1);
    slider.position(5, 50);
}

P.draw = function() {
    background('#1b4b34');
    line(0, ground, width, ground);
    strokeWeight(4);
    for (let i = 0; i <= width; i += scl) {
        point(i, ground);
    }
    strokeWeight(1);
    wind = createVector(slider.value()*0.5, 0);
    ball.update();
    ball.show();
    if (mouseIsPressed && mouseY < ground && mouseX > 0 && mouseY > 0) {
        ball.simulate(mouseX, mouseY);
    }
    text(nfc(vel.mag(), 2), 5, ground + 10);
    text(nfc(vel.x, 2), 5, ground + 20);
    text(nfc(-vel.y, 2), 5, ground + 30);

    //console.log(frameRate());
}

function reset() {
    ball = new Ball();
    slider.value('0');
    vel.setMag(0);
}

P.mouseReleased = function() {
    if (mouseY < ground && mouseX > 0 && mouseX < width && mouseY > 0) {
        ball.kick(mouseX, mouseY);
    }
}

class Ball {
    constructor() {
        this.radius = 5;
        this.pos = createVector(100, ground-this.radius);
        this.vel = createVector();
    }

    show() { 
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
    }

    update() {
        this.vel.add(gravity);
        this.pos.add(this.vel);
        this.pos.add(wind);
        if (this.pos.y > ground-this.radius) {
            this.pos.y = ground-this.radius;
            this.vel.y *= -1;
            this.vel.mult(0.95);
            return true;
        } else return false;
    }

    kick(x, y) {
        let mouse = createVector(x, y);
        mouse.sub(this.pos);
        mouse.div(20);
        this.vel = mouse;
        vel = this.vel.copy();
        vel.mult(50/scl);
    }

    simulate(x, y) {
        let friend = new Ball;
        friend.pos = this.pos.copy();
        friend.kick(x, y);
        do {
            point(friend.pos.x, friend.pos.y);
        } while (!friend.update());
    }
}
}}, 'main');

document.getElementById('main').style.height = sketch.height+marginTop + 'px'


