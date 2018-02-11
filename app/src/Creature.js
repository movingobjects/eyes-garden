
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
      SCALE_RANGE          = new Range(0.05, 0.25),
      OPEN_SHUT_SECS_RANGE = new Range(1, 5),
      BLINK_SECS_RANGE     = new Range(2, 20),
      DART_EYES_SECS_RANGE = new Range(0.25, 5);


// Class

export default class Creature extends PIXI.Container {

  // Constructor

  constructor(otherEyes) {

    super();

    this.initState();
    this.makeEyes(otherEyes);

    this.start();

  }
  initState() {

    this.timeoutOpenShut = -1;
    this.timeoutBlink    = -1;
    this.timeoutDartEyes = -1;

    this.eyeScale = random.num(SCALE_RANGE.min, SCALE_RANGE.max);
    this.radius   = random.int(RADIUS_RANGE.min, RADIUS_RANGE.max) * this.eyeScale;

    this.eyeCount = Math.round(maths.map(this.radius, RADIUS_RANGE.min * this.eyeScale, RADIUS_RANGE.max * this.eyeScale, EYE_COUNT_RANGE.min, EYE_COUNT_RANGE.max, true))
    this.eyes     = [];

    this.x        = this.getRandomX();
    this.y        = this.getRandomY();

    this.exiting  = false;
    this.gazePt   = undefined;

  }


  // Event handlers

  nextFrame() {

    if (this.gazePt) {
      this.eyes.forEach((eye) => {
        eye.lookToward(this.gazePt);
      })
    }

    this.eyes.forEach((eye) => eye.nextFrame());

  }


  // Methods

  start() {

    this.queueOpenShut();
    this.queueBlink();
    this.queueDartEyes();

  }

  makeEyes(otherEyes) {

    const overlapsAnEye = (pt) => {

      let thisPt = this.toGlobal(pt);

      const overlap = otherEyes.find((otherEye) => {

        let minDist      = 300 * Math.max(this.eyeScale, otherEye.eyeScale),
            otherPtLocal = new PIXI.Point(otherEye.x, otherEye.y),
            otherPt      = otherEye.parent.toGlobal(otherPtLocal);

        return (geom.dist(thisPt, otherPt) < minDist);

      })

      return !!overlap;

    };

    for (let i = 0; i < this.eyeCount; i++) {

      let pt,
          tries = 0;

      do {
        pt   = random.ptInCircle(this.radius);
        pt.y /= 2;

        if (++tries >= 100) {
          this.eyeCount = i;
          return;
        }

      } while (overlapsAnEye(pt))

      let eye   = new Eye(this.eyeScale);
          eye.x = pt.x;
          eye.y = pt.y;

      otherEyes.push(eye);

      this.addChild(eye);
      this.eyes.push(eye);

    }

  }

  queueOpenShut() {

    clearTimeout(this.timeoutOpenShut);

    this.timeoutOpenShut = setTimeout(() => {
      this.openShut();
      this.queueOpenShut();
    }, OPEN_SHUT_SECS_RANGE.random * 1000);

  }
  openShut() {

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

    clearTimeout(this.timeoutBlink);

    this.timeoutBlink = setTimeout(() => {
      this.blink();
      this.queueBlink();
    }, BLINK_SECS_RANGE.random * 1000);

  }
  blink() {

    this.eyes.forEach((eye) => eye.blink());

  }

  queueDartEyes() {

    clearTimeout(this.timeoutDartEyes);

    this.timeoutDartEyes = setTimeout(() => {
      this.dartEyes();
      this.queueDartEyes();
    }, DART_EYES_SECS_RANGE.random * 1000);

  }
  dartEyes() {

    if (random.boolean()) {
      this.lookForward();
    } else {
      this.lookAt(this.getRandomPt());
    }

  }

  lookAt(pt) {
    this.gazePt = pt;
    if (random.boolean()) {
      this.blink();
    }
  }
  lookForward(pt) {

    this.gazePt = undefined;

    this.eyes.forEach((eye) => {
      eye.look(random.num(), 0.1);
    });

  }

  wake() {
    this.eyes.forEach((eye) => eye.open());
  }
  exit() {

    this.exiting = true;

    clearTimeout(this.timeoutOpenShut);
    clearTimeout(this.timeoutBlink);
    clearTimeout(this.timeoutDartEyes);

    this.eyes.forEach((eye) => {
      setTimeout(() => {
        if (eye.isOpen) {
          eye.shut();
        }
      }, random.int(0, 2000));
    });

    setTimeout(() => {
      this.emit('gone', {
        target: this
      });
    }, 3000);

  }


  // Helpers

  getRandomPt() {
    return new PIXI.Point(this.getRandomX(), this.getRandomY());
  }
  getRandomX() {
    return random.int(App.W);
  }
  getRandomY() {
    return random.int(App.H);
  }

}
