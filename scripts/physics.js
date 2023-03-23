'use strict';


// Calculate if intersection between puck and paddle circles, then address collision.
function checkRoundEdgeCollision(puck, x, y, r) {
    let distance = distanceBetweenPoints(puck.x, puck.y, x, y);
    if (distance < puck.r + r) {
        let overlap = puck.r + r - distance;
        let currentSpeed =  Math.sqrt(puck.velX * puck.velX + puck.velY * puck.velY);
        let angleFromPaddle = getAngle(x, y, puck.x, puck.y);
        puck.velX = Math.cos(angleFromPaddle)*currentSpeed;
        puck.velY = Math.sin(angleFromPaddle)*currentSpeed;
        puck.x = Math.cos(angleFromPaddle)*overlap + puck.x;
        puck.y = Math.sin(angleFromPaddle)*overlap + puck.y;
        return true;
    }
    return false;
}

function collisionDetectionHandling(puck, paddle, overlay, timers) {
    // Address wall collisions.
    if (puck.x-puck.r < 0) {
        let overlap = -1*(0 - (puck.x - puck.r));
        puck.x = overlap + puck.r;
        puck.velX = -1*puck.velX;
    } else if (puck.x + puck.r > overlay.width) {
        let overlap = puck.x + puck.r - overlay.width;
        puck.x = overlay.width - overlap - puck.r;
        puck.velX = -1*puck.velX;
    }

    let paddleCollision = false;

    // Address paddle 1 collisions.
    let p1 = paddle[1];
    let p1Bottom = p1.y + (p1.width/2);
    let p1Top = p1.y - (p1.width/2);
    let p1Left = p1.x - p1.length/2;
    let p1Right = p1.x + p1.length/2;
    if (puck.y - puck.r < p1Bottom && puck.y + puck.r > p1Top && puck.x - puck.r < p1Right && puck.x + puck.r > p1Left) { // Possible Collision
        // Collision with straight edge
        let leftRadiusCenterX = p1Left + p1.width/2;
        let rightRadiusCenterX = p1Right - p1.width/2;
        if (puck.x < rightRadiusCenterX && puck.x > leftRadiusCenterX) {
            let overlap = p1Bottom - (puck.y - puck.r);
            puck.y += overlap*2;
            // Calculate a new trajectory for the puck based on where it hit the paddle.
            let impact_point = (puck.x - p1Left) / p1.length;
            let degree = -1*(impact_point*90 + 225);
            let direction = degree*Math.PI/180;
            const currentSpeed = Math.sqrt(puck.velX**2 + puck.velY**2);
            puck.velX = Math.cos(direction)*currentSpeed;
            puck.velY = Math.sin(direction)*currentSpeed;
            paddleCollision = true;
        }
        // Check collision with either rounded edge.
        else {
            paddleCollision = checkRoundEdgeCollision(puck, leftRadiusCenterX, p1.y, p1.width/2);
            paddleCollision = checkRoundEdgeCollision(puck, rightRadiusCenterX, p1.y, p1.width/2);
        }
    }

    // Address paddle 2 collisions.
    let p2 = paddle[2];
    let p2Bottom = p2.y + (p2.width/2);
    let p2Top = p2.y - (p2.width/2);
    let p2Left = p2.x - p2.length/2;
    let p2Right = p2.x + p2.length/2;
    if (puck.y - puck.r < p2Bottom && puck.y + puck.r > p2Top && puck.x - puck.r < p2Right && puck.x + puck.r > p2Left) { // Possible Collision
        // Collision with straight edge
        let leftRadiusCenterX = p2Left + p2.width/2;
        let rightRadiusCenterX = p2Right - p2.width/2;
        if (puck.x < rightRadiusCenterX && puck.x > leftRadiusCenterX) {
            let overlap = puck.y + puck.r - p2Top;
            puck.y -= overlap*2;
            // Calculate a new trajectory for the puck based on where it hit the paddle.
            let impact_point = (puck.x - p2Left) / p2.length;
            let degree = impact_point*90 + 225;
            let direction = degree*Math.PI/180;
            const currentSpeed = Math.sqrt(puck.velX**2 + puck.velY**2);
            puck.velX = Math.cos(direction)*currentSpeed;
            puck.velY = Math.sin(direction)*currentSpeed;
            paddleCollision = true;
        }
        // Collision with rounded edge
        else {
            paddleCollision = checkRoundEdgeCollision(puck, leftRadiusCenterX, p2.y, p2.width/2);
            paddleCollision = checkRoundEdgeCollision(puck, rightRadiusCenterX, p2.y, p2.width/2);
        }
    }
    if (paddleCollision) {
        endRocketEffects(puck, timers);
    }
}

function endRocketEffects(puck, timers) {
    if (timers.rocketEffectCount > 0) { // Rocket effects only last until it hits paddle.
        for (let i = 0; i < timers.rocketEffectCount; i++) {
            reverseSpeedIncreasePercent(puck, 50);
        }
        timers.rocketEffectCount = 0; 
    }
}

function consumableCollisionDetection(puck, consumables, timers, particles) {
    let rocketCollisions = [];
    let bombCollisions = [];
    let rockets = consumables.rockets;
    let bombs = consumables.bombs;

    // Rockets
    for (let i = 0; i < rockets.length; i++) {
        if (distanceBetweenPoints(puck.x, puck.y, rockets[i].x, rockets[i].y) < rockets[i].r + puck.r) {
            rocketCollisions.push(i);
            rocketEffect(puck, timers);
        }
    }
    // Bombs
    for (let i = 0; i < bombs.length; i++) {
        if (distanceBetweenPoints(puck.x, puck.y, bombs[i].x, bombs[i].y) < bombs[i].r + puck.r) {
            bombCollisions.push(i);
            bombEffect(puck, timers, bombs[i], particles);
        }
    }

    // Remove consumable after effect.
    rocketCollisions = rocketCollisions.reverse();
    bombCollisions = bombCollisions.reverse();
    for (let i = 0; i < rocketCollisions.length; i++) {
        rockets.splice(rocketCollisions[i], 1);
    }
    for (let i = 0; i < bombCollisions.length; i++) {
        bombs.splice(bombCollisions[i], 1);
    }
}

function rocketEffect(puck, timers) {
    timers.resetTime = 100; // Pause for tenth of second to ignite rocket.
    timers.rocketEffectCount += 1;
    increaseSpeedPercent(puck, 50); // Increase puck speed by 50%.

    // Get new random direction velocities based on speed, toward other players side.
    const currentSpeed = Math.sqrt(puck.velX**2 + puck.velY**2);
    if (puck.velY > 0) {
        setRandomVelocities(puck, currentSpeed, 45, 135);
    } else {
        setRandomVelocities(puck, currentSpeed, 225, 315);
    }
}

function bombEffect(puck, timers, bomb, particles) {
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
    createBombParticles(bomb, particles);
}

// Get random direction velocities that add up to the given speed between degree min, max.
function setRandomVelocities(puck, speed, min, max) {
    const direction = getRandomInt(min, max)*Math.PI/180;
    puck.velX = Math.cos(direction)*speed;
    puck.velY = Math.sin(direction)*speed;
}

// Get random direction velocities that can be within 45 degrees of each players direction.
function setHalfRandomVelocities(puck, speed) {
    if (Math.random() < 0.5) {
        var degrees = getRandomInt(45, 135);
    } else {
        var degrees = getRandomInt(225, 315);
    }
    const direction = degrees*Math.PI/180;
    puck.velX = Math.cos(direction)*speed;
    puck.velY = Math.sin(direction)*speed;
}

function increaseSpeedPercent(puck, percentIncrease) {
    const currentSpeed = Math.sqrt(puck.velX**2 + puck.velY**2);
    const newSpeed = currentSpeed * (1 + percentIncrease/100);
    puck.velX  = (newSpeed / currentSpeed) * puck.velX;
    puck.velY = (newSpeed / currentSpeed) * puck.velY;
}

function increaseSpeedFromInitial(puck, percentIncrease) {
    const currentSpeed = Math.sqrt(puck.velX**2 + puck.velY**2);
    const newSpeed = currentSpeed + (puck.initialSpeed * percentIncrease / 100);
    puck.velX = (newSpeed / currentSpeed) * puck.velX;
    puck.velY = (newSpeed / currentSpeed) * puck.velY;
}

function reverseSpeedIncreasePercent(puck, percentIncrease) {
    const currentSpeed = Math.sqrt(puck.velX ** 2 + puck.velY ** 2);
    const newSpeed = currentSpeed / (1 + percentIncrease / 100);
    const speedRatio = newSpeed / currentSpeed;
    puck.velX = puck.velX * speedRatio;
    puck.velY = puck.velY * speedRatio;
}
