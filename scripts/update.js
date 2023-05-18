'use strict';


// Update scores when necessary.
function updateScore(overlay, scorePoint, score, puck, timers, consumables) {
    if (scorePoint[0] === true) {
        if (scorePoint[1] === 1) {
          score.player1 += 1;
        } else if (scorePoint[1] === 2) {
          score.player2 += 1;
        }
        score.newRender = true;
        resetPuck(overlay, puck, timers, score, consumables);
        if (score.player1 === 7 || score.player2 === 7) {
          return true;
        }
        timers.rocket = timers.totalRocketSpawnTime;
        timers.blueRocket = timers.totalBlueRocketSpawnTime;
        timers.bomb = timers.totalBombSpawnTime;
        timers.timeSinceScore = 0;
        timers.lastSpeedIncrease = 0;
    }
    return false;
}

// Calculate if a player has scored.
function pointDetection(puck, overlay) {
    if (puck.y - puck.r < 0) {
        return [true, 2];
    } else if (puck.y + puck.r > overlay.height) {
        return [true, 1];
    }
    return [false, 0];
}

// Increase puck speed after time.
function longGameSpeedUp(puck, timers) {
    if (Math.floor(timers.timeSinceScore/1000) > timers.lastSpeedIncrease) {
        timers.lastSpeedIncrease = Math.floor(timers.timeSinceScore/1000) + 1;
        increaseSpeedPercent(puck, 0.5);
    }
}

// Update the puck location, collisions, timers, consumables effects.
function updatePuck(overlay, puck, paddle, consumables, particles, timers, elapsedTime, stats) {
    timers.timeSinceScore += elapsedTime;
    if (timers.resetTime > 0) {
        timers.resetTime -= elapsedTime;
    } else {

        if (timers.bombExpireTime > 0) {
            timers.bombExpireTime -= elapsedTime;
        } else if (timers.bombExpireTime < 0) { // Janky code for bomb worn off trigger
          endBombEffects(puck, timers, consumables);
        }

        // Update the puck location and address collisions.
        puck.x = puck.x + (puck.velX*elapsedTime/1000);
        puck.y = puck.y + (puck.velY*elapsedTime/1000);
        consumableCollisionDetection(puck, consumables, timers, stats);
        let collision = collisionDetectionHandling(puck, paddle, overlay); // Main collision physics.
        if (collision && (consumables.rocketEffectCount > 0 || consumables.blueRocketEffectCount > 0)) {
          endRocketEffects(puck, consumables); 
        }
        createRocketExhaustParticles(puck, particles, consumables);
    }

    updatePuckColor(puck, consumables);
    return pointDetection(puck, overlay);
}

// Update puck color based on consumable effects.
function updatePuckColor(puck, consumables) {
  const colors = ['#202124', '#ff8300', '#ff6400', '#ff4500', '#fc2e20', '#C31912', '#8a0303', '#310202'];
  const blueColors = ['#202124', '#0D1C82', '#0219BB', '#0E138D', '#1F0B47', '#240731', '#29021A'];
  let frenzyCount = 0;
  frenzyCount += consumables.rocketEffectCount;
  frenzyCount += consumables.bombEffectCount*3;
  frenzyCount += consumables.blueRocketEffectCount;
  let palette;
  if (consumables.blueRocketEffectCount > 0) {
    palette = blueColors;
  } else {
    palette = colors;
  }
  if (frenzyCount > palette.length) {
    puck.color = palette[palette.length-1];
  } else {
    puck.color = palette[frenzyCount];
  }
}

function resetPuck(overlay, puck, timers, score, consumables) {
    setHalfRandomVelocities(puck, puck.initialSpeed);
    let speedUp = 4 * (score.player1 + score.player2);
    increaseSpeedFromInitial(puck, speedUp); // Speed increases slightly each round.
    puck.x = overlay.width/2;
    puck.y = overlay.height/2;
    timers.resetTime = 750;
    timers.bombExpireTime = 0;
    consumables.rocketEffectCount = 0;
    consumables.blueRocketEffectCount = 0;
    consumables.bombEffectCount = 0;
}

function handleTouch(e, canvas, paddle, stats, puck, timers, consumables) {
  let overlay = document.getElementById("overlay");
  let width = canvas.width;
  let x = e.targetTouches[0].clientX;
  let y = e.targetTouches[0].clientY;

  // Check for blue rocket usage.
  if (stats.blueRockets.player1 > 0 && consumables.blueRocketEffectCount === 0 &&
    x < overlay.width/20+48 && y < overlay.height/2-(overlay.height/10)+50 && y > overlay.height/2-(overlay.height/10)-50) {
      useBlueRocket(puck, timers, consumables, stats, 1)
  } else if (stats.blueRockets.player2 > 0 && consumables.blueRocketEffectCount === 0 &&
    x < overlay.width/20+48 && y < overlay.height/2+(overlay.height/10)+50 && y > overlay.height/2+(overlay.height/10)-50) {
      useBlueRocket(puck, timers, consumables, stats, 2)
  } else {

    // Move Paddle
    if (x < paddle.length/2) {
      x = paddle.length/2;
    }
    else if (x > width - paddle.length/2) {
      x = width - paddle.length/2;
    }
    paddle.x = x;
  }
}

function updateAnimations(elapsedTime, consumables) {

  // Collecting blue rocket animation
  let remove = [];
  for (let i = 0; i < consumables.blueRockets.length; i++) {
    let blueRocket = consumables.blueRockets[i];
    if (blueRocket.playerX !== 0 && blueRocket.playerY !== 0) {
      if (blueRocket.x === blueRocket.playerX && blueRocket.y === blueRocket.playerY) {
        remove.push(i);
      } else {
        let speed = elapsedTime/2;
        if (speed > distanceBetweenPoints(blueRocket.x, blueRocket.y, blueRocket.playerX, blueRocket.playerY)) {
          blueRocket.x = blueRocket.playerX;
          blueRocket.y = blueRocket.playerY;
        } else {
          const point = calculatePointAlongLine([blueRocket.x, blueRocket.y], [blueRocket.playerX, blueRocket.playerY], speed);
          blueRocket.x = point[0];
          blueRocket.y = point[1];
        }
      }
    }
  } 
  for (let i = remove.length-1; i > -1; i--) {
    consumables.blueRockets.splice(remove[i], 1);
  }
  remove.length = 0;
}

function winner() {
    let start = createStartButton();
    if (start) {
      const startButton = document.getElementById("startButton");
      startButton.textContent = "Play Again?"
    }
    toggleFullscreen();
}

function createStartButton() {
  let startButton = document.createElement("button");
  startButton.id = "startButton";
  startButton.className = "startButton";
  startButton.textContent = "Play";
  startButton.addEventListener("click", () => { start(); });
  document.body.appendChild(startButton);
  return true;
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
