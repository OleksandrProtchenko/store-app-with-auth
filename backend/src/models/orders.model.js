import mongoose from "mongoose";

const priceSchema = new mongoose.Schema(
  {
    value: { type: Number, required: true },
    symbol: { type: String, required: true },
    isDefault: { type: Number, enum: [0, 1], default: 0 },
  },
  { _id: false },
);

const productSchema = new mongoose.Schema(
  {
    serialNumber: { type: Number, required: true },
    isNew: Number,
    photo: String,
    title: { type: String, required: true },
    type: { type: String, required: true },
    specification: String,
    guarantee: {
      start: { type: String, required: true },
      end: { type: String, required: true },
    },
    price: {
      type: [priceSchema],
      required: true,
      validate: {
        validator: (arr) => Array.isArray(arr) && arr.length > 0,
        message: "At least one price is required",
      },
    },
    order: Number,
  },
  { timestamps: true },
);

const ordersSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    products: { type: [productSchema], default: [] },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Orders", ordersSchema);
