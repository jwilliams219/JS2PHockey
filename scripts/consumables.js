'use strict';

function createConsumable(consumables, consumable) {
    let randomX = getRandomInt(50, overlay.width - 50);
    let randomY = getRandomInt(overlay.height/4, overlay.height*3/4);
    if (consumable === "rocket") {
      consumables.rockets.push({ x: randomX, y: randomY, r: 15 })
    } else if (consumable === "bomb") {
      consumables.bombs.push({ x: randomX, y: randomY, r: 15 })
    }
}

// Part of bomb visual effect.
function createRedBomb(consumables, bomb) {
    consumables.redBombs.push({ x: bomb.x, y: bomb.y, r: bomb.r, lifetime: 200, startParticles: true })
}

// Update conmsumable spawn timers.
function updateConsumableTimers(consumables, timers, elapsedTime, particles) {
    if (timers.resetTime <= 0) {
        // Create the consumables at spawn times.
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
    // Update the timer for red bomb animations.
    let remove = []
    for (let i = 0; i < consumables.redBombs.length; i++) {
        consumables.redBombs[i].lifetime -= elapsedTime;
        if (consumables.redBombs[i].lifetime < 0) {
            remove.push(i);
        }
        if (consumables.redBombs[i].lifetime < 50 && consumables.redBombs[i].startParticles) { // Start particle animation before red bomb expiration.
            particleSystem.createBombParticles(consumables.redBombs[i], particles);
            consumables.redBombs[i].startParticles = false;
        } 
    }
    for (let i = remove.length-1; i > -1; i--) {
        consumables.redBombs.splice(remove[i], 1);
    }
    remove.length = 0;
}

function rocketEffect(puck, timers, consumables) {
    timers.resetTime = 100; // Pause for tenth of second to ignite rocket.
    consumables.rocketEffectCount += 1;
    increaseSpeedPercent(puck, 30); // Increase puck speed by 30%.

    // Get new random direction velocities based on speed, toward other players side.
    const currentSpeed = Math.sqrt(puck.velX**2 + puck.velY**2);
    if (puck.velY > 0) {
        setRandomVelocities(puck, currentSpeed, 45, 135);
    } else {
        setRandomVelocities(puck, currentSpeed, 225, 315);
    } 
}

function bombEffect(puck, timers, bomb, consumables) {
    consumables.bombEffectCount += 1;
    timers.resetTime = 250; // Pause puck for a quarter second.
    timers.bombExpireTime = 3000; // Effect lasts for 3 seconds.
    increaseSpeedPercent(puck, 50); // Increase puck speed by 50%.

    // Get new random direction velocities based on speed, toward last players own side.
    const currentSpeed = Math.sqrt(puck.velX**2 + puck.velY**2);
    if (puck.velY > 0) {
        setRandomVelocities(puck, currentSpeed, 225, 315);
    } else {
        setRandomVelocities(puck, currentSpeed, 45, 135);
    }
    // Show red bomb for a moment, then disappear and particle creation.
    createRedBomb(consumables, bomb);
}

function createRocketExhaustParticles(puck, particles, consumables) {
  if (consumables.rocketEffectCount > 0) {
    particleSystem.createRocketParticles(puck, particles, "normal");
  }
}

// Rocket effects only last until it hits paddle.
function endRocketEffects(puck, consumables) {
    for (let i = 0; i < consumables.rocketEffectCount; i++) {
        reverseSpeedIncreasePercent(puck, 30);
    }
    consumables.rocketEffectCount = 0;
}

function endBombEffects(puck, timers, consumables) {
    timers.bombExpireTime = 0;
    for (let i = 0; i < consumables.bombEffectCount; i++) {
        reverseSpeedIncreasePercent(puck, 50); // Reverse consumable speed up when it is worn off.
    }
    consumables.bombEffectCount = 0;
}
