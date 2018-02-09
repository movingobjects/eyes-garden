
// Imports

import './styles/style.scss';

import * as PIXI from 'pixi.js';
import { random } from 'varyd-utils';

import App from './App';
import Eye from './Eye';


// Constants

// Class

export default class Creature extends PIXI.Container {

  // Constructor

  constructor() {

    super();

    this.color  = random.color();
    this.radius = random.int(150, 400);

    this.eyes = [];

    this.makeBody();
    this.makeEyes();
    this.queueEyeUpdate();

  }


  // Methods

  makeBody() {

    this.body = new PIXI.Graphics();

    this.body.lineStyle(5, this.color);
    this.body.beginFill(this.color, 0.25);
    this.body.drawCircle(0, 0, this.radius);

    this.addChild(this.body);

  }

  makeEyes() {

    const eyeCount = random.int(1, 7),
          maxDist  = 300;

    for (var i = 0; i < eyeCount; i++) {

      let eye   = new Eye(this.color);
          eye.x = random.num(-maxDist, maxDist);
          eye.y = random.num(-maxDist, maxDist);

      eye.open();

      this.addChild(eye);
      this.eyes.push(eye)

    }

  }

  queueEyeUpdate() {

    const delay = 1000 * random.num(5, 10);

    setTimeout(() => {
      this.updateAnEye();
      this.queueEyeUpdate();
    }, delay);

  }

  updateAnEye() {

    let eye = random.item(this.eyes);

    if (eye.isOpen) {
      eye.shut();

    } else {
      eye.open();
    }

  }

}
