import mongoose from "mongoose";
const schema = mongoose.Schema;

const addressSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  name: String,
  mobile: String,
  pincode: String,
  state: String,
  address: String,
  street: String,
  city: String,
  typeOfAddress: {
    type: String,
    enum: ["Home", "Office"],
    default: "Home",
  },
});

export default mongoose.model("address", addressSchema);
