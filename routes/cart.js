import express from "express";
import CartModel from "../models/cart.model.js";
import RestaurantModel from "../models/restaurants.model.js";

const router = express.Router();

// Get the cart for a user
router.get("/", async (req, res) => {
  const userId = req.headers["user_id"];
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  try {
    const cart = await CartModel.findOne({ userId });
    res.json(cart || { userId, items: [] });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch cart", error: err.message });
  }
});

// Add dish to cart
router.post("/", async (req, res) => {
  const { userId, dishId } = req.body;

  if (!userId || !dishId) {
    return res.status(400).json({ message: "userId and dishId required" });
  }

  try {
    // Find the dish from restaurant's menu
    const restaurant = await RestaurantModel.findOne({ "menu._id": dishId });
    if (!restaurant) return res.status(404).json({ message: "Dish not found" });

    const dish = restaurant.menu.find((item) => item._id.toString() === dishId);
    if (!dish)
      return res.status(404).json({ message: "Dish not found in menu" });

    let cart = await CartModel.findOne({ userId });

    if (!cart) {
      // Create new cart with the dish
      cart = new CartModel({
        userId,
        items: [
          {
            dishId: dish._id,
            name: dish.name,
            price: dish.price,
            image: dish.image,
            quantity: 1,
          },
        ],
      });
    } else {
      // Check if dish is already in cart
      const existingItem = cart.items.find(
        (i) => i.dishId && i.dishId.toString() === dishId
      );

      if (existingItem) {
        existingItem.quantity += 1;
      } else {
        cart.items.push({
          dishId: dish._id,
          name: dish.name,
          price: dish.price,
          image: dish.image,
          quantity: 1,
        });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to add to cart", error: err.message });
  }
});

router.put("/update", async (req, res) => {
  const { userId, dishId, quantity } = req.body;

  if (!userId || !dishId || typeof quantity !== "number") {
    return res
      .status(400)
      .json({ message: "userId, dishId, and quantity are required" });
  }

  try {
    const cart = await CartModel.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const item = cart.items.find((i) => i.dishId.toString() === dishId);
    if (!item) {
      return res.status(404).json({ message: "Dish not found in cart" });
    }

    if (quantity <= 0) {
      // Remove the item if quantity is 0 or less
      cart.items = cart.items.filter((i) => i.dishId.toString() !== dishId);
    } else {
      // Update the quantity
      item.quantity = quantity;
    }

    await cart.save();
    res.status(200).json({ message: "Cart updated successfully", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    res
      .status(500)
      .json({ message: "Failed to update cart", error: error.message });
  }
});

export default router;
