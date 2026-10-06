import mongoose from 'mongoose';

const whyChooseUsItemSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  desc: {
    type: String,
    required: true,
    trim: true,
  },
  highlight: {
    type: String,
    default: 'Advantage',
    trim: true,
  },
  iconType: {
    type: String,
    enum: ['mentors', 'mock-interviews', 'placement-support', 'projects', 'doubt-support', 'knowledge-guarantee', 'custom'],
    default: 'mentors',
  },
  iconBg: {
    type: String,
    default: 'bg-blue-50 text-[#3498db] border-blue-200/80',
  },
  badgeBg: {
    type: String,
    default: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  order: {
    type: Number,
    default: 0,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const whyChooseUsSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: 'The Data Knowledge Advantage',
      trim: true,
    },
    title: {
      type: String,
      default: 'Why Choose Us?',
      trim: true,
    },
    description: {
      type: String,
      default: 'Practical skills, industry-working mentors, and dedicated career placement support designed to get you hired.',
      trim: true,
    },
    items: [whyChooseUsItemSchema],
    ctaTitle: {
      type: String,
      default: 'Ready to start your data transformation?',
      trim: true,
    },
    ctaSubtitle: {
      type: String,
      default: 'Talk to our career advisors and get a personalized learning roadmap.',
      trim: true,
    },
    ctaButtonText: {
      type: String,
      default: 'Get Free Career Guidance',
      trim: true,
    },
    ctaButtonLink: {
      type: String,
      default: '/contact',
      trim: true,
    },
    showCtaBanner: {
      type: Boolean,
      default: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const WhyChooseUs = mongoose.models.WhyChooseUs || mongoose.model('WhyChooseUs', whyChooseUsSchema);
export default WhyChooseUs;
