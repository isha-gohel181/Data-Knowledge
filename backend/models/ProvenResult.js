import mongoose from 'mongoose';

const provenResultSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    salary: {
      type: String,
      default: 'Salary: 12 LPA',
      trim: true,
    },
    transitionTag: {
      type: String,
      default: 'Non-Tech to Tech Transition',
      trim: true,
    },
    badge: {
      type: String,
      default: '★ SUCCESS STORY',
      trim: true,
    },
    image: {
      type: String,
      default: '',
    },
    order: {
      type: Number,
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

provenResultSchema.index({ isActive: 1, order: 1, createdAt: -1 });

const ProvenResult = mongoose.model('ProvenResult', provenResultSchema);
export default ProvenResult;
