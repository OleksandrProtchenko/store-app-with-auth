import express from "express";
import mongoose from "mongoose";
import Orders from "../models/orders.model.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const validateProductPayload = (payload) => {
  if (!payload || typeof payload !== "object") {
    return "Product payload is required";
  }

  const { title, type, serialNumber, guarantee, price } = payload;

  if (!title || typeof title !== "string") return "Product title is required";
  if (!type || typeof type !== "string") return "Product type is required";
  if (serialNumber === undefined || Number.isNaN(Number(serialNumber))) {
    return "Product serialNumber must be a number";
  }

  if (!guarantee || typeof guarantee !== "object") {
    return "Product guarantee is required";
  }

  if (!guarantee.start || !guarantee.end) {
    return "Product guarantee.start and guarantee.end are required";
  }

  if (!Array.isArray(price) || price.length === 0) {
    return "Product price must be a non-empty array";
  }

  const invalidPrice = price.find(
    (p) =>
      p == null ||
      Number.isNaN(Number(p.value)) ||
      typeof p.symbol !== "string" ||
      p.symbol.length === 0,
  );

  if (invalidPrice)
    return "Each price item must contain numeric value and symbol";

  return null;
};

// GET all orders
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Orders.find({ userId: req.user.userId });
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: "Fetch orders error", error: err.message });
  }
});

// CREATE order
router.post("/", auth, async (req, res) => {
  try {
    const { title, description, date } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        message: "title and description are required",
      });
    }

    const order = await Orders.create({
      title,
      description,
      date: date || new Date().toISOString(),
      products: [],
      userId: req.user.userId,
    });

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: "Create order error", error: err.message });
  }
});

// UPDATE order
router.put("/:id", auth, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const { title, description, date } = req.body;
    const updateFields = {};
    if (title !== undefined) updateFields.title = title;
    if (description !== undefined) updateFields.description = description;
    if (date !== undefined) updateFields.date = date;

    const order = await Orders.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.userId },
      { $set: updateFields },
      { new: true, runValidators: true },
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (err) {
    res.status(400).json({ message: "Update order error", error: err.message });
  }
});

// DELETE order
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }

    const result = await Orders.deleteOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!result.deletedCount) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({ message: "Order deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete order error", error: err.message });
  }
});

// ADD product
router.post("/:id/products", auth, async (req, res) => {
  try {
    if (!isValidId(req.params.id)) {
      return res.status(400).json({ message: "Invalid order id" });
    }
    const validationError = validateProductPayload(req.body);
    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const order = await Orders.findOne({
      _id: req.params.id,
      userId: req.user.userId,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.products.push(req.body);
    await order.save();

    res.status(201).json(order);
  } catch (err) {
    res.status(400).json({ message: "Add product error", error: err.message });
  }
});

// DELETE product
router.delete("/:orderId/products/:productId", auth, async (req, res) => {
  try {
    const { orderId, productId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(orderId) ||
      !mongoose.Types.ObjectId.isValid(productId)
    ) {
      return res.status(400).json({ message: "Invalid orderId or productId" });
    }

    const order = await Orders.findOne({
      _id: orderId,
      userId: req.user.userId,
    });
    if (!order) return res.status(404).json({ message: "Order not found" });

    const before = order.products.length;
    order.products = order.products.filter(
      (p) => p._id.toString() !== productId,
    );

    if (order.products.length === before) {
      return res.status(404).json({ message: "Product not found in order" });
    }

    await order.save();
    res.json(order);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Delete product error", error: err.message });
  }
});

export default router;
