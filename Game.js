// v1.1
'use strict';


function game() {
  var prevTime;
  var timeSinceScore;
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
  const bombSpawnTime = 6500;
  const rocketSpawnTime = 5000;
  //const bombImageRes = [200, 241];
  //const rocketImageRes = [162, 171];
  var imgBomb;
  var imgRocket;
  var lastSpeedIncrease;

  function createConsumable(consumable) {
    let randomX = getRandomInt(50, overlay.width - 50);
    let randomY = getRandomInt(overlay.height/4, overlay.height*3/4);
    if (consumable === "rocket") {
      consumables.rockets.push({ x: randomX, y: randomY, r: puckRadius })
    } else if (consumable === "bomb") {
      consumables.bombs.push({ x: randomX, y: randomY, r: puckRadius })
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
      1: { x: canvas1.width/2, y: 80, color: "red", length: paddleLength, width: paddleWidth },
      2: { x: canvas2.width/2, y: overlay.height-80, color: "blue", length: paddleLength, width: paddleWidth }
    }
    puck = { x: overlay.width/2, y: overlay.height/2, velX: 0, velY: 0, r: puckRadius };
    setHalfRandomVelocities(puck, initialSpeed); // Set intitial velX, velY
    timers = { resetTime: 3500, bomb: bombSpawnTime, bombExpireTime: 0, rocket: rocketSpawnTime, rocketEffectOn: false };
    score.newRender = true;
  }

  function initializeGame() {
    let domRect = overlay.getBoundingClientRect();
    window = { height: domRect["height"], width: domRect["width"] };
    adjustGameToWindowSize();

    score = { player1: 0, player2: 0, newRender: true };
    consumables = { bombs: [], rockets: [] };
    imgBomb = loadBombImg();
    imgRocket = loadRocketImg();

    canvas1.addEventListener('touchstart', (e) => movePaddle(e, canvas1, paddle[1]));
    canvas2.addEventListener('touchstart', (e) => movePaddle(e, canvas2, paddle[2]));
    canvas1.addEventListener('touchmove', (e) => movePaddle(e, canvas1, paddle[1]));
    canvas2.addEventListener('touchmove', (e) => movePaddle(e, canvas2, paddle[2]));
    
    timeSinceScore = 0;
    lastSpeedIncrease = 0;
    prevTime = performance.now();
    gameLoop(performance.now());
  }
  
  function gameLoop(time) {
    let elapsedTime = time - prevTime;
    //console.log(elapsedTime);
    //console.log(Math.sqrt(puck.velX**2 + puck.velY**2));
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
    timeSinceScore += elapsedTime;
    let scorePoint = updatePuck(overlay, puck, paddle, consumables, timers, elapsedTime, initialSpeed);

    // Update scores when necessary.
    if (scorePoint[0] === true) {
      if (scorePoint[1] === 1) {
        score.player1 += 1;
      } else if (scorePoint[1] === 2) {
        score.player2 += 1;
      }
      score.newRender = true;
      resetPuck(overlay, puck, timers, initialSpeed, score);
      if (score.player1 === 7 || score.player2 === 7) {
        return true;
      }
      timers.rocket = rocketSpawnTime;
      timers.bomb = bombSpawnTime;
      timeSinceScore = 0;
      lastSpeedIncrease = 0;
    }

    // Update conmsumable spawn timers.
    if (timers.resetTime <= 0) {
      timers.rocket -= elapsedTime;
      if (timers.rocket < 0) {
        createConsumable("rocket");
        timers.rocket = rocketSpawnTime;
      }
      timers.bomb -= elapsedTime;
      if (timers.bomb < 0) {
        createConsumable("bomb");
        timers.bomb = bombSpawnTime;
      }
    }

    // Increase puck speed after time.
    if (Math.floor(timeSinceScore/1000) > lastSpeedIncrease) {
      lastSpeedIncrease = Math.floor(timeSinceScore/1000) + 1;
      increaseSpeedPercent(puck, 0.5);
    }

    return false;
  }

  function render() {
    // Render scores on player canvases.
    if (score.newRender) {
      drawScores(canvas1, ctx1, canvas2, ctx2, score);
    }

    // Render objects on the overlay canvas.
    ctxOver.clearRect(0, 0, overlay.width, overlay.height);
    drawPaddle(overlay, paddle[1]);
    drawPaddle(overlay, paddle[2]);
    if (timers.resetTime <= 1000) {
      drawPuck(overlay, puck);
    } else {
      drawCountdown(overlay, timers);
    }
    for (let i = 0; i < consumables.rockets.length; i++) {
      drawRocket(overlay, consumables.rockets[i], imgRocket);
    }
    for (let i = 0; i < consumables.bombs.length; i++) {
      drawBomb(overlay, consumables.bombs[i], imgBomb);
    }
  }

  function winner() {
    let start = startButton();
    if (start) {
      const startButton = document.getElementById("startButton");
      startButton.textContent = "Play Again?"
      startButton.style.left = "35vw";
    }
    toggleFullscreen();
  }
  initializeGame();
}


function initialize() {
  let newGame = game();
}

function start() {
  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.remove();
  }
  if (!document.fullscreenElement) {
    toggleFullscreen();
  }
  initialize();
}

// Enable normal touch functions before beginning game.
document.getElementById("overlay").setAttribute("style", "touch-action: auto");
startButton();
