
// Imports

import './styles/style.scss';

import * as PIXI from 'pixi.js';
import { random } from 'varyd-utils';

import App from './App';

import eyeOpen1 from './images/eye-open/eye-open-1.png';
import eyeOpen2 from './images/eye-open/eye-open-2.png';
import eyeOpen3 from './images/eye-open/eye-open-3.png';
import eyeOpen4 from './images/eye-open/eye-open-4.png';
import eyeOpen5 from './images/eye-open/eye-open-5.png';
import eyeOpen6 from './images/eye-open/eye-open-6.png';
import eyeOpen7 from './images/eye-open/eye-open-7.png';
import eyeOpen8 from './images/eye-open/eye-open-8.png';
import eyeOpen9 from './images/eye-open/eye-open-9.png';
import eyeOpen10 from './images/eye-open/eye-open-10.png';
import eyeOpen11 from './images/eye-open/eye-open-11.png';
import eyeOpen12 from './images/eye-open/eye-open-12.png';
import eyeOpen13 from './images/eye-open/eye-open-13.png';
import eyeOpen14 from './images/eye-open/eye-open-14.png';
import eyeOpen15 from './images/eye-open/eye-open-15.png';
import eyeOpen16 from './images/eye-open/eye-open-16.png';

import eyeShut1 from './images/eye-shut/eye-shut-1.png';
import eyeShut2 from './images/eye-shut/eye-shut-2.png';
import eyeShut3 from './images/eye-shut/eye-shut-3.png';
import eyeShut4 from './images/eye-shut/eye-shut-4.png';
import eyeShut5 from './images/eye-shut/eye-shut-5.png';
import eyeShut6 from './images/eye-shut/eye-shut-6.png';
import eyeShut7 from './images/eye-shut/eye-shut-7.png';
import eyeShut8 from './images/eye-shut/eye-shut-8.png';
import eyeShut9 from './images/eye-shut/eye-shut-9.png';
import eyeShut10 from './images/eye-shut/eye-shut-10.png';
import eyeShut11 from './images/eye-shut/eye-shut-11.png';
import eyeShut12 from './images/eye-shut/eye-shut-12.png';
import eyeShut13 from './images/eye-shut/eye-shut-13.png';
import eyeShut14 from './images/eye-shut/eye-shut-14.png';
import eyeShut15 from './images/eye-shut/eye-shut-15.png';
import eyeShut16 from './images/eye-shut/eye-shut-16.png';


// Constants

const eyeOpenSeq = [
  eyeOpen1, eyeOpen2, eyeOpen3, eyeOpen4, eyeOpen5,
  eyeOpen6, eyeOpen7, eyeOpen8, eyeOpen9, eyeOpen10,
  eyeOpen11, eyeOpen12, eyeOpen13, eyeOpen14, eyeOpen15,
  eyeOpen16
];

const eyeShutSeq = [
  eyeShut1, eyeShut2, eyeShut3, eyeShut4, eyeShut5,
  eyeShut6, eyeShut7, eyeShut8, eyeShut9, eyeShut10,
  eyeShut11, eyeShut12, eyeShut13, eyeShut14, eyeShut15,
  eyeShut16
];

export default class Eye extends PIXI.Container {

  constructor() {

    super();

    this.isOpen = false;

    this.openAnim                = new PIXI.extras.AnimatedSprite(eyeOpenSeq.map((img) => PIXI.Texture.fromImage(img)));
    this.openAnim.loop           = false;
    this.openAnim.animationSpeed = random.num(0.25, 0.75);
    this.openAnim.anchor.set(0.5);
    this.openAnim.gotoAndStop(0);
    this.addChild(this.openAnim);

    this.shutAnim                = new PIXI.extras.AnimatedSprite(eyeShutSeq.map((img) => PIXI.Texture.fromImage(img)));
    this.shutAnim.loop           = false;
    this.shutAnim.animationSpeed = random.num(0.25, 0.75);
    this.shutAnim.anchor.set(0.5);
    this.shutAnim.gotoAndStop(15);
    this.addChild(this.shutAnim);

    this.move();

  }

  move() {
    this.x = Math.random() * App.W;
    this.y = Math.random() * App.H;
  }

  open() {
    this.isOpen = true;
    this.openAnim.gotoAndPlay(0);
    this.shutAnim.gotoAndStop(15);
  }

  shut() {
    this.isOpen = false;
    this.openAnim.gotoAndStop(0);
    this.shutAnim.gotoAndPlay(0);
  }

}
