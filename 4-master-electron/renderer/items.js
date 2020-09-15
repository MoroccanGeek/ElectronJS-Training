// DOM nodes
let items = document.getElementById('items')


exports.storage = JSON.parse(localStorage.getItem('bookmarks')) || []

exports.save = () => {
    localStorage.setItem('bookmarks', JSON.stringify(this.storage))
}

// Add new Item
exports.addItem = (item, isNew = false) => {

    // Create a new DOM node
    let itemNode = document.createElement('div')

    // assign 'read-item' class
    itemNode.setAttribute('class', 'read-item')

    // Add innerHTML
    itemNode.innerHTML = `<img src="${item.screenshot}"><h2>${item.title}</h2>`

    // Append new node to "items"
    items.appendChild(itemNode)

    if(isNew){
        // Add items to storage and persist
        this.storage.push(item)
        this.save()
    }

}

// Add items from storage
this.storage.forEach( item => {
    this.addItem(item)
});