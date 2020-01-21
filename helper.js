let marginTop = 50, marginLeft = 200;
let sketch;

function toggleMenu(width, id) {
    document.getElementById(id).style.width = width;
}

function switchTo(name) {
    console.log(name);
    let main = document.getElementById("main");
    while (main.firstChild) 
        main.removeChild(main.firstChild);
    delete require.cache[require.resolve('./sketches/'+name)];
    sketch = require("./sketches/"+name);
    main.style.height = sketch.height+marginTop + 'px';
    document.getElementById("help").src = "./formulae/"+name+".html";
    if (name != "start") {
        document.querySelector("button.right").style.visibility = "visible";
    } else {
        document.querySelector("button.right").style.visibility = "hidden";
    }
    setTimeout(()=>toggleMenu('0', 'sidebar-left'), 200);
}

function dashedLine(P, x1, y1, x2, y2, dash=5.0) {
    let count = Math.hypot(x1-x2, y1-y2)/dash;
    for (let i = 0; i < count; i++) {
        if (i % 2 == 0) {
            P.line(P.map(i, 0, count, x1, x2),
                   P.map(i, 0, count, y1, y2),
                   P.map(P.min(i+1, count), 0, count, x1, x2), 
                   P.map(P.min(i+1, count), 0, count, y1, y2));

        }
    }
}

function createLabeledSlider(P, sld, name, units, y, scl = 1, sy = 20, clr='') {
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
    if (clr != '') {
        label.style('color', clr);
    }
    slider.position(0, sy);
    slider.output = output;
    slider.unit = unit;
    slider.update = () => {slider.output.elt.value = P.nf(slider.elt.value/scl, 1, 2)};
    slider.input(() => slider.update());
    return slider;
}

function createTitle(P, name) {
    let title = P.createDiv(name);
    title.id('title');
    title.elt.style.width = P.width + 'px';
}

function createDescription(name) {
    /*let description = P.createDiv("<b>Пояснення до досліду:</b> <br/>" + "<i>" + text + "</i>");
    description.id('descriptionS');
    description.elt.style.width = '200px';
    description.position(0, 505);*/
    const { remote } = require("electron");
    let parent = remote.getCurrentWindow();
    let child = new remote.BrowserWindow({height : 350, width: 500, parent: parent, 
                                        modal: true, autoHideMenuBar: true, resizable: false,
                                        minimizable: false, icon: './bulb.ico', show: false});
    child.loadFile('descriptions/' + name + '.html');
    child.once('ready-to-show', () => {
        child.show()
    });
}

function createInfoB(P, name) {
    let infoB = P.createButton('&#xf129;');
    infoB.position(P.windowWidth - 45, 0);
    infoB.mousePressed(() => {createDescription(name)});
    infoB.elt.title = 'пояснення';
    return infoB;
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

function createToggle(P, y = 100, lbl = 'Показати підписи:', dflt = true) {
    let label = P.createElement('label', '<span class=cblabel>'+lbl+'</span>');
    let toggle = P.createElement('input');
    toggle.elt.type = 'checkbox';
    let span = P.createElement('span', '');
    label.child(toggle);
    label.child(span);
    label.position(5, y+24);
    label.class('switch');
    span.class('slider');
    label.checked = 
        (x) => (x === undefined ? 
                toggle.elt.checked :
                toggle.elt.checked = x);
    label.checked(dflt);
    span.id(Math.random().toString(36).replace(/[^a-z]+/g, 'x'));
    label.color = (off = null, on = null) => {
        if (off) {
            span.style('background-color', off);
        } 
        if (on) {
            let style = `
            input:checked + #${span.id()} {
                background-color: ${on} !important;
            }
            input:checked + #${span.id()}:before {
                box-shadow: 0 0 1px ${on} !important;
            }
            `
            let css = P.createElement('style', style);
            document.getElementsByTagName('head')[0].appendChild(css.elt);
        }
    }
    return label;
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


function arrow(P, x1, y1, x2, y2) {
    let segment = P.createVector(x2-x1, y2-y1);
    P.line(x1, y1, x2, y2);
    segment.setMag(8);
    segment.rotate(P.PI/6);
    P.line(x2, y2, x2-segment.x, y2-segment.y);
    segment.rotate(-P.PI/3);
    P.line(x2, y2, x2-segment.x, y2-segment.y);
}

function drawArrows(P, vel) { with (P) {

    P.setup = function() {
        let canvas = createCanvas(200, 440);
        canvas.position(0, 150);
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
        arrow(P, 0, 0, x, y);
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
