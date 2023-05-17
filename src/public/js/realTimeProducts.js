const socket = io()

let updatedProductsList = document.getElementById('updatedProductsList')

socket.on('updatedProductsUi', async data => {
    let productsList = ''
    await data.forEach((product) => {
        productsList += `<li>${product.title}</li>`
    })
    updatedProductsList.innerHTML = productsList
    console.log('productList', productsList)
})