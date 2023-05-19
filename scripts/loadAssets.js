'use strict';


let loadAssets = (function() {

  function smokeImg() {
    let imgSmoke = new Image();
    imgSmoke.isReady = false;
    imgSmoke.onload = function() {
      this.isReady = true;
    };
    imgSmoke.src = './images/smoke-2.png';
    return imgSmoke;
  }
  
  function fireImg1() {
    let imgFire = new Image();
    imgFire.isReady = false;
    imgFire.onload = function() {
      this.isReady = true;
    };
    imgFire.src = './images/fire.png';
    return imgFire;
  }

  function fireImg2() {
    let imgFire = new Image();
    imgFire.isReady = false;
    imgFire.onload = function() {
      this.isReady = true;
    };
    imgFire.src = './images/fire-2.png';
    return imgFire;
  }

  function fireImg3() {
    let imgFire = new Image();
    imgFire.isReady = false;
    imgFire.onload = function() {
      this.isReady = true;
    };
    imgFire.src = './images/fire-3.png';
    return imgFire;
  }

  function fireImgBlue() {
    let imgFire = new Image();
    imgFire.isReady = false;
    imgFire.onload = function() {
      this.isReady = true;
    };
    imgFire.src = './images/fire-blue.png';
    return imgFire;
  }
  
  function rocketImg() {
    let imgRocket = new Image();
    imgRocket.isReady = false;
    imgRocket.onload = function() {
      this.isReady = true;
    };
    imgRocket.src = './images/rocket.png';
    return imgRocket;
  }
  
  function blueRocketImg() {
    let imgRocket = new Image();
    imgRocket.isReady = false;
    imgRocket.onload = function() {
      this.isReady = true;
    };
    imgRocket.src = './images/rocket2.png';
    return imgRocket;
  }
  
  function bombImg() {
    let imgBomb = new Image();
    imgBomb.isReady = false;
    imgBomb.onload = function() {
      this.isReady = true;
    };
    imgBomb.src = './images/bomb.png';
    return imgBomb;
  }

  function redBombImg() {
    let imgBomb = new Image();
    imgBomb.isReady = false;
    imgBomb.onload = function() {
      this.isReady = true;
    };
    imgBomb.src = './images/red bomb.png';
    return imgBomb;
  }

  function explosionSound() {
    let sound = new Audio();
    sound.isReady = false;
    sound.addEventListener('canplay', function() { sound.isReady = true; });
    sound.addEventListener('timeupdate', function(){ }, 
    sound.src = './sounds/explosion.wav');
    sound.volume = 0.2;
    return sound;
  }

  function fuseSound() {
    let sound = new Audio();
    sound.isReady = false;
    sound.addEventListener('canplay', function() { sound.isReady = true; });
    sound.addEventListener('timeupdate', function(){ }, 
    sound.src = './sounds/fuse.wav');
    sound.volume = 0.2;
    return sound;
  }

  function ignitionSound() {
    let sound = new Audio();
    sound.isReady = false;
    sound.addEventListener('canplay', function() { sound.isReady = true; });
    sound.addEventListener('timeupdate', function(){ }, 
    sound.src = './sounds/ignition.wav');
    sound.volume = 0.2;
    return sound;
  }
  
  let api = {
    smokeImg: smokeImg,
    fireImg1: fireImg1,
    fireImg2: fireImg2,
    fireImg3: fireImg3,
    fireImgBlue: fireImgBlue,
    rocketImg: rocketImg,
    blueRocketImg: blueRocketImg,
    bombImg: bombImg,
    redBombImg: redBombImg,
    explosionSound: explosionSound,
    fuseSound: fuseSound,
    ignitionSound: ignitionSound,
  };

  return api;
}());
