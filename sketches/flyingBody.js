//  кинуте тiло
module.exports = new p5((P) => { with (P) {

let gravity;
let ball1, ball2;
let ground, vel1, vel2, scl = 100;
let running = true, kicked1 = false, kicked2 = false, first = true;
let heightS;
let resetB, runB, infoB, checkbox;
let arrows;
let rate = 50;
let dataBackup = {
    v0:    '0',
    alpha: '0',
    h0:    '0',
    dist:  '--',
    time:  '--',
    h:     '--'
}; 
let data = {
    1: Object.assign({}, dataBackup), 
    2: Object.assign({}, dataBackup)
};

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    stroke(255);
    frameRate(rate);

    gravity = createVector(0, 9.8*scl/(rate*rate));
    ground = height - 50;

    createTitle(P, 'Тіло, кинуте під кутом');
    
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    infoB = createInfoB(P, 'flyingBody');
    
    heightS = createLabeledSlider(P, [0, ground-10, 0, 1], 'Початкова висота: ', ' м', 50, scl);
    heightS.input(() => {heightS.update();
                         data[1+!first].h = data[1+!first].dist = data[1+!first].time = '--'; 
                         data[1+!first].h0 = heightS.value()/scl});
    checkbox = createToggle(P, 85, "Переключити м'яч", false);
    checkbox.changed(change);
    checkbox.color(off='yellow', on='orange');

    ball1 = new Ball('yellow');
    ball2 = new Ball('orange');
    vel1 = createVector();
    vel2 = createVector();

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textSize(12);

    arrows = createVector();
    new p5((P2) => drawArrows(P2, arrows), 'main');
}

function showData(data) {
    let dataLabels = 
        ["Початкова швидкiсть, м/с", 
         "Початковий кут, *", 
         "Початкова висота, м", 
         "Дальнiсть польоту, м", 
         "Час польоту, с", 
         "Висота польоту, м"];
    push();
    noStroke();
    let i = 2;
    fill('yellow');
    text('M\'яч 1', width-80, 20);
    fill('orange');
    text('М\'яч 2', width-40, 20);
    for (let field in data[1]) {
        if (field == 'absalpha') continue;
        fill(255);
        text(dataLabels[i-2], width-240, 20*i);
        fill('yellow');
        text(data[1][field], width-80, 20*i);
        fill('orange');
        text(data[2][field], width-40, 20*i);
        i++;
    }
    stroke(255);
    for (let i = 0; i < 8; i++) {
        line(width-242, 20*i+5, width-2, 20*i+5);
    }
    for (let i of [240, 80, 40, 0]) {
        line(width-i-2, 5, width-i-2, 145);
    }
    pop();
}

function processBall(which) {
    let ball = [ball2, ball1][which];
    let kicked = [kicked2, kicked1][which];
    let vel = [vel2, vel1][which];
    if (kicked) {
        if (running) {
            if (ball.update()) {
                ball.height = 0;
                if (first == which) {
                    heightS.value('0');
                    heightS.update();
                }
                kicked = false;
                vel.set(0, 0);
                let d = data[!which+1];
                let v0y = parseFloat(d.v0)*sin(d.absalpha)*rate/scl;
                let g = 9.8;
                d.time = nf((v0y + sqrt(v0y*v0y + 2*parseFloat(d.h0)*g))/g, 1, 2);
                d.dist = nf(parseFloat(d.time)*parseFloat(d.v0)*rate/scl*cos(d.absalpha), 1, 2);
                console.log(v0y);
                if (v0y < 0) v0y = 0;
                d.h = nf((v0y*v0y*0.5/g + parseFloat(d.h0)), 1, 2);
                console.log(d, g, v0y);
            }

        }
        if (first == which) {
            arrows.set(ball.vel.x, ball.vel.y);
        }
    } else {
        if (first == which) {
            ball.height = heightS.value();
            ball.pos.y = ground-ball.radius-ball.height;
            arrows.set(vel.x*scl/rate, vel.y*scl/rate);
        }
    }
    return kicked;
}

// t = (v0y + sqrt(v02*v0y + 2gh))/g
// l = t*v0x
// h = v0y**2 / 2g + h0

P.draw = function() {
    background('#1b4b34');
    showGround();

    kicked1 = processBall(1);
    kicked2 = processBall(0);

    if (first) {
        ball2.show();
        ball1.show();
    } else {
        ball1.show();
        ball2.show();
    }
    
    if (mouseIsPressed && mouseY < ground-ball1.radius && mouseX > 0 && mouseY > 0) {
        if (first) {
            ball1.simulate(mouseX, mouseY);
            data[1] = Object.assign({}, dataBackup);
            data[1].h0 = heightS.value()/scl;
            data[1].v0 = nf(vel1.mag()*scl/rate, 1, 1);
            data[1].absalpha = -vel1.heading();
            let alpha = abs(degrees(data[1].absalpha));
            if (alpha > 90) alpha = 180-alpha;
            data[1].alpha = nf(alpha, 1, 1);
        } else {
            ball2.simulate(mouseX, mouseY);
            data[2] = Object.assign({}, dataBackup);
            data[2].h0 = heightS.value()/scl;
            data[2].v0 = nf(vel2.mag()*scl/rate, 1, 1);
            data[2].absalpha = -vel2.heading()
            let alpha = abs(degrees(data[2].absalpha));
            if (alpha > 90) alpha = 180-alpha;
            data[2].alpha = nf(alpha, 1, 1);
        }
    }

    createShadow(P);
    showData(data);
}

function reset() {
    loop();
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;
    checkbox.checked(false);
    first = true;
    kicked1 = false;
    kicked2 = false;
    heightS.value('0');
    heightS.update();
    ball1 = new Ball('yellow');
    ball2 = new Ball('orange');
    vel1.setMag(0);
    vel2.setMag(0);
    data = {
        1: Object.assign({}, dataBackup), 
        2: Object.assign({}, dataBackup)
    };
}

function run() {
    if (running) {
        running = false;
        runB.html('&#xf04b;');
        runB.elt.title = 'продовжити';
        //noLoop();
    } else {
        //loop();
        runB.html('&#xf04c;');
        running = true;
        runB.elt.title = 'зупинити';
    }
}

function showGround() {
    strokeWeight(1);
    stroke('#30825b');
    line(100, 0, 100, ground);
    stroke(255);
    line(0, ground, width, ground);
    
    fill(255);
    for (let i = 0; i*scl <= width; i++) {
        strokeWeight(4);
        stroke(255);
        point(i*scl, ground);
        if (i > 0) {
            noStroke();
            text((i - 1) + ' м', i*scl, ground + 15);
        }
    }

    fill('#30825b');
    for (let i = 1; ground - i*scl >= 0; i++) {
        strokeWeight(4);
        stroke('#30825b');
        point(100, ground - i*scl);
        noStroke();
        text(i + ' м', 75, ground - i*scl);
    }
}

P.mouseReleased = function() {
    if (mouseY < ground-ball1.radius && mouseX > 0 && mouseX < width && mouseY > 0) {
        if (first) {
            ball1.kick(mouseX, mouseY);
            kicked1 = true;
        } else {
            ball2.kick(mouseX, mouseY);
            kicked2 = true;
        }
    }
}

function change() {
    first = !first;
    if (first) {
        heightS.value(ball1.height);
        heightS.update();
    } else {
        heightS.value(ball2.height);
        heightS.update();
    }
}

class Ball {
    constructor(clr) {
        this.radius = 5;
        this.pos = createVector(100, ground-this.radius);
        this.vel = createVector();
        this.height = 0;
        this.clr = clr;
    }

    show() { 
        fill(this.clr);
        stroke(255);
        strokeWeight(1);
        ellipse(this.pos.x, this.pos.y, 2*this.radius);
    }

    update() {
        this.vel.add(gravity);
        this.pos.add(this.vel);
        if (this.pos.y > ground-this.radius) {
            this.pos.y = ground-this.radius;
            // this.vel.y *= -1;
            // this.vel.mult(0.95);
            this.vel.set(0, 0);
            return true;
        } else return false;
    }

    kick(x, y) {
        let mouse = createVector(x, y);
        mouse.sub(this.pos);
        mouse.div(20);
        this.vel = mouse;
        if (first) {
            vel1 = this.vel.copy(); 
            vel1.mult(rate/scl);
        } else {
            vel2 = this.vel.copy(); 
            vel2.mult(rate/scl);
        }
    }

    simulate(x, y) {
        let friend = new Ball();
        friend.pos = this.pos.copy();
        friend.kick(x, y);
        strokeWeight(1);
        stroke(255);
        do {
            point(friend.pos.x, friend.pos.y);
        } while (!friend.update());
    }
}
}}, 'main');

