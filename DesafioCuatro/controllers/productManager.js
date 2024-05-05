
import fs from "fs"

class Product{

    constructor(id ,title, description, price, thumbnail, code, stock){
        this.id = id,
        this.title = title,
        this.description = description,
        this.price = price,
        this.thumbnail = thumbnail,
        this.code = code,
        this.stock = stock
    }
}

export default class ProductManager{

    static lastId = 0;

    constructor(path){
        this.path = path;
        this.products = [];
    }

    async readFile(){
        try{
                const data = await fs.promises.readFile(this.path,'utf8')
                return JSON.parse(data);
        }catch(error){
            if (error.code === 'ENOENT')
                return [];
            else
                throw error;
        }
    }

    async addProduct(newItem){
        try {
                let { title, description, price, status, thumbnail, code, stock } = newItem

                if (!title)         return "El campo title es obligatorio";
                if (!description)   return "El campo description es obligatorio";
                if (isNaN(price))   return "El campo price es obligatorio)";
                if (!price)         return "El campo price es obligatorio)";
                if (price === 0)    return "El precio debe se mayor a 0";
                //if (!thumbnail)     return console.log("El campo thumbnail es obligatorio");
                if (!code)          return "El campo code es obligatorio";
                if (isNaN(stock))   return "El campo stock es obligatorio";
                if (!stock)         return "El campo stock es obligatorio";
                if (stock === 0)    return "El stock debe se mayor a 0";

                this.products =  await this.readFile();
                const longitud =  this.products.length;
                console.log(longitud)
                ProductManager.lastId = this.products[longitud-1].id + 1
                const findProduct = this.products.find((item)=>item.code === code)
        
                if (findProduct)
                {
                    console.log(`addProduct: El Producto a ingresar posee un código existente! (Code = \"${newItem.code}\")`);
                    return "Ya existe el producto a agregar"
                }
                else
                {
                    const newProduct = {
                        id: ProductManager.lastId,
                        title,
                        description,
                        price,
                        status,
                        thumbnail,
                        code,
                        stock
                    }

                    this.products.push(newProduct);
                    await fs.promises.writeFile(this.path, JSON.stringify(this.products,null,2));
                    console.info(`addProduct: El producto \"${title}\" con id = ${newProduct.id} fue creado exitosamente!`);
                    return "Producto Agregado"
                }
        }catch(error){
            console.error('addProduct: Error al agregar un producto',error)
        }
        
    }
    
    async getProducts(){
        try{
            return this.products =  await this.readFile();
        }catch(error){
            console.error("getProducts: Error al listar los productos",error);
            return []
        }
    }

    async getProductById(id){
        try{

            this.products =  await this.readFile();
            const result = this.products.find(product => product.id == id);
            
            return result
        }catch(error){
            console.error("getProduct: Error durante la lectura del archivo.",error);
        }
        
    }

    async updateProduct(updatedProduct){
        try{
            this.products =  await this.readFile();
            const result = this.products.find(product => product.id == updatedProduct.id);
    
            if (result){
                result.code  = updatedProduct.code;
                result.title = updatedProduct.title;
                result.description =  updatedProduct.description;
                result.price = updatedProduct.price;
                result.thumbnail = updatedProduct.thumbnail;
                result.stock = updatedProduct.stock;
                await fs.promises.writeFile(this.path, JSON.stringify(this.products,null,2));
                return "Producto Actualizado.";
            }
            else
            {
                console.log("updateProduct: El producto a actualizar no existe!");
                return "El producto a actualizar no existe!";
            }
        }catch(error){
            console.error('updateProduct: Error durante la actualización del archivo',error)
            return "Error durante la actualización del producto.";
        }
    }

    async deleteProduct(id)
    {
        try{
            this.products =  await this.readFile();
            const findProduct = this.products.find(product => product.id == id)
            if (findProduct){
                const filteredProducts = this.products.filter(product => product.id != id);
                await fs.promises.writeFile(this.path, JSON.stringify(filteredProducts,null,2) );
                console.log("deleteProduct: Producto Eliminado");
                return "Producto Eliminado"
            }
            else{
                console.log("deleteProduct: Producto a eliminar no existe!");
                return "El producto a eliminar no existe!"
            }
        }catch(error){
            throw error
        }    
    }
}



