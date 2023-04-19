console.log('realTimeProducts.js')

const socket = io()

socket.on('updatedProductsUi', data => {
    let updatedProductsList = document.getElementById('updatedProductsList')
    let productsList = ''
    data.forEach((product) => {
        productsList += `<li>${product.title}</li>`
    })
    updatedProductsList.innerHTML = productsList
})