
// Imports

import './styles/style.scss';

import * as PIXI from 'pixi.js';
import { random, maths, geom } from 'varyd-utils';

import App from './App';
import Eye from './Eye';


// Constants

const RADIUS_MIN    = 500,
      RADIUS_MAX    = 1500,
      EYE_COUNT_MIN = 2,
      EYE_COUNT_MAX = 10,
      SCALE_MIN     = 0.15,
      SCALE_MAX     = 0.35,
      BODY_BG_COLOR = 0x000000;


// Class

export default class Creature extends PIXI.Container {

  // Constructor

  constructor() {

    super();

    this.initBindings();
    this.initState();

    this.makeEyes();
    this.start();

  }
  initBindings() {
    this.onFrame = this.onFrame.bind(this);
  }
  initState() {

    this.eyeScale = random.num(SCALE_MIN, SCALE_MAX);
    this.radius   = random.int(RADIUS_MIN, RADIUS_MAX) * this.eyeScale;
    this.velX     = 0;//random.num(-4, 4);

    this.eyeCount = Math.round(maths.map(this.radius, RADIUS_MIN * this.eyeScale, RADIUS_MAX * this.eyeScale, EYE_COUNT_MIN, EYE_COUNT_MAX, true))

    this.eyes     = [];

    this.x        = this.getRandomX();
    this.y        = this.getRandomY();

  }


  // Event handlers

  onFrame() {

    if (this.velX !== 0) {

      const xMin = -RADIUS_MAX,
            xMax = App.W + RADIUS_MAX;

      this.x += this.velX;

      if ((this.velX > 0) && (this.x > xMax)) {
        this.x = xMin;
        this.y = this.getRandomY();
      }

      if ((this.velX < 0) && (this.x < xMin)) {
        this.x = xMax;
        this.y = this.getRandomY();

      }

    }

    if (App.followMouse) {
      this.lookAt(App.lookAtPt);
    } else {
      this.lookForward();
    }

    this.eyes.forEach((eye) => eye.update());

    requestAnimationFrame(this.onFrame);

  }


  // Methods

  start() {

    requestAnimationFrame(this.onFrame);

    this.queueEyeUpdate();
    this.queueBlink();

  }

  makeEyes() {

    const minDistX  = 325 * this.eyeScale,
          minDistY  = 175 * this.eyeScale,
          minDistSq = Math.pow(300 * this.eyeScale, 2)

    const overlapsAnEye = (pt) => {
      const overlap = this.eyes.find((eye) => {
        return ((maths.diff(eye.x, pt.x) < minDistX) && (maths.diff(eye.y, pt.y) < minDistY))
            || (geom.distSqXY(eye.x, eye.y, pt.x, pt.y) < minDistSq);
      })
      return !!overlap;
    };

    this.body = new PIXI.Graphics();
    this.body.beginFill(BODY_BG_COLOR);
    this.addChild(this.body);

    for (let i = 0; i < this.eyeCount; i++) {

      let pt;

      do {
        pt   = random.ptInCircle(this.radius);
        pt.y /= 2;
      } while (overlapsAnEye(pt))

      let eye   = new Eye(this.eyeScale);
          eye.x = pt.x;
          eye.y = pt.y;

      //eye.open();

      this.body.drawCircle(pt.x, pt.y, 300 * this.eyeScale);

      this.addChild(eye);
      this.eyes.push(eye)

    }

    this.body.endFill();

  }

  queueEyeUpdate() {

    const delay = 1000 * random.num(2, 4);

    setTimeout(() => {
      this.updateAnEye();
      this.queueEyeUpdate();
    }, delay);

  }
  updateAnEye() {

    let eye = random.item(this.eyes);

    if (eye) {
      if (eye.isOpen) {
        eye.shut();
      } else {
        eye.open();
      }
    }

  }

  queueBlink() {

    const delay = 1000 * random.num(0.25, 20);

    setTimeout(() => {
      this.blink();
      this.queueBlink();
    }, delay);

  }
  blink() {

    this.eyes.forEach((eye) => eye.blink());

  }

  lookAt(pt) {
    this.eyes.forEach((eye) => {
      eye.lookToward(pt);
    })
  }
  lookForward(pt) {
    this.eyes.forEach((eye) => {
      eye.lookForward();
    })
  }



  // Helpers

  getRandomX() {
    return random.int(App.W);
  }
  getRandomY() {
    return random.int(App.H);
  }

}
