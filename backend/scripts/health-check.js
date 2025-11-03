#!/usr/bin/env node
import mongoose from "mongoose";
import { fileURLToPath } from "url";
import path from "path";

// Handle ES6 __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function healthCheck() {
  try {
    console.log("🏥 Running health check...");

    // Check MongoDB connection
    const mongoUri =
      process.env.MONGODB_URI || "mongodb://localhost:27017/sci-solia";
    await mongoose.connect(mongoUri);
    console.log("✅ MongoDB connection: OK");

    // Import models dynamically
    const AuditLog = (await import("../models/AuditLog.js")).default;
    const RefreshToken = (await import("../models/RefreshToken.js")).default;

    // Create indexes for performance
    await AuditLog.collection.createIndex({ userId: 1, timestamp: -1 });
    await AuditLog.collection.createIndex({ action: 1, timestamp: -1 });
    await RefreshToken.collection.createIndex(
      { expiresAt: 1 },
      { expireAfterSeconds: 0 },
    );

    console.log("✅ Indexes created successfully");

    // Clean up expired refresh tokens
    const result = await RefreshToken.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    console.log(`🧹 Cleaned up ${result.deletedCount} expired refresh tokens`);

    console.log("✅ Health check completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Health check failed:", error);
    process.exit(1);
  }
}

// Run if called directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  healthCheck();
}

export default healthCheck;
