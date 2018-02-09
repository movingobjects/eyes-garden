
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

    this.initBindings();
    this.initState();

    this.makeEyes();
    this.start();

  }

  initBindings() {
    this.onFrame = this.onFrame.bind(this);
  }

  initState() {

    this.radius   = random.int(RADIUS_MIN, RADIUS_MAX);
    this.velX     = random.num(-5, 5);

    this.eyeCount = Math.round(maths.map(this.radius, RADIUS_MIN, RADIUS_MAX, EYE_COUNT_MIN, EYE_COUNT_MAX))

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

  }

  makeEyes() {

    const overlapsAnEye = (pt) => {
      const overlap = this.eyes.find((eye) => {
        return ((maths.diff(eye.x, pt.x) < 65) && (maths.diff(eye.y, pt.y) < 35))
            || (geom.distSqXY(eye.x, eye.y, pt.x, pt.y) < 60 * 60);
      })
      return !!overlap;
    };

    this.body = new PIXI.Graphics();
    this.body.beginFill(0x111111);
    this.addChild(this.body);

    for (let i = 0; i < this.eyeCount; i++) {

      let pt;

      do {
        pt   = random.ptInCircle(this.radius);
        pt.y /= 2;
      } while (overlapsAnEye(pt))

      let eye   = new Eye();
          eye.x = pt.x;
          eye.y = pt.y;

      //eye.open();

      this.body.drawCircle(pt.x, pt.y, 60);

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

    if (eye.isOpen) {
      eye.shut();

    } else {
      eye.open();
    }

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
