let blue = function(p) {
    p.setup = function() {
        p.createCanvas(500, 500);
    }
    p.draw = function() {
        p.background('blue'); 
    }
}

new p5(blue, 'main');
