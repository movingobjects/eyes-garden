
// Imports

import './styles/style.scss';

import * as PIXI from 'pixi.js';
import { maths, random, geom } from 'varyd-utils';

import App from './App';

import imgSclera from './images/eye-sclera.png';

import imgOpen1 from './images/eye-open/eye-open-1.png';
import imgOpen2 from './images/eye-open/eye-open-2.png';
import imgOpen3 from './images/eye-open/eye-open-3.png';
import imgOpen4 from './images/eye-open/eye-open-4.png';
import imgOpen5 from './images/eye-open/eye-open-5.png';
import imgOpen6 from './images/eye-open/eye-open-6.png';
import imgOpen7 from './images/eye-open/eye-open-7.png';
import imgOpen8 from './images/eye-open/eye-open-8.png';
import imgOpen9 from './images/eye-open/eye-open-9.png';
import imgOpen10 from './images/eye-open/eye-open-10.png';
import imgOpen11 from './images/eye-open/eye-open-11.png';
import imgOpen12 from './images/eye-open/eye-open-12.png';
import imgOpen13 from './images/eye-open/eye-open-13.png';
import imgOpen14 from './images/eye-open/eye-open-14.png';
import imgOpen15 from './images/eye-open/eye-open-15.png';
import imgOpen16 from './images/eye-open/eye-open-16.png';

import imgShut1 from './images/eye-shut/eye-shut-1.png';
import imgShut2 from './images/eye-shut/eye-shut-2.png';
import imgShut3 from './images/eye-shut/eye-shut-3.png';
import imgShut4 from './images/eye-shut/eye-shut-4.png';
import imgShut5 from './images/eye-shut/eye-shut-5.png';
import imgShut6 from './images/eye-shut/eye-shut-6.png';
import imgShut7 from './images/eye-shut/eye-shut-7.png';
import imgShut8 from './images/eye-shut/eye-shut-8.png';
import imgShut9 from './images/eye-shut/eye-shut-9.png';
import imgShut10 from './images/eye-shut/eye-shut-10.png';
import imgShut11 from './images/eye-shut/eye-shut-11.png';
import imgShut12 from './images/eye-shut/eye-shut-12.png';
import imgShut13 from './images/eye-shut/eye-shut-13.png';
import imgShut14 from './images/eye-shut/eye-shut-14.png';
import imgShut15 from './images/eye-shut/eye-shut-15.png';
import imgShut16 from './images/eye-shut/eye-shut-16.png';
import imgShut17 from './images/eye-shut/eye-shut-17.png';
import imgShut18 from './images/eye-shut/eye-shut-18.png';
import imgShut19 from './images/eye-shut/eye-shut-19.png';

import imgBlink1 from './images/eye-blink/eye-blink-1.png';
import imgBlink2 from './images/eye-blink/eye-blink-2.png';
import imgBlink3 from './images/eye-blink/eye-blink-3.png';
import imgBlink4 from './images/eye-blink/eye-blink-4.png';
import imgBlink5 from './images/eye-blink/eye-blink-5.png';
import imgBlink6 from './images/eye-blink/eye-blink-6.png';
import imgBlink7 from './images/eye-blink/eye-blink-7.png';
import imgBlink8 from './images/eye-blink/eye-blink-8.png';


// Constants

const IRIS_EASE  = 0.2,
      MASK_COLOR = 0x000000;

const imgSeqEyeOpen = [
  imgOpen1, imgOpen2, imgOpen3, imgOpen4, imgOpen5,
  imgOpen6, imgOpen7, imgOpen8, imgOpen9, imgOpen10,
  imgOpen11, imgOpen12, imgOpen13, imgOpen14, imgOpen15,
  imgOpen16
];

const imgSeqEyeShut = [
  imgShut1, imgShut2, imgShut3, imgShut4, imgShut5,
  imgShut6, imgShut7, imgShut8, imgShut9, imgShut10,
  imgShut11, imgShut12, imgShut13, imgShut14, imgShut15,
  imgShut16, imgShut17, imgShut18, imgShut19
];

const imgSeqBlink = [
  imgBlink1, imgBlink2, imgBlink3, imgBlink4, imgBlink5,
  imgBlink6, imgBlink7, imgBlink8
];


// Class

export default class Eye extends PIXI.Container {

  // Constructor

  constructor(scale) {

    super();

    this.imgScale = scale;

    this.initState();

    this.makeEye();

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

    let sclera                  = PIXI.Sprite.fromImage(imgSclera);
        sclera.anchor.set(0.5);
        sclera.scale            = new PIXI.Point(this.imgScale, this.imgScale);
    this.sclera = sclera;
    this.addChild(this.sclera);

    let iris                    = new PIXI.Graphics();
        iris.beginFill(0x000000);
        iris.drawCircle(0, 0, 75 * this.imgScale);
        iris.beginFill(0xffffff);
        iris.drawCircle(0, 0, 35 * this.imgScale);
        iris.endFill();
    this.iris = iris;
    this.addChild(this.iris);

    let openAnim                = new PIXI.extras.AnimatedSprite(imgSeqEyeOpen.map((img) => PIXI.Texture.fromImage(img)));
        openAnim.loop           = false;
        openAnim.animationSpeed = random.num(0.25, 0.75);
        openAnim.tint           = MASK_COLOR;
        openAnim.anchor.set(0.5);
        openAnim.scale          = new PIXI.Point(this.imgScale, this.imgScale);
        openAnim.gotoAndStop(0);
    this.openAnim = openAnim;
    this.addChild(this.openAnim);

    let shutAnim                = new PIXI.extras.AnimatedSprite(imgSeqEyeShut.map((img) => PIXI.Texture.fromImage(img)));
        shutAnim.loop           = false;
        shutAnim.animationSpeed = random.num(0.25, 0.75);
        shutAnim.tint           = MASK_COLOR;
        shutAnim.anchor.set(0.5);
        shutAnim.scale          = new PIXI.Point(this.imgScale, this.imgScale);
        shutAnim.gotoAndStop(0);
    this.shutAnim = shutAnim;
    this.addChild(this.shutAnim);

    let blinkAnim                = new PIXI.extras.AnimatedSprite(imgSeqBlink.map((img) => PIXI.Texture.fromImage(img)));
        blinkAnim.loop           = false;
        blinkAnim.animationSpeed = random.num(0.25, 0.75);
        blinkAnim.tint           = MASK_COLOR;
        blinkAnim.anchor.set(0.5);
        blinkAnim.scale          = new PIXI.Point(this.imgScale, this.imgScale);
        blinkAnim.gotoAndStop(0);
    this.blinkAnim = blinkAnim;
    this.addChild(this.blinkAnim);

  }

  open() {
    this.isOpen = true;
    this.openAnim.gotoAndPlay(0);
    this.shutAnim.gotoAndStop(0);
    this.blinkAnim.gotoAndStop(0);
  }
  shut() {
    this.isOpen = false;
    this.openAnim.gotoAndStop(this.lastOpenFrame);
    this.shutAnim.gotoAndPlay(0);
    this.blinkAnim.gotoAndStop(this.lastBlinkFrame);
  }

  look(anglePerc, amt) {

    let circRad = maths.lerp(5, 75, amt, true) * this.imgScale,
        irisPt = geom.ptAroundCircle(circRad, anglePerc);

    this.irisTrgtX = irisPt.x;
    this.irisTrgtY = irisPt.y;

  }
  lookToward(pt) {

    let gPt       = this.toGlobal(new PIXI.Point(0, 0)),
        rads      = Math.atan2(pt.y - gPt.y, pt.x - gPt.x) + (Math.PI * 0.5),
        anglePerc = rads / (Math.PI * 2);

    let distSq    = geom.distSq(pt, gPt),
        amt       = maths.norm(distSq, (10 * 10), (200 * 200), true);

    this.look(anglePerc, amt);

  }
  lookForward() {
    this.irisTrgtX = 0;
    this.irisTrgtY = 0;
  }

  update() {

    if (this.iris.x !== this.irisTrgtX) {
      this.iris.x = maths.ease(this.iris.x, this.irisTrgtX, IRIS_EASE, 0.5);
    }

    if (this.iris.y !== this.irisTrgtY) {
      this.iris.y = maths.ease(this.iris.y, this.irisTrgtY, IRIS_EASE, 0.5);
    }

  }

  blink() {

    if (this.isOpen) {
      this.blinkAnim.gotoAndPlay(0);
      this.openAnim.gotoAndStop(this.lastOpenFrame);
      this.shutAnim.gotoAndStop(0);
    }

  }

}
