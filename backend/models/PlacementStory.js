import mongoose from 'mongoose';

const placementStorySchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true,
    },
    role: {
      type: String,
      default: 'Data Analyst',
      trim: true,
    },
    company: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
    },
    companyBadge: {
      type: String,
      default: 'Product Base Company',
      trim: true,
    },
    badge: {
      type: String,
      default: 'Data Analyst - In Just 40 Days',
      trim: true,
    },
    instagramUrl: {
      type: String,
      required: [true, 'Instagram URL is required'],
      trim: true,
    },
    thumbnail: {
      type: String,
      default: '',
    },
    video: {
      type: String,
      default: '',
    },
    handle: {
      type: String,
      default: 'learn.with.rushikesh',
      trim: true,
    },
    likesCount: {
      type: String,
      default: '120+',
      trim: true,
    },
    caption: {
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

placementStorySchema.index({ isActive: 1, order: 1, createdAt: -1 });

const PlacementStory = mongoose.model('PlacementStory', placementStorySchema);
export default PlacementStory;
