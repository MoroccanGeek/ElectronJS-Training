//Modules
const fs = require('fs')

// DOM nodes
let items = document.getElementById('items')

let readerJS
fs.readFile(`${__dirname}/reader.js`, (err, data) => {
    readerJS = data.toString()
})

// Listen for 'done' message from reader window
window.addEventListener('message', e => {
    
    // check for correct message
    if(e.data.action === 'delete-reader-item'){

        // Delete item at given index
        this.delete(e.data.itemIndex)

        // Close the reader window
        e.source.close()
    }
})

// Delete item
exports.delete = itemIndex => {

    // Remove item from DOM
    items.removeChild(items.childNodes[itemIndex])

    // Remove item from storage
    this.storage.splice(itemIndex, 1)

    // persist storage
    this.save()

    // Select previous item or new top item
    if(this.storage.length) {

        // Get new selected item index
        let newSelectedItemIndex = (itemIndex === 0 ) ? 0 : itemIndex - 1

        // Select item at new index
        document.getElementsByClassName('read-item')[newSelectedItemIndex].classList.add('selected')
    }
}


// Get selected item index
exports.getSelectedItem = () => {

    // Get selected node
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    // Get item index
    let itemIndex = 0
    let child = currentItem
    while( (child = child.previousElementSibling) != null) itemIndex++

    //Return selected item and index
    return {node: currentItem, index: itemIndex}
}



exports.storage = JSON.parse(localStorage.getItem('bookmarks')) || []

exports.select = e => {

    // remove currently selected item class
    this.getSelectedItem().node.classList.remove('selected')

    // add to clicked item
    e.currentTarget.classList.add('selected')
}

exports.save = () => {
    localStorage.setItem('bookmarks', JSON.stringify(this.storage))
}

exports.open = () => {

    // only if we have items (in case of menu open)
    if(!this.storage.length) return

    // Get selected item
    let currentItem = this.getSelectedItem()

    // get item's URL
    let contentURL = currentItem.node.dataset.url;

    // open item in proxy BrowserWindow
    let readWin = window.open(contentURL, '', `
        maxWidth=2000,
        maxHeight=2000,
        width=1200,
        height=800,
        backgroundColor=#DEDEDE,
        nodeIntegration=0,
        contextIsolation=1`);

    // inject JS with specific item index (selectedItem.index)
    readWin.eval(readerJS.replace('{index}', currentItem.index))

}

// Add new Item
exports.addItem = (item, isNew = false) => {

    // Create a new DOM node
    let itemNode = document.createElement('div')

    // assign 'read-item' class
    itemNode.setAttribute('class', 'read-item')

    // set item url as data attribute
    itemNode.setAttribute('data-url', item.url)

    // Add innerHTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // Append new node to "items"
    items.appendChild(itemNode)

    // attach click handler to select
    itemNode.addEventListener('click', this.select)

    // attach double click handler to open
    itemNode.addEventListener('dblclick', this.open)

    // If this is the first item, select it
    if(document.getElementsByClassName('read-item').length === 1){
        itemNode.classList.add('selected')
    }

    if(isNew){
        // Add items to storage and persist
        this.storage.push(item)
        this.save()
    }

}

exports.changeSelection = direction => {

    // Get current slected item
    let currentItem = this.getSelectedItem()

    // Handle up/down
    if(direction === 'ArrowUp' && currentItem.previousElementSibling){
        currentItem.node.classList.remove('selected');
        currentItem.node.previousElementSibling.classList.add('selected');

    } else if(direction === 'ArrowDown' && currentItem.nextElementSibling){
        currentItem.node.classList.remove('selected');
        currentItem.node.nextElementSibling.classList.add('selected');

    }
}

// Add items from storage
this.storage.forEach( item => {
    this.addItem(item)
});