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
  var canvas = {};
  var particles = [];

  function adjustGameToWindowSize() {
    const p1 = document.getElementById("p1");
    const p2 = document.getElementById("p2");
    const domRect1 = p1.getBoundingClientRect();
    const domRect2 = p2.getBoundingClientRect();
    canvas.canvas1.height = domRect1["height"];
    canvas.canvas1.width = domRect1["width"];
    canvas.canvas2.height = domRect2["height"];
    canvas.canvas2.width = domRect2["width"];
    canvas.overlay.height = domRect1["height"]*2;
    canvas.overlay.width = domRect1["width"];

    paddles = {
      1: { x: canvas.canvas1.width/2, y: 80, color: "red", length: 100, width: 16 },
      2: { x: canvas.canvas2.width/2, y: canvas.overlay.height-80, color: "blue", length: 100, width: 16 }
    }
    puck = { x: canvas.overlay.width/2, y: canvas.overlay.height/2, velX: 0, velY: 0, r: 15, initialSpeed: canvas.overlay.height/3, color: '#202124' };
    setHalfRandomVelocities(puck, puck.initialSpeed); // Set intitial velX, velY
    
    timers = { resetTime: 3500, bomb: 6500, totalBombSpawnTime: 6500, bombExpireTime: 0, rocket: 5000, 
      totalRocketSpawnTime: 5000, timeSinceScore: 0,  lastSpeedIncrease: 0 };
    score.newRender = true;
  }

  function initializeGame() {
    canvas.canvas1 = document.getElementById("canvas1");
    canvas.canvas2 = document.getElementById("canvas2");
    canvas.overlay = document.getElementById("overlay");
    canvas.ctx1 = canvas.canvas1.getContext('2d');
    canvas.ctx2 = canvas.canvas2.getContext('2d');
    canvas.ctxOver = canvas.overlay.getContext('2d');

    let domRect = canvas.overlay.getBoundingClientRect();
    window = { height: domRect["height"], width: domRect["width"] };
    adjustGameToWindowSize();

    score = { player1: 0, player2: 0, newRender: true };
    consumables = { bombs: [], rockets: [], imgBomb: graphics.loadBombImg(), imgRocket: graphics.loadRocketImg(), 
      rocketEffectCount: 0, bombEffectCount: 0 };

    canvas.canvas1.addEventListener('touchstart', (e) => movePaddle(e, canvas.canvas1, paddles[1]));
    canvas.canvas2.addEventListener('touchstart', (e) => movePaddle(e, canvas.canvas2, paddles[2]));
    canvas.canvas1.addEventListener('touchmove', (e) => movePaddle(e, canvas.canvas1, paddles[1]));
    canvas.canvas2.addEventListener('touchmove', (e) => movePaddle(e, canvas.canvas2, paddles[2]));
    
    prevTime = performance.now();
    gameLoop(performance.now());
  }
  
  // Main game loop function. Input -> Update -> Render -> Loop
  function gameLoop(time) {
    let elapsedTime = time - prevTime;
    prevTime = time;
    //console.log(elapsedTime);
    //console.log(Math.sqrt(puck.velX**2 + puck.velY**2)); // Print puck speed

    let domRect = canvas.overlay.getBoundingClientRect();
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
    let scorePoint = updatePuck(canvas.overlay, puck, paddles, consumables, particles, timers, elapsedTime);

    // Update if player has scored.
    let gameIsOver = updateScore(canvas.overlay, scorePoint, score, puck, timers, consumables);

    // Update conmsumable spawn timers.
    updateConsumableTimers(consumables, timers, elapsedTime);

    // Update particle animations
    updateParticles(particles, elapsedTime);

    // Slowly speed up the round over time.
    longGameSpeedUp(puck, timers);

    return gameIsOver;
  }

  function render() {
    // Render scores on player canvases.
    if (score.newRender) {
      graphics.drawScores(canvas, score);
    }

    // Render objects on the overlay canvas.
    canvas.ctxOver.clearRect(0, 0, canvas.overlay.width, canvas.overlay.height);
    graphics.drawPaddle(canvas.overlay, paddles[1]);
    graphics.drawPaddle(canvas.overlay, paddles[2]);
    graphics.drawParticles(canvas.overlay, particles);
    if (timers.resetTime <= 1000) {
      graphics.drawPuck(canvas.overlay, puck);
    } else {
      graphics.drawCountdown(canvas.overlay, timers);
    }
    for (let i = 0; i < consumables.rockets.length; i++) { // Put these for loops into the graphics functions.
      graphics.drawRocket(canvas.overlay, consumables.rockets[i], consumables.imgRocket);
    }
    for (let i = 0; i < consumables.bombs.length; i++) {
      graphics.drawBomb(canvas.overlay, consumables.bombs[i], consumables.imgBomb);
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
