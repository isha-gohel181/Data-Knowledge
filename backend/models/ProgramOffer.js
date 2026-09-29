import mongoose from 'mongoose';

const programOfferSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Program title is required'],
      trim: true,
    },
    shortTitle: {
      type: String,
      required: [true, 'Short title is required'],
      trim: true,
    },
    badge: {
      type: String,
      default: 'Featured Program',
      trim: true,
    },
    icon: {
      type: String,
      default: 'star',
      trim: true,
    },
    highlights: {
      type: [String],
      default: [],
    },
    tools: {
      type: [String],
      default: [],
    },
    courseId: {
      type: String,
      default: '',
      trim: true,
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

const ProgramOffer = mongoose.model('ProgramOffer', programOfferSchema);
export default ProgramOffer;
