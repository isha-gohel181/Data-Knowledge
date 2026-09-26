import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

async function main() {
  await mongoose.connect(process.env.MONGO_URI);
  const User = mongoose.models.User || mongoose.model("User", new mongoose.Schema({ email: String, role: String, fullName: String, status: String, isActive: Boolean }, { strict: false }));
  const admins = await User.find({ role: { $in: ["admin", "super_admin"] } });
  console.log("Admins count:", admins.length);
  admins.forEach(a => console.log(`- ID: ${a._id}, Email: ${a.email}, Role: ${a.role}, Name: ${a.fullName}`));
  await mongoose.disconnect();
}

main().catch(console.error);
