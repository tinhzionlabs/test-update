const { app, BrowserWindow, ipcMain, ipcRenderer, autoUpdater, dialog } = require("electron");
const MainScreen = require("./screens/main/mainScreen");
const Globals = require("./globals");


let curWindow;

//Basic flags
autoUpdater.autoDownload = false;
autoUpdater.autoInstallOnAppQuit = true;

function createWindow() {
  curWindow = new MainScreen();
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", function () {
    if (BrowserWindow.getAllWindows().length == 0) createWindow();
  });

  const server = 'https://test-hz-six.vercel.app'
  const url = `${server}/update/mac/${app.getVersion()}`

  autoUpdater.setFeedURL({ url })
  console.log(url)
  setInterval(() => {
    curWindow.showMessage(`checking hihihih. Current version ${app.getVersion()}`);
    console.log("check update")
    autoUpdater.checkForUpdates()
  }, 20000)

  console.log("check update")

  curWindow.showMessage(`Checking for updates. Current version ${app.getVersion()}`);
});

/*New Update Available*/

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
  curWindow.showMessage(`download ok. Current version ${app.getVersion()}`);

  const dialogOpts = {
    type: 'info',
    buttons: ['Restart', 'Later'],
    title: 'Application Update',
    message: process.platform === 'win32' ? releaseNotes : releaseName,
    detail:
      'A new version has been downloaded. Restart the application to apply the updates.',
  }

  dialog.showMessageBox(dialogOpts).then((returnValue) => {
    curWindow.showMessage(`error ${app.getVersion()}`);
    if (returnValue.response === 0) autoUpdater.quitAndInstall()
  })
})

autoUpdater.on('error', (message) => {
  console.error('There was a problem updating the application')
  curWindow.showMessage(`${message.toString()}. Current version ${app.getVersion()}`);
})



//Global exception handler
process.on("uncaughtException", function (err) {
  console.log(err);
});

app.on("window-all-closed", function () {
  if (process.platform != "darwin") app.quit();
});