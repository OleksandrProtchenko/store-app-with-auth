import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    value: Number,
    symbol: String,
    isDefault: Number,
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    serialNumber: Number,
    isNew: Number,
    photo: String,
    title: String,
    type: String,
    specification: String,
    guarantee: {
      start: String,
      end: String,
    },
    price: [priceSchema],
    order: Number,
    date: String,
  },
  { timestamps: true },
);

const incomeSchema = new mongoose.Schema(
  {
    title: String,
    date: String,
    description: String,
    products: [productSchema],
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Income", incomeSchema);
