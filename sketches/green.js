let green = function(p) {
    p.setup = function() {
        p.createCanvas(500, 500);
    }
    p.draw = function() {
        p.background('green');      
    }
}

new p5(green, 'main');