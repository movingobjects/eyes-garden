
// Imports

import './styles/style.scss';
import * as PIXI from 'pixi.js';

import svgEye from './images/eye.svg';

import testSeq1 from './images/test-seq-1.png';
import testSeq2 from './images/test-seq-2.png';
import testSeq3 from './images/test-seq-3.png';
import testSeq4 from './images/test-seq-4.png';
import testSeq5 from './images/test-seq-5.png';
import testSeq6 from './images/test-seq-6.png';
import testSeq7 from './images/test-seq-7.png';


// Constants


// Vars

var elApp = document.getElementById('app'),
    appW  = elApp.clientWidth,
    appH  = elApp.clientHeight;

var app   = new PIXI.Application(appW, appH),
    eye   = PIXI.Sprite.fromImage(svgEye);

var timeLastEyeMove = Date.now();


// Init

init();

function init() {

  elApp.appendChild(app.view);

  app.ticker.add(onFrame);

  spriteTest();

}

function spriteTest() {

  let seq = [
    testSeq1,
    testSeq2,
    testSeq3,
    testSeq4,
    testSeq5,
    testSeq6,
    testSeq7
  ].map((seqImg) => PIXI.Texture.fromImage(seqImg));

  let sprite = new PIXI.extras.AnimatedSprite(seq);
      sprite.animationSpeed = 0.2;
      sprite.play();

  app.stage.addChild(sprite);

}

// Event handlers

function onFrame(delta) {

  if (Date.now() - timeLastEyeMove > 3000) {
    moveEye();
    timeLastEyeMove = Date.now();
  }

}


// Functions

function moveEye() {
  eye.anchor.set(0.5);
  eye.x = Math.random() * app.screen.width;
  eye.y = Math.random() * app.screen.height;
  app.stage.addChild(eye);
}
