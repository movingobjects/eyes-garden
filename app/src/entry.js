
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

const testSeqs = [
  testSeq1,
  testSeq2,
  testSeq3,
  testSeq4,
  testSeq5,
  testSeq6,
  testSeq7
];


// Vars

var elApp = document.getElementById('app'),
    appW  = elApp.clientWidth,
    appH  = elApp.clientHeight;

var app   = new PIXI.Application(appW, appH),
    anim;

var timeLastMove = Date.now();


// Init

init();

function init() {

  elApp.appendChild(app.view);

  initAnim();
  start();

}

function initAnim() {

  anim = new PIXI.extras.AnimatedSprite(testSeqs.map((seqImg) => PIXI.Texture.fromImage(seqImg)));

  anim.animationSpeed = 0.2;
  anim.loop           = false;
  anim.anchor.set(0.5);

  app.stage.addChild(anim);

}

// Event handlers

function onFrame(delta) {

  const moveSecs = 3;

  if (Date.now() - timeLastMove > (moveSecs * 1000)) {
    moveAnim();
    timeLastMove = Date.now();
  }

}


// Functions

function start() {

  moveAnim();
  app.ticker.add(onFrame);

}

function moveAnim() {

  anim.x = Math.random() * appW;
  anim.y = Math.random() * appH;
  anim.gotoAndPlay(0);

}
