// v1.1
'use strict';


function game() {
  var prevTime;
  var timers = {};
  var paddles = {};
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

  function adjustGameToWindowSize() {
    let domRect1 = p1.getBoundingClientRect();
    let domRect2 = p2.getBoundingClientRect();
    canvas1.height = domRect1["height"];
    canvas1.width = domRect1["width"];
    canvas2.height = domRect2["height"];
    canvas2.width = domRect2["width"];
    overlay.height = domRect1["height"]*2;
    overlay.width = domRect1["width"];

    paddles = {
      1: { x: canvas1.width/2, y: 80, color: "red", length: 100, width: 16 },
      2: { x: canvas2.width/2, y: overlay.height-80, color: "blue", length: 100, width: 16 }
    }
    puck = { x: overlay.width/2, y: overlay.height/2, velX: 0, velY: 0, r: 15, initialSpeed: overlay.height/3 };
    setHalfRandomVelocities(puck, puck.initialSpeed); // Set intitial velX, velY
    
    timers = { resetTime: 3500, bomb: 6500, totalBombSpawnTime: 6500, bombExpireTime: 0, rocket: 5000, 
      totalRocketSpawnTime: 5000, rocketEffectCount: 0, timeSinceScore: 0,  lastSpeedIncrease: 0 };
    score.newRender = true;
  }

  function initializeGame() {
    let domRect = overlay.getBoundingClientRect();
    window = { height: domRect["height"], width: domRect["width"] };
    adjustGameToWindowSize();

    score = { player1: 0, player2: 0, newRender: true };
    consumables = { bombs: [], rockets: [], imgBomb: loadBombImg(), imgRocket: loadRocketImg() };

    canvas1.addEventListener('touchstart', (e) => movePaddle(e, canvas1, paddles[1]));
    canvas2.addEventListener('touchstart', (e) => movePaddle(e, canvas2, paddles[2]));
    canvas1.addEventListener('touchmove', (e) => movePaddle(e, canvas1, paddles[1]));
    canvas2.addEventListener('touchmove', (e) => movePaddle(e, canvas2, paddles[2]));
    
    prevTime = performance.now();
    gameLoop(performance.now());
  }
  
  // Main game loop function. Input -> Update -> Render -> Loop
  function gameLoop(time) {
    let elapsedTime = time - prevTime;
    prevTime = time;
    //console.log(elapsedTime);
    //console.log(Math.sqrt(puck.velX**2 + puck.velY**2)); // Print puck speed

    let domRect = overlay.getBoundingClientRect();
    if (domRect["height"] !== window.height || domRect["width"] !== window.width) {
      adjustGameToWindowSize();
      window.height = domRect["height"];
      window.width = domRect["width"];
    }

    let gameIsOver = update(elapsedTime);
    render();

    if (!gameIsOver) {
      requestAnimationFrame(gameLoop);
    }
    else {
      winner();
    }
  }

  function update(elapsedTime) {
    // Main physics update.
    let scorePoint = updatePuck(overlay, puck, paddles, consumables, timers, elapsedTime);

    // Update if player has scored.
    let gameIsOver = updateScore(scorePoint, score, overlay, puck, timers);

    // Update conmsumable spawn timers.
    updateConsumableTimers(consumables, timers, elapsedTime);

    // Slowly speed up the round over time.
    longGameSpeedUp(puck, timers);

    return gameIsOver;
  }

  function render() {
    // Render scores on player canvases.
    if (score.newRender) {
      drawScores(canvas1, ctx1, canvas2, ctx2, score);
    }

    // Render objects on the overlay canvas.
    ctxOver.clearRect(0, 0, overlay.width, overlay.height);
    drawPaddle(overlay, paddles[1]);
    drawPaddle(overlay, paddles[2]);
    if (timers.resetTime <= 1000) {
      drawPuck(overlay, puck);
    } else {
      drawCountdown(overlay, timers);
    }
    for (let i = 0; i < consumables.rockets.length; i++) {
      drawRocket(overlay, consumables.rockets[i], consumables.imgRocket);
    }
    for (let i = 0; i < consumables.bombs.length; i++) {
      drawBomb(overlay, consumables.bombs[i], consumables.imgBomb);
    }
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
