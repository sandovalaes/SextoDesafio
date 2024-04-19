const ProductManager = require('./ProductManager.js')
const Manager =  new ProductManager('productos.json');


const express = require ("express")
const app = express()
const PORT  = 8080

app.use(express.urlencoded({ extended: true }))

app.get('/Productos', async (req, res)=>{
    try{
        const misProductos = await Manager.getProducts()
        let limit = parseInt(req.query.limit)

        if (limit) return  res.send(misProductos.slice(0,limit))
        
        return res.send(misProductos)
    }catch{
        console.log(error)
        return res.send('Error al procesar el pedido')
    }
})

app.get('/Productos/:idProduct', async (req, res)=>{
    try{
        const product = await Manager.getProductById(req.params.idProduct)

        if (!product) return res.send({error: "Producto no encontrado!"})
        
        return res.send(product)
    }catch{
        console.log(error)
        return res.send('Error al procesar el pedido')
    }
})

app.listen(PORT, () =>{ 
    console.log(`Server running on port: ${PORT}`)
} )