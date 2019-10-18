//  кинуте тiло
module.exports = new p5((P) => { with (P) {

let gravity;
let ball1, ball2;
let ground, vel1, vel2, scl = 100;
let running = true, kicked1 = false, kicked2 = false, first = true;
let heightS;
let resetB, runB, infoB;
let arrows;
let rate = 50;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    stroke(255);
    frameRate(rate);

    /*const { remote } = require("electron");
    let parent = remote.getCurrentWindow();
    let child = new remote.BrowserWindow({height : 200, width: 300, parent: parent, 
                                        modal: true, autoHideMenuBar: true, resizable: false,
                                        minimizable: false, icon: './bulb.ico', show: false});
    child.loadFile('descriptions/flyingBody.html');
    child.once('ready-to-show', () => {
        child.show()
    });*/

    gravity = createVector(0, 9.8*scl/(rate*rate));
    ground = height - 50;

    createTitle(P, 'Тіло, кинуте під кутом');
    /*description = createDiv("За допомогою повзунка оберіть початкову висоту. Затиснувши ліву клавішу миші на робочому просторі ви можете обрати напрям та модуль швидкості, а відпустивши кинути м'ячик.");
    description.position(0, 550);
    description.style('width', '200px');*/

    //description = createDescription(P, "за допомогою повзунка оберіть початкову висоту. Затиснувши ліву клавішу миші на робочому просторі ви можете обрати напрям та модуль швидкості, а відпустивши кинути м'ячик.");

    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    infoB = createInfoB(P, 'flyingBody');
    
    heightS = createLabeledSlider(P, [0, ground-10, 0, 1], 'Початкова висота: ', ' м', 50, scl);

    ball1 = new Ball('yellow');
    ball2 = new Ball('orange');
    vel1 = createVector();
    vel2 = createVector();

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textSize(12);

    arrows = createVector();
    new p5((P2) => drawArrows(P2, arrows), 'main');
}

P.draw = function() {
    background('#1b4b34');
    showGround();
   // console.log(nfc(frameRate(), 1));
    
   if (kicked1) {
       if (running) {
            if (ball1.update()) {
                ball1.height = 0;
                if (first) {
                    heightS.value('0');
                    heightS.update();
                }
                kicked1 = false;
                vel1.set(0, 0);
            }
            if (first) {
                arrows.set(ball1.vel.x, ball1.vel.y);
            }
        }
    } else {
        if (first) {
            ball1.height = heightS.value();
            ball1.pos.y = ground-ball1.radius-ball1.height;
            arrows.set(vel1.x*scl/rate, vel1.y*scl/rate);
        }
    }

    if (kicked2) {
        if (running) {
            if (ball2.update()) {
                ball2.height = 0;
                if (!first) {
                    heightS.value('0');
                    heightS.update();
                }
                kicked2 = false;
                vel2.set(0, 0);
            }
            if (!first) {
                arrows.set(ball2.vel.x, ball2.vel.y);
            }
        }
    } else {
        if (!first) {
            ball2.height = heightS.value();
            ball2.pos.y = ground-ball2.radius-ball2.height;
            arrows.set(vel2.x*scl/rate, vel2.y*scl/rate);
        }
    }

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
        } else {
            ball2.simulate(mouseX, mouseY);
        }
    }

    createShadow(P);
}

function reset() {
    loop();
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;
    kicked1 = false;
    kicked2 = false;
    heightS.value('0');
    heightS.update();
    ball1 = new Ball('yellow');
    ball2 = new Ball('orange');
    vel1.setMag(0);
    vel2.setMag(0);
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

P.keyPressed = function() {
    if (key == " ") {
        first = !first;
        if (first) {
            heightS.value(ball1.height);
            heightS.update();
        } else {
            heightS.value(ball2.height);
            heightS.update();
        }
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

