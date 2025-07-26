import mongoose from "mongoose";
const schema = mongoose.Schema;

const OrderSchema = new schema({
  userId: {
    type: String,
    required: true,
  },
  items: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
      images: {
        type: Array,
        default: [],
      },
    },
  ],
  shippingAddress: { type: String, required: true },

  paymentMethod: { type: String, required: true },
  orderDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Processing",
  },
});

export default mongoose.model("orders", OrderSchema);
