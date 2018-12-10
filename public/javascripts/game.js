let bgCanvas = document.getElementById("bg");
let gameCanvas = document.getElementById("game");
let hitCanvas = document.getElementById("hit");

bgCtx = bgCanvas.getContext("2d");
gameCtx = gameCanvas.getContext("2d");
hitCtx = hitCanvas.getContext("2d");

let canvasSize = 800;
let colorsHash = {};

bgCanvas.width = canvasSize, bgCanvas.height = canvasSize;
gameCanvas.width = canvasSize, gameCanvas.height = canvasSize;
hitCanvas.width = canvasSize, hitCanvas .height = canvasSize;

function preload() {
    let images = [{id: "clouds",    src: "clouds.png"},
                  {id: "starsbg",   src: "bg.png"},
                  {id: "stars",     src: "stars.png"},
                  {id: "elf96",     src: "icons8-elf-96.png"},
                  {id: "elf48",     src: "icons8-elf-48.png"}];

    images.forEach(element => {
        let img = document.createElement("img");
        img.src = "/images/" + element.src;
        img.id = element.id;
        img.hidden = true;
        document.getElementsByTagName("body")[0].appendChild(img);
    });
}

preload();

let bg = {
    images: [{id: "starsbg",    x: 0,   speed: 1},
             {id: "stars",      x: 0,   speed: 2},
             {id: "clouds",     x: 0,   speed: 4}
            ],
    imgWidth: 3840,
    animate: function() {
        this.images.forEach(element => {
            bgCtx.drawImage(document.getElementById(element.id), element.x, 0);
            bgCtx.drawImage(document.getElementById(element.id), this.imgWidth + element.x, 0);
            element.x = element.x - element.speed;
            if(element.x < -this.imgWidth) element.x = 0;
        });
    }
}

let hole = {
    width: 80,
    height: 80,
    radius: 40,
    color: "rgba(20, 20, 20, 0.8)",
    draw: function(e) {
        e.x = getRandomInt(canvasSize - this.width);
        e.y = getRandomInt(canvasSize - this.height);
        gameCtx.fillStyle = this.color;
        gameCtx.beginPath();
        gameCtx.arc(e.x + this.width / 2, e.y + this.height / 2, this.radius, 0,2*Math.PI);
        gameCtx.fill();

        gameCtx.drawImage(document.getElementById("elf96"), e.x + 10, e.y + 10, 60, 60);
        
        hitCtx.fillStyle = e.colorKey;
        hitCtx.beginPath();
        hitCtx.arc(e.x + this.width / 2, e.y + this.height / 2, this.radius, 0,2*Math.PI);
        hitCtx.fill();
    }
}

function boardSetup() {
    let holes = [
        {id: 0, x: 0, y: 0, colorkey: ""},
        {id: 1, x: 0, y: 0, colorkey: ""},
        {id: 2, x: 0, y: 0, colorkey: ""},
        {id: 3, x: 0, y: 0, colorkey: ""},
        {id: 4, x: 0, y: 0, colorkey: ""},
        {id: 5, x: 0, y: 0, colorkey: ""},
        {id: 6, x: 0, y: 0, colorkey: ""},
        {id: 7, x: 0, y: 0, colorkey: ""},
        {id: 8, x: 0, y: 0, colorkey: ""},
        {id: 9, x: 0, y: 0, colorkey: ""}
    ];
    
    holes.forEach(element => {
        let colorKey = getRandomColor();

        if (!colorsHash[colorKey]) {
            element.colorKey = colorKey;
            colorsHash[colorKey] = element;
        }
        hole.draw(element);
    });
}

function step() {
    bgCtx.clearRect(0, 0, canvasSize, canvasSize);
    bg.animate();

    window.requestAnimationFrame(step);
}

window.requestAnimationFrame(step);

document.getElementById("game").addEventListener("click", function(e) {
    let pixel = hitCtx.getImageData(e.x -50, e.y-100, 1, 1).data;
    let color = `rgb(${pixel[0]},${pixel[1]},${pixel[2]})`;
    let shape = colorsHash[color];
    if (shape) {
        console.log('click on: ' + shape.id);
    }
    console.log(e.x, e.y, pixel);
}, false);

function getRandomColor() {
    let r = Math.round(Math.random() * 255);
    let g = Math.round(Math.random() * 255);
    let b = Math.round(Math.random() * 255);
    return `rgb(${r},${g},${b})`;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }