import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

import { User } from "../models/user.model.js";
import { Table } from "../models/table.model.js";
import { Reservation } from "../models/reservation.model.js";

dotenv.config();

// Generate sample users
const sampleUsers = [
  {
    name: "Admin User",
    email: "admin@restaurant.com",
    password: "admin123",
    role: "admin",
    phone: "+1 555 123 4567",
  },
  {
    name: "John Anderson",
    email: "john.anderson@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 555 987 6543",
  },
  {
    name: "Sarah Thompson",
    email: "sarah.thompson@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 555 234 5678",
  },
  {
    name: "David Robert",
    email: "david.martinez@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 555 876 5432",
  },
  {
    name: "Emily Johnson",
    email: "emily.johnson@example.com",
    password: "password123",
    role: "customer",
    phone: "+1 555 345 6789",
  },
];

// Generate tables
const sampleTables = [
  {
    id: 1,
    capacity: 2,
    type: "Window",
    description: "Romantic table by the window",
  },
  {
    id: 2,
    capacity: 4,
    type: "Center",
    description: "Perfect center table for families",
  },
  {
    id: 3,
    capacity: 6,
    type: "Private",
    description: "Private table for special occasions",
  },
  {
    id: 4,
    capacity: 2,
    type: "Terrace",
    description: "Table on the terrace with an outside view",
  },
  {
    id: 5,
    capacity: 4,
    type: "Center",
    description: "Comfortable center table",
  },
  {
    id: 6,
    capacity: 8,
    type: "Family",
    description: "Large table for family events",
  },
  {
    id: 7,
    capacity: 2,
    type: "Bar",
    description: "High table at the bar",
  },
  {
    id: 8,
    capacity: 4,
    type: "Window",
    description: "Table with panoramic view",
  },
  {
    id: 9,
    capacity: 6,
    type: "Center",
    description: "Spacious center table",
  },
  {
    id: 10,
    capacity: 3,
    type: "Terrace",
    description: "Intimate table on the terrace",
  },
  {
    id: 11,
    capacity: 5,
    type: "Center",
    description: "Versatile table for medium-sized groups",
  },
  {
    id: 12,
    capacity: 2,
    type: "Private",
    description: "Exclusive private table",
  },
];

// Generate reservations
const generateSampleReservations = (users) => {
  const reservations = [];
  const timeSlots = [
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
  ];

  // Generate reservations for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split("T")[0];

    const reservationsPerDay = Math.floor(Math.random() * 3) + 3;

    for (let j = 0; j < reservationsPerDay; j++) {
      const customer =
        users[Math.floor(Math.random() * (users.length - 1)) + 1];
      const tableId = Math.floor(Math.random() * 12) + 1;
      const time = timeSlots[Math.floor(Math.random() * timeSlots.length)];
      const partySize = Math.floor(Math.random() * 6) + 1;

      const conflict = reservations.find(
        (r) => r.date === dateStr && r.time === time && r.tableId === tableId,
      );

      if (!conflict) {
        reservations.push({
          tableId,
          userId: customer._id,
          date: dateStr,
          time,
          partySize,
          customer: {
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
          },
          status: Math.random() > 0.1 ? "confirmed" : "cancelled",
          notes: Math.random() > 0.7 ? "Favorite table by the window" : "",
          createdAt: new Date(
            Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000,
          ),
        });
      }
    }
  }

  return reservations;
};

// Seeding function
const seedDatabase = async () => {
  try {
    console.log("Seeding process..");

    // Connect to mongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("MongoDB connected successfully");

    // Clean existing data
    await User.deleteMany({});
    await Table.deleteMany({});
    await Reservation.deleteMany({});

    // Create users
    const hashedUsers = await Promise.all(
      sampleUsers.map(async (user) => ({
        ...user,
        password: await bcrypt.hash(user.password, 12),
      })),
    );

    const createdUsers = await User.insertMany(hashedUsers);
    console.log(`${createdUsers.length} users created`);

    // Create tables
    const createdTables = await Table.insertMany(sampleTables);
    console.log(`${createdTables.length} tables created`);

    // Create reservations
    const sampleReservations = generateSampleReservations(createdUsers);
    const createdReservations =
      await Reservation.insertMany(sampleReservations);
    console.log(`${createdReservations.length} reservations created`);

    // Summary
    console.log(`Users: ${createdUsers.length}`);
    console.log(`Tables: ${createdTables.length}`);
    console.log(`Reservations: ${createdReservations.length}`);

    console.log("\nSeeding completed!");
  } catch (error) {
    console.error("Error during seeding:", error);
  } finally {
    await mongoose.connection.close();
    console.log("Closed connection...");
    process.exit(0);
  }
};

// Handling command line arguments
const args = process.argv.slice(2);
seedDatabase();
