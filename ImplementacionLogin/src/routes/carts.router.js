import CartsManager from '../cartsManager.js'
import cartModel from '../models/carts.model.js'
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import {Router, json} from 'express'

const router = Router()

router.get("/",async (req,res)=>{
    try{
        console.log("consultando carritos")
        const myCarts = await cartModel.find()

        if (!myCarts) return res.status(404).json({error: "Carritos no encontrados!"})

        let limit = parseInt(req.query.limit)

        if (limit) return   res.status(200).json({result :"sucess", payload: myCarts.slice(0,limit)}) 
        
        return  res.status(200).json({result :"success", payload: myCarts}) 
    }catch{
        console.log(error)
        return json.status(500).json({message : 'Error al recuperar los carritos.'})
    }
})

router.get("/:cid",async (req,res)=>{
    try{
        let idCart = req.params.cid
        const cart = await cartModel.findOne({_id : idCart}).populate("products.product")
        if (!cart) return res.status(404).json({error: "Carrito no encontrado!"})
        res.status(200).json({result :"success", payload: cart.products}) 
    }catch(error){
        return res.status(500).json({message:"Error al consultar el carrito solicitado."}) 
    }
})

router.get("/view/:cid",isAuthenticated,async (req,res)=>{
    try{
        let idCart = req.params.cid
        const cart = await cartModel.findOne({_id : idCart}).populate("products.product")
        if (!cart) return res.status(404).json({error: "Carrito no encontrado!"})
        res.render('cart',{result :"success", payload: cart.products, user: req.session.user}) 
    }catch(error){
        return res.status(500).json({message:"Error al consultar el carrito solicitado."}) 
    }
})

router.put('/:cid', async(req, res)=>{
    try{
        const idCart = req.params.cid
        const cart = req.body
        console.log(cart)
        const msg = await cartModel.updateOne({_id : idCart}, cart)
        res.status(200).json({result :"success", payload: msg}) 
    }catch{
        return res.status(500).json({message:'Error durante la actualizacion del carrito.'})
    }
})

router.put('/:cid/products/:pid', async(req, res)=>{
    try{
        const idCart = req.params.cid
        const idProduct = req.params.pid
        const {quantity} = req.body
        console.log(quantity)

        const cart = await cartModel.findOne({_id: idCart})

        if (!cart) 
            return res.status(404).json({ error: 'Carrito no encontrado' });

        let productIndex = cart.products.findIndex(item => String(item.product) === idProduct)

        if (productIndex === -1) 
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        cart.products[productIndex].quantity = quantity

        const msg = await cartModel.updateOne({_id : idCart}, cart)
        res.status(200).json({result :"success", payload: msg}) 
    }catch{
        return res.status(500).json({message:'Error durante la actualizacion del carrito.'})
    }
})

router.delete('/:cid', async(req, res)=>{
    try{
        const idCart = req.params.cid
        const msg = await cartModel.deleteOne({_id: idCart})
        res.status(200).json({result :"success", payload: msg}) 
    }catch{
        return res.status(500).json({message:'Error durante la eliminación del carrito.'})
    }
})

router.delete('/:cid/products/:pid', async(req, res)=>{
    try{
        const idCart = req.params.cid
        const idProduct = req.params.pid
        const cart = await cartModel.findOne({_id: idCart})

        if (!cart) 
            return res.status(404).json({ error: 'Carrito no encontrado' });

        let productIndex = cart.products.findIndex(item => String(item.product) === idProduct)

        if (productIndex === -1) 
            return res.status(404).json({ error: 'Producto no encontrado en el carrito' });

        cart.products.splice(productIndex,1)
        let msg = await cartModel.updateOne({_id : idCart }, cart)
        res.status(200).json({result :"success", payload: msg})
        
    }catch(error){
        console.error('Error al eliminar el producto del carrito:', error);
        return res.status(500).json({ message: 'Error al eliminar el producto del carrito' });
    }
})


router.post('/:cid/products/:pid', async (req, res) => {
    try {
        const { cid, pid } = req.params;

        const cart = await cartModel.findById(cid);
        if (!cart) {
            return res.status(404).json({ error: 'Carrito no encontrado' });
        }

        const existingProductIndex = cart.products.findIndex(item => item.product.toString() === pid);
        if (existingProductIndex !== -1) {

            cart.products[existingProductIndex].quantity += 1;
        } else {

            cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();

        return res.status(200).json({result :"success", payload: cart});
    } catch (error) {
        console.error('Error al agregar el producto al carrito:', error);
        return res.status(500).json({ error: 'Error al agregar el producto al carrito' });
    }
});

export default router