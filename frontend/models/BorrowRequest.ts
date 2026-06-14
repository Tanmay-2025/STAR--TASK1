import { Schema, model, models } from "mongoose";

const BorrowRequestSchema = new Schema(
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
    quantity: {
  type: Number,
  required: true,
  min: 1,
},

    status: {
      type: String,
      enum: [
        "pending",
        "approved",
        "rejected",
        "return_pending",
        "completed",
      ],
      default: "pending",
    },

    requestedAt: {
      type: Date,
      default: Date.now,
    },

    approvedAt: {
      type: Date,
    },

    returnedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const BorrowRequest =
  models.BorrowRequest ||
  model("BorrowRequest", BorrowRequestSchema);

export default BorrowRequest;