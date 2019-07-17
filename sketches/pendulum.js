// Маятник
module.exports = new p5((P) => { with (P) {

    let gravity;
    let pendulum;
    let running, scl = 150;
    let lenS, gravityS;
    let resetB, runB;
    
    P.setup = function() {
        createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
        frameRate('50');
        fill(255, 0, 0);
        stroke(255, 255, 255);
        
        createTitle(P, 'Маятник');
        resetB = createResetB(P, reset);
        runB = createRunB(P, run);
    
        gravityS = createSlider(1.6, 10, 9.8, 0.1);
        lenS = createSlider(round(height*0.1), round(height*0.7), round(0.4*height), 1);
        gravityS.position(0, 40);
        lenS.position(0, 20);
        
        let labelGravity = createElement('label', 'Прискорення вільного <br> падіння:');
        labelGravity.elt.appendChild(gravityS.elt);
        labelGravity.position(5, 50);
        
        let labelLen = createElement('label', 'Довжина нитки:');
        labelLen.elt.appendChild(lenS.elt);
        labelLen.position(5, 120);
        
        pendulum = new Pendulum();
        running = true;

        loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    }
    
    P.draw = function() {
        background('#1b4b34');
        
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height && running && mouseIsPressed) {
            pendulum.change(mouseX, mouseY);
        } else  {
            pendulum.update();
        }
        pendulum.show();
    }
    
    function reset() {
        loop();
        runB.html('&#xf04c;');
        runB.elt.title = 'зупинити';
        running = true;
    
        gravityS.value('9.8');
        lenS.value('round(0.4*height)');
        pendulum = new Pendulum();
    }
    
    function run() {
        if (running) {
            running = false;
            runB.html('&#xf04b;');
            runB.elt.title = 'продовжити';
            noLoop();
        } else {
            loop();
            runB.html('&#xf04c;');
            running = true;
            runB.elt.title = 'зупинити';
        }
    }
    
    
    class Pendulum {
        constructor() {
            this.radius = 10;
            this.pivot = createVector(width/2, height/4);
            this.pos = this.pivot.copy();
            this.len = lenS.value();
            this.pos.y += this.len;
            this.angle = 0;
            this.avel = 0;
            this.mass = 1;
            this.acc = createVector();
        }
    
        show() {
            line(this.pivot.x, this.pivot.y, this.pos.x, this.pos.y)
            ellipse(this.pos.x, this.pos.y, 2*this.radius);
        }
    
        update() {
            this.len = lenS.value();
            let acc = -1*(gravityS.value()*scl/2500)*sin(this.angle)/this.len;
            this.avel += acc;
            this.angle += this.avel;
            this.pos.set(this.len*sin(this.angle), this.len*cos(this.angle));
            this.pos.add(this.pivot);
        }

        change(x, y) {
            this.len = lenS.value();
            this.avel = 0;
            let vec = p5.Vector.sub(createVector(x, y), this.pivot);
            vec.setMag(this.len);
            this.pos = p5.Vector.add(vec, this.pivot);
            this.angle = vec.angleBetween(createVector(0, 1));
            if (x < width/2) {
                this.angle *= -1;
            }
        }
    }

    }}, 'main');
    
    