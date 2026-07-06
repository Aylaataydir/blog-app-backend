/**
 * One-time script to create an admin user
 * Run with: npm run create-admin
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";

// Load environment variables
dotenv.config();

const createAdmin = async () => {
    try {
        // Connect to database
        const dbUri = process.env.DB_URI;
        if (!dbUri) {
            console.error("❌ DB_URI is not defined in environment variables");
            process.exit(1);
        }

        await mongoose.connect(dbUri);
        console.log("✅ Database connected");

        // Admin user details - CHANGE THESE VALUES
        const adminData = {
            username: "admin",
            email: "aylaataydir@gmail.com",
            password: "AdminAyla123!",  // Must meet password requirements
            firstName: "Admin",
            lastName: "Admin",
            isActive: true,
            isStaff: true,
            isAdmin: true
        };

        // Check if admin already exists
        const existingAdmin = await User.findOne({
            $or: [
                { email: adminData.email },
                { username: adminData.username }
            ]
        });

        if (existingAdmin) {
            console.log("⚠️  Admin user already exists!");
            console.log(`Username: ${existingAdmin.username}`);
            console.log(`Email: ${existingAdmin.email}`);
            process.exit(0);
        }

        // Create admin user
        const admin = await User.create(adminData);

        console.log("\n✅ Admin user created successfully!");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log(`Username: ${admin.username}`);
        console.log(`Email: ${admin.email}`);
        console.log(`Password: ${adminData.password}`);
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("\n⚠️  Please save these credentials in a secure location!");
        console.log("⚠️  Consider changing the password after first login.\n");

    } catch (error) {
        console.error("❌ Error creating admin user:", error);
        if (error instanceof Error) {
            console.error(error.message);
        }
        process.exit(1);
    } finally {
        // Close database connection
        await mongoose.connection.close();
        console.log("Database connection closed");
        process.exit(0);
    }
};

// Run the script
createAdmin();
