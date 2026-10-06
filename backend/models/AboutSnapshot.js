import mongoose from 'mongoose';

const aboutSnapshotSchema = new mongoose.Schema(
  {
    badgeText: {
      type: String,
      default: 'About Data Knowledge',
      trim: true,
    },
    headlinePrefix: {
      type: String,
      default: 'Empowering Learners with',
      trim: true,
    },
    headlineHighlight: {
      type: String,
      default: 'Real-World Skills.',
      trim: true,
    },
    paragraph1: {
      type: String,
      default:
        'At Data Knowledge, our mission is to provide practical and industry-focused training in tools like SQL, Excel, Power BI, Tableau, Python, and Business Analysis. Our courses are designed to help learners gain real-world skills that companies actually look for in data analyst and data science roles.',
      trim: true,
    },
    paragraph2: {
      type: String,
      default:
        'The training programs focus on hands-on learning, real-time projects, and step-by-step guidance so that students can confidently work on real business problems. Whether you are a beginner starting your data analytics journey or a working professional looking to upgrade your skills, our courses are structured to support your career growth.',
      trim: true,
    },
    bulletPoints: {
      type: [String],
      default: [
        'Hands-on training in SQL, Excel, Power BI, Tableau, Python & Business Analysis',
        'Learn from real industry experts with experience in Data Analytics, ML & AI',
        'Job-ready preparation with resume building, mock interviews & real-time projects',
        'Continuous project support, code reviews & personalized career mentorship',
      ],
    },
    primaryButtonText: {
      type: String,
      default: 'Discover More About Us',
      trim: true,
    },
    primaryButtonLink: {
      type: String,
      default: '/about-us',
      trim: true,
    },
    showPrimaryButton: {
      type: Boolean,
      default: true,
    },
    secondaryButtonText: {
      type: String,
      default: 'Explore Courses',
      trim: true,
    },
    secondaryButtonLink: {
      type: String,
      default: '/courses',
      trim: true,
    },
    showSecondaryButton: {
      type: Boolean,
      default: true,
    },
    image: {
      type: String,
      default: '/hero_section.png',
      trim: true,
    },
    imageAlt: {
      type: String,
      default: 'Data Knowledge Practical Learning',
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const AboutSnapshot =
  mongoose.models.AboutSnapshot || mongoose.model('AboutSnapshot', aboutSnapshotSchema);
export default AboutSnapshot;
