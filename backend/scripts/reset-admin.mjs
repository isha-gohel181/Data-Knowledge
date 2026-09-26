import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

const salt = parseInt(process.env.SALT) || 10;

const adminAccounts = [
  {
    email: "admin@dataknowledge.in",
    password: "Admin@123",
    fullName: "Data Knowledge Admin",
    role: "super_admin",
  }
];

const userSchema = new mongoose.Schema(
  {
    fullName: { type: String, trim: true, required: true },
    email: { type: String, required: true, lowercase: true, trim: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["admin", "instructor", "student", "news_editor", "super_admin"],
      default: "student",
    },
    is_verify: { type: Boolean, default: false },
    profilePicture: { type: String, default: "default-profile.png" },
    isActive: { type: Boolean, default: true },
    status: { type: String, enum: ["active", "inactive"], default: "active" },
    emailVerified: { type: Boolean, default: true },
    isBanned: { type: Boolean, default: false },
    skipDeviceApproval: { type: Boolean, default: true },
  },
  { timestamps: true, strict: false }
);

async function main() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  for (const acc of adminAccounts) {
    const hashedPassword = await bcrypt.hash(acc.password, salt);
    const existing = await User.findOne({ email: acc.email.toLowerCase() });

    if (existing) {
      existing.password = hashedPassword;
      existing.role = acc.role;
      existing.fullName = acc.fullName;
      existing.isActive = true;
      existing.status = "active";
      existing.emailVerified = true;
      existing.isBanned = false;
      existing.skipDeviceApproval = true;
      await existing.save();
      console.log(`✅ Admin credentials updated for: ${acc.email}`);
    } else {
      const newAdmin = new User({
        fullName: acc.fullName,
        email: acc.email.toLowerCase(),
        password: hashedPassword,
        role: acc.role,
        is_verify: true,
        isActive: true,
        status: "active",
        emailVerified: true,
        isBanned: false,
        skipDeviceApproval: true,
      });
      await newAdmin.save();
      console.log(`✅ Admin user created: ${acc.email}`);
    }
  }

  console.log("\n=================================");
  console.log("🔐 ADMIN LOGIN CREDENTIALS:");
  console.log("=================================");
  adminAccounts.forEach(acc => {
    console.log(`📧 Email    : ${acc.email}`);
    console.log(`🔑 Password : ${acc.password}`);
    console.log(`👑 Role     : ${acc.role}`);
    console.log("---------------------------------");
  });

  await mongoose.disconnect();
  console.log("🔌 Disconnected. Done!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
