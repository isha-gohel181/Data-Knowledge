import mongoose from 'mongoose';

const statSchema = new mongoose.Schema({
  label: { type: String, required: true },
  value: { type: String, required: true }
}, { _id: false });

const mentorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: { type: String, required: true },
  exCompanies: [{ type: String }],
  experienceBadge: { type: String },
  image: { type: String },
  stats: [statSchema],
  bio: [{ type: String }], // Array of strings for paragraphs
  skills: [{ type: String }],
  accentGradient: { type: String },
  glowColor: { type: String },
  borderColor: { type: String },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

export default mongoose.model('Mentor', mentorSchema);
