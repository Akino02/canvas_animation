const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const mousecoor = document.getElementById("mousecoor");

let canvaswidth = screen.width;
let canvasheight = screen.height;

canvas.width = canvaswidth;
canvas.height = (canvasheight-200);

setInterval(() => {
  //každých 10s se restartuje velikost canvasu
  canvaswidth = screen.width;
  canvasheight = screen.height;
  canvas.width = canvaswidth;
  canvas.height = canvasheight-200;
  //console.log(canvas.width);
  //console.log(canvas.height);
}, 10000);

let mouseX = canvas.width / 2;
let mouseY = canvas.height / 2;
let snow = Math.random(Math.floor) * canvas.width;
let changepossX = Math.random(Math.floor) * 50;
let changepossY = Math.random(Math.floor) * 50;
let changepossXY1 = Math.random(Math.floor) * 25;
let circlesposs = [];
let maxcircles = 20;
let radius = Math.random(Math.floor) * 15;
let radiusarr = [];

//color
let redr = Math.random(Math.floor) * 256;
let greenr = Math.random(Math.floor) * 256;
let bluer = Math.random(Math.floor) * 256;
let savecolor = [];

let distToCircle;
let distCircleToCircle;

let randompossX = Math.random(Math.floor) * canvas.width;
let randompossY = Math.random(Math.floor) * canvas.height;
let speedX = Math.random(Math.floor) * 1;
let speedY = Math.random(Math.floor) * 1;
let speedXY = [];

function mousepos() {
  canvas.addEventListener("mousemove", function (event) {
    mouseX = event.clientX;
    mouseY = event.clientY;
    mousecoor.innerHTML = `${mouseX},${mouseY}`;
  });
}

function drawCanvas() {
  ctx.fillStyle = "white";
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  //circles
  /*myš*/ //circlesposs.push({ x: (mouseX+changepossX-changepossXY1), y: (mouseY+changepossY-changepossXY1) });
  /*obrazovka je top*/ //circlesposs.push({ x: snow, y: 0});
  /*obrazovka všude*/ circlesposs.push({ x: randompossX, y: randompossY });

  /*color*/ savecolor.push({ x: redr, y: greenr, z: bluer });

  /*Speed*/ speedXY.push({ x: speedX, y: speedY });

  radiusarr.push({ x: radius });
  if (circlesposs.length >= 100) {
    for (let i = 0; i < 100; i++) {
      if (radiusarr[i].x < 0) {
        radiusarr[i].x = Math.abs(radiusarr[i].x);
      }
      ctx.beginPath();

      ctx.fillStyle = `rgb(${savecolor[i].x},${savecolor[i].y},${savecolor[i].z})`; //barva kruhů

      ctx.arc(
        circlesposs[i].x,
        circlesposs[i].y,
        radiusarr[i].x,
        0,
        Math.PI * 2
      );
      ctx.fill();

      distToCircle = Math.sqrt(
        (mouseX - circlesposs[i].x) ** 2 + (mouseY - circlesposs[i].y) ** 2
      );
      for (let y = 0; y < 100; y++) {
        distCircleToCircle = Math.sqrt(
          (circlesposs[y].x - circlesposs[i].x) ** 2 +
            (circlesposs[y].y - circlesposs[i].y) ** 2
        );
        if (distCircleToCircle < 100) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(256,0,0,${opacitystick})`; //barva kruhu s kruhem
          ctx.moveTo(circlesposs[y].x, circlesposs[y].y);
          ctx.lineTo(circlesposs[i].x, circlesposs[i].y);
          ctx.stroke();
        }
      }
      if (distToCircle < 100) {
        //let opacitystick = (1-(distToCircle/100)); //čím blíže tím bude plnější
        let opacitystick = distToCircle / 100; //čím blíže tím bude prázdnější                               //barva kruhu s myší
        ctx.beginPath();
        //ctx.strokeStyle = `rgba(256,0,0,${opacitystick})`;
        ctx.strokeStyle = "aqua";
        ctx.moveTo(mouseX, mouseY);
        ctx.lineTo(circlesposs[i].x, circlesposs[i].y);
        ctx.stroke();
      }
    }
  }
}
//opacity podle vzdálenosti k objektu
function fall() {
  for (let i = 0; i < circlesposs.length; i++) {
    circlesposs[i].y += speedXY[i].y;
    circlesposs[i].x -= speedXY[i].x;
    /*if (circlesposs[i].y <= canvas.height && radiusarr[i].x > 0) {
      circlesposs[i].y += speedXY[i].y;
      //radiusarr[i].x -= 0.01;   //potom navazuje čáru s 0
      if (circlesposs[i].y == canvas.height) {
        circlesposs[i].x = 0; //pokud by to vycházelo na celou stránku
      }
    } else if (radiusarr[i].x <= 0 || circlesposs[i].y >= canvas.height) {
      radiusarr[i].x = 0;
    }*/
    if (
      circlesposs[i].y + radiusarr[i].x > canvas.height ||
      circlesposs[i].x + radiusarr[i].x > canvas.width
    ) {
      //bottom
      if (circlesposs[i].y > 0) {
        circlesposs[i].y -= speedXY[i].y;
        speedXY[i].y = speedXY[i].y * -1;
      }
      if (circlesposs[i].x > 0) {
        circlesposs[i].x += speedXY[i].x;
        speedXY[i].x = speedXY[i].x * -1;
        //console.log("ahoj right");
      }
    } else if (
      circlesposs[i].y + radiusarr[i].x < canvas.height ||
      circlesposs[i].x + radiusarr[i].x < canvas.width
    ) {
      //top   //left
      if (circlesposs[i].y < 0) {
        circlesposs[i].y -= speedXY[i].y;
        speedXY[i].y = speedXY[i].y * -1;
        //console.log("Ahoj top");
      } else if (circlesposs[i].x < 0) {
        circlesposs[i].x += speedXY[i].x;
        speedXY[i].x = speedXY[i].x * -1;
        //console.log("ahoj left");
      }
    }
  }
}

//https://stackoverflow.com/questions/37101054/how-to-make-object-bounce-off-edge-of-canvas
function bounce() {
  for (let i = 0; i < 100; i++) {
    if (circlesposs[i].y + radiusarr[i].x >= canvas.height) {
      circlesposs[i].y -= 1;
    } else if (circlesposs[i].y + radiusarr[i].x <= canvas.height) {
      circlesposs[i].y += 1;
    } else if (circlesposs[i].x + radiusarr[i].x >= canvas.width) {
      circlesposs[i].x += 1;
    } else if (circlesposs[i].x + radiusarr[i].x <= canvas.width) {
      circlesposs[i].x -= 1;
    }
  }
}

function drawingLoop() {
  setInterval(() => {
    radius = Math.random(Math.floor) * 15;
    changepossX = Math.random(Math.floor) * 50;
    changepossY = Math.random(Math.floor) * 50;
    changepossXY1 = Math.random(Math.floor) * 25;
    snow = Math.random(Math.floor) * canvas.width;

    redr = Math.random(Math.floor) * 256;
    greenr = Math.random(Math.floor) * 256;
    bluer = Math.random(Math.floor) * 256;
    randompossX = Math.random(Math.floor) * canvas.width;
    randompossY = Math.random(Math.floor) * canvas.height;
    speedX = Math.random(Math.floor) * 1;
    speedY = Math.random(Math.floor) * 1;
    drawCanvas();
  }, 50);
  setInterval(() => {
    fall();
  }, 10);
}

window.onload = () => {
  mousepos();
  drawingLoop();
};