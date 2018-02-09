
// Imports

import * as PIXI from 'pixi.js';
import { random } from 'varyd-utils';

import Creature from './Creature';


// Constants

const CREATURE_COUNT   = 5;


export default class App {

  // Constructor

  constructor() {

    // Static

    App.elem    = document.getElementById('app');
    App.W       = App.elem.clientWidth,
    App.H       = App.elem.clientHeight;
    App.pixiApp = new PIXI.Application(App.W, App.H);
    App.stage   = App.pixiApp.stage;

    // Properties

    this.creatures = [];


    // Start

    this.initView();
    this.makeCreatures();
    this.start();

  }


  // Methods

  initView() {

    App.elem.appendChild(App.pixiApp.view);

  }

  makeCreatures() {

    for (let i = 0; i < CREATURE_COUNT; i++) {

      let creature   = new Creature();
          creature.x = Math.random() * App.W;
          creature.y = Math.random() * App.H;

      App.stage.addChild(creature);

      this.creatures.push(creature);

    }

  }

  start() { }

}
