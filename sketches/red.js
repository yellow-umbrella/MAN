let red = function(p) {
    p.setup = function() {
        p.createCanvas(500, 500);
    }
    p.draw = function() {
        p.background('red');      
    }
}

new p5(red, 'main');
