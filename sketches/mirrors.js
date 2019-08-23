//  плоскі дзеркала
module.exports = new p5((P) => { with (P) {

let mirrors = [], rays = [], description;
let running = true, confirmed = false, EPS = 1E-8;
let resetB, runB;
let V;

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
    V = p5.Vector;
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

function cross(A, B) {
    return A.x*B.y - A.y*B.x;
}

function intersection(A1, B1, A2, B2) {
    let C1 = V.sub(B1, A1);
    let C2 = V.sub(B2, A2);
    let a1 = C1.y, a2 = C2.y;
    let b1 = -C1.x, b2 = -C2.x;
    let c1 = cross(C1, A1), c2 = cross(C2, A2);
    let denom = a1*b2 - a2*b1;
    if (abs(denom) < EPS)
        return null;
    let num_y = c1*a2 - c2*a1;
    let num_x = c2*b1 - c1*b2;
    return createVector(num_x/denom, num_y/denom);
}

function parameter(a, b, p) {
    let num = V.sub(p, a), denom = V.sub(b, a);
    return (abs(denom.x) < EPS ? num.y/denom.y : num.x/denom.x);
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
            alfa *= 0.9;
        }
    }

    change(x, y) {
        let start = this.dots[0].copy();
        this.dots = [start.copy()];
        let tdot = createVector(x, y);
        while (this.dots.length < 16) {

            let check = false, ind = -1, dist = max(height, width), dot = createVector();

            for (let mirror of mirrors) {
                console.log("for");
                let t = intersection(start, tdot, mirror.pos1, mirror.pos2);
                if (t == null) continue;
                let t1 = parameter(start, tdot, t);
                let t2 = parameter(mirror.pos1, mirror.pos2, t);
                if (t1 >= 0 && t2 >= 0 && t2 <= 1) {
                    let mag = V.sub(start, t).mag();
                    if (dist > mag && mag > EPS) {
                        check = true;
                        ind = mirror.ind;
                        dist = mag;
                        dot = t.copy();
                    }
                }
            }
            
            if (check) {
                this.dots.push(dot);
                let angleBeg = (V.sub(start,dot).dot(V.sub(mirrors[ind].pos1, dot)) > 0 ? 
                                mirrors[ind].pos1 : mirrors[ind].pos2);
                let vec = V.sub(start, dot), vec1 = V.sub(angleBeg, dot);
                console.log(start, dot, vec);
                let angle = vec.angleBetween(vec1);
                angle = PI - 2*angle;
                if (vec.x*vec1.y - vec.y*vec1.x > 0) {
                    angle *= -1;
                }
                start = dot.copy();
                vec.rotate(angle);
                tdot = V.add(dot, vec);
            } else {
                let vec = V.sub(tdot, start);
                vec.setMag(2*sqrt(width*width + height*height));
                this.dots.push(V.add(start, vec));
                break;
            }
        }
    }
}
}}, 'main');
    
    
