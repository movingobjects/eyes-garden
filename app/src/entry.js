
// Imports

import './styles/style.scss';
import * as PIXI from 'pixi.js';

import svgEye from './images/eye.svg';


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
