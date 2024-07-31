import ProductManager from '../productManager.js'
import productModel from '../models/product.model.js'
import { isAuthenticated, isNotAuthenticated } from '../middleware/auth.js';
import {Router} from 'express'
import mongoose from 'mongoose';

const router = Router()

router.get("/",async (req,res)=>{
    try{
        console.log("Consultanto productos")
        let { limit, page, sort, query } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        sort = sort || '';
        query = query || '';

        let filter = {};

        if (query) {
            const descriptionRegex = new RegExp(`^${query}$`, 'i');
            filter = { description: descriptionRegex };
        }

        let options = {
            page: page,
            limit: limit,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true
        };

        console.log(options)
        console.log(filter)

        let result = await productModel.paginate( filter, options);

        const { totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = result;
        const prevLink = hasPrevPage ? `${req.baseUrl}/?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `${req.baseUrl}/?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;
        res.status(200).json({
            result :"sucess", 
            payload: result.docs,  
            totalPages: totalPages, 
            prevPage: prevPage, 
            nextPage: nextPage, 
            page: currentPage,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink
        })
    }catch(error){
        console.error(error)
        return res.status(500).json({message:'Error al recuperar los productos.'})
    }
})

router.get("/view",isAuthenticated,async (req,res)=>{
    try{
        console.log("Consultanto productos")
        let { limit, page, sort, query } = req.query;
        limit = parseInt(limit) || 10;
        page = parseInt(page) || 1;
        sort = sort || '';
        query = query || '';

        let filter = {};

        if (query) {
            const descriptionRegex = new RegExp(`^${query}$`, 'i');
            filter = { description: descriptionRegex };
        }

        let options = {
            page: page,
            limit: limit,
            sort: sort ? { price: sort === 'asc' ? 1 : -1 } : {},
            lean: true
        };

        console.log(options)
        console.log(filter)

        let result = await productModel.paginate( filter, options);

        const { totalPages, prevPage, nextPage, page: currentPage, hasPrevPage, hasNextPage } = result;
        const prevLink = hasPrevPage ? `${req.baseUrl}/view/?limit=${limit}&page=${prevPage}&sort=${sort}&query=${query}` : null;
        const nextLink = hasNextPage ? `${req.baseUrl}/view/?limit=${limit}&page=${nextPage}&sort=${sort}&query=${query}` : null;
        res.render('products',{
            result :"success", 
            payload: result.docs,  
            totalPages: totalPages, 
            prevPage: prevPage, 
            nextPage: nextPage, 
            page: currentPage,
            hasPrevPage: hasPrevPage,
            hasNextPage: hasNextPage,
            prevLink: prevLink,
            nextLink: nextLink,
            user: req.session.user
        })
    }catch(error){
        console.error(error)
        return res.status(500).json({message:'Error al recuperar los productos.'})
    }
})

router.get('/:idProduct', async (req, res)=>{
    try{
        let idProduct = req.params.idProduct;
        const product = await productModel.findOne({_id : idProduct})

        if (!product) return res.status(404).json({message: "Producto no encontrado!"})
        
        res.status(200).json({result :"success", payload: product}) 
    }catch{
        return res.status(500).json({message :'Error al intentar obtener el producto.'})
    }
})

router.post('/', async(req, res)=>{
    try{
        let {title, description, price, status, thumbnail, code, stock} = req.body
        console.log(title)
        if (!title || !description || !price || !status || !code || !stock)
            res.status(400).json({result :"error", payload: "Parametros no definidos"})     

        const msg = await productModel.create({title, description, price, status, thumbnail, code, stock})
        res.status(200).json({result :"success", payload: msg}) 
    }catch{
        return res.status(500).json({message:"Error durante el alta del producto."})
    }
})

router.put('/:idProduct', async(req, res)=>{
    try{
        const idProduct = req.params.idProduct
        const productUpdated = req.body

        if (!productUpdated.title || !productUpdated.description || !productUpdated.price || !productUpdated.status || !productUpdated.code || !productUpdated.stock)
            res.status(400).json({result :"error", payload: "Parametros no definidos"})     

        const msg = await productModel.updateOne({_id:idProduct}, productUpdated)
        res.status(200).json({result :"success", payload: msg}) 
    }catch{
        return res.status(500).json({message:'Error durante la actualización del producto.'})
    }
})

router.delete('/:idProduct', async(req, res)=>{
    try{
        const idProduct = req.params.idProduct
        const msg = await productModel.deleteOne({_id : idProduct})
        res.status(200).json({result :"success", payload: msg}) 
    }catch{
        console.log(error)
        return res.status(500).json({message :'Error durante la eliminación del producto.'})
    }
})

export default router