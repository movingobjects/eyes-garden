
// Imports

import './styles/style.scss';

import * as PIXI from 'pixi.js';
import { random, maths, geom } from 'varyd-utils';
import { Range } from 'varyd-utils';

import App from './App';
import Eye from './Eye';


// Constants

const RADIUS_RANGE         = new Range(500, 1500),
      EYE_COUNT_RANGE      = new Range(2, 10),
      SCALE_RANGE          = new Range(0.15, 0.35),
      OPEN_SHUT_SECS_RANGE = new Range(1, 5),
      BLINK_SECS_RANGE     = new Range(0.25, 20),
      DART_EYES_RANGE      = new Range(0.25, 5),
      VEL_RANGE            = new Range(-5, 5);

const BODY_BG_COLOR        = 0x000000;


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


    this.eyeScale = random.num(SCALE_RANGE.min, SCALE_RANGE.max);
    this.radius   = random.int(RADIUS_RANGE.min, RADIUS_RANGE.max) * this.eyeScale;
    this.velX     = random.num(-3, 3);

    this.eyeCount = Math.round(maths.map(this.radius, RADIUS_RANGE.min * this.eyeScale, RADIUS_RANGE.max * this.eyeScale, EYE_COUNT_RANGE.min, EYE_COUNT_RANGE.max, true))
    this.eyes     = [];

    this.x        = this.getRandomX();
    this.y        = this.getRandomY();

    this.gazePt   = undefined;

  }


  // Event handlers

  onFrame() {

    if (this.velX !== 0) {

      const xMin = -RADIUS_RANGE.max,
            xMax = App.W + RADIUS_RANGE.max;

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

    if (this.gazePt) {
      this.eyes.forEach((eye) => {
        eye.lookToward(this.gazePt);
      })
    }

    this.eyes.forEach((eye) => eye.update());

    requestAnimationFrame(this.onFrame);

  }


  // Methods

  start() {

    requestAnimationFrame(this.onFrame);

    this.queueEyeUpdate();
    this.queueBlink();
    this.queueDartEyes();

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

      this.body.drawCircle(pt.x, pt.y, 300 * this.eyeScale);

      this.addChild(eye);
      this.eyes.push(eye)

    }

    this.body.endFill();

  }

  queueEyeUpdate() {

    setTimeout(() => {
      this.updateAnEye();
      this.queueEyeUpdate();
    }, OPEN_SHUT_SECS_RANGE.random * 1000);

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

    setTimeout(() => {
      this.blink();
      this.queueBlink();
    }, BLINK_SECS_RANGE.random * 1000);

  }
  blink() {

    this.eyes.forEach((eye) => eye.blink());

  }

  queueDartEyes() {

    setTimeout(() => {
      this.dartEyes();
      this.queueDartEyes();
    }, DART_EYES_RANGE.random * 1000);

  }
  dartEyes() {

    if (random.boolean()) {
      this.lookForward();
    } else {
      this.lookAt(new PIXI.Point(this.getRandomX(), this.getRandomY()));
    }

  }

  lookAt(pt) {
    this.gazePt = pt;
    this.blink();
  }
  lookForward(pt) {

    const anglePerc = (this.velX < 1) ? 0.75 : 0.25,
          amt       = maths.map(Math.abs(this.velX), 0, VEL_RANGE.max, 0.1, 1);

    this.eyes.forEach((eye) => {
      eye.look(anglePerc, amt);
    });

    this.gazePt = undefined;

  }


  // Helpers

  getRandomX() {
    return random.int(App.W);
  }
  getRandomY() {
    return random.int(App.H);
  }

}
