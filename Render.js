'use strict';


// Math to check if a point is in an arc.
function checkInCircle(x, y, arc) {
    if ((Math.pow(x-arc[0], 2) + Math.pow(y-arc[1], 2)) < (Math.pow(arc[2], 2))) {
      return true;
    }
    return false;
  }
  
  function drawPuck(canvas, puck) {
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(puck.x, puck.y, puck.radius, 0, 2*Math.PI, false);
    ctx.fillStyle = 'black';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.stroke()
  }
  
  function drawPaddle(canvas, paddle) { // Do I want to made the size dynamic on screen size?
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "3";
    ctx.roundRect(paddle.x-(paddle.length/2), paddle.y-(paddle.width/2), paddle.length, paddle.width, paddle.width/2)
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.stroke();
  }
  
  function movePaddle(e, canvas, paddle) {
    let width = canvas.width;
    let x = e.targetTouches[0].clientX;
    if (x < 40) {
      x = 40;
    }
    else if (x > width-40) {
      x = width-40
    }
    paddle.x = x;
  }
  