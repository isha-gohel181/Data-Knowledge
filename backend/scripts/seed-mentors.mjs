import mongoose from "mongoose";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, resolve } from "path";
import Mentor from "../models/Mentor.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: resolve(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI;
if (!MONGO_URI) {
  console.error("❌ MONGO_URI not found in .env");
  process.exit(1);
}

const defaultMentors = [
  {
    name: 'Rushikesh',
    role: 'Data Science Mentor',
    exCompanies: ['Ex-Cognizant', 'Ex-PwC'],
    experienceBadge: '4+ Years Industry Experience',
    image: '/data_knowlege/mentor/Rushikesh.jpeg',
    stats: [
      { label: 'Industry Exp', value: '4+ Yrs' },
      { label: 'Teaching Exp', value: '2+ Yrs' },
      { label: 'Mentored', value: '500+' }
    ],
    bio: [
      'Rushikesh brings 4+ years of industry experience from leading global consulting firms like Cognizant and PwC. Along with his industry expertise, he has 2+ years of dedicated teaching experience training aspiring data professionals.',
      'Known for turning complex data concepts into simple, practical lessons that anyone can master. With an unwavering focus on real-world projects, hands-on practice, and industry-ready tools, he has helped hundreds of learners transition into Data Analytics and Data Science roles.'
    ],
    skills: ['Python', 'SQL', 'Data Analytics', 'Machine Learning', 'Business Strategy', 'Power BI'],
    accentGradient: 'from-blue-500/10 via-[#3498db]/15 to-transparent',
    glowColor: 'shadow-blue-500/15',
    borderColor: 'hover:border-[#3498db]',
    status: 'active'
  },
  {
    name: 'Krishna',
    role: 'Senior Data Science Instructor & Industry Mentor',
    exCompanies: ['5+ Yrs Industry Veteran', 'Senior Instructor'],
    experienceBadge: '5+ Years Analytics Experience',
    image: '/data_knowlege/mentor/krishna.jpeg',
    stats: [
      { label: 'Analytics Exp', value: '5+ Yrs' },
      { label: 'Students Trained', value: '800+' },
      { label: 'Project Rating', value: '4.9/5' }
    ],
    bio: [
      'Krishna possesses 5+ years of extensive experience across Data Science, Analytics, and Business Analysis. Having mentored hundreds of successful learners, she specializes in transforming theoretical concepts into enterprise-grade data solutions.',
      'Her teaching approach focuses on practical business projects and the critical skills demanded in today’s data-driven marketplace—delivering clarity, respectful guidance, and tangible career outcomes for every learner.'
    ],
    skills: ['Python', 'SQL', 'Power BI', 'Tableau', 'Machine Learning', 'Business Analytics'],
    accentGradient: 'from-cyan-500/10 via-[#3498db]/15 to-transparent',
    glowColor: 'shadow-cyan-500/15',
    borderColor: 'hover:border-cyan-500',
    status: 'active'
  }
];

async function main() {
  console.log("🔗 Connecting to MongoDB...");
  await mongoose.connect(MONGO_URI);
  console.log("✅ Connected to MongoDB");

  for (const mentorData of defaultMentors) {
    const existing = await Mentor.findOne({ name: mentorData.name });

    if (existing) {
      console.log(`ℹ️ Mentor already exists: ${mentorData.name}`);
    } else {
      const newMentor = new Mentor(mentorData);
      await newMentor.save();
      console.log(`✅ Default mentor created: ${mentorData.name}`);
    }
  }

  await mongoose.disconnect();
  console.log("🔌 Disconnected. Done!");
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  mongoose.disconnect();
  process.exit(1);
});
