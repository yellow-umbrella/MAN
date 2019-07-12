let marginTop = 50, marginLeft = 200;
let sketch;

function toggleMenu(width, id) {
    document.getElementById(id).style.width = width;
    if (id == "sidebar-right") {
        document.getElementById("button-bottom").style.right = (5 + parseInt(width)).toString() + 'px';
    }
}

function switchTo(name) {
    let main = document.getElementById("main");
    while (main.firstChild) 
        main.removeChild(main.firstChild);
    delete require.cache[require.resolve('./sketches/'+name)]
    sketch = require("./sketches/"+name);
    main.style.height = sketch.height+marginTop + 'px'
    document.getElementById("help").src = "./frames/"+name+".html";
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
    toggleS.position(5, 70);
    toggleS.size(30);
    toggleS.class('toggle');
    return toggleS;
}

