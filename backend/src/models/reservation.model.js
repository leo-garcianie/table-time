import mongoose from "mongoose";

const reservationSchema = new mongoose.Schema({
  tableId: {
    type: Number,
    required: true,
    ref: "Table",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  date: {
    type: String,
    required: true,
    validate: {
      validator(value) {
        return new Date(value) >= new Date().setHours(0, 0, 0, 0);
      },
      message: "Invalid date format",
    },
  },
  time: {
    type: String,
    required: true,
    enum: [
      "12:00",
      "12:30",
      "13:00",
      "13:30",
      "14:00",
      "14:30",
      "19:00",
      "19:30",
      "20:00",
      "20:30",
      "21:00",
      "21:30",
      "22:00",
    ],
  },
  partySize: {
    type: Number,
    required: true,
    min: 1,
    max: 20,
  },
  customer: {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Invalid email address",
      ],
    },
    phone: { type: String, trim: true },
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "cancelled", "completed", "no-show"],
    default: "confirmed",
  },
  notes: { type: String, trim: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

reservationSchema.index({ date: 1, time: 1, tableId: 1 });
reservationSchema.index({ "customer.email": 1 });
reservationSchema.index({ status: 1 });

export const Reservation = mongoose.model("Reservation", reservationSchema);
