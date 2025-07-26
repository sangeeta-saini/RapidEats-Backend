import express from "express";
import mongoose from "mongoose";
import OrderModel from "../models/order.model.js";

const ObjectId = mongoose.Types.ObjectId;
const router = express.Router({ mergeParams: true });

const getObjectIds = (items) => {
  return items.map((id) => new ObjectId(id));
};
router.put("/:order_id/status", async (req, res) => {
  try {
    const { order_id } = req.params;
    if (!mongoose.isValidObjectId(order_id)) {
      return res.status(400).json({ message: `order_id is not a valid id` });
    }
    const { delivery_status } = req.body;
    if (!ORDER_STATUS.includes(delivery_status)) {
      return res
        .status(400)
        .json({ message: `delivery_status is not a valid status` });
    }

    const updatedOrder = await OrderModel.findByIdAndUpdate(
      order_id,
      { status: delivery_status },
      { new: true }
    );
    const productIds = getObjectIds(updatedOrder.items);
    const productsData = await ProductsModel.find({
      _id: productIds,
    });
    res.json({
      items: productsData,
      status: updatedOrder.status,
    });
  } catch (err) {
    res.status(500).json({ error: "Failed to update delivery status" });
  }
});

router.post("/", async (req, res) => {
  try {
    const { items } = req.body;
    if (!items) {
      return res.status(400).json({ message: "items is required" });
    }
    if (!Array.isArray(items)) {
      return res
        .status(400)
        .json({ message: "items must be an array of product ids" });
    }
    if (!items.length) {
      return res.status(400).json({ message: "items array can not be empty" });
    }

    const itemObjectIds = items.map((item) => {
      if (!mongoose.isValidObjectId(item.id)) {
        return res
          .status(400)
          .json({ message: `${item.id} is not a valid id` });
      }
      return new ObjectId(item.id);
    });

    let productsData = await ProductsModel.find({
      _id: {
        $in: itemObjectIds,
      },
    });

    productsData = productsData.map((product) => product.toJSON());

    if (productsData.length !== items.length) {
      return res
        .status(400)
        .json({ message: `some of the products does not exist` });
    }

    let productQtyMapping = {};
    let updatedProduct = items.map((item) => {
      productQtyMapping[item.id] = item.quantity;
      return ProductsModel.findOneAndUpdate(
        {
          _id: new ObjectId(item.id),
        },
        { $inc: { stock: -item.quantity } }, // use +x to increase
        { new: true }
      );
    });

    productsData = productsData.map((product) => {
      delete product.stock;
      delete product.rating;
      const productData = {
        ...product,
        quantity: productQtyMapping[product._id.toString()],
      };
      return productData;
    });

    await Promise.all(updatedProduct);

    const payload = {
      items,
      status: "Processing",
    };
    const newOrder = new OrderModel(payload);
    const savedOrder = await newOrder.save();
    res.status(200).json({
      items: productsData,
      status: savedOrder.status,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const orders = await OrderModel.find()
      .sort({ createdAt: -1 })
      .populate("shippingAddress");

    if (!orders.length) {
      return res.json({ orders: [] });
    }

    const orderData = [];

    for (const order of orders) {
      const items = order.items; // contains productId and quantity
      const productIds = items.map((item) => new ObjectId(item.productId));

      // Fetch product details
      const products = await ProductsModel.find({ _id: { $in: productIds } });

      // Merge product details with quantity
      const detailedItems = products.map((product) => {
        const matchingItem = items.find(
          (item) => item.productId === product._id.toString()
        );
        const productItem = product.toObject();

        return {
          ...productItem,
          quantity: matchingItem?.quantity || 0,
        };
      });

      orderData.push({
        _id: order._id,
        status: order.status,
        shippingAddress: order.shippingAddress,
        paymentMethod: order.paymentMethod,
        orderDate: order.orderDate,
        items: detailedItems,
      });
    }

    res.json({ orders: orderData });
  } catch (err) {
    console.error("Failed to fetch orders:", err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedOrder = await OrderModel.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    const product = await ProductsModel.find({
      _id: new ObjectId(updatedOrder.items[0]),
    });
    res.json({
      ...product,
      status: updatedOrder.status,
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await OrderModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
