
// Imports

import './styles/style.scss';

import Two from 'two.js';

// Constants

// Vars

var elApp = document.getElementById('app');
var two   = new Two({
  width: elApp.clientWidth,
  height: elApp.clientHeight
}).appendTo(elApp);


// Init

init();

function init() {

  two.bind('update', (frameCount) => {
    console.log(frameCount);
  }).play();

}
