
// Imports

import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';

import { random } from 'varyd-utils';
import { Range } from 'varyd-utils';

import Creature from './Creature';


// Constants

const CREATURE_COUNT_PER_PX_SQ    = 10 / (1280 * 800),
      CREATURE_REFRESH_SECS_RANGE = new Range(3, 5);


export default class App {

  // Constructor

  constructor() {

    this.creatures = [];

    this.initBindings();
    this.initPIXI();

    this.makeCreatures();
    this.start();

  }

  initBindings() {

    this.onFrame           = this.onFrame.bind(this);

  }
  initPIXI() {

    const pixiApp = new PIXI.Application({
      width: window.innerWidth,
      height: window.innerHeight
    });

    this.stage    = pixiApp.stage;

    document.body.appendChild(pixiApp.view)

    window.onresize = () => {

      let w = window.innerWidth,
          h = window.innerHeight;

      pixiApp.renderer.view.style.width  = w + "px";
      pixiApp.renderer.view.style.height = h + "px";

      pixiApp.renderer.resize(w,h);

    }

  }


  // Event Handlers

  onFrame() {

    PIXI.tweenManager.update();

    this.creatures.forEach((creature) => creature.nextFrame());

    requestAnimationFrame(this.onFrame);

  }

  onCreatureGone(e) {

    let creature = e.target,
        index    = this.creatures.indexOf(creature);

    creature.removeAllListeners();

    this.stage.removeChild(creature);

    if (index != -1) {
      this.creatures.splice(index, 1);
    }

  }


  // Methods

  makeCreatures() {

    let pxSq  = (window.innerWidth * window.innerHeight),
        count = Math.round(CREATURE_COUNT_PER_PX_SQ * pxSq);

    for (let i = 0; i < count; i++) {
      this.addCreature();
    }

  }

  addCreature() {

    let allEyes = this.creatures.reduce((eyes, creature) => {
      return eyes.concat(creature.eyes)
    }, []);

    let creature   = new Creature(allEyes);
        creature.on('gone', this.onCreatureGone, this);

    this.creatures.push(creature);

    this.stage.addChild(creature);

  }
  exitCreature() {

    let creature = this.creatures[0];

    if (creature) {
      creature.exit();
    }

  }

  start() {

    this.queueCreatureRefresh();

    requestAnimationFrame(this.onFrame);

  }

  queueCreatureRefresh() {

    clearTimeout(this.timeoutCreatureRefresh);

    this.timeoutCreatureRefresh = setTimeout(() => {

      let pxSq  = (window.innerWidth * window.innerHeight),
          count = Math.round(CREATURE_COUNT_PER_PX_SQ * pxSq);

      if (this.creatures.length < count) {
        this.addCreature();
      } else {
        this.exitCreature();
      }

      this.queueCreatureRefresh();

    }, CREATURE_REFRESH_SECS_RANGE.random * 1000)

  }

}
