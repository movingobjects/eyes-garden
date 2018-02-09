
// Imports

import './styles/style.scss';

import * as PIXI from 'pixi.js';
import { random, maths, geom } from 'varyd-utils';

import App from './App';
import Eye from './Eye';


// Constants

const RADIUS_MIN    = 100,
      RADIUS_MAX    = 300,
      EYE_COUNT_MIN = 2,
      EYE_COUNT_MAX = 10;


// Class

export default class Creature extends PIXI.Container {

  // Constructor

  constructor() {

    super();

    this.color    = random.color();
    this.radius   = random.int(RADIUS_MIN, RADIUS_MAX);

    this.eyeCount = Math.round(maths.map(this.radius, RADIUS_MIN, RADIUS_MAX, EYE_COUNT_MIN, EYE_COUNT_MAX))

    this.eyes = [];

    this.makeEyes();
    //this.queueEyeUpdate();

  }


  // Methods

  makeEyes() {

    const overlapsAnEye = (pt) => {
      const overlap = this.eyes.find((eye) => {
        return geom.distSqXY(eye.x, eye.y, pt.x, pt.y) < (70 * 70);
      })
      return !!overlap;
    };

    this.body = new PIXI.Graphics();
    this.body.beginFill(0x000000);
    this.addChild(this.body);

    for (let i = 0; i < this.eyeCount; i++) {

      let pt;

      do {
        pt = random.ptInCircle(this.radius - 50);
      } while (overlapsAnEye(pt))

      let eye   = new Eye(this.color);
          eye.x = pt.x;
          eye.y = pt.y;

      this.body.drawCircle(pt.x, pt.y, 60);

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
