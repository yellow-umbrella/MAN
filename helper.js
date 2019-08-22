let marginTop = 50, marginLeft = 200;
let sketch;

function toggleMenu(width, id) {
    document.getElementById(id).style.width = width;
}

function switchTo(name) {
    let main = document.getElementById("main");
    while (main.firstChild) 
        main.removeChild(main.firstChild);
    delete require.cache[require.resolve('./sketches/'+name)]
    sketch = require("./sketches/"+name);
    main.style.height = sketch.height+marginTop + 'px'
    document.getElementById("help").src = "./formulae/"+name+".html";
}

function createLabeledSlider(P, sld, name, units, y, scl = 1, sy = 20) {
    let slider = P.createSlider(...sld);
    let b = P.createElement('b', '');
    let output = P.createElement('output', P.nf(sld[2]/scl, 1, 2));
    let label = P.createElement('label', name);
    let unit = P.createElement('span', units);
    b.child(output);
    b.child(unit);
    label.child(b);
    label.child(slider);
    label.position(5, y);
    slider.position(0, sy);
    slider.output = output;
    slider.update = () => {slider.output.elt.value = P.nf(slider.elt.value/scl, 1, 2)};
    slider.input(() => slider.update());
    return slider;
}

function createTitle(P, name) {
    let title = P.createDiv(name);
    title.id('title');
    title.elt.style.width = P.width + 'px';
}

function createDescription(P, text) {
    let description = P.createDiv("<b>Пояснення до досліду:</b> <br/>" + "<i>" + text + "</i>");
    description.id('descriptionS');
    description.elt.style.width = '200px';
    description.position(0, 505);
}

function createRunB(P, callback) {
    let runB = P.createButton('&#xf04c;');
    runB.position(105, 0);
    runB.mousePressed(callback);
    runB.elt.title = 'зупинити';
    return runB;
}

function createResetB(P, callback) {
    let resetB = P.createButton('&#xf2f9;');
    resetB.position(155, 0);
    resetB.mousePressed(callback);
    resetB.elt.title = 'оновити';
    return resetB;
}

function createToggleS(P, y = 100) {
    let toggleS = P.createSlider(0, 1, 1, 1);
    toggleS.position(0, 20);
    toggleS.size(30);
    toggleS.class('toggle');
    toggleS.attribute('value', '1');
    toggleS.input(() => toggleS.attribute('value', toggleS.value()));
    let labelToggle = P.createElement('label', 'Сховати/показати підписи:');
    labelToggle.child(toggleS);
    labelToggle.position(5, y);
    return toggleS;
}

function createShadow(P, x = 0, y = 0) {
    P.push();
    P.translate(x, y);
    P.colorMode(P.RGB);
    P.stroke(0, 0, 0, 50);
    P.strokeWeight(10);
    P.strokeCap(P.PROJECT);
    P.line(10, 0, P.width, 0);
    P.line(0, 0, 0, P.height);
    P.pop();
}

function drawArrows(P, vel) { with (P) {

    function arrow(x1, y1, x2, y2) {
        let segment = createVector(x2-x1, y2-y1);
        line(x1, y1, x2, y2);
        segment.setMag(8);
        segment.rotate(PI/6);
        line(x2, y2, x2-segment.x, y2-segment.y);
        segment.rotate(-PI/3);
        line(x2, y2, x2-segment.x, y2-segment.y);
    }

    P.setup = function() {
        let canvas = createCanvas(200, 440);
        canvas.position(0, 110);
        canvas.class('arrows');
        stroke(255);
        noFill();
    }

    P.draw = function() {
        background('#26734d');
        if (vel.mag() < 1e-6) return;

        push();
        translate(100, 120);
        let sign = createVector(Math.sign(vel.x), Math.sign(vel.y));
        let mag = createVector(abs(vel.x), abs(vel.y));
        let x, y;
        if (mag.x > mag.y) {
            x = 100*sign.x;
            y = sign.y*map(mag.y, 0, mag.x, 0, 100);
        } else {
            x = sign.x*map(mag.x, 0, mag.y, 0, 100);
            y = 100*sign.y;
        }
        line(0, 0, x, 0);
        line(0, 0, 0, y);
        arrow(0, 0, x, y);
        noStroke();
        fill(255);
        let horAlign = (x < 0 ? LEFT : RIGHT);
        let verAlign = (y < 0 ? TOP : BOTTOM);
        textAlign(horAlign, verAlign);
        text(nf(vel.x, 1, 1) + ' м/с', x, -4*sign.y);
        text(nf(-vel.y, 1, 1) + ' м/с', -4*sign.x, y);
        textAlign(horAlign, (y >= 0 ? TOP : BOTTOM));
        text(nf(vel.mag(), 1, 1) + ' м/с', x, y+4*sign.y);
        pop();

        push();
        translate(100, 340);
        let start = HALF_PI*(1-sign.x);
        let direction = createVector(x, y);
        direction.setMag(100);
        if (sign.x == 0)
            sign.x = 1;
        line(0, 0, sign.x*100, 0);
        line(0, 0, direction.x, direction.y);
        let angle = 0;
        if (vel.y != 0) {
            let start = HALF_PI*(1-sign.x);
            let finish = (direction.heading() + TWO_PI) % TWO_PI;
            if (start > finish)
                [start, finish] = [finish, start];
            angle = degrees(abs(start - finish)) % 90;
            if (vel.y < 0 && vel.x >= 0) {
                angle = 90 - angle;
                [start, finish] = [finish, start];
            }
            arc(0, 0, 60, 60, start, finish);
        }
        noStroke();
        fill(255);
        textAlign(horAlign, verAlign);
        text(nf(angle, 1, 1)+' °', -4*sign.x, -4*sign.y);
        pop();
    }

}}
