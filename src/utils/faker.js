const { faker } = require('@faker-js/faker')

faker.location = 'es'

exports.generateProducts = (quantity) => {
    let mockingProducts = []

    for (let i = 0; i < quantity; i++) {
        let product = {
            title: faker.commerce.product(),
            description: faker.commerce.productDescription(),
            price: faker.commerce.price(),
            thumbnail: faker.image.url(),
            code: faker.string.alphanumeric(10),
            stock: faker.number.int(1000),
            category: faker.commerce.productAdjective(),
            status: 'active'
        }
        mockingProducts.push(product)
    }
    return mockingProducts
}