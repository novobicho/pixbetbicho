
import { execSync } from "child_process";

console.log("🔄 Starting database update process...");

try {
  console.log("📦 Syncing database schema with drizzle-kit...");
  // Run drizzle-kit push to update the database schema
  execSync("npx drizzle-kit push", { stdio: "inherit" });
  
  console.log("✅ Database update completed successfully!");
} catch (error) {
  console.error("❌ Error updating database:", error);
  process.exit(1);
}
