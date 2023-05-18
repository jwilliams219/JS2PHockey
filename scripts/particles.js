'use strict';

let particleSystem = (function() {

    let smokeImg = graphics.loadSmoke2();
    let fireImg1 = graphics.loadFire1();
    let fireImg2 = graphics.loadFire2();
    let fireImg3 = graphics.loadFire3();
    let fireBlue = graphics.loadFireBlue();

    function createBombParticles(bomb, particles) {
        let particle = { 
            size: { mean: 8, stdev: 3 },
            speed: { mean: 75, stdev: 35 }}

        for (let i = 0; i < 30; i++) { // Create fire particles 1
            let x = getRandomInt(Math.round(bomb.x-20), Math.round(bomb.x+20));
            let y = getRandomInt(Math.round(bomb.y-20), Math.round(bomb.y+20));
            let size = nextGaussian(particle.size.mean, particle.size.stdev);
            particles.push( { 
                center: { x: x, y: y },
                size: { width: size, height: size },
                direction: nextCircleVector(),
                speed: nextGaussian(particle.speed.mean, particle.speed.stdev),
                rotation: 0,
                lifetime: nextGaussian(700, 200),
                alive: 0,
                image: fireImg1
            })
        }
        for (let i = 0; i < 20; i++) { // Create fire particles 2
            let x = getRandomInt(Math.round(bomb.x-20), Math.round(bomb.x+20));
            let y = getRandomInt(Math.round(bomb.y-20), Math.round(bomb.y+20));
            let size = nextGaussian(particle.size.mean, particle.size.stdev);
            particles.push( { 
                center: { x: x, y: y },
                size: { width: size, height: size },
                direction: nextCircleVector(),
                speed: nextGaussian(120, 45),
                rotation: 0,
                lifetime: nextGaussian(500, 200),
                alive: 0,
                image: fireImg2
            })
        }
        for (let i = 0; i < 50; i++) { // Create fire particles 3
            let x = getRandomInt(Math.round(bomb.x-20), Math.round(bomb.x+20));
            let y = getRandomInt(Math.round(bomb.y-20), Math.round(bomb.y+20));
            let size = nextGaussian(particle.size.mean, particle.size.stdev);
            particles.push( { 
                center: { x: x, y: y },
                size: { width: size, height: size },
                direction: nextCircleVector(),
                speed: nextGaussian(120, 45),
                rotation: 0,
                lifetime: nextGaussian(500, 200),
                alive: 0,
                image: fireImg3
            })
        }
        for (let i = 0; i < 30; i++) { // Create smoke particles
            let x = getRandomInt(Math.round(bomb.x-20), Math.round(bomb.x+20));
            let y = getRandomInt(Math.round(bomb.y-20), Math.round(bomb.y+20));
            let size = nextGaussian(particle.size.mean, particle.size.stdev);
            particles.push( { 
                center: { x: x, y: y },
                size: { width: size, height: size },
                direction: nextCircleVector(),
                speed: nextGaussian(particle.speed.mean, particle.speed.stdev),
                rotation: 0,
                lifetime: nextGaussian(800, 200),
                alive: 0,
                image: smokeImg
            })
        }
    }

    function createRocketParticles(puck, particles, rocketType) {
        let fire;
        if (rocketType === "normal") {
            fire = fireImg2;
        } else if (rocketType === "blue") {
            fire = fireBlue;
        }
        let particle = { 
            size: { mean: 5, stdev: 2 },
            speed: { mean: 20, stdev: 5 }}

        for (let i = 0; i < 3; i++) { // Create fire particles
            let x = puck.x;
            let y = puck.y;
            let size = nextGaussian(particle.size.mean, particle.size.stdev);
            particles.push( { 
                center: { x: x, y: y },
                size: { width: size, height: size },
                direction: nextCircleVector(),
                speed: nextGaussian(40, 10),
                rotation: 0,
                lifetime: nextGaussian(175, 75),
                alive: 0,
                image: fire,
                type: "fire"
            })
        }
        for (let i = 0; i < 3; i++) {  // Create smoke particles.
            let x = puck.x;
            let y = puck.y;
            let size = nextGaussian(particle.size.mean, particle.size.stdev);
            particles.push( { 
                center: { x: x, y: y },
                size: { width: size, height: size },
                direction: nextCircleVector(),
                speed: nextGaussian(particle.speed.mean, particle.speed.stdev),
                rotation: 0,
                lifetime: nextGaussian(350, 75),
                alive: 0,
                image: smokeImg,
                type: "smoke"
            })
        }
    }

    function updateParticles(particles, elapsedTime) {
        let remove  = [];
        
        for (let i = 0; i < particles.length; i++) {
            let particle = particles[i];
            particle.alive += elapsedTime;
            particle.center.x += (elapsedTime/1000 * particle.speed * particle.direction.x);
            particle.center.y += (elapsedTime/1000 * particle.speed * particle.direction.y);
            particle.rotation += particle.speed / 500;
            if (particle.alive >= particle.lifetime) {
                remove.push(i);
            }
        }
        for (let i = remove.length-1; i > -1; i--) {
            particles.splice(remove[i], 1);
        }
        remove.length = 0;
    }

let api = {
    createBombParticles: createBombParticles,
    createRocketParticles: createRocketParticles,
    updateParticles: updateParticles,
  };

  return api;
}());