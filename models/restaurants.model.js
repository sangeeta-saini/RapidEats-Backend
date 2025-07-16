import mongoose from "mongoose";

const menuItemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  price: Number,
  isVeg: Boolean,
  image: String,
  rating: Number,
  description: String,
});

const restaurantSchema = new mongoose.Schema({
  id: Number,
  name: String,
  cuisine: String,
  rating: Number,
  location: String,
  image: String,
  menu: [menuItemSchema],
});

const RestaurantModel = mongoose.model("Restaurant", restaurantSchema);
export default RestaurantModel;
