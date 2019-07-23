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

function createTitle(P, name) {
    let title = P.createDiv(name);
    title.id('title');
    title.elt.style.width = P.width + 'px';
}

function createRunB(P, callback) {
    let runB = P.createButton('&#xf04c;');
    runB.position(55, 0);
    runB.mousePressed(callback);
    runB.elt.title = 'зупинити';
    return runB;
}

function createResetB(P, callback) {
    let resetB = P.createButton('&#xf2f9;');
    resetB.position(105, 0);
    resetB.mousePressed(callback);
    resetB.elt.title = 'оновити';
    return resetB;
}

function createToggleS(P) {
    let toggleS = P.createSlider(0, 1, 1, 1);
    toggleS.position(0, 20);
    toggleS.size(30);
    toggleS.class('toggle');
    toggleS.attribute('value', '1');
    toggleS.input(() => toggleS.attribute('value', toggleS.value()));
    let labelToggle = P.createElement('label', 'Сховати/показати підписи:');
    labelToggle.child(toggleS);
    labelToggle.position(5, 100);
    return toggleS;
}

function drawArrows(P, vel) { with (P) {

    function arrow(x1, y1, x2, y2) {
        push();
        let segment = createVector(x2-x1, y2-y1);
        line(x1, y1, x2, y2);
        segment.setMag(8);
        segment.rotate(PI/6);
        line(x2, y2, x2-segment.x, y2-segment.y);
        segment.rotate(-PI/3);
        line(x2, y2, x2-segment.x, y2-segment.y);
    }

    P.setup = function() {
        let canvas = createCanvas(200, 200);
        canvas.position(0, 150);
        canvas.class('arrows');
        stroke(255);
    }

    P.draw = function() {
        background('#26734d');
        translate(100, 100);
        if (vel.mag() < 1e-6) return;
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
    }

}}
