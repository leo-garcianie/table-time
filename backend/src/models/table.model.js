import mongoose from "mongoose";

const tableSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  capacity: { type: Number, required: true, min: 1, max: 20 },
  type: {
    type: String,
    enum: ["Window", "Center", "Terrace", "Private", "Bar", "Family"],
    required: true,
  },
  isActive: { type: Boolean, default: true },
  description: { type: String, trim: true },
});

export const Table = mongoose.model("Table", tableSchema);
