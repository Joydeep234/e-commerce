import mongoose from "mongoose";

const cartSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user",
  },
  items: [
    {
      sellingProducts: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      items: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const cart = mongoose.model("cart", cartSchema);

export default cart;
