
// Imports

import * as PIXI from 'pixi.js';
import * as tweenManager from 'pixi-tween';

import { random } from 'varyd-utils';
import { Range } from 'varyd-utils';

import Creature from './Creature';



// Constants

const CREATURE_COUNT              = 10,
      CREATURE_REFRESH_SECS_RANGE = new Range(3, 5);


export default class App {

  // Constructor

  constructor() {

    this.creatures = [];

    this.initBindings();
    this.initApp();
    this.initPIXI();

    this.makeCreatures();
    this.start();

  }

  initBindings() {
    this.onFrame = this.onFrame.bind(this);
  }
  initApp() {

    App.elem    = document.getElementById('app');

    App.W       = App.elem.clientWidth,
    App.H       = App.elem.clientHeight;

    App.allEyes = [];

  }
  initPIXI() {

    App.pixiApp = new PIXI.Application({
      width: App.W,
      height: App.H,
      backgroundColor: 0x000000
    });

    App.stage   = App.pixiApp.stage;
    App.elem.appendChild(App.pixiApp.view);

  }


  // Event Handlers

  onFrame() {

    PIXI.tweenManager.update();

    this.creatures.forEach((creature) => creature.nextFrame());

    requestAnimationFrame(this.onFrame);

  }


  // Methods

  makeCreatures() {

    for (let i = 0; i < CREATURE_COUNT; i++) {
      this.addCreature();
    }

  }

  addCreature() {

    let creature   = new Creature();

    this.creatures.push(creature);

    App.stage.addChild(creature);

  }
  exitCreature() {

    let creature = this.creatures.shift();

    if (creature) {
      creature.exit();
    }

    setTimeout(() => {
      App.stage.removeChild(creature);
    }, 3000)

  }

  start() {

    this.queueCreatureRefresh();

    requestAnimationFrame(this.onFrame);

  }

  queueCreatureRefresh() {

    clearTimeout(this.timeoutCreatureRefresh);

    this.timeoutCreatureRefresh = setTimeout(() => {

      if (this.creatures.length < CREATURE_COUNT) {
        this.addCreature();
      } else {
        this.exitCreature();
      }

      this.queueCreatureRefresh();

    }, CREATURE_REFRESH_SECS_RANGE.random * 1000)

  }

}
