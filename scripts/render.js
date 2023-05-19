'use strict';

//const bombImageRes = [200, 241];
//const rocketImageRes = [162, 171];

let graphics = (function() {

  function drawTexture(ctx, image, center, rotation, size) {
    ctx.save();
    ctx.translate(center.x, center.y);
    ctx.rotate(rotation);
    ctx.translate(-center.x, -center.y);
    ctx.drawImage(
        image,
        center.x - size.width / 2,
        center.y - size.height / 2,
        size.width, size.height);
    ctx.restore();
  }

  function drawText(ctx, spec) {
      ctx.save();
      ctx.font = spec.font;
      ctx.fillStyle = spec.fillStyle;
      ctx.strokeStyle = spec.strokeStyle;
      ctx.stokeWidth
      ctx.textBaseline = 'top';
      ctx.translate(spec.position.x, spec.position.y);
      ctx.rotate(spec.rotation);
      ctx.translate(-spec.position.x, -spec.position.y);
      ctx.fillText(spec.text, spec.position.x, spec.position.y);
      ctx.strokeText(spec.text, spec.position.x, spec.position.y);
      ctx.restore();
  }
  
  function drawParticle(canvas, particle) {
    let ctx = canvas.getContext("2d");
    ctx.save();
    ctx.translate(particle.center.x, particle.center.y);
    ctx.rotate(particle.rotation);
    ctx.translate(-particle.center.x, -particle.center.y);
    ctx.drawImage(
        particle.image,
        particle.center.x - particle.size.width / 2,
        particle.center.y - particle.size.height / 2,
        particle.size.width, particle.size.height);
    ctx.restore();
  }
  
  function drawParticles(canvas, particles) {
    for (let i =0; i < particles.length; i++) {
      if (particles[i].image.isReady) {
        drawParticle(canvas, particles[i]);
      }
    }
  }

  function drawPuck(canvas, puck) {
    let ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(puck.x, puck.y, puck.r, 0, 2*Math.PI, false);
    ctx.fillStyle = puck.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = "2";
    ctx.stroke()
  }
  
  function drawPaddle(canvas, paddle) { // Do I want to made the size dynamic on screen size?
    let ctx = canvas.getContext("2d");
    ctx.beginPath();
    ctx.lineWidth = "2";  //???
    if (navigator.userAgent.indexOf("Firefox") != -1) {
      ctx.rect(paddle.x-(paddle.length/2), paddle.y-(paddle.width/2), paddle.length, paddle.width); 
    } else {
      ctx.roundRect(paddle.x-(paddle.length/2), paddle.y-(paddle.width/2), paddle.length, paddle.width, paddle.width/2)
    }
    ctx.fillStyle = paddle.color;
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = "2";
    ctx.stroke();
  }
  
  function drawRocket(canvas, rocket, img) {
    let ctx = canvas.getContext('2d');
    if (img.isReady) {
      ctx.drawImage(img, rocket.x - 16, rocket.y - 17, 32, 34);
    }
  }

  function drawRockets(canvas, rockets, img) {
    for (let i = 0; i < rockets.length; i++) {
      drawRocket(canvas, rockets[i], img);
    }
  }

  function drawBlueRockets(canvas, rockets, img, stats, blueRocketOpacity) { // Need to refactor this section and textures in general.
    let ctx = canvas.getContext('2d');
    let opacity = blueRocketOpacity.currentOpacity;
    for (let i = 0; i < rockets.length; i++) {
      let rocket = rockets[i];
      if (img.isReady) {
        ctx.save();
        ctx.globalAlpha = opacity;
        ctx.drawImage(img, rocket.x - 16, rocket.y - 17, 32, 34);
        ctx.restore();
      }
    }
    let overlay = document.getElementById("overlay");
    if (stats.blueRockets.player1 > 0 && img.isReady) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(overlay.width/20, overlay.height/2 - (overlay.height/10))
      ctx.rotate(Math.PI);
      ctx.drawImage(img, -16, -17, 32, 34);
      ctx.globalAlpha = 0.5;
      ctx.lineWidth = 1;
      drawText(ctx, {font: '12px Arial', fillStyle: 'white', strokeStyle: 'white', position: {x: 15, y: 10}, rotation: 0, text: '' + stats.blueRockets.player1});
      ctx.restore();
    }
    if (stats.blueRockets.player2 > 0 && img.isReady) {
      ctx.save();
      ctx.globalAlpha = opacity;
      ctx.translate(overlay.width/20, overlay.height/2 + (overlay.height/10))
      ctx.drawImage(img, -16, -17, 32, 34);
      ctx.globalAlpha = 1;
      ctx.lineWidth = 1;
      drawText(ctx, {font: '12px Arial', fillStyle: 'white', strokeStyle: 'white', position: {x: 15, y: 10}, rotation: 0, text: '' + stats.blueRockets.player2});
      ctx.restore();
    }
  }
  
  function drawBomb(canvas, bomb, img) {
    let ctx = canvas.getContext('2d');
    if (img.isReady) {
      ctx.drawImage(img, bomb.x - 26, bomb.y - 32, 52, 64);
    }
  }

  function drawBombs(canvas, bombs, img) {
    for (let i = 0; i < bombs.length; i++) {
      drawBomb(canvas, bombs[i], img);
    }
  }
  
  function drawScores(canvas, score) {
    const canvas1 = canvas.canvas1;
    const ctx1 = canvas.ctx1;
    const canvas2 = canvas.canvas2;
    const ctx2 = canvas.ctx2;
    ctx1.clearRect(0, 0, canvas1.width, canvas1.height);
    ctx2.clearRect(0, 0, canvas2.width, canvas2.height);
    ctx1.font = '20px Arial';
    ctx1.save();
    ctx1.translate(21, canvas1.height -29);
    ctx1.rotate(Math.PI);
    ctx1.fillStyle = 'white';
    ctx1.fillText(score.player1, 0, 0);
    ctx1.restore();
    ctx2.font = '20px Arial';
    ctx2.fillStyle = 'white';
    ctx2.fillText(score.player2, 10, 30);
    score.newRender = false;
  }
  
  function drawCountdown(canvas, timers) {
    let ctx = canvas.getContext('2d');
    let time = Math.round(timers.resetTime/1000);
    ctx.font = '24px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(time, canvas.width/2, canvas.height/2);
  }

  let api = {
    drawParticles: drawParticles,
    drawPuck: drawPuck,
    drawPaddle: drawPaddle,
    drawRockets: drawRockets,
    drawBlueRockets: drawBlueRockets,
    drawBombs: drawBombs,
    drawScores: drawScores,
    drawCountdown: drawCountdown,
  };

  return api;
}());
