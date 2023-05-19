const socket = io()

let updatedProductsList = document.getElementById('updatedProductsList')

socket.on('updatedProductsUi', async data => {
    let productsList = ''
    await data.forEach((product) => {
        productsList += `<div class="col">
        <div class="card" style="width: 14rem;">
          <img src="https://ichef.bbci.co.uk/news/640/cpsprodpb/A058/production/_101784014_gettyimages-490824921.jpg" class="card-img-top" alt="numeral de ejemplo" />
          <div class="card-body">
            <h6 class="card-title"></h6>
            <p class="card-text"></p>
            <p class="card-text"></p>
            <p class="card-text"></p>
            <p class="card-text"></p>
          </div>
          <div class="card-body">
            <a href="#" class="card-link">Detalle</a>
            <a href="#" class="card-link">Agregar al carrito</a>
          </div>
        </div>
        </div>`
    })
    updatedProductsList.innerHTML = productsList
    console.log('productList', productsList)
})