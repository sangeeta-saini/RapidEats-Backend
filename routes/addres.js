import express from "express";

import AddressModel from "../models/address.model.js";

const router = express.Router({ mergeParams: true });

router.post("/add", async (req, res) => {
  try {
    const address = new AddressModel(req.body);
    await address.save();
    res.status(201).json(address);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.get("/:userId", async (req, res) => {
  try {
    const addresses = await AddressModel.find({ userId: req.params.userId });
    res.json(addresses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:addressId", async (req, res) => {
  try {
    const updated = await AddressModel.findByIdAndUpdate(
      req.params.addressId,
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

router.delete("/:addressId", async (req, res) => {
  try {
    await AddressModel.findByIdAndDelete(req.params.addressId);
    res.json({ message: "Address deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
