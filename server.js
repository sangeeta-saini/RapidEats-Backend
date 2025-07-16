import express from "express";
import env from "dotenv";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import UserRoutes from "./routes/user.js";
import cors from "cors";
import MockRoutes from "./routes/mockRoutes.js";
import restaurantData from "./Data/restaurantData.js";
import RestaurantModel from "./models/restaurants.model.js";

env.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use("/user", UserRoutes);
app.use("/api", MockRoutes);

const port = process.env.PORT || 9000;

const dbURI = "mongodb://localhost:27017/fooddelivery";
console.log(dbURI);

async function importData() {
  try {
    mongoose.connect(dbURI).then((result) => {
      console.log("connection is sucessfull");
    });
    // await RestaurantModel.deleteMany();

    const count = await RestaurantModel.countDocuments();
    if (count === 0) {
      await RestaurantModel.insertMany(restaurantData);
      console.log("Data imported sucessfully");
    } else {
      console.log(" Data already exists. Skipping import.");
    }
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
  }
}

importData();

console.log("something is happing here");

app.listen(port, () => {
  console.log(`server is runing on port http://localhost:${port}`);
});
