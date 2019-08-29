module.exports = new p5((P) => { with (P) {

let infoB;

P.setup = function() {
    createCanvas(windowWidth, windowHeight);
    stroke(255);

    infoB = createInfoB(P, 'start');

    loadFont('./fonts/Roundedmplus1c.ttf', font => textFont(font));
}

P.draw = function() {
    background('#1b4b34');
    text("start", width/2, height/2);
}
    
}}, 'main');
        
        
    