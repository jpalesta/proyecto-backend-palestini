const socket = io()
// const { logger } = require('../../utils/logger');

let updatedProductsList = document.getElementById('updatedProductsList')

socket.on('updatedProductsUi', async prods => {
  let productsList = ''
    await prods.forEach((product) => {
        productsList += 
        `<div class="column">
        <div class="card" style="width: 22rem;">
          <img src="https://ichef.bbci.co.uk/news/640/cpsprodpb/A058/production/_101784014_gettyimages-490824921.jpg" class="card-img-top" alt="numeral de ejemplo" />
          <div class="card-body">
            <h6 class="card-title">${product.title}</h6>
            <p class="card-text">Descripción: ${product.description}</p>
            <p class="card-text">Código: ${product.code}</p>
            <p class="card-text">Stock: ${product.stock}</p>
            <p class="card-text">Categoría: ${product.category}</p>
          </div>
          <div class="card-body">
          </div>
        </div>
        </div>`
    })
    updatedProductsList.innerHTML = productsList
})