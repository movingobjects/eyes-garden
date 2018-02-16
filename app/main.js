
const { app, BrowserWindow } = require('electron'),
      electronReload         = require('electron-reload');

let win,
    pathBuild = `${__dirname}/build/`;

electronReload(pathBuild);

app.on('ready', () => {

  win = new BrowserWindow({
    width: 1024,
    height: 768,
    backgroundColor: '#000',
    fullscreenable: true,
    fullscreen: true
  });

  win.loadURL(`file://${pathBuild}index.html`);

});

app.on('window-all-closed', () => {

  app.quit();

});
