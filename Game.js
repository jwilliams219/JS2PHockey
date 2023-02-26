'use strict';


function game() {
  var prevTime;
  var initialSpeed;
  var paddle = {};
  var puck = {};
  var score = {};
  const canvas1 = document.getElementById("canvas1");
  const canvas2 = document.getElementById("canvas2");
  const overlay = document.getElementById("overlay");
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  const ctxOver = overlay.getContext('2d');
  const p1 = document.getElementById("p1");
  const p2 = document.getElementById("p2");
  const puckRadius = 15;
  const paddleLength = 80;
  const paddleWidth = 16;

  function initializeGame() {

    let domRect1 = p1.getBoundingClientRect();
    let domRect2 = p2.getBoundingClientRect();
    canvas1.height = domRect1["height"];
    canvas1.width = domRect1["width"];
    canvas2.height = domRect2["height"];
    canvas2.width = domRect2["width"];
    overlay.height = domRect1["height"]*2;
    overlay.width = domRect1["width"];
    initialSpeed = overlay.height/3;
    
    paddle = {
      1: { "x": canvas1.width/2, "y": 50, "color": "red", "length": paddleLength, "width": paddleWidth },
      2: { "x": canvas2.width/2, "y": overlay.height-50, "color": "blue", "length": paddleLength, "width": paddleWidth }
    }
    let initialVelocity = getInitialVelocities(initialSpeed);
    puck = { "x": overlay.width/2, "y": overlay.height/2, "velX": initialVelocity.x, "velY": initialVelocity.y, "radius": puckRadius, "resetTime": 1000 };
    score = { "player1": 0, "player2": 0, "scoreChange": true };

    drawPaddle(canvas1, paddle[1].x, paddle[1].y);
    drawPaddle(canvas2, paddle[2].x, paddle[2].y);
    canvas1.addEventListener('touchstart', (e) => movePaddle(e, canvas1, paddle[1]));
    canvas2.addEventListener('touchstart', (e) => movePaddle(e, canvas2, paddle[2]));
    canvas1.addEventListener('touchmove', (e) => movePaddle(e, canvas1, paddle[1]));
    canvas2.addEventListener('touchmove', (e) => movePaddle(e, canvas2, paddle[2]));
    
    prevTime = performance.now();
    gameLoop(performance.now());
  }
  
  function gameLoop(time) {
    let elapsedTime = time - prevTime;
    //console.log(elapsedTime);
    prevTime = time;
    
    let end = update(elapsedTime);
    render();

    if (!end) {
      requestAnimationFrame(gameLoop);
    }
    else {
      winner();
    }
  }

  function update(elapsedTime) {
    let scorePoint = updatePuck(elapsedTime, puck, paddle, overlay);
    if (scorePoint[0] === true) {
      if (scorePoint[1] === 1) {
        score.player1 += 1;
      } else if (scorePoint[1] === 2) {
        score.player2 += 1;
      }
      score.scoreChange = true;
      resetPuck(puck, initialSpeed, overlay);
      if (score.player1 === 7 || score.player2 === 7) {
        return true;
      }
    }
    return false;
  }

  function render() {
    if (score.scoreChange === true) {
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      ctx1.font = '20px Arial';
      ctx1.fillText(score.player1, 10, canvas1.height - 10);
      ctx2.font = '20px Arial';
      ctx2.fillText(score.player2, 10, 25);
      score.scoreChange = false;
    }
    ctxOver.clearRect(0, 0, overlay.width, overlay.height);
    drawPaddle(overlay, paddle[1]);
    drawPaddle(overlay, paddle[2]);
    drawPuck(overlay, puck);
  }

  function winner() {
    
  }
  initializeGame();
}

function initialize() {
  let newGame = game();
}

initialize();