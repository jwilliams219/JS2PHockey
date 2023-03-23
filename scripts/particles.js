'use strict';

let smokeImg = graphics.loadSmoke2();
let fireImg1 = graphics.loadFire1();
let fireImg2 = graphics.loadFire2();

function createBombParticles(bomb, particles) {
    let particle = { 
        size: { mean: 10, stdev: 2 },
        speed: { mean: 60, stdev: 25 }}

    for (let i = 0; i < 10; i++) {
        let x = getRandomInt(Math.round(bomb.x-15), Math.round(bomb.x+15));
        let y = getRandomInt(Math.round(bomb.y-15), Math.round(bomb.y+15));
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
    for (let i = 0; i < 20; i++) {
        let x = getRandomInt(Math.round(bomb.x-15), Math.round(bomb.x+15));
        let y = getRandomInt(Math.round(bomb.y-15), Math.round(bomb.y+15));
        let size = nextGaussian(particle.size.mean, particle.size.stdev);
        particles.push( { 
            center: { x: x, y: y },
            size: { width: size, height: size },
            direction: nextCircleVector(),
            speed: nextGaussian(100, 25),
            rotation: 0,
            lifetime: nextGaussian(500, 200),
            alive: 0,
            image: fireImg2
        })
    }
    for (let i = 0; i < 10; i++) {
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
            image: smokeImg
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

        if (particle.alive > particle.lifetime) {
            remove.push(i);
        }
    }
    for (let i = remove.length-1; i > -1; i--) {
        particles.splice(i, 1);
    }
    remove.length = 0;
}