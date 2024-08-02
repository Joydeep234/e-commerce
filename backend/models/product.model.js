import mongoose from 'mongoose'
// Declare the Schema of the Mongo model
var productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  product_img_url: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    default: 0,
  },
  catagory: {
    type: String,
    required: true,
  }
});

//Export the model
const product = mongoose.model('Product', productSchema);
export default product;