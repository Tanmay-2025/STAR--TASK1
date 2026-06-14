import { Schema, model, models } from "mongoose";

const InventorySchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    totalQuantity: {
      type: Number,
      required: true,
      min: 0,
    },

    availableQuantity: {
      type: Number,
      required: true,
      min: 0,
    },
    qrCode: {
  type: String,
},
    qrValue: {
  type: String,
},
  },
  {
    timestamps: true,
  }
);

const Inventory =
  models.Inventory || model("Inventory", InventorySchema);

export default Inventory;