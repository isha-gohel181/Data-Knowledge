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
  console.error("❌ MONGO_URI not found in backend/.env");
  process.exit(1);
}

// Parse CLI flags (e.g. --admin-email=... --admin-password=... --user-email=... --user-password=...)
const args = process.argv.slice(2);
const getArg = (key, fallback) => {
  const arg = args.find((a) => a.startsWith(`--${key}=`));
  return arg ? arg.split("=")[1].trim() : fallback;
};

const ADMIN_EMAIL = getArg("admin-email", "admin@dataknowledge.in");
const ADMIN_PASSWORD = getArg("admin-password", "Admin@123");
const ADMIN_NAME = getArg("admin-name", "Data Knowledge Admin");

const USER_EMAIL = getArg("user-email", "student@dataknowledge.in");
const USER_PASSWORD = getArg("user-password", "Student@123");
const USER_NAME = getArg("user-name", "Demo Student");
const ONLY_ACCOUNT = getArg("only", "");

const accounts = [
  {
    email: ADMIN_EMAIL,
    password: ADMIN_PASSWORD,
    fullName: ADMIN_NAME,
    role: "super_admin",
    description: "Super Admin (Access to Admin Panel & all controls)",
  },
  {
    email: USER_EMAIL,
    password: USER_PASSWORD,
    fullName: USER_NAME,
    role: "student",
    description: "Regular Student / User (Access to Web portal)",
  },
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
    is_verify: { type: Boolean, default: true },
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
  console.log("\n=======================================================");
  console.log("🔗 Connecting to MongoDB Atlas...");
  console.log(`📡 URI: ${MONGO_URI.replace(/:([^@]+)@/, ":****@")}`);
  console.log("=======================================================\n");

  await mongoose.connect(MONGO_URI);
  console.log("✅ Successfully connected to MongoDB Database\n");

  const User = mongoose.models.User || mongoose.model("User", userSchema);

  const accountsToUpdate = ONLY_ACCOUNT
    ? accounts.filter((acc) => acc.description.toLowerCase().startsWith(ONLY_ACCOUNT.toLowerCase()))
    : accounts;

  if (accountsToUpdate.length === 0) {
    throw new Error(`Unknown account selector "${ONLY_ACCOUNT}". Use "admin" or "regular student".`);
  }

  for (const acc of accountsToUpdate) {
    const salt = 10;
    const hashedPassword = await bcrypt.hash(acc.password, salt);

    const existing = await User.findOne({ email: acc.email.toLowerCase() });

    if (existing) {
      existing.password = hashedPassword;
      existing.role = acc.role;
      existing.fullName = acc.fullName;
      existing.isActive = true;
      existing.status = "active";
      existing.emailVerified = true;
      existing.is_verify = true;
      existing.isBanned = false;
      existing.skipDeviceApproval = true;
      existing.passwordChangedAt = new Date();
      await existing.save();
      console.log(`🔄 UPDATED EXISTING ACCOUNT: ${acc.email} (${acc.role})`);
    } else {
      const newUser = new User({
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
        passwordChangedAt: new Date(),
      });
      await newUser.save();
      console.log(`✨ CREATED NEW ACCOUNT: ${acc.email} (${acc.role})`);
    }
  }

  console.log("\n=======================================================");
  console.log("🔐 USER CREDENTIALS READY FOR LOGIN:");
  console.log("=======================================================");
  accountsToUpdate.forEach((acc) => {
    console.log(`📌 ${acc.description}`);
    console.log(`   📧 Email    : ${acc.email}`);
    console.log(`   🔑 Password : ${acc.password}`);
    console.log(`   👑 Role     : ${acc.role}`);
    console.log("-------------------------------------------------------");
  });
  console.log("✅ All accounts are verified and device-approval bypassed.\n");

  await mongoose.disconnect();
  console.log("🔌 Database disconnected cleanly. Done!\n");
}

main().catch((err) => {
  console.error("❌ Error setting up accounts:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
