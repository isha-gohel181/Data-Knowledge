import mongoose from 'mongoose';

const heroSectionSchema = new mongoose.Schema(
  {
    headlinePrefix: {
      type: String,
      default: 'Master Practical Data Analytics,',
      trim: true,
    },
    headlineHighlight: {
      type: String,
      default: 'Data Science, ML & AI',
      trim: true,
    },
    description: {
      type: String,
      default:
        'At Data Knowledge, our mission is to provide practical and industry-focused training in tools like SQL, Excel, Power BI, Tableau, Python, and Business Analysis. Gain real-world skills that companies actually look for in data analyst and data science roles.',
      trim: true,
    },
    primaryButtonText: {
      type: String,
      default: 'Explore Programs',
      trim: true,
    },
    primaryButtonLink: {
      type: String,
      default: '/courses',
      trim: true,
    },
    showPrimaryButton: {
      type: Boolean,
      default: true,
    },
    secondaryButtonText: {
      type: String,
      default: 'Book Consultation',
      trim: true,
    },
    secondaryButtonAction: {
      type: String,
      enum: ['consultation_modal', 'custom_link'],
      default: 'consultation_modal',
    },
    secondaryButtonLink: {
      type: String,
      default: '',
      trim: true,
    },
    showSecondaryButton: {
      type: Boolean,
      default: true,
    },
    mentorImage: {
      type: String,
      default: '/data_knowlege/mentor/mentore_2.png',
      trim: true,
    },
    mentorImageAlt: {
      type: String,
      default: 'Data Knowledge Mentors',
      trim: true,
    },
    badgeText: {
      type: String,
      default: '',
      trim: true,
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

const HeroSection = mongoose.models.HeroSection || mongoose.model('HeroSection', heroSectionSchema);
export default HeroSection;
