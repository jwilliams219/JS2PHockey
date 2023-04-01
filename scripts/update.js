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
function updatePuck(overlay, puck, paddle, consumables, particles, timers, elapsedTime) {
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
        consumableCollisionDetection(puck, consumables, timers);
        let collision = collisionDetectionHandling(puck, paddle, overlay); // Main collision physics.
        if (collision && consumables.rocketEffectCount > 0) {
          endRocketEffects(puck, consumables); 
        }
        createRocketExhaustParticles(puck, particles, consumables);
    }

    updatePuckColor(puck, consumables);
    return pointDetection(puck, overlay);
}

// Update puck color based on consumable effects.
function updatePuckColor(puck, consumables) {
  if (consumables.bombEffectCount === 0) {
    if (consumables.rocketEffectCount > 3) {
      puck.color = '#8a0303'; // blood red
    } else if (consumables.rocketEffectCount === 3) {
        puck.color = '#fc2e20'; // red
    } else if (consumables.rocketEffectCount === 2) {
        puck.color = '#ff4500'; // orange red
    } else if (consumables.rocketEffectCount === 1) {
        puck.color = '#ff8300'; // orange
    } else {
      puck.color = '#202124'; // black grey
    }
  } else if (consumables.bombEffectCount === 1) {
    if (consumables.rocketEffectCount === 0) {
      puck.color = '#ff4500';
    } else {
      puck.color = '#8a0303';
    }
  } else if (consumables.bombEffectCount > 1) {
    puck.color = '#8a0303';
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
    consumables.bombEffectCount = 0;
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

function winner() {
    let start = createStartButton();
    if (start) {
      const startButton = document.getElementById("startButton");
      startButton.textContent = "Play Again?"
      startButton.style.left = "35vw";
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
