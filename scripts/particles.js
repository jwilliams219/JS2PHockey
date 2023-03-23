'use strict';

let smokeImg = graphics.loadSmoke2();
let fireImg1 = graphics.loadFire1();
let fireImg2 = graphics.loadFire2();

function createBombParticles(bomb, particles) {
    let particle = { 
        size: { mean: 10, stdev: 2 },
        speed: { mean: 60, stdev: 25 }}

    for (let i = 0; i < 15; i++) {
        let x = getRandomInt(Math.round(bomb.x-15), Math.round(bomb.x+15));
        let y = getRandomInt(Math.round(bomb.y-15), Math.round(bomb.y+15));
        let size = nextGaussian(particle.size.mean, particle.size.stdev);
        particles.push( { 
            center: { x: x, y: y },
            size: { width: size, height: size },
            direction: nextCircleVector(),
            speed: nextGaussian(particle.speed.mean, particle.speed.stdev),
            rotation: 0,
            lifetime: nextGaussian(800, 200),
            alive: 0,
            image: fireImg1
        })
    }
    for (let i = 0; i < 30; i++) {
        let x = getRandomInt(Math.round(bomb.x-15), Math.round(bomb.x+15));
        let y = getRandomInt(Math.round(bomb.y-15), Math.round(bomb.y+15));
        let size = nextGaussian(particle.size.mean, particle.size.stdev);
        particles.push( { 
            center: { x: x, y: y },
            size: { width: size, height: size },
            direction: nextCircleVector(),
            speed: nextGaussian(100, 25),
            rotation: 0,
            lifetime: nextGaussian(600, 200),
            alive: 0,
            image: fireImg2
        })
    }
    for (let i = 0; i < 15; i++) {
        let x = getRandomInt(Math.round(bomb.x-15), Math.round(bomb.x+15));
        let y = getRandomInt(Math.round(bomb.y-15), Math.round(bomb.y+15));
        let size = nextGaussian(particle.size.mean, particle.size.stdev);
        particles.push( { 
            center: { x: x, y: y },
            size: { width: size, height: size },
            direction: nextCircleVector(),
            speed: nextGaussian(particle.speed.mean, particle.speed.stdev),
            rotation: 0,
            lifetime: nextGaussian(900, 200),
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
        fire = fireImg3;
    }
    let particle = { 
        size: { mean: 5, stdev: 2 },
        speed: { mean: 20, stdev: 5 }}

    for (let i = 0; i < 3; i++) {
        let x = puck.x;
        let y = puck.y;
        let size = nextGaussian(particle.size.mean, particle.size.stdev);
        particles.push( { 
            center: { x: x, y: y },
            size: { width: size, height: size },
            direction: nextCircleVector(),
            speed: nextGaussian(40, 10),
            rotation: 0,
            lifetime: nextGaussian(150, 75),
            alive: 0,
            image: fire,
            type: "fire"
        })
    }
    for (let i = 0; i < 3; i++) { 
        let x = puck.x;
        let y = puck.y;
        let size = nextGaussian(particle.size.mean, particle.size.stdev);
        particles.push( { 
            center: { x: x, y: y },
            size: { width: size, height: size },
            direction: nextCircleVector(),
            speed: nextGaussian(particle.speed.mean, particle.speed.stdev),
            rotation: 0,
            lifetime: nextGaussian(300, 75),
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