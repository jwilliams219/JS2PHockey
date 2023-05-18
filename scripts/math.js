'use strict';


function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random()*(max - min) + min);
}

function distanceBetweenPoints(x1, y1, x2, y2) {
    let deltaX = x2 - x1;
    let deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
}

function calculatePointAlongLine(point1, point2, distance) {
    const [x1, y1] = point1;
    const [x2, y2] = point2;
    
    const totalDistance = distanceBetweenPoints(x1, y1, x2, y2);
    const ratio = distance / totalDistance;
    
    const endpointX = x1 + (x2 - x1) * ratio;
    const endpointY = y1 + (y2 - y1) * ratio;
    
    return [endpointX, endpointY];
}

function getAngle(x1, y1, x2, y2) {
    const dx = x2 - x1;
    const dy = y2 - y1;
    return Math.atan2(dy, dx);
}

function nextCircleVector() {
    let angle = Math.random() * 2 * Math.PI;
    return {
        x: Math.cos(angle),
        y: Math.sin(angle)
    };
}

function nextGaussian(mean, stdDev) {
    let x1 = 0;
    let x2 = 0;
    let y1 = 0;
    let y2 = 0;
    let z = 0;

    do {
        x1 = 2 * Math.random() - 1;
        x2 = 2 * Math.random() - 1;
        z = (x1 * x1) + (x2 * x2);
    } while (z >= 1);
    
    z = Math.sqrt((-2 * Math.log(z)) / z);
    y1 = x1 * z;
    y2 = x2 * z;
    
    return mean + y1 * stdDev;
}
