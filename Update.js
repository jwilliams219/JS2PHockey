'use strict';


// Update scores when necessary.
function updateScore(overlay, scorePoint, score, puck, timers) {
    if (scorePoint[0] === true) {
        if (scorePoint[1] === 1) {
          score.player1 += 1;
        } else if (scorePoint[1] === 2) {
          score.player2 += 1;
        }
        score.newRender = true;
        resetPuck(overlay, puck, timers, score);
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

function createConsumable(consumables, consumable) {
    let randomX = getRandomInt(50, overlay.width - 50);
    let randomY = getRandomInt(overlay.height/4, overlay.height*3/4);
    if (consumable === "rocket") {
      consumables.rockets.push({ x: randomX, y: randomY, r: 15 })
    } else if (consumable === "bomb") {
      consumables.bombs.push({ x: randomX, y: randomY, r: 15 })
    }
}

// Update conmsumable spawn timers.
function updateConsumableTimers(consumables, timers, elapsedTime) {
    if (timers.resetTime <= 0) {
        timers.rocket -= elapsedTime;
        if (timers.rocket < 0) {
          createConsumable(consumables, "rocket");
          timers.rocket = timers.totalRocketSpawnTime;
        }
        timers.bomb -= elapsedTime;
        if (timers.bomb < 0) {
          createConsumable(consumables, "bomb");
          timers.bomb = timers.totalBombSpawnTime;
        }
    }
}

// Increase puck speed after time.
function longGameSpeedUp(puck, timers) {
    if (Math.floor(timers.timeSinceScore/1000) > timers.lastSpeedIncrease) {
        timers.lastSpeedIncrease = Math.floor(timers.timeSinceScore/1000) + 1;
        increaseSpeedPercent(puck, 0.5);
    }
}

// Update the puck location, collisions, timers, consumables effects.
function updatePuck(overlay, puck, paddle, consumables, timers, elapsedTime) {
    timers.timeSinceScore += elapsedTime;
    if (timers.resetTime > 0) {
        timers.resetTime -= elapsedTime;
    } else {
        if (timers.bombExpireTime > 0) {
            timers.bombExpireTime -= elapsedTime;
        } else if (timers.bombExpireTime < 0) {
            timers.bombExpireTime = 0;
            reverseSpeedIncreasePercent(puck, 50); // Reverse consumable speed up when it is worn off.
        }
        // Update the puck location and address collisions.
        puck.x = puck.x + (puck.velX*elapsedTime/1000);
        puck.y = puck.y + (puck.velY*elapsedTime/1000);
        consumableCollisionDetection(puck, consumables, timers);
        collisionDetectionHandling(puck, paddle, overlay, timers); // Main collision physics.
    }
    return pointDetection(puck, overlay);
}

function resetPuck(overlay, puck, timers, score) {
    setHalfRandomVelocities(puck, puck.initialSpeed);
    let speedUp = 4 * (score.player1 + score.player2);
    increaseSpeedFromInitial(puck, speedUp); // Speed increases slightly each round.
    puck.x = overlay.width/2;
    puck.y = overlay.height/2
    timers.resetTime = 750;
    timers.bombExpireTime = 0;
    timers.rocketEffectCount = 0;
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
