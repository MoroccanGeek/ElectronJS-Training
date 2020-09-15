// Modules
const { BrowserWindow} = require('electron')

let offScreenWindow


module.exports = (url, callback) => {

    //Create offscreen browser window
    offScreenWindow = new BrowserWindow({
        width: 500,
        height: 500,
        show: false,
        webPreferences: {
            offscreen: true
        }
    })

    // load item url
    offScreenWindow.loadURL(url)

    // Wait for content to finish laoding
    offScreenWindow.webContents.on('did-finish-load', e => {

        // Get Title
        let title = offScreenWindow.getTitle()

        // Get screenshot (thumbnail)
        offScreenWindow.webContents.capturePage().then( image => {

            // get image in dataURL (This useful to prevent us from creating new image files)
            let screenshot = image.toDataURL()

            // Execute callback with new item object
            callback({title, screenshot, url})

            //cleanUp
            offScreenWindow.close()
            offScreenWindow = null
        })
    })

}