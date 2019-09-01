module.exports = new p5((P) => { with (P) {

let infoB, author, title;

P.setup = function() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(-200, -50);
    noStroke();
    fill('#0d261a');

    infoB = createInfoB(P, 'start');
    author = createDiv("&copy; Нємкевич Дар'я");
    author.id('author');
    title = createDiv('<center><h1>Фізичний Помічник</h1><h3>Експериментуй та розумій. Віртуальна фізична лабораторія.</h3><center/>');
    title.style('font-size', '1.4em');
    title.position(width/2, 0.1*height);
    title.center('horizontal');
    title.style('color','#0d261a');

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
    /*textAlign(CENTER, CENTER);
    textSize('1.4em');*/
}

P.draw = function() {
    background('#26734d');
}
    
}}, 'main');
        
        
    