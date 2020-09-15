const electron = require('electron')
const {ipcRenderer} = electron
const items = require('./items')

let showModal = document.getElementById('show-modal'),
    closeModal = document.getElementById('close-modal'),
    modal = document.getElementById('modal')
    addItem = document.getElementById('add-item')
    itemUrl = document.getElementById('url');


// Toggle modal buttons
const toggleModalButtons = () => {
    // check state of buttons
    if(addItem.disabled === true) {
        addItem.disabled = false
        addItem.style.opacity = 1
        addItem.innerText = 'Add Item'
        closeModal.style.display = 'inline'
    }else {
        addItem.disabled = true
        addItem.style.opacity = 0.5
        addItem.innerText = 'Adding...'
        closeModal.style.display = 'none'
    }
}

// show Modal
showModal.addEventListener('click', e => {
    modal.style.display = 'flex'
    itemUrl.focus()
})

// close Modal
closeModal.addEventListener('click', e => {
    modal.style.display = 'none'
})

// Handle new Items
addItem.addEventListener('click', e => {

    // Check a URL exists
    if(itemUrl.value){
        
        // send new item to main process
        ipcRenderer.send('newItem-channel', itemUrl.value);
        
        // Disable buttons
        toggleModalButtons();
    }
})

// Handle new-item response from Main
ipcRenderer.on('new-item-success', (e, newItem) => {
    
    // Add new Item
    items.addItem(newItem, true)
    
    // Active buttons
    toggleModalButtons();

    // Hide modal and clear value
    itemUrl.value = ''
    closeModal.click()
})

// Listen to keyboard submit
itemUrl.addEventListener('keyup', e=> {
    if(e.key === 'Enter'){
        addItem.click()
    }
})