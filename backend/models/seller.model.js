import mongoose from "mongoose";
// Declare the Schema of the Mongo model
var sellerSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  landmark: {
    type: String,
    required: true,
  },
  sellingProducts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
    },
  ],
});

//Export the model
const seller = mongoose.model("seller",sellerSchema);

export default seller;
