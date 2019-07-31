// Маятник
module.exports = new p5((P) => { with (P) {

    let gas;
    let running, scl = 150, minHeight = 20;
    let temprS;
    let resetB, runB;
    let constR;
    
    P.setup = function() {
        createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
        stroke(255, 255, 255);
        
        createTitle(P, 'Ізопроцеси');
        resetB = createResetB(P, reset);
        runB = createRunB(P, run);

        constR = createRadio();
        constR.option('Ізотермічний', 'T');
        constR.option('Ізобарний', 'P');
        constR.option('Ізохорний', 'V');
        constR.position(5, 50);
        constR.style('width', '60px');
    
        gas = new Gas();

        temprS = createSlider(gas.T*minHeight/gas.height, gas.T*gas.pos.y/gas.height, 300, 1);
        temprS.position(0, 20);
        
        let labelTempr = createElement('label', 'Температура:');
        labelTempr.elt.appendChild(temprS.elt);
        labelTempr.position(5, 200);
        
        running = true;
        temprS.input(() => {if (constR.value()) gas.update(constR.value());});
    
        loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
        textAlign(CENTER, CENTER);
    }
    
    P.draw = function() {
        background('#1b4b34');

        if (mouseIsPressed) {
            if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && constR.value() != 'V' && constR.value()) {
                gas.height = gas.pos.y - min(mouseY, gas.pos.y - minHeight);
                gas.update(constR.value());
            }
        }

        gas.show();
    }
    
    function reset() {
        runB.html('&#xf04c;');
        runB.elt.title = 'зупинити';
        running = true;
    
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
            this.pos = createVector((width - this.width)/2, 0.9*height);
            this.V = this.width*this.height;
            this.T = 300;
            this.P = 15*this.T/this.V;
            this.particles = new Array(30);
            for (let i = 0; i < this.particles.length; i++) {
                this.particles[i] = new Particle(this.pos.x, this.pos.x + this.width, this.pos.y - this.height, this.pos.y);
            }
        }

        show() {
            strokeWeight(1);
            line(this.pos.x, this.pos.y, this.pos.x, 0);
            line(this.pos.x + this.width, this.pos.y, this.pos.x + this.width, 0);
            line(this.pos.x, this.pos.y, this.pos.x + this.width, this.pos.y);
            strokeWeight(4);
            line(this.pos.x, this.pos.y - this.height, this.pos.x + this.width, this.pos.y - this.height);
            for (let particle of this.particles) {
                particle.update(this.pos.y - this.height, sqrt(this.T));
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
                        this.height = this.V/this.width;
                        this.T = temprS.value();
                    } else {
                        this.T = this.T*(this.height*this.width)/this.V;
                        this.V = this.height*this.width;
                        temprS.value(this.T);
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
        
    }
    
    
    }}, 'main');
        
        
    