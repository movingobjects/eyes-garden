
// Imports

import * as PIXI from 'pixi.js';
import { random } from 'varyd-utils';

import Creature from './Creature';


// Constants

const CREATURE_COUNT   = 7;


export default class App {

  // Constructor

  constructor() {

    // Static

    App.elem    = document.getElementById('app');
    App.W       = App.elem.clientWidth,
    App.H       = App.elem.clientHeight;
    App.pixiApp = new PIXI.Application({
      width: App.W,
      height: App.H,
      backgroundColor: 0x000000
    });
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

    let bg = new PIXI.Graphics();
        bg.beginFill(0x000000)
        bg.drawRect(0, 0, App.W, App.H);
    App.stage.addChild(bg);

    App.stage.interactive = true;
    App.stage.on('click', (e) => {
      App.followMouse = App.followMouse ? false : true;
    });
    App.stage.on('mousemove', (e) => {
      App.lookAtPt = new PIXI.Point(e.data.global.x, e.data.global.y);
    });

  }

  makeCreatures() {

    for (let i = 0; i < CREATURE_COUNT; i++) {

      let creature   = new Creature();

      App.stage.addChild(creature);

      this.creatures.push(creature);

    }

  }

  start() { }

}
