'use strict'


function distanceBetweenPoints(x1, y1, x2, y2) {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function getAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.atan2(dy, dx);
}

function pointDetection(puck, overlay) {
    if (puck.y - puck.radius < 0) {
        return [true, 2];
    } else if (puck.y + puck.radius > overlay.height) {
        return [true, 1];
    }
    return [false, 0];
}

// Calculate if intersection between puck and paddle circles, then address collision.
function checkRoundEdgeCollision(puck, x, y, r) {
    let distance = distanceBetweenPoints(puck.x, puck.y, x, y);
    if (distance < puck.radius + r) {
        let overlap = puck.radius + r - distance;
        let currentSpeed =  Math.sqrt(puck.velX * puck.velX + puck.velY * puck.velY);
        let angleFromPaddle = getAngle(x, y, puck.x, puck.y);
        puck.velX = Math.cos(angleFromPaddle)*currentSpeed;
        puck.velY = Math.sin(angleFromPaddle)*currentSpeed;
        puck.x = Math.cos(angleFromPaddle)*overlap + puck.x;
        puck.y = Math.sin(angleFromPaddle)*overlap + puck.y;
    }
}

function collisionDetection(puck, paddle, overlay) {
    // Address wall collisions.
    if (puck.x-puck.radius < 0) {
        let overlap = -1*(0 - (puck.x - puck.radius));
        puck.x = overlap + puck.radius;
        puck.velX = -1*puck.velX;
    } else if (puck.x + puck.radius > overlay.width) {
        let overlap = puck.x + puck.radius - overlay.width;
        puck.x = overlay.width - overlap - puck.radius;
        puck.velX = -1*puck.velX;
    }

    // Address paddle collisions.
    let p1 = paddle[1];
    let p2 = paddle[2];

    let p1Bottom = p1.y + (p1.width/2);
    let p1Top = p1.y - (p1.width/2);
    if (puck.y - puck.radius < p1Bottom && puck.y + puck.radius > p1Top && 
        puck.x - puck.radius < (p1.x + p1.length/2) && puck.x + puck.radius > (p1.x - p1.length/2)) { // Possible Collision
        // Collision with straight edge
        let leftRadiusCenterX = p1.x - p1.length/2 + p1.width/2;
        let rightRadiusCenterX = p1.x + p1.length/2 - p1.width/2;
        if (puck.x < rightRadiusCenterX && puck.x > leftRadiusCenterX) {
            let overlap = p1Bottom - (puck.y - puck.radius);
            puck.y = p1Bottom + overlap + puck.radius;
            puck.velY = -1 * puck.velY;
        }
        // Check collision with either rounded edge.
        else {
            checkRoundEdgeCollision(puck, leftRadiusCenterX, p1.y, p1.width/2);
            checkRoundEdgeCollision(puck, rightRadiusCenterX, p1.y, p1.width/2);
            
            // Address wall collisions again. This(and one below) might not be completely necessary?
            if (puck.x-puck.radius < 0) {
                let overlap = -1*(0 - (puck.x - puck.radius));
                puck.x = overlap + puck.radius;
                puck.velX = -1*puck.velX;
            } else if (puck.x + puck.radius > overlay.width) {
                let overlap = puck.x + puck.radius - overlay.width;
                puck.x = overlay.width - overlap - puck.radius;
                puck.velX = -1*puck.velX;
            }
        }
    }

    let p2Bottom = p2.y + (p2.width/2);
    let p2Top = p2.y - (p2.width/2);
    if (puck.y - puck.radius < p2Bottom && puck.y + puck.radius > p2Top && 
        puck.x - puck.radius < (p2.x + p2.length/2) && puck.x + puck.radius > (p2.x - p2.length/2)) { // Possible Collision
        // Collision with straight edge
        let leftRadiusCenterX = p2.x - p2.length/2 + p2.width/2;
        let rightRadiusCenterX = p2.x + p2.length/2 - p2.width/2;
        if (puck.x < rightRadiusCenterX && puck.x > leftRadiusCenterX) {
            let overlap = puck.y + puck.radius - p2Top;
            puck.y = p2Top - overlap - puck.radius;
            puck.velY = -1 * puck.velY;
        }
        // Collision with rounded edge
        else {
            checkRoundEdgeCollision(puck, leftRadiusCenterX, p2.y, p2.width/2);
            checkRoundEdgeCollision(puck, rightRadiusCenterX, p2.y, p2.width/2);
            
            // Address wall collisions again.
            if (puck.x-puck.radius < 0) {
                let overlap = -1*(0 - (puck.x - puck.radius));
                puck.x = overlap + puck.radius;
                puck.velX = -1*puck.velX;
            } else if (puck.x + puck.radius > overlay.width) {
                let overlap = puck.x + puck.radius - overlay.width;
                puck.x = overlay.width - overlap - puck.radius;
                puck.velX = -1*puck.velX;
            }
        }
    }
}

function updatePuck(elapsedTime, puck, paddle, overlay) {
    if (puck.resetTime > 0) {
        puck.resetTime = puck.resetTime - elapsedTime;
    } else {
        puck.x = puck.x + (puck.velX*elapsedTime/1000);
        puck.y = puck.y + (puck.velY*elapsedTime/1000);
        collisionDetection(puck, paddle, overlay);
    }
    return pointDetection(puck, overlay);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max - min) + min);
}

// Get random direction velocities that add up to the given speed.
function getRandomDirectionVelocities(speed) {
    const direction = Math.random()*2*Math.PI;
    const velX = Math.cos(direction)*speed;
    const velY = Math.sin(direction)*speed;
    return {"x": velX, "y": velY};
}

function getInitialVelocities(speed) {
    if (Math.random() < 0.5) {
        var degrees = getRandomInt(45, 135);
    } else {
        var degrees = getRandomInt(225, 315);
    }
    const direction = degrees*Math.PI/180;
    const velX = Math.cos(direction)*speed;
    const velY = Math.sin(direction)*speed;
    return {"x": velX, "y": velY};
}

function resetPuck(puck, speed, overlay) {
    let initialVelocity = getInitialVelocities(speed);
    puck.x = overlay.width/2;
    puck.y = overlay.height/2
    puck.velX = initialVelocity.x;
    puck.velY = initialVelocity.y;
    puck.resetTime = 500;
}