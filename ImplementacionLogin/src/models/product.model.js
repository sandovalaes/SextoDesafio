import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = "Productos"

const productSchema = new mongoose.Schema(

    {
        title: { type: String, require: true, max:100},
        description: { type: String, require: true, max:100},
        price: { type: Number, require: true},
        status: { type: Boolean, require: true},
        thumbnail: { type: String, require: true, max:2000},
        code: { type: String, require: true, max:50},
        stock: { type: Number, require: true}
    }
)

productSchema.plugin(mongoosePaginate)

const productModel = mongoose.model(productCollection, productSchema)

export default productModel