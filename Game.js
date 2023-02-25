'use strict';


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
  if (puck.y - puck.radius < p1Bottom && puck.y + puck.radius > p1Top && puck.x < (p1.x + p1.length/2) && puck.x > (p1.x - p1.length/2)) { // Possible Collision
    // Collision with straight edge
    if (puck.x < (p1.x + p1.length/2 - p1.width/2) && puck.x > (p1.x - p1.length/2 + p1.width/2)) {
      let overlap = p1Bottom - (puck.y - puck.radius);
      puck.y = p1Bottom + overlap;
      puck.velY = -1 * puck.velY;
    }
    // Collision with rounded edge
    else {
      let dx = Math.abs(puck.x - p1.x);
      let dy = Math.abs(puck.y - p1.y);
      if (dx > p1.length / 2 + puck.radius) return;
      if (dy > p1.width / 2 + puck.radius) return;
      if (dx <= p1.length / 2 || dy <= p1.width / 2) {
        let angle = Math.atan2(dy, dx);
        let angle1 = Math.atan2(p1.width / 2, p1.length / 2);
        let angle2 = Math.atan2(-p1.width / 2, p1.length / 2);
        if (angle > angle1 || angle < angle2) {
          let overlap = puck.radius - Math.sqrt(dx * dx + dy * dy);
          let newVelX = Math.abs(puck.velX) * Math.cos(angle);
          let newVelY = -Math.abs(puck.velY) * Math.sin(angle);
          puck.x += Math.sign(puck.velX) * overlap * Math.cos(angle);
          puck.y -= overlap * Math.sin(angle);
          puck.velX = Math.sign(puck.velX) * newVelX;
          puck.velY = newVelY;
        }
      }
    }
  }

  let p2Bottom = p2.y + (p2.width/2) + overlay.height/2;
  let p2Top = p2.y - (p2.width/2) + overlay.height/2;
  if (puck.y - puck.radius < p2Bottom && puck.y + puck.radius > p2Top && puck.x < (p2.x + p2.length/2) && puck.x > (p2.x - p2.length/2)) { // Possible Collision
    // Collision with straight edge
    if (puck.x < (p2.x + p2.length/2 - p2.width/2) && puck.x > (p2.x - p2.length/2 + p2.width/2)) {
      let overlap = puck.y + puck.radius - p2Top;
      puck.y = p2Top - overlap;
      puck.velY = -1 * puck.velY;
    }
    // Collision with rounded edge
  }
}

function updatePuck(elapsedTime, puck, paddle, overlay) {
  puck.x = puck.x + (puck.velX*elapsedTime/1000);
  puck.y = puck.y + (puck.velY*elapsedTime/1000);
  collisionDetection(puck, paddle, overlay);
}

// Get random direction velocities that add up to the given speed.
function getRandomDirectionVelocities(speed) {
  const direction = Math.random() * 2 * Math.PI;
  const velX = Math.cos(direction) * speed;
  const velY = Math.sin(direction) * speed;
  return {"x": velX, "y": velY};
}

function game() {
  var prevTime;
  var paddle = {};
  var puck = {};
  const canvas1 = document.getElementById("canvas1");
  const canvas2 = document.getElementById("canvas2");
  const overlay = document.getElementById("overlay");
  const ctx1 = canvas1.getContext('2d');
  const ctx2 = canvas2.getContext('2d');
  const ctxOver = overlay.getContext('2d');
  const p1 = document.getElementById("p1");
  const p2 = document.getElementById("p2");
  const initialSpeed = 100;
  const initialVelocity = getRandomDirectionVelocities(initialSpeed);
  const puckRadius = 15;
  const paddleLength = 80;
  const paddleWidth = 16;

  function initializeGame() {

    let domRect1 = p1.getBoundingClientRect();
    let domRect2 = p2.getBoundingClientRect();
    canvas1.height = domRect1["height"];
    canvas1.width = domRect1["width"];
    canvas2.height = domRect2["height"];
    canvas2.width = domRect2["width"];
    overlay.height = domRect1["height"]*2;
    overlay.width = domRect1["width"];
    
    paddle = {
      1: { "x": canvas1.width/2, "y": 50, "color": "red", "length": paddleLength, "width": paddleWidth },
      2: { "x": canvas2.width/2, "y": canvas2.height-50, "color": "blue", "length": paddleLength, "width": paddleWidth }
    }
    puck = { "x": canvas1.width/2, "y": canvas1.height, "velX": initialVelocity.x, "velY": initialVelocity.y, "radius": puckRadius };

    drawPaddle(canvas1, paddle[1].x, paddle[1].y);
    drawPaddle(canvas2, paddle[2].x, paddle[2].y);
    canvas1.addEventListener('touchstart', (e) => movePaddle(e, canvas1, paddle[1]));
    canvas2.addEventListener('touchstart', (e) => movePaddle(e, canvas2, paddle[2]));
    canvas1.addEventListener('touchmove', (e) => movePaddle(e, canvas1, paddle[1]));
    canvas2.addEventListener('touchmove', (e) => movePaddle(e, canvas2, paddle[2]));
    
    prevTime = performance.now();
    gameLoop(performance.now());
  }
  
  function gameLoop(time) {
    let elapsedTime = time - prevTime;
    prevTime = time;
    
    let input = getInput();
    let end = update(input, elapsedTime);
    
    if (!end) {
      render();
      requestAnimationFrame(gameLoop);
    }
    else {
      winner();
    }
  }

  function getInput() {
    
  }

  function update(input, elapsedTime) {
    updatePuck(elapsedTime, puck, paddle, overlay);
  }

  function render() {
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctxOver.clearRect(0, 0, overlay.width, overlay.height);
    drawPaddle(canvas1, paddle[1]);
    drawPaddle(canvas2, paddle[2]);
    drawPuck(overlay, puck);
  }

  function winner() {
    
  }
  initializeGame();
}

function initialize() {
  let newGame = game();
}

initialize();