import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  // productId: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: "Product",
  //   required: true,
  // },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    default: 1,
  },
  images: {
    type: [String],
    default: [],
  },
});

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
