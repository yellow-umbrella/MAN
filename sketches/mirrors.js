//  плоскі дзеркала
module.exports = new p5((P) => { with (P) {

    let mirrors = [], description;
    let running = true, confirmed = false;
    let resetB, runB;
    
    P.setup = function() {
        createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
        stroke(255);

        createTitle(P, 'Плоскі дзеркала');
        description = createDiv("description");
        description.position(0, 550);
        description.style('width', '200px');
    
        resetB = createResetB(P, reset);
        runB = createRunB(P, run);
    
        loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    }
    
    P.draw = function() {
        background('#1b4b34');

        if (mouseIsPressed && mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
            if (!confirmed) {
                mirrors[mirrors.length - 1].pos2.set(mouseX, mouseY);
            }
        }
        
        for (let mirror of mirrors) {
            mirror.show();
        }
    }
    
    function reset() {
        loop();
        runB.html('&#xf04c;');
        runB.elt.title = 'зупинити';
        running = true;
        confirm = false;
        mirrors = [];
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

    P.mousePressed = function() {
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
            if (!confirmed) {
                mirrors.push(new Mirror(mouseX, mouseY, mirrors.length));
            }
        }
    }
    
    class Mirror {
        constructor(x, y, i) {
            this.pos1 = createVector(x, y)
            this.pos2 = this.pos1.copy()
            this.ind = i;
        }

        show() {
            stroke(255);
            strokeWeight(3);
            line(this.pos1.x, this.pos1.y, this.pos2.x, this.pos2.y);
        }
    }
    }}, 'main');
    
    