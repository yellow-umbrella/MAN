// Маятник
module.exports = new p5((P) => { with (P) {

let gas;
let running, scl = 200, minHeight = 20, description;
let temprS;
let resetB, runB, infoB;
let constR;
let graphs = [];
let mins, maxs;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    stroke(255, 255, 255);
    
    createTitle(P, 'Ізопроцеси');
    
    resetB = createResetB(P, reset);
    runB = createRunB(P, run);
    infoB = createInfoB(P, 'pvt');

    constR = createRadio();
    constR.option(' Ізотермічний', 'T');
    constR.elt.innerHTML += '<br/>';
    constR.option(' Ізобарний', 'P');
    constR.elt.innerHTML += '<br/>';
    constR.option(' Ізохорний', 'V');
    constR.elt.innerHTML += '<br/>';
    constR.position(5, 50);
    constR.value('T');

    gas = new Gas();

    temprS = createLabeledSlider(P, [gas.T*minHeight/gas.height, gas.T*gas.pos.y/gas.height, 300, 1], 'Температура: ', ' К', 120);
    
    running = true;
    temprS.input(() => {gas.update(constR.value()); temprS.update()});
    constR.input(() => {gas = new Gas(); temprS.value(gas.T); temprS.update()});

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    textAlign(CENTER, CENTER);

    strokeCap(SQUARE);
    mins = {
        T: gas.T*minHeight/gas.height,
        V: minHeight*gas.width/scl,
    };
    maxs = {
        T: gas.T*gas.pos.y/gas.height, 
        V: gas.pos.y*gas.width/scl,
    };
    mins.P = 15*min(mins.T/gas.V, gas.T/maxs.V);
    maxs.P = 15*max(gas.T/mins.V, maxs.T/gas.V);
    console.log(mins, maxs);

}

P.draw = function() {
    background('#1b4b34');

    if (mouseIsPressed) {
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && constR.value() != 'V' && constR.value()) {
            for (let particle of gas.particles) {
                particle.stretch(gas.height, gas.pos.y - min(mouseY, gas.pos.y - minHeight));
            }
            gas.height = gas.pos.y - min(mouseY, gas.pos.y - minHeight);
            gas.update(constR.value());
        }
    }

    for (let graph of graphs) {
        graph.show(gas);
    }

    gas.show();

    createShadow(P);
}

function reset() {
    runB.html('&#xf04c;');
    runB.elt.title = 'зупинити';
    running = true;
    gas = new Gas();
    temprS.value(gas.T)
    temprS.output.elt.value = temprS.value();
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

class Gas {
    constructor() {
        this.width = 200;
        this.height = 200;
        this.pos = createVector((width/2 - this.width)/2, 0.9*height);
        this.V = this.width*this.height/scl;
        this.T = 300;
        this.P = 15*this.T/this.V;
        this.particles = new Array(30);
        for (let i = 0; i < this.particles.length; i++) {
            this.particles[i] = new Particle(this.pos.x, this.pos.x + this.width, this.pos.y - this.height, this.pos.y);
        }
        graphs = [];
        let types = [];
        if (constR.value() == 'T') {
            types = ['hyp', 'vert', 'vert'];
        } else if (constR.value() == 'P') {
            types = ['hor', 'hor', 'diag'];
        } else {
            types = ['vert', 'diag', 'hor'];
        }
        graphs.push(new Graph(createVector(width/2, height/3-3), 'P', 'Па', 'V', 'м^3', types[0]));
        graphs.push(new Graph(createVector(width/2, 2*height/3-6), 'P', 'Па', 'T', 'K', types[1]));
        graphs.push(new Graph(createVector(width/2, height-10), 'V', 'м^3', 'T', 'K', types[2]));
    }

    show() {
        strokeWeight(1);
        line(this.pos.x, this.pos.y, this.pos.x, 0);
        line(this.pos.x + this.width, this.pos.y, this.pos.x + this.width, 0);
        line(this.pos.x, this.pos.y, this.pos.x + this.width, this.pos.y);
        strokeWeight(4);
        line(this.pos.x, this.pos.y - this.height, this.pos.x + this.width, this.pos.y - this.height);
        for (let particle of this.particles) {
            if (running) {
                particle.update(this.pos.y - this.height, sqrt(this.T));
            }
            particle.show();
        }
    }

    update(val) {
        if (val) {
            if (val == 'T') {
                this.P = this.P*this.V/(this.height*this.width/scl);
                this.V = this.height*this.width/scl;
                temprS.value(this.T);
            }
            if (val == 'V') {
                this.P = this.P*temprS.value()/this.T;
                this.T = temprS.value();
            }
            if (val == 'P') {
                if (this.T != temprS.value()) {
                    this.V = this.V*temprS.value()/this.T;
                    for (let particle of this.particles) {
                        particle.stretch(this.height, this.V*scl/this.width);
                    }
                    this.height = this.V*scl/this.width;
                    this.T = temprS.value();
                } else {
                    this.T = this.T*(this.height*this.width/scl)/this.V;
                    this.V = this.height*this.width/scl;
                    temprS.value(this.T);
                    temprS.output.elt.value = temprS.value();
                }
            }
        }
    }
}

class Particle {
    constructor(minX, maxX, minY, maxY) {
        this.pos = createVector(random(minX, maxX), random(minY, maxY));
        this.vel = createVector(random(-0.2, 0.2), random(-0.2, 0.2));
        this.minX = minX;
        this.maxX = maxX;
        this.minY = minY;
        this.maxY = maxY;
    }

    show() {
        strokeWeight(2);
        point(this.pos.x, this.pos.y);
    }

    update(minY, coeff) {
        this.pos.add(p5.Vector.mult(this.vel, coeff));
        this.minY = minY;
        if (this.pos.x <= this.minX) {
            //this.pos.y -= this.vel.y*(minX-this.pos.x)/this.vel.x;
            this.pos.x = this.minX;
            this.vel.x *= -1;
        }

        if (this.pos.x >= this.maxX) {
            //this.pos.y -= this.vel.y*(this.pos.x - maxX)/this.vel.x;
            this.pos.x = this.maxX;
            this.vel.x *= -1;
        }

        if (this.pos.y <= this.minY) {
            //this.pos.x -= this.vel.x*(minY-this.pos.y)/this.vel.y;
            this.pos.y = this.minY;
            this.vel.y *= -1;
        }

        if (this.pos.y >= this.maxY) {
            //this.pos.x -= this.vel.x*(this.pos.y - maxY)/this.vel.y;
            this.pos.y = this.maxY;
            this.vel.y *= -1;
        }
    }

    stretch(prevH, curH) {
        let ratio = (this.maxY - this.pos.y)/prevH;
        this.pos.y = this.maxY - ratio*curH;
    }
    
}

class Graph {
    constructor(pos, y, y1, x, x1, type) {
        this.x = x; // x label
        this.y = y; // y label
        this.x1 = x1;
        this.y1 = y1;
        this.pos = pos; // position of (0,0)
        this.height = height / 3.3;
        this.width = width / 3;
        this.type = type; // vert, hor, diag, hyp
    }

    show(gas) {
        push();
        translate(this.pos.x, this.pos.y);
        textSize(10);
        fill(255);
        stroke(255);
        strokeWeight(0.5);
        textAlign(LEFT, CENTER);
        text(this.x + ',' + this.x1, this.width + 15, 0);
        textAlign(RIGHT, BOTTOM);
        text(this.y + ',' + this.y1, -10, -this.height);
        noFill();
        strokeWeight(1.5);
        arrow(P, 0, 0, this.width + 10, 0);
        arrow(P, 0, 0, 0, -this.height-5);
        let x = map(gas[this.x], 0, maxs[this.x], 0, this.width);
        let y = map(gas[this.y], 0, maxs[this.y], 0, this.height);
        let minX = 0, minY = 0;
        if (this.type == 'vert') {
            minX = this.width/2;
            if (this.x == 'V' && this.y == 'P') {
                y = map(gas[this.y], 0, 15*maxs.T/gas.V, 0, this.height);
                minY = -map(15*mins.T/gas.V, 0, 15*maxs.T/gas.V, 0, this.height);
            } else if (this.y == 'P') {
                minY = -map(15*gas.T/maxs.V, 0, 15*gas.T/mins.V, 0, this.height);
            } else {
                minY = -map(mins[this.y], 0, maxs[this.y], 0, this.height);
            }
            line(minX, minY, this.width/2, -this.height);
            point(minX, minY/2);
            x = this.width/2; 
        } else if (this.type == 'hor') {
            minY = -this.height/2;
            minX = map(mins[this.x], 0, maxs[this.x], 0, this.width);
            line(minX, minY, this.width, -this.height/2);
            point(minX/2, minY);
            y = this.height/2;
        } else if (this.type == 'diag') {
            let minX = map(mins[this.x], 0, maxs[this.x], 0, this.width);
            let minY = -map(minX, 0, this.width, 0, this.height);
            line (minX, minY, this.width, -this.height);
            point(minX/2, minY/2);
            y = map(x, 0, this.width, 0, this.height);
        } else if (this.type == 'hyp') {
            let coeff = 15*this.height*gas.T*this.width/(maxs.P*maxs.V);
            beginShape();
            let firstX = 0;
            for (let x = coeff/this.height; x < this.width; x++) {
                let y = coeff/x;
                if (y <= this.height) {
                    vertex(x, -y);
                    if (firstX == 0)
                        firstX = x;
                }
            }
            endShape();
            y = coeff/x;
            /*if (y > this.height) {
                y = coeff/firstX;
                x = firstX; 
            }*/
        }
        strokeWeight(5)
        point(x, -y);
        noStroke();
        fill('yellow');
        textSize(10);
        textAlign(RIGHT, TOP);
        text(nf(gas[this.y], 1, 1), -5, -y-2);
        textAlign(CENTER, TOP);
        text(nf(gas[this.x], 1, 1), x, 0);
        pop();
    }
}

}}, 'main');
        
        
    
