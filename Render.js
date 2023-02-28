'use strict';


function drawPuck(canvas, puck) {
  let ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(puck.x, puck.y, puck.radius, 0, 2*Math.PI, false);
  ctx.fillStyle = 'black';
  ctx.fill();
  ctx.strokeStyle = 'white';
  ctx.lineWidth = "2";
  ctx.stroke()
}

function drawPaddle(canvas, paddle) { // Do I want to made the size dynamic on screen size?
  let ctx = canvas.getContext("2d");
  ctx.beginPath();
  ctx.lineWidth = "2";
  ctx.roundRect(paddle.x-(paddle.length/2), paddle.y-(paddle.width/2), paddle.length, paddle.width, paddle.width/2)
  ctx.fillStyle = paddle.color;
  ctx.fill();
  ctx.stroke();
}

function movePaddle(e, canvas, paddle) {
  let width = canvas.width;
  let x = e.targetTouches[0].clientX;
  if (x < 40) {
    x = 40;
  }
  else if (x > width-40) {
    x = width-40
  }
  paddle.x = x;
}

function drawSpeedDot(canvas, dot) {
  let ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, dot.r, 0, 2*Math.PI, false);
  ctx.fillStyle = 'green';
  ctx.fill();
}

function loadBombImg() {
  let imgBomb = new Image();
  imgBomb.isReady = false;
  imgBomb.onload = function() {
    this.isReady = true;
  };
  imgBomb.src = './images/bomb.png';
  return imgBomb;
}

function drawBomb(canvas, bomb, img) {
  let ctx = canvas.getContext('2d');
  if (img.isReady) {
    ctx.drawImage(img, bomb.x - 26, bomb.y - 32, 52, 64);
  }
}

function toggleFullscreen() {
  let game = document.getElementById("game");

  if (!document.fullscreenElement) {
    game.requestFullscreen().catch((err) => {
      console.log(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
    });
  } else {
    document.exitFullscreen();
    document.getElementById("overlay").setAttribute("style", "touch-action: auto");
  }
  return "done";
}
