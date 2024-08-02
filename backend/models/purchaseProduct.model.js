import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var purchaseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  product_img_url: {
    type: String,
    required: true,
  },
  price: {
    type: number,
    required: true,
  },
  delivered:{
    type: Boolean,
    default:false
  }
});

//Export the model
module.exports = mongoose.model("Purchase", purchaseSchema);
