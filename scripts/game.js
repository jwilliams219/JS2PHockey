// v1.1
'use strict';


function game() {
  var prevTime;
  var timers = {};
  var paddles = {};
  var puck = {};
  var consumables = {};
  var window = {};
  var canvas = {};
  var stats = {};
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
    
    timers = { resetTime: 3250, bomb: 6500, totalBombSpawnTime: 6500, bombExpireTime: 0, rocket: 5000, totalRocketSpawnTime: 5000, 
      blueRocket: 12000, totalBlueRocketSpawnTime: 12000, timeSinceScore: 0,  lastSpeedIncrease: 0 };
    stats.score.newRender = true;
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
    stats.score = { player1: 0, player2: 0, newRender: true };
    stats.blueRockets = { player1: 0, player2: 0 };
    consumables = { 
      bombs: [], redBombs: [], rockets: [], blueRockets: [], 
      blueRocketOpacity: {currentOpacity: 1.0, goingUp: false}, rocketEffectCount: 0, bombEffectCount: 0, blueRocketEffectCount: 0, 
      images: { bomb: loadAssets.bombImg(), redBomb: loadAssets.redBombImg(), rocket: loadAssets.rocketImg(), blueRocket: loadAssets.blueRocketImg()},
      sounds: { fuse: soundQueue(), ignition: soundQueue(), explosion: soundQueue()}
    };
    for (let i = 0; i < 5; i++) { // Add number of sound assets.
      consumables.sounds.fuse.addAsset(loadAssets.fuseSound());
      consumables.sounds.ignition.addAsset(loadAssets.ignitionSound());
      consumables.sounds.explosion.addAsset(loadAssets.explosionSound());
    }
      
    adjustGameToWindowSize();

    canvas.canvas1.addEventListener('touchstart', (e) => handleTouch(e, canvas.canvas1, paddles[1], stats, puck, timers, consumables));
    canvas.canvas2.addEventListener('touchstart', (e) => handleTouch(e, canvas.canvas2, paddles[2], stats, puck, timers, consumables));
    canvas.canvas1.addEventListener('touchmove', (e) => handleTouch(e, canvas.canvas1, paddles[1], stats, puck, timers, consumables));
    canvas.canvas2.addEventListener('touchmove', (e) => handleTouch(e, canvas.canvas2, paddles[2], stats, puck, timers, consumables));
    
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
    let scorePoint = updatePuck(canvas.overlay, puck, paddles, consumables, particles, timers, elapsedTime, stats);

    // Update if player has scored.
    let gameIsOver = updateScore(canvas.overlay, scorePoint, stats.score, puck, timers, consumables);

    // Update conmsumable spawn timers.
    updateConsumableTimers(consumables, timers, elapsedTime, particles);

    updateAnimations(elapsedTime, consumables);

    // Update particle animations
    particleSystem.updateParticles(particles, elapsedTime);

    // Slowly speed up the round over time.
    longGameSpeedUp(puck, timers);

    return gameIsOver;
  }

  function render() {
    // Render scores on player canvases.
    if (stats.score.newRender) {
      graphics.drawScores(canvas, stats.score);
    }

    // Render objects on the overlay canvas.
    canvas.ctxOver.clearRect(0, 0, canvas.overlay.width, canvas.overlay.height);
    graphics.drawPaddle(canvas.overlay, paddles[1]);
    graphics.drawPaddle(canvas.overlay, paddles[2]);
    graphics.drawParticles(canvas.overlay, particles);
    if (timers.resetTime <= 750) {
      graphics.drawPuck(canvas.overlay, puck);
    } else {
      graphics.drawCountdown(canvas.overlay, timers);
    }
    graphics.drawRockets(canvas.overlay, consumables.rockets, consumables.images.rocket)
    graphics.drawBlueRockets(canvas.overlay, consumables.blueRockets, consumables.images.blueRocket, stats, consumables.blueRocketOpacity);
    graphics.drawBombs(canvas.overlay, consumables.bombs, consumables.images.bomb)
    graphics.drawBombs(canvas.overlay, consumables.redBombs, consumables.images.redBomb)
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
createStartButton();
