'use strict';


function game() {
  var prevTime;
  var gameTime;
  var initialSpeed;
  var timers = {};
  var paddle = {};
  var puck = {};
  var consumables = {};
  var score = {};
  var window = {};
  const canvas1 = document.getElementById("canvas1");
  const canvas2 = document.getElementById("canvas2");
  const overlay = document.getElementById("overlay");
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  const ctxOver = overlay.getContext('2d');
  const p1 = document.getElementById("p1");
  const p2 = document.getElementById("p2");
  const puckRadius = 15;
  const paddleLength = 100;
  const paddleWidth = 16;
  const speedDotSpawnTime = 3000;
  const bombSpawnTime = 8000;
  const bombImageRes = [200, 241];
  var imgBomb;

  function createConsumable(consumable) {
    let randomX = getRandomInt(50, overlay.width - 50);
    let randomY = getRandomInt(overlay.height/4, overlay.height*3/4);
    if (consumable === "speedDot") {
      consumables.speedDots.push({ "x": randomX, "y": randomY, "r": puckRadius/3 })
    } else if (consumable === "bomb") {
      consumables.bombs.push({ "x": randomX, "y": randomY, "r": puckRadius })
    }
  }

  function adjustGameToWindowSize() {
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
    timers = { "speedDot": speedDotSpawnTime, "bomb": bombSpawnTime };
    score.scoreChange = true;
  }

  function initializeGame() {
    let domRect = overlay.getBoundingClientRect();
    window = { "height": domRect["height"], "width": domRect["width"] };
    adjustGameToWindowSize();

    score = { "player1": 0, "player2": 0, "scoreChange": true };
    consumables = { "bombs": [], "speedDots": [] };
    imgBomb = loadBombImg();

    canvas1.addEventListener('touchstart', (e) => movePaddle(e, canvas1, paddle[1]));
    canvas2.addEventListener('touchstart', (e) => movePaddle(e, canvas2, paddle[2]));
    canvas1.addEventListener('touchmove', (e) => movePaddle(e, canvas1, paddle[1]));
    canvas2.addEventListener('touchmove', (e) => movePaddle(e, canvas2, paddle[2]));
    
    gameTime = 0;
    prevTime = performance.now();
    gameLoop(performance.now());
  }
  
  function gameLoop(time) {
    let elapsedTime = time - prevTime;
    gameTime += elapsedTime;
    console.log(elapsedTime);
    prevTime = time;

    let domRect = overlay.getBoundingClientRect();
    if (domRect["height"] !== window.height || domRect["width"] !== window.width) {
      adjustGameToWindowSize();
      window.height = domRect["height"];
      window.width = domRect["width"];
    }

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
    let scorePoint = updatePuck(overlay, elapsedTime, puck, paddle, consumables);
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
      timers.speedDot = speedDotSpawnTime;
      timers.bomb = bombSpawnTime;
    }
    timers.speedDot -= elapsedTime;
    timers.bomb -= elapsedTime;
    if (timers.speedDot < 0) {
      createConsumable("speedDot");
      timers.speedDot = speedDotSpawnTime;
    }
    if (timers.bomb < 0) {
      createConsumable("bomb");
      timers.bomb = bombSpawnTime;
    }

    return false;
  }

  function render() {
    if (score.scoreChange) {
      ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
      ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
      ctx1.font = '20px Arial';
      ctx1.save();
      ctx1.translate(21, canvas1.height -24);
      ctx1.rotate(Math.PI);
      ctx1.fillStyle = 'white';
      ctx1.fillText(score.player1, 0, 0);
      ctx1.restore();
      ctx2.font = '20px Arial';
      ctx2.fillStyle = 'white';
      ctx2.fillText(score.player2, 10, 25);
      score.scoreChange = false;
    }
    ctxOver.clearRect(0, 0, overlay.width, overlay.height);
    drawPaddle(overlay, paddle[1]);
    drawPaddle(overlay, paddle[2]);
    drawPuck(overlay, puck);
    for (let i = 0; i < consumables.speedDots.length; i++) {
      drawSpeedDot(overlay, consumables.speedDots[i]);
    }
    for (let i = 0; i < consumables.bombs.length; i++) {
      drawBomb(overlay, consumables.bombs[i], imgBomb);
    }
  }

  function winner() {
    toggleFullscreen();
    const button = document.getElementById("startButton");
    button.textContent = "Play Again?"
    button.style.display = "block";
    button.style.left = "40vw";
  }
  initializeGame();
}


function initialize() {
  let newGame = game();
}

function start() {
  const button = document.getElementById("startButton");
  button.style.display = "none";
  toggleFullscreen();
  initialize();
}

// Enable normal touch functions before beginning game.
document.getElementById("overlay").setAttribute("style", "touch-action: auto");
