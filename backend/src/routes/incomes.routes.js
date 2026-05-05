import express from "express";
import Income from "../models/income.model.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// GET all incomes
router.get("/", auth, async (req, res) => {
  const incomes = await Income.find({ userId: req.user.userId });
  res.json(incomes);
});

// CREATE income
router.post("/", auth, async (req, res) => {
  try {
    const income = await Income.create({
      ...req.body,
      userId: req.user.userId,
    });
    res.status(201).json(income);
  } catch (err) {
    res
      .status(400)
      .json({ message: "Create income error", error: err.message });
  }
});

// DELETE income
router.delete("/:id", auth, async (req, res) => {
  await Income.deleteOne({ _id: req.params.id, userId: req.user.userId });
  res.json({ message: "Income deleted" });
});

// ADD product
router.post("/:id/products", auth, async (req, res) => {
  const income = await Income.findOne({
    _id: req.params.id,
    userId: req.user.userId,
  });
  if (!income) return res.status(404).json({ message: "Income not found" });

  income.products.push(req.body);
  await income.save();

  res.json(income);
});

// DELETE product
router.delete("/:incomeId/products/:productId", auth, async (req, res) => {
  const income = await Income.findOne({
    _id: req.params.incomeId,
    userId: req.user.userId,
  });
  if (!income) return res.status(404).json({ message: "Income not found" });

  income.products = income.products.filter(
    (p) => p._id.toString() !== req.params.productId,
  );
  await income.save();

  res.json(income);
});

export default router;
