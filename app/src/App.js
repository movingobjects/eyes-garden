
// Imports

import * as PIXI from 'pixi.js';
import { random } from 'varyd-utils';

import Eye from './Eye';


// Constants

const TOTAL_COUNT      = 25,
      UPDATE_DELAY_MIN = 250,
      UPDATE_DELAY_MAX = 1000;


export default class App {

  constructor() {

    // Static

    App.elem    = document.getElementById('app');
    App.W       = App.elem.clientWidth,
    App.H       = App.elem.clientHeight;
    App.pixiApp = new PIXI.Application(App.W, App.H);
    App.stage   = App.pixiApp.stage;

    // Properties

    this.eyes = [];


    // Start

    this.initView();
    this.initEyes();
    this.start();

  }

  initView() {

    App.elem.appendChild(App.pixiApp.view);

  }

  initEyes() {

    for (let i = 0; i < TOTAL_COUNT; i++) {

      let eye   = new Eye();

      App.stage.addChild(eye);

      this.eyes.push(eye);

    }

  }


  // Functions

  start() {

    this.queueAnUpdate();

  }

  queueAnUpdate() {

    const delay = random.num(UPDATE_DELAY_MIN, UPDATE_DELAY_MAX);

    setTimeout(() => {
      this.updateAnEye();
      this.queueAnUpdate();
    }, delay);

  }

  updateAnEye() {

    let eye = random.item(this.eyes);

    if (eye.isOpen) {
      eye.shut();

    } else {
      eye.move();
      eye.open();
    }

  }

}
