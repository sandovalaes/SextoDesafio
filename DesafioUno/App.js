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

    constructor(){
        this.products = [];
    }

    addProduct(code, title, description, price, thumbnail, stock){
        let id;
        
        if (!code)          return console.log("El campo code es obligatorio");
        if (!title)         return console.log("El campo title es obligatorio");
        if (!description)   return console.log("El campo description es obligatorio");
        if (isNaN(price))   return console.log("El campo price es obligatorio");
        if (price === 0)    return console.log("El precio debe se mayor a 0");
        if (!thumbnail)     return console.log("El campo thumbnail es obligatorio");
        if (isNaN(stock))   return console.log("El campo stock es obligatorio");
        if (stock === 0)    return console.log("El stock debe se mayor a 0");

        const FindProduct = this.products.filter((item)=>item.code === code)

        if (FindProduct.length > 0)
            console.log(`El Producto ingresado posee un código existente! (Code = \"${code}\")`);
        else
        {
            id = (this.products.length == 0) ? 1 : this.products[this.products.length - 1].id + 1
            this.products.push(new Product(id, title, description, price, thumbnail, code, stock));
            console.info(`El producto \"${title}\" con id = ${id} fue creado exitosamente!`);
        }
    }
    
    getProducts(){
        this.products.forEach(product => {console.log(product)});
    }

    getProductById(id){
        const result = this.products.find(product => product.id == id);
        if(result)  console.log(result);
        else    console.log(`El Producto con id = ${id} no fue encontrado!`);
    }
}


const Manager =  new ProductManager();

Manager.addProduct("Pinza24","Pinza", "Pinza Reforzada Marca Dogo", 500, "imagen", 100);
Manager.addProduct("Marti00","Martillo Mediano", "Martillo Mediano Reforzado Marca Dogo", 750, "imagen", 25);
Manager.addProduct("Alam22","Rollo de Alambre", "Rollo de Alambre x 50 mts", 325, "imagen", 50);
Manager.addProduct("Dest45","Destornillador philips", "Destornillador Philips Marca Vessel Punta Imantada", 90, "imagen", 50);

Manager.getProducts();

Manager.addProduct("Pinza24","Pinza", "Pinza Reforzada", 500, "imagen", 100);

Manager.getProductById(2);

Manager.getProductById(7)