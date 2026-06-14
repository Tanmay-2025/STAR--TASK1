import mongoose, {
  Schema,
  model,
  models,
} from "mongoose";

const InventoryLogSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    inventoryId: {
      type: Schema.Types.ObjectId,
      ref: "Inventory",
      required: true,
    },

    action: {
      type: String,
      enum: [
        "add",
        "update",
        "delete",
        "borrow_request",
        "approve",
        "reject",
        "return_request",
        "return_confirmed",
      ],
      required: true,
    },

    quantity: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

export default models.InventoryLog ||
  model(
    "InventoryLog",
    InventoryLogSchema
  );