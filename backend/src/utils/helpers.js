import { Reservation } from "../models/reservation.model.js";

// Function to clean expired reservations (daily execution)
export const cleanupExpiredReservations = async () => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = yesterday.toISOString().split("T")[0];

    const result = await Reservation.updateMany(
      {
        date: { $lt: yesterdayStr },
        status: "confirmed",
      },
      {
        status: "completed",
        updatedAt: new Date(),
      },
    );
      console.log(
          `${result.modifiedCount} reservations have been updated`
      );
  } catch (e) {
    console.error("Error at cleaning reservations", e);
  }
};
