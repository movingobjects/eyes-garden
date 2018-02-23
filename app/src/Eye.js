
// Imports

import './styles/style.scss';

import * as PIXI from 'pixi.js';
import { maths, random, geom } from 'varyd-utils';
import { Range } from 'varyd-utils';

import App from './App';

import imgSclera from './images/eye-sclera.png';
import imgIris from './images/eye-iris.png';
import imgPupil from './images/eye-pupil.png';

import imgEyeOpen1 from './images/eye-open/eye-open-1.png';
import imgEyeOpen2 from './images/eye-open/eye-open-2.png';
import imgEyeOpen3 from './images/eye-open/eye-open-3.png';
import imgEyeOpen4 from './images/eye-open/eye-open-4.png';
import imgEyeOpen5 from './images/eye-open/eye-open-5.png';
import imgEyeOpen6 from './images/eye-open/eye-open-6.png';
import imgEyeOpen7 from './images/eye-open/eye-open-7.png';
import imgEyeOpen8 from './images/eye-open/eye-open-8.png';
import imgEyeOpen9 from './images/eye-open/eye-open-9.png';
import imgEyeOpen10 from './images/eye-open/eye-open-10.png';
import imgEyeOpen11 from './images/eye-open/eye-open-11.png';
import imgEyeOpen12 from './images/eye-open/eye-open-12.png';
import imgEyeOpen13 from './images/eye-open/eye-open-13.png';
import imgEyeOpen14 from './images/eye-open/eye-open-14.png';
import imgEyeOpen15 from './images/eye-open/eye-open-15.png';
import imgEyeOpen16 from './images/eye-open/eye-open-16.png';

import imgEyeShut1 from './images/eye-shut/eye-shut-1.png';
import imgEyeShut2 from './images/eye-shut/eye-shut-2.png';
import imgEyeShut3 from './images/eye-shut/eye-shut-3.png';
import imgEyeShut4 from './images/eye-shut/eye-shut-4.png';
import imgEyeShut5 from './images/eye-shut/eye-shut-5.png';
import imgEyeShut6 from './images/eye-shut/eye-shut-6.png';
import imgEyeShut7 from './images/eye-shut/eye-shut-7.png';
import imgEyeShut8 from './images/eye-shut/eye-shut-8.png';
import imgEyeShut9 from './images/eye-shut/eye-shut-9.png';
import imgEyeShut10 from './images/eye-shut/eye-shut-10.png';
import imgEyeShut11 from './images/eye-shut/eye-shut-11.png';
import imgEyeShut12 from './images/eye-shut/eye-shut-12.png';
import imgEyeShut13 from './images/eye-shut/eye-shut-13.png';
import imgEyeShut14 from './images/eye-shut/eye-shut-14.png';
import imgEyeShut15 from './images/eye-shut/eye-shut-15.png';
import imgEyeShut16 from './images/eye-shut/eye-shut-16.png';
import imgEyeShut17 from './images/eye-shut/eye-shut-17.png';
import imgEyeShut18 from './images/eye-shut/eye-shut-18.png';
import imgEyeShut19 from './images/eye-shut/eye-shut-19.png';

import imgEyeBlink1 from './images/eye-blink/eye-blink-1.png';
import imgEyeBlink2 from './images/eye-blink/eye-blink-2.png';
import imgEyeBlink3 from './images/eye-blink/eye-blink-3.png';
import imgEyeBlink4 from './images/eye-blink/eye-blink-4.png';
import imgEyeBlink5 from './images/eye-blink/eye-blink-5.png';
import imgEyeBlink6 from './images/eye-blink/eye-blink-6.png';
import imgEyeBlink7 from './images/eye-blink/eye-blink-7.png';
import imgEyeBlink8 from './images/eye-blink/eye-blink-8.png';

// Constants

const DEBUG_DISABLE_SHUT = false,
      IRIS_EASE          = 0.2,
      MASK_COLOR         = 0x000000,
      IRIS_COLOR         = 0x000000;

const IRIS_LOOK_DIST_RANGE = new Range(5, 75);

const imgSeqEyeOpen = [
  imgEyeOpen1,  imgEyeOpen2,  imgEyeOpen3,  imgEyeOpen4,
  imgEyeOpen5,  imgEyeOpen6,  imgEyeOpen7,  imgEyeOpen8,
  imgEyeOpen9,  imgEyeOpen10, imgEyeOpen11, imgEyeOpen12,
  imgEyeOpen13, imgEyeOpen14, imgEyeOpen15, imgEyeOpen16
];

const imgSeqEyeShut = [
  imgEyeShut1,  imgEyeShut2,  imgEyeShut3,  imgEyeShut4,
  imgEyeShut5,  imgEyeShut6,  imgEyeShut7,  imgEyeShut8,
  imgEyeShut9,  imgEyeShut10, imgEyeShut11, imgEyeShut12,
  imgEyeShut13, imgEyeShut14, imgEyeShut15, imgEyeShut16,
  imgEyeShut17, imgEyeShut18, imgEyeShut19
];

const imgSeqBlink = [
  imgEyeBlink1, imgEyeBlink2, imgEyeBlink3, imgEyeBlink4,
  imgEyeBlink5, imgEyeBlink6, imgEyeBlink7, imgEyeBlink8
];


// Class

export default class Eye extends PIXI.Container {

  // Constructor

  constructor(scale) {

    super();

    this.eyeScale = scale;

    this.initState();
    this.makeEye();

    if (DEBUG_DISABLE_SHUT) {
      this.open();
    }

  }

  initState() {

    this.isOpen    = false;

    this.irisTrgtX = 0;
    this.irisTrgtY = 0;

  }

  // Get & set

  get lastOpenFrame() {
    return imgSeqEyeOpen.length - 1;
  }
  get lastShutFrame() {
    return imgSeqEyeShut.length - 1;
  }
  get lastBlinkFrame() {
    return imgSeqBlink.length - 1;
  }


  // Methods

  makeEye() {

    let faceDirX                 = random.sign();

    let sclera                   = PIXI.Sprite.fromImage(imgSclera);
        sclera.anchor.set(0.5);
        sclera.scale             = new PIXI.Point(faceDirX * this.eyeScale, this.eyeScale);
    this.sclera                  = sclera;
    this.addChild(this.sclera);

    let iris                     = PIXI.Sprite.fromImage(imgIris);
        iris.anchor.set(0.5);
        iris.rotation            = random.num(0, Math.PI * 2);
        iris.scale               = new PIXI.Point(this.eyeScale, this.eyeScale);
        iris.tint                = IRIS_COLOR;
    this.iris                    = iris;
    this.addChild(this.iris);

    let pupil                     = PIXI.Sprite.fromImage(imgPupil);
        pupil.anchor.set(0.5);
        pupil.rotation            = this.iris.rotation;
        pupil.scale               = new PIXI.Point(this.eyeScale, this.eyeScale);
    this.pupil                    = pupil;
    this.addChild(this.pupil);

    let openAnim                 = new PIXI.extras.AnimatedSprite(imgSeqEyeOpen.map((img) => PIXI.Texture.fromImage(img)));
        openAnim.loop            = false;
        openAnim.animationSpeed  = random.num(0.25, 0.75);
        openAnim.tint            = MASK_COLOR;
        openAnim.anchor.set(0.5);
        openAnim.scale           = new PIXI.Point(this.eyeScale, this.eyeScale);
        openAnim.gotoAndStop(0);
    this.openAnim                = openAnim;
    this.addChild(this.openAnim);

    let shutAnim                 = new PIXI.extras.AnimatedSprite(imgSeqEyeShut.map((img) => PIXI.Texture.fromImage(img)));
        shutAnim.loop            = false;
        shutAnim.animationSpeed  = random.num(0.25, 0.75);
        shutAnim.tint            = MASK_COLOR;
        shutAnim.anchor.set(0.5);
        shutAnim.scale           = new PIXI.Point(this.eyeScale, this.eyeScale);
        shutAnim.gotoAndStop(0);
    this.shutAnim                = shutAnim;
    this.addChild(this.shutAnim);

    let blinkAnim                = new PIXI.extras.AnimatedSprite(imgSeqBlink.map((img) => PIXI.Texture.fromImage(img)));
        blinkAnim.loop           = false;
        blinkAnim.animationSpeed = random.num(0.25, 0.75);
        blinkAnim.tint           = MASK_COLOR;
        blinkAnim.anchor.set(0.5);
        blinkAnim.scale          = new PIXI.Point(this.eyeScale, this.eyeScale);
        blinkAnim.gotoAndStop(this.lastBlinkFrame);
    this.blinkAnim               = blinkAnim;
    this.addChild(this.blinkAnim);

  }

  open() {

    this.isOpen = true;

    this.openAnim.gotoAndPlay(0);
    this.shutAnim.gotoAndStop(0);
    this.blinkAnim.gotoAndStop(this.lastBlinkFrame);

  }
  shut() {

    if (DEBUG_DISABLE_SHUT) return;

    this.isOpen = false;

    this.openAnim.gotoAndStop(this.lastOpenFrame);
    this.shutAnim.gotoAndPlay(0);
    this.blinkAnim.gotoAndStop(this.lastBlinkFrame);

  }

  look(anglePerc, amt) {

    let circRad = IRIS_LOOK_DIST_RANGE.lerp(amt, true) * this.eyeScale,
        irisPt  = geom.ptAroundCircle(circRad, anglePerc);

    this.irisTrgtX = irisPt.x;
    this.irisTrgtY = irisPt.y;

  }
  lookToward(pt) {

    const DIST_SQ_NEAR = Math.pow(10, 2),
          DIST_SQ_FAR  = Math.pow(200, 2);

    let gPt       = this.toGlobal(new PIXI.Point(0, 0)),
        rads      = Math.atan2(pt.y - gPt.y, pt.x - gPt.x) + (Math.PI * 0.5),
        anglePerc = rads / (Math.PI * 2);

    let distSq    = geom.distSq(pt, gPt),
        amt       = maths.norm(distSq, DIST_SQ_NEAR, DIST_SQ_FAR, true);

    this.look(anglePerc, amt);

  }
  lookForward() {
    this.irisTrgtX = 0;
    this.irisTrgtY = 0;
  }

  nextFrame() {

    if (this.iris.x !== this.irisTrgtX) {
      this.iris.x = maths.ease(this.iris.x, this.irisTrgtX, IRIS_EASE, 0.5);
    }

    if (this.iris.y !== this.irisTrgtY) {
      this.iris.y = maths.ease(this.iris.y, this.irisTrgtY, IRIS_EASE, 0.5);
    }

    this.pupil.x = this.iris.x;
    this.pupil.y = this.iris.y;

  }

  blink() {

    if (this.isOpen) {
      this.blinkAnim.gotoAndPlay(0);
      this.openAnim.gotoAndStop(this.lastOpenFrame);
      this.shutAnim.gotoAndStop(0);
    }

  }

}
