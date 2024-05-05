import {Router} from "express"
import ProductManager from "../controllers/productManager.js"
import { __dirname } from "../utils.js"


const Manager=new ProductManager(__dirname+'/data/products.json')

const router = Router()

router.get("/products",async (req,res)=>{
    try{
        const misProductos = await Manager.getProducts()
        let limit = parseInt(req.query.limit)

        if (limit) return  res.send(misProductos.slice(0,limit))
        
        return res.send(misProductos)
    }catch{
        console.log(error)
        return res.send('Error al procesar los productos.')
    }
})

router.get('/products/:idProduct', async (req, res)=>{
    try{
        const product = await Manager.getProductById(req.params.idProduct)

        if (!product) return res.send({error: "Producto no encontrado!"})
        
        return res.send(product)
    }catch{
        console.log(error)
        return res.send('Error al intentar obtener el producto.')
    }
})

router.post('/products', async(req, res)=>{
    try{
        const newProduct = req.body
        const msg = await Manager.addProduct(newProduct)
        res.json({message: `${msg}`})
    }catch{
        console.log(error)
        return res.json({message:"Error durante el alta del producto."})
    }
})

router.put('/products/:idProduct', async(req, res)=>{
    try{
        const id = req.params.idProduct
        const productUpdated = req.body
        const msg = await Manager.updateProduct(productUpdated)
        res.json({message: `${msg}`})
    }catch{
        console.log(error)
        return res.send('Error durante la actualización del producto.')
    }
})

router.delete('/products/:idProduct', async(req, res)=>{
    try{
        const id = req.params.idProduct
        console.log(id)
        const msg = await Manager.deleteProduct(id)
        res.json({message: `${msg}`})
    }catch{
        console.log(error)
        return res.send('Error durante la eliminación del producto.')
    }
})

export default router