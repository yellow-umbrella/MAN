//  плоскі дзеркала
module.exports = new p5((P) => { with (P) {

    let mirrors = [], rays = [], description;
    let running = true, confirmed = false, EPS = 1E-8;
    let resetB, runB;
    
    P.setup = function() {
        createCanvas(windowWidth-marginLeft, windowHeight-marginTop);
        stroke(255);

        createTitle(P, 'Плоскі дзеркала');
        /*description = createDiv("Затискаючи ліву клавішу миші створіть двосторонні дзеркала, підтвердіть створене за допомогою кнопки та пускайте промені так само як створювали дзеркала.");
        description.position(0, 550);
        description.style('width', '200px');*/

        description = createDescription(P, "затискаючи ліву клавішу миші створіть двосторонні дзеркала, підтвердіть створене за допомогою кнопки та пускайте промені так само як створювали дзеркала.")
    
        resetB = createResetB(P, reset);
        runB = createRunB(P, run);
    
        loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    }
    
    P.draw = function() {
        background('#1b4b34');

        if (mouseIsPressed && mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
            if (!confirmed) {
                mirrors[mirrors.length - 1].pos2.set(mouseX, mouseY);
            } else {
                if (!rays[rays.length - 1].finished) {
                    rays[rays.length - 1].change(mouseX, mouseY);
                }
            }
        }

        for (let ray of rays) {
            ray.show();
        }
        
        for (let mirror of mirrors) {
            mirror.show();
        }

        createShadow(P);
    }
    
    function reset() {
        //loop();
        runB.html('&#xf04c;');
        runB.elt.title = 'зупинити';
        running = true;
        confirmed = false;
        mirrors = [];
        rays = [];
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

    P.mousePressed = function() {
        if (mouseY > 0 && mouseX > 0 && mouseX < width && mouseY < height) {
            if (!confirmed) {
                mirrors.push(new Mirror(mouseX, mouseY, mirrors.length));
            } else {
                rays.push(new Ray(mouseX, mouseY))
            }
        }
    }

    P.keyPressed = function() {
        confirmed = true;
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

    class Ray {
        constructor(x, y) {
            this.dots = [];
            this.dots.push(createVector(x, y));
            this.finished = false;
        }

        show() {
            let alfa = 100;
            strokeWeight(4);
            let prevDot = this.dots[0].copy();
            for (let dot of this.dots) {
                stroke(255, 255, 0, alfa);
                line(prevDot.x, prevDot.y, dot.x, dot.y);
                prevDot = dot.copy();
                alfa -= 10;
            }
        }

        change(x, y) {
            let start = this.dots[0].copy();
            this.dots = [];
            this.dots.push(start.copy());
            let tdot = createVector(x, y);
            while (this.dots.length < 10) {
                let A = tdot.y - start.y, B = start.x - tdot.x, C = tdot.x*start.y - start.x*tdot.y;
                let check = false, ind = -1, dist = max(height, width), dot = createVector();
                for (let mirror of mirrors) {
                    let A1 = mirror.pos1.y - mirror.pos2.y;
                    let B1 = mirror.pos2.x - mirror.pos1.x;
                    let C1 = mirror.pos1.x*mirror.pos2.y - mirror.pos2.x*mirror.pos1.y;
                    if (abs(A*B1 - A1*B) < EPS) {
                        continue;
                    }
                    let tx = (B*C1 - B1*C)/(A*B1 - A1*B), ty = (A1*C - A*C1)/(A*B1 - A1*B);
                    let t = createVector(tx, ty);
                    let t1 = p5.Vector.sub(t, start).x/p5.Vector.sub(tdot, start).x;
                    let t2 = p5.Vector.sub(t, mirror.pos1).x/p5.Vector.sub(mirror.pos2, mirror.pos1).x;
                    if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
                        check = true;
                        if (dist > p5.Vector.sub(start, t).mag()) {
                            ind = mirror.ind, dist = p5.Vector.sub(start, t).mag(), dot = t.copy();
                        }
                    }
                }
                
                if (check) {
                    this.dots.push(dot);
                    let angleBeg = (p5.Vector.sub(start,dot).dot(mirrors[ind].pos1, dot) > 0 ? mirrors[ind].pos1 : mirrors[ind].pos2);
                    let vec = p5.Vector.sub(start, dot), vec1 = p5.Vector.sub(angleBeg, dot); 
                    let angle = vec.angleBetween(vec1);
                    angle = -2*angle + PI;
                    if (vec.x*vec1.y - vec.y*vec1.x > 0) {
                        angle *= -1;
                    }
                    vec.rotate(angle);
                    tdot = p5.Vector.add(dot, vec);
                    start = dot.copy();
                } else {
                    let vec = p5.Vector.sub(tdot, start);
                    vec.setMag(2*sqrt(width*width + height*height));
                    this.dots.push(p5.Vector.add(start, vec));
                    break;
                }
            }
        }
    }
    }}, 'main');
    
    