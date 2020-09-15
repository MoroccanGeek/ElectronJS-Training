

let showModal = document.getElementById('show-modal'),
closeModal = document.getElementById('close-modal'),
modal = document.getElementById('modal');

// show Modal
showModal.addEventListener('click', e => {
modal.style.display = 'flex'
})

// close Modal
closeModal.addEventListener('click', e => {
modal.style.display = 'none'
})