module.exports = new p5((P) => { with (P) {

P.setup = function() {
    let canvas = createCanvas(windowWidth, windowHeight);
    canvas.position(-200, -50);
    noStroke();
    fill('#0d261a');
    createInfoB(P, 'start');
    let titleDiv = createDiv(` 
        <center>
            <h1>Фізичний Помічник</h1>
            <h3>Експериментуй та розумій. Віртуальна фізична лабораторія.</h3>
        </center>
        <br>
        <p id='description'>В даній програмі представлена добірка фізичних дослідів на різні теми з шкільної програми, 
            які наочно продемонструють фізичні закони, а теоретична довідка допоможе краще 
            засвоїти формули. Для початку роботи оберіть потрібний дослід в лівому меню.
        </p>
        <p id='author'>&copy; Нємкевич Дар'я</p>`
    );
    titleDiv.id('init');
    select('#main').child('init');
    noLoop();
}
}}, 'main');
        
        
    
