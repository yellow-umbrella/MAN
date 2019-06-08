let gravity;
let ball;
let ground;
let button;
let slider;
let wind;

function setup() {
    createCanvas(windowWidth, windowHeight);
    fill(255,0,0);
    stroke(255,255,255);
    gravity = createVector(0, 1);
    ground = height - 100;
    ball = new Ball();
    button = createButton('&#xf2f9;');
    button.position(50, ground + 50);
    button.mousePressed(change);
    slider = createSlider(-10, 10, 0, 1);
    slider.position(100, ground + 50);
    textSize(18);
}

function draw() {
    background(51);
    line(0, ground, width, ground);
    text('Вітер:', 100, ground + 30);
    wind = createVector(slider.value()*0.5, 0);
    ball.update();
    ball.show();
    if (mouseIsPressed && mouseY <= ground) {
        ball.simulate(mouseX, mouseY);
    }
}

function change() {
    ball = new Ball();
    slider.value('0');
}

function mouseReleased() {
    if (mouseY <= ground) {
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
