import mongoose from "mongoose";
const schema = mongoose.Schema;

const CartItemSchema = new mongoose.Schema({
  productId: String,
  price: Number,
  quantity: Number,
  images: {
    type: Array,
    default: [],
  },
});

const CartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  items: [CartItemSchema],
});

export default mongoose.model("addbag", CartSchema);
