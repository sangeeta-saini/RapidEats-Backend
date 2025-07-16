import express from "express";
import fs from "fs";
import RestaurantModel from "../models/restaurants.model.js";

const router = express.Router();

let data = [];

try {
  const rawData = fs.readFileSync("./data/mock_food_delivery_data.json");
  data = JSON.parse(rawData);
  console.log("mock data loaded sucessfully");
} catch (error) {
  console.log("failed to load mock data", error.message);
}

router.get("/restaurants", async (req, res) => {
  try {
    const restaurants = await RestaurantModel.find();
    res.json(restaurants);
  } catch (error) {
    console.log("Eroor in /restaurants", error.message);
    res.status(500).json({ message: "Failed to get restaurants" });
  }
});

router.get("/restaurants/:id", async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findOne(req.params.id);
    if (!restaurant)
      return res.status(404).json({ message: "Restaurnts not found" });
    res.json(restaurant);
  } catch (err) {
    console.log("Error in /restaurnts/:id", err.message);
    res.status(500).json({ message: "Failed to get restaurants" });
  }
});

router.get("/restaurants/:id/menu", async (req, res) => {
  try {
    const restaurant = await RestaurantModel.findById(req.params.id);

    if (!restaurant) return res.status(404).json({ message: "Menu not found" });
    res.json(restaurant.menu);
  } catch (err) {
    console.log("Error in /restaurnts/:id/menu", err.message);
    res.status(500).json({ message: "Failed to get menu" });
  }
});

export default router;
