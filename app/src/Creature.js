
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
      DART_EYES_SECS_RANGE = new Range(0.25, 5),
      STEP_SECS_RANGE      = new Range(5, 10),
      STEP_COUNT_RANGE     = new Range(1, 5);

const BODY_BG_COLOR        = 0x000000;


// Class

export default class Creature extends PIXI.Container {

  // Constructor

  constructor() {

    super();

    this.initState();

    this.makeEyes();
    this.start();

  }
  initState() {

    this.timeoutOpenShut = -1;
    this.timeoutBlink    = -1;
    this.timeoutDartEyes = -1;
    this.timeoutSteps    = -1;

    this.eyeScale = random.num(SCALE_RANGE.min, SCALE_RANGE.max);
    this.radius   = random.int(RADIUS_RANGE.min, RADIUS_RANGE.max) * this.eyeScale;

    this.eyeCount = Math.round(maths.map(this.radius, RADIUS_RANGE.min * this.eyeScale, RADIUS_RANGE.max * this.eyeScale, EYE_COUNT_RANGE.min, EYE_COUNT_RANGE.max, true))
    this.eyes     = [];

    this.x        = this.getRandomX();
    this.y        = this.getRandomY();

    this.gazePt   = undefined;
    this.stepping = false;

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
    //this.queueSteps();

  }

  makeEyes() {
    const minDistX  = 325 * this.eyeScale,
          minDistY  = 175 * this.eyeScale;

    const overlapsAnEye = (pt) => {

      let thisPt = this.toGlobal(pt);

      const overlap = App.allEyes.find((eye) => {

        let thatPt  = eye.parent.toGlobal(new PIXI.Point(eye.x, eye.y)),
            minDist = (300 * Math.max(this.eyeScale, eye.eyeScale));

        return (geom.dist(thisPt, thatPt) < minDist);

      })

      return !!overlap;

    };

    this.body = new PIXI.Graphics();
    this.body.beginFill(BODY_BG_COLOR);
    //this.addChild(this.body);

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

      this.body.drawCircle(pt.x, pt.y, 300 * this.eyeScale);

      this.addChild(eye);
      this.eyes.push(eye)

    }

    this.body.endFill();

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
      this.lookAt(new PIXI.Point(this.getRandomX(), this.getRandomY()));
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

  queueSteps() {

    clearTimeout(this.timeoutSteps);

    this.timeoutSteps = setTimeout(() => {

      if (!this.stepping) {
        this.step(STEP_COUNT_RANGE.random);
      }
      this.queueSteps();
    }, STEP_SECS_RANGE.random * 1000);

  }
  step(times) {

    this.stepping = true;

    const dirX = random.sign(),
          dirY = random.sign();

    const STEP_X_RANGE = new Range(50, 150),
          STEP_Y_RANGE = new Range(50, 100),
          CTRL_PT_Y_OFFSET_RANGE = new Range(-25, -50);

    let pts = [{
      x: this.x,
      y: this.y
    }];

    let duration = 0;

    for (let i = 1; i < times; i++) {

      let lastPt = pts[i - 1];
      let nextPt = {
        x: lastPt.x + (dirX * STEP_X_RANGE.random),
        y: lastPt.y + (dirY * STEP_Y_RANGE.random)
      }

      duration += 4 * geom.dist(lastPt, nextPt);

      pts.push(nextPt);

    }

    var path = new PIXI.tween.TweenPath();
        path.moveTo(this.x, this.y);

    pts.forEach((pt, i) => {
      if (i > 0) {

        let lastPt = pts[i - 1],
            ptA    = geom.lerpPt(lastPt, pt, 0.333),
            ptB    = geom.lerpPt(lastPt, pt, 0.666);

        let cpAx   = ptA.x,
            cpBx   = ptB.x,
            cpAy   = ptA.y + CTRL_PT_Y_OFFSET_RANGE.random,
            cpBy   = ptB.y + CTRL_PT_Y_OFFSET_RANGE.random;

        path.bezierCurveTo(cpAx, cpAy, cpBx, cpBy, pt.x, pt.y);

      }
    })

    var tween        = PIXI.tweenManager.createTween(this);
        tween.path   = path;
        tween.time   = duration;
        tween.easing = PIXI.tween.Easing.linear();
        tween.expire = true;
        tween.on('end', () => {
          this.stepping = false;
        })
        tween.start();

  }

  wake() {
    this.eyes.forEach((eye) => eye.open());
  }
  exit() {

    clearTimeout(this.timeoutOpenShut);
    clearTimeout(this.timeoutBlink);
    clearTimeout(this.timeoutDartEyes);
    clearTimeout(this.timeoutSteps);

    this.eyes.forEach((eye) => {
      setTimeout(() => {
        if (eye.isOpen) {
          eye.exit();
        }
      }, random.int(0, 2000));
    });

  }


  // Helpers

  getRandomX() {
    return random.int(App.W);
  }
  getRandomY() {
    return random.int(App.H);
  }

}
