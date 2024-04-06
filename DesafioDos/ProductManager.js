const fs = require('fs').promises

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

class ProductManager{

    constructor(path){
        this.path = path;
        this.products = [];
        this.nextId = 1;
    }

    async readFile(){
        try{
                const data = await fs.readFile(this.path,'utf8')
                return JSON.parse(data);
        }catch(error){
            if (error.code === 'ENOENT')
                return [];
            else
                throw error;
        }
    }

    async addProduct(newProduct){
        try {
                let id;
            
                if (!newProduct.code)          return console.log("El campo code es obligatorio");
                if (!newProduct.title)         return console.log("El campo title es obligatorio");
                if (!newProduct.description)   return console.log("El campo description es obligatorio");
                if (isNaN(newProduct.price))   return console.log("El campo price es obligatorio");
                if (newProduct.price === 0)    return console.log("El precio debe se mayor a 0");
                if (!newProduct.thumbnail)     return console.log("El campo thumbnail es obligatorio");
                if (isNaN(newProduct.stock))   return console.log("El campo stock es obligatorio");
                if (newProduct.stock === 0)    return console.log("El stock debe se mayor a 0");
        
                this.products =  await this.readFile();
                const findProduct = this.products.find((item)=>item.code === newProduct.code)
        
                if (findProduct)
                {
                    console.log(`addProduct: El Producto a ingresar posee un código existente! (Code = \"${newProduct.code}\")`);
                    return false
                }
                else
                {
                    id = this.nextId ++
                    this.products.push(new Product(id, newProduct.title, newProduct.description, newProduct.price, newProduct.thumbnail, newProduct.code, newProduct.stock));
                    await fs.writeFile(this.path, JSON.stringify(this.products,null,2));
                    console.info(`addProduct: El producto \"${newProduct.title}\" con id = ${id} fue creado exitosamente!`);
                    return true
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
            if(result)  
                console.log(result);
            else    
                console.log(`getProduct: El Producto con id = ${id} no fue encontrado!`);

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
                await fs.writeFile(this.path, JSON.stringify(this.products,null,2));
                return true;
            }
            else
            {
                console.log("updateProduct: El producto a actualizar no existe!");
                return false
            }
        }catch(error){
            console.error('updateProduct: Error durante la actualización del archivo',error)
        }
    }

    async deleteProduct(id)
    {
        try{
            this.products =  await this.readFile();
            const findProduct = this.products.find(product => product.id === id)
            if (findProduct){
                const filteredProducts = this.products.filter(product => product.id !== id);
                await fs.writeFile(this.path, JSON.stringify(filteredProducts,null,2) );
                console.log("deleteProduct: Producto Eliminado");
                return true
            }
            else{
                console.log("deleteProduct: Producto a eliminar no existe!");
                return false
            }
        }catch(error){
            throw error
        }    
    }
}

module.exports = ProductManager

