import fs from 'fs/promises'

class CartsManager{

    static lastId = 0;

    constructor(path){
        this.path = path;
        this.carts = [];
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

    async addProductToCart(cid,pid){
        try {

            this.carts =  await this.readFile();
            CartsManager.lastId = this.carts.length;

            const myCart = this.carts.find(item=>item.id == cid)

            if (!myCart){
    
                return { message:"El Carrito no existe"}
            }
            else{
                const {id, products} = myCart
                const myproduct = products.find(item=>item.id == pid)
                if (!myproduct){
                    const newItemCart = {id:pid, quantity:1 }
                    myCart.products.push(newItemCart)
                }
                else{
                    myproduct.quantity++
                }
                await fs.writeFile(this.path, JSON.stringify(this.carts,null,2));
                return "Producto Agregado al Carrito."
            }
            
            
        }catch(error){
            console.error('addProductToCart: Error al agregar el producto al carrito',error)
            return "addProductToCart: Error al agregar el producto al carrito."
        }
    }
    
    async addCart(newItem){
        try {
            const {products} = newItem

            this.carts =  await this.readFile();
            CartsManager.lastId = this.carts.length;

            const newCart = {
                id: ++CartsManager.lastId,
                products
            }

            this.carts.push(newCart)
            await fs.writeFile(this.path, JSON.stringify(this.carts,null,2));
            
            return "Carrito Agregado"
        }catch(error){
            console.error('addCart: Error al agregar un carrito',error)
            return "addCart: Error al agregar un carrito."
        }
    }

    async getCarritos(){
        try{
            return this.carts =  await this.readFile();
        }catch(error){
            console.error("getCarts: Error al listar los carritos",error);
            return []
        }
    }

    async getCarrito(id){
        try{
            this.carts =  await this.readFile();
            const carrito = this.carts.find(item=>item.id == id)
            if (!carrito)
                return "No existe el carrito solicitado"
            else
                return carrito
        }catch(error){
            console.error("getCart: Error al obtener el carrito",error);
            return []
        }
    }

    
}

export default CartsManager
