let sketch = new p5((P) => { with (P) {
let gravity;
let ball;
let ground;
let button;
let slider;
let wind;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    fill(255,0,0);
    stroke(255,255,255);
    gravity = createVector(0, 1);
    ground = height - 100;
    ball = new Ball();
    button = createButton('&#xf2f9;');
    button.position(50, 0);
    button.mousePressed(reset);
    slider = createSlider(-10, 10, 0, 1);
    slider.position(5, 50);
}

P.draw = function() {
    background(51);
    line(0, ground, width, ground);
    wind = createVector(slider.value()*0.5, 0);
    ball.update();
    ball.show();
    if (mouseIsPressed && mouseY < ground && mouseX > 0 && mouseY > 0) {
        ball.simulate(mouseX, mouseY);
    }
}

function reset() {
    ball = new Ball();
    slider.value('0');
}

P.mouseReleased = function() {
    if (mouseY < ground && mouseX > 0 && mouseX < width && mouseY > 0) {
        ball.kick(mouseX, mouseY);
    }
}

class Ball {
    constructor() {
        this.radius = 10;
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
        mouse.div(15);
        this.vel = mouse;
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


