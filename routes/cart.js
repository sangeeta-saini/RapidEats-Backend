import express from "express";
import CartModel from "../models/cart.model.js";

const router = express.Router();

// GET /cart - fetch user's cart
router.get("/", async (req, res) => {
  const userId = req.headers["user-id"];
  if (!userId) return res.status(400).json({ message: "User ID is required" });

  const cart = await CartModel.findOne({ userId });
  res.json(cart || { userId, items: [] });
});

// POST /cart/add - add a dish to cart
router.post("/add", async (req, res) => {
  const { userId, dishId } = req.body;

  if (!userId || !dishId)
    return res.status(400).json({ message: "userId and dishId required" });

  const dish = await DishModel.findById(dishId);
  if (!dish) return res.status(404).json({ message: "Dish not found" });

  let cart = await CartModel.findOne({ userId });

  if (!cart) {
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
    const item = cart.items.find((i) => i.dishId.toString() === dishId);
    if (item) {
      item.quantity += 1;
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
});

// PUT /cart/update/:dishId - update quantity
router.put("/update/:dishId", async (req, res) => {
  const { userId, quantity } = req.body;
  const { dishId } = req.params;

  if (!userId || !dishId || quantity < 1)
    return res.status(400).json({ message: "Invalid input" });

  const cart = await CartModel.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  const item = cart.items.find((i) => i.dishId.toString() === dishId);
  if (!item) return res.status(404).json({ message: "Item not in cart" });

  item.quantity = quantity;

  await cart.save();
  res.json(cart);
});

// DELETE /cart/remove/:dishId - remove one dish from cart
router.delete("/remove/:dishId", async (req, res) => {
  const { userId } = req.body;
  const { dishId } = req.params;

  const cart = await CartModel.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = cart.items.filter((i) => i.dishId.toString() !== dishId);
  await cart.save();

  res.json(cart);
});

// DELETE /cart/clear - clear entire cart
router.delete("/clear", async (req, res) => {
  const { userId } = req.body;

  const cart = await CartModel.findOne({ userId });
  if (!cart) return res.status(404).json({ message: "Cart not found" });

  cart.items = [];
  await cart.save();

  res.json({ message: "Cart cleared", cart });
});

export default router;
