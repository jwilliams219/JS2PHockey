'use strict';

// Returns object that can handle multiple sound calls at a time.
function soundQueue() {
  let soundQueue = { assets: [], queue: 0};
  
  soundQueue.addAsset = (asset) => {
      soundQueue.assets.push(asset);
  }

  soundQueue.play = () => {
      if (soundQueue.assets.length !== 0 && soundQueue.assets[soundQueue.queue].isReady) {
          soundQueue.assets[soundQueue.queue].play();
      }
      if (soundQueue.queue.length === 0 || soundQueue.queue === soundQueue.assets.length-1) {
          soundQueue.queue = 0;
      } else {
          soundQueue.queue++;
      }
  }

  return soundQueue;
}

let initialAssets = {};

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

// Load assets on page load instead of when game starts to avoid faults on first time load.
function loadInitialAssets() {
  initialAssets = {
    images: { bomb: loadAssets.bombImg(), redBomb: loadAssets.redBombImg(), rocket: loadAssets.rocketImg(), blueRocket: loadAssets.blueRocketImg()},
    sounds: { fuse: soundQueue(), ignition: soundQueue(), explosion: soundQueue()}
  }
  for (let i = 0; i < 5; i++) { // Add number of sound assets.
    initialAssets.sounds.fuse.addAsset(loadAssets.fuseSound());
    initialAssets.sounds.ignition.addAsset(loadAssets.ignitionSound());
    initialAssets.sounds.explosion.addAsset(loadAssets.explosionSound());
  }
}
