// Import necesarios
import { app, BrowserWindow, Menu } from 'electron';
import { MenuItemConstructorOptions } from 'electron/main';
import * as path from 'path';
import * as url from 'url';

// Inicializamos la ventana de Electron
let win: BrowserWindow;
function createWindow() {
    win = new BrowserWindow({ width: 800, height: 600 });

    win.loadURL(
        url.format({
            pathname: path.join(__dirname, `/../../dist/Odin/index.html`),
            protocol: 'file:',
            slashes: true
        })
    );

    let isMac = process.platform === 'darwin'

    let template: Array<MenuItemConstructorOptions> = [
        {
            label: 'View',
            submenu: [
                { role: 'reload' },
                { role: 'forceReload' },
                { role: 'toggleDevTools' },
                { type: 'separator' },
                { role: 'resetZoom' },
                { role: 'zoomIn' },
                { role: 'zoomOut' },
                { type: 'separator' },
                { role: 'togglefullscreen' }
            ]
        },
        {
            role: 'help',
            submenu: [
                {
                    label: 'About ValhollRT',
                    click: async () => {
                        const { shell } = require('electron')
                        await shell.openExternal('https://valhollrt.com')
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template)
    Menu.setApplicationMenu(menu)

    // win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });
}



// Para ver el estado de la app
app.on('ready', createWindow)

app.on('activate', () => {
    if (win === null) {
        createWindow()
    }
})

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
})


