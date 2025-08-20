import app from "./src/app.js";
import { connectDB } from "./src/config/database.js";
import { cleanupExpiredReservations } from "./src/utils/helpers.js";

const PORT = process.env.PORT;

const initServer = async () => {
  try {
    // Connect to the database
    await connectDB();

    // Cleanup expired reservations
    setInterval(cleanupExpiredReservations, 24 * 60 * 60 * 1000); // Once a day

    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
      console.log(`API at http://localhost:${PORT}/api`);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

initServer();
