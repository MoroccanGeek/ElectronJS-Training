// DOM nodes
let items = document.getElementById('items')


exports.storage = JSON.parse(localStorage.getItem('bookmarks')) || []

exports.select = e => {

    // remove currently selected item class
    document.getElementsByClassName('read-item selected')[0].classList.remove('selected')

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
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    let contentURL = currentItem.dataset.url;

    console.log('opening item: ', contentURL)

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
    let currentItem = document.getElementsByClassName('read-item selected')[0]

    // Handle up/down
    if(direction === 'ArrowUp' && currentItem.previousElementSibling){
        currentItem.classList.remove('selected');
        currentItem.previousElementSibling.classList.add('selected');

    } else if(direction === 'ArrowDown' && currentItem.nextElementSibling){
        currentItem.classList.remove('selected');
        currentItem.nextElementSibling.classList.add('selected');

    }
}

// Add items from storage
this.storage.forEach( item => {
    this.addItem(item)
});