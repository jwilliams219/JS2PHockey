'use strict';


function drawPuck(canvas, puck) {
  let ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(puck.x, puck.y, puck.r, 0, 2*Math.PI, false);
  ctx.fillStyle = '#202124';
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
  if (x < paddle.length/2) {
    x = paddle.length/2;
  }
  else if (x > width - paddle.length/2) {
    x = width - paddle.length/2;
  }
  paddle.x = x;
}

function drawSpeedDot(canvas, dot) {
  let ctx = canvas.getContext('2d');
  ctx.beginPath();
  ctx.arc(dot.x, dot.y, dot.r, 0, 2*Math.PI, false);
  ctx.fillStyle = '#32CD32';
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

function drawScores(canvas1, ctx1, canvas2, ctx2, score) {
  ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
  ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
  ctx1.font = '20px Arial';
  ctx1.save();
  ctx1.translate(21, canvas1.height -29);
  ctx1.rotate(Math.PI);
  ctx1.fillStyle = 'white';
  ctx1.fillText(score.player1, 0, 0);
  ctx1.restore();
  ctx2.font = '20px Arial';
  ctx2.fillStyle = 'white';
  ctx2.fillText(score.player2, 10, 30);
  score.newRender = false;
}

function drawCountdown(canvas, puck) {
  let ctx = canvas.getContext('2d');
  let time = Math.round(puck.resetTime/1000);
  ctx.font = '24px Arial';
  ctx.fillStyle = 'white';
  ctx.fillText(time, canvas.width/2, canvas.height/2);
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

function startButton() {
  let startButton = document.createElement("button");
  startButton.id = "startButton";
  startButton.className = "startButton";
  startButton.textContent = "Play";
  startButton.addEventListener("click", () => { start(); });
  document.body.appendChild(startButton);
  return true;
}
