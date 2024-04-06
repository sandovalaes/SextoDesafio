
/* **************************************  TEST *******************************************/

const ProductManager = require('./ProductManager.js')
const Manager =  new ProductManager("productos.json");

const product1 = {
    "id": 0,
    "code" :"Pinza24",
    "title" : "Pinza",
    "description" : "Pinza Reforzada Marca Dogo", 
    "price" : 500, 
    "thumbnail" :"imagen", 
    "stock" :100
}

const myUpdatedProduct = {
    "id": 1,
    "code" :"Pinza25",
    "title" : "Pinza",
    "description" : "Pinza Común Marca Thopsom", 
    "price" : 500, 
    "thumbnail" :"imagen", 
    "stock" :10
}

Manager.getProducts()
.then(productos  => console.log("Resultado de getProducts: ",productos) )
.catch(error => console.error("Error en getProduct: ",error))

Manager.addProduct(product1)
.then(resultado => console.log("Resultado de addProduct: ",resultado))
.catch(error => console.error("Error en addProduct",error))

Manager.getProductById(1)
.then(productos  => console.log("Resultado de getProductById: ",productos) )
.catch(error => console.error("Error en getProduct: ",error))

Manager.updateProduct(myUpdatedProduct)
.then(resultado  => console.log("Resultado de updateProduct: ",resultado) )
.catch(error => console.log("Error en updateProduct", error))

Manager.deleteProduct(1)
.then(resultado  => console.log("Resultado de deleteProduct: ",resultado) )
.catch(error => console.log("Error en deleteProduct", error))

Manager.getProducts()
.then(productos  => console.log("Resultado de getProducts: ",productos) )
.catch(error => console.error("Error en getProduct: ",error))
