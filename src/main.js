const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');

function createWindow() {
  const mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    icon: path.join(__dirname, 'icon.ico'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false, // Keep false for security
      contextIsolation: true, // Keep true for security
    }
  });

  // Maximize the window automatically
  mainWindow.maximize();

  // Load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools for debugging
  // mainWindow.webContents.openDevTools();
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
app.whenReady().then(() => {
  const primaryDir = app.getPath('userData');
  if (!fs.existsSync(primaryDir)) {
    fs.mkdirSync(primaryDir, { recursive: true });
  }
  const dataFilePath = path.join(primaryDir, 'database.json');

  // Fallback and legacy paths for cross-environment safety
  const fallbackPaths = [
    path.join(app.getPath('appData'), 'alover-invoice', 'database.json'),
    path.join(app.getPath('appData'), 'Alover Invoice', 'database.json'),
    path.join(__dirname, '..', 'database.json')
  ];

  ipcMain.handle('load-data', async () => {
    try {
      if (fs.existsSync(dataFilePath)) {
        const data = fs.readFileSync(dataFilePath, 'utf8');
        const parsed = JSON.parse(data);
        if (parsed && (parsed.invoices?.length > 0 || parsed.customers?.length > 0)) {
          return parsed;
        }
      }

      // Check fallback paths if primary file doesn't exist or is empty
      for (const fbPath of fallbackPaths) {
        if (fs.existsSync(fbPath)) {
          const data = fs.readFileSync(fbPath, 'utf8');
          const parsed = JSON.parse(data);
          if (parsed && (parsed.invoices?.length > 0 || parsed.customers?.length > 0)) {
            try {
              fs.writeFileSync(dataFilePath, JSON.stringify(parsed, null, 2), 'utf8');
            } catch (wErr) {
              console.error('Failed to sync to primary path', wErr);
            }
            return parsed;
          }
        }
      }
    } catch (error) {
      console.error('Failed to load data', error);
    }
    return { invoices: [], customers: [], settings: {} };
  });

  ipcMain.handle('save-data', async (event, data) => {
    try {
      fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');

      // Also backup to existing fallback directories
      for (const fbPath of fallbackPaths) {
        try {
          const dir = path.dirname(fbPath);
          if (fs.existsSync(dir)) {
            fs.writeFileSync(fbPath, JSON.stringify(data, null, 2), 'utf8');
          }
        } catch (bErr) {
          // ignore secondary backup errors
        }
      }

      return { success: true };
    } catch (error) {
      console.error('Failed to save data', error);
      return { success: false, error: error.message };
    }
  });

  ipcMain.handle('save-pdf-dialog', async (event, { defaultFilename, bufferData, base64Data }) => {
    try {
      const win = BrowserWindow.getFocusedWindow() || (BrowserWindow.getAllWindows().length > 0 ? BrowserWindow.getAllWindows()[0] : null);
      const options = {
        title: 'Save PDF',
        defaultPath: defaultFilename || 'Invoice.pdf',
        filters: [{ name: 'PDF Documents (*.pdf)', extensions: ['pdf'] }]
      };
      
      const { canceled, filePath } = win ? await dialog.showSaveDialog(win, options) : await dialog.showSaveDialog(options);

      if (canceled || !filePath) {
        return { success: false, canceled: true };
      }

      const buffer = bufferData ? Buffer.from(bufferData) : Buffer.from(base64Data, 'base64');
      fs.writeFileSync(filePath, buffer);
      return { success: true, filePath };
    } catch (error) {
      console.error('Failed to save PDF via dialog', error);
      return { success: false, error: error.message };
    }
  });

  createWindow();

  app.on('activate', function () {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
