import mongoose from "mongoose";

const cartCollection = "Carritos"

const cartSchema = new mongoose.Schema(
    {
        products: { 
            type:   [
                        {
                            product:{type :    mongoose.Schema.Types.ObjectId, ref: "Productos"},
                            quantity: {type : Number, default:1}
                        }
                    ] ,
            default: []        
        }
    }
)

const cartModel = mongoose.model(cartCollection, cartSchema)

export default cartModel