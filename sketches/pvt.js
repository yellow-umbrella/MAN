// Маятник
module.exports = new p5((P) => { with (P) {

let gas;
let running, scl = 150, minHeight = 20, description;
let temprS;
let resetB, runB;
let constR;
let graphs = [];
let mins, maxs;

P.setup = function() {
    createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
    stroke(255, 255, 255);
    
    createTitle(P, 'Ізопроцеси');
    /*description = createDiv("Ви можете обрати один з трьох ізопроцесів, змінювати температуру за допомогою повзунка та об'єм, рухаючи поршень на робочому просторі.");
    description.position(0, 550);
    description.style('width', '200px');*/
    description = createDescription(P, "ви можете обрати один з трьох ізопроцесів, змінювати температуру за допомогою повзунка та об'єм, рухаючи поршень на робочому просторі.");

    resetB = createResetB(P, reset);
    runB = createRunB(P, run);

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
        V: minHeight*gas.width,
    };
    maxs = {
        T: gas.T*gas.pos.y/gas.height, 
        V: gas.pos.y*gas.width,
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
        this.V = this.width*this.height;
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
        graphs.push(new Graph(createVector(width/2, height/3-3), 'P', 'V', types[0]));
        graphs.push(new Graph(createVector(width/2, 2*height/3-6), 'P', 'T', types[1]));
        graphs.push(new Graph(createVector(width/2, height-10), 'V', 'T', types[2]));
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
                this.P = this.P*this.V/(this.height*this.width);
                this.V = this.height*this.width;
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
                        particle.stretch(this.height, this.V/this.width);
                    }
                    this.height = this.V/this.width;
                    this.T = temprS.value();
                } else {
                    this.T = this.T*(this.height*this.width)/this.V;
                    this.V = this.height*this.width;
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

function arrow(x1, y1, x2, y2) {
    let segment = createVector(x2-x1, y2-y1);
    line(x1, y1, x2, y2);
    segment.setMag(8);
    segment.rotate(PI/6);
    line(x2, y2, x2-segment.x, y2-segment.y);
    segment.rotate(-PI/3);
    line(x2, y2, x2-segment.x, y2-segment.y);
}

class Graph {
    constructor(pos, y, x, type) {
        this.x = x; // x label
        this.y = y; // y label
        this.pos = pos; // position of (0,0)
        this.height = height / 3.3;
        this.width = width / 3;
        this.type = type; // vert, hor, diag, hyp
    }

    show(gas) {
        push();
        noFill();
        stroke(255);
        strokeWeight(1.5);
        translate(this.pos.x, this.pos.y);
        arrow(0, 0, this.width, 0);
        arrow(0, 0, 0, -this.height);
        text(this.x, this.width + 10, 0);
        text(this.y, -10, -this.height);
        let x = map(gas[this.x], mins[this.x], maxs[this.x], 0, this.width);
        let y = map(gas[this.y], mins[this.y], maxs[this.y], 0, this.height);
        if (this.type == 'vert') {
            line(this.width/2, 0, this.width/2, -this.height);
            x = this.width/2; 
        } else if (this.type == 'hor') {
            line(0, -this.height/2, this.width, -this.height/2);
            y = this.height/2;
        } else if (this.type == 'diag') {
            line (0, 0, this.width, -this.height);
            y = map(x, 0, this.width, 0, this.height);
        } else if (this.type == 'hyp') {
            let coeff = 5000.0;
            beginShape();
            let firstX = 0;
            for (let x = 1; x < this.width; x++) {
                let y = coeff/x;
                if (y < this.height) {
                    vertex(x, -y);
                    if (firstX == 0)
                        firstX = x;
                }
            }
            endShape();
            y = coeff/x;
            if (y > this.height) {
                y = this.height;
                x = firstX; 
            }
        }
        strokeWeight(6)
        point(x, -y);
        pop();
    }
}

}}, 'main');
        
        
    
