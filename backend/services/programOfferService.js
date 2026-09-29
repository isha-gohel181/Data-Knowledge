import ProgramOffer from '../models/ProgramOffer.js';

const DEFAULT_SEEDS = [
  {
    title: 'Master Data Analytics, Engineering & Science',
    shortTitle: 'Combo Track',
    badge: 'Flagship Combo',
    icon: 'star',
    highlights: [
      'Data Analytics, Data Engineering & Data Science (3-in-1 Track)',
      '25+ Industry Capstones with Real Enterprise Datasets',
      'Daily Live Online Interactive Classes & 1-on-1 Mentorship'
    ],
    tools: ['Python', 'SQL', 'Power BI', 'Tableau', 'PySpark', 'Databricks', 'Snowflake', 'AWS'],
    courseId: '',
    order: 0,
    isActive: true,
  },
  {
    title: 'Master Data & Business Analyst',
    shortTitle: 'Data Analyst',
    badge: 'Most Popular',
    icon: 'analytics',
    highlights: [
      'Advanced Excel, SQL Querying & Relational Data Modeling',
      'Interactive KPI Dashboards with Power BI & Tableau',
      'Python Analytics & 10 Enterprise Business Case Studies'
    ],
    tools: ['Excel', 'SQL', 'Power BI', 'Tableau', 'Python', 'Jira'],
    courseId: '',
    order: 1,
    isActive: true,
  },
  {
    title: 'Master Data Engineering',
    shortTitle: 'Data Engineering',
    badge: 'High Demand',
    icon: 'cloud',
    highlights: [
      'Big Data Processing with Apache PySpark & Python',
      'Databricks Lakehouse Architecture & Orchestration',
      'Snowflake Cloud Data Warehousing & AWS/Azure ETL'
    ],
    tools: ['PySpark', 'Databricks', 'Snowflake', 'SQL', 'Python', 'AWS'],
    courseId: '',
    order: 2,
    isActive: true,
  },
  {
    title: 'Master Data Science & Machine Learning',
    shortTitle: 'Data Science & AI',
    badge: 'Next-Gen AI',
    icon: 'sparkles',
    highlights: [
      'Applied Statistics & Exploratory Data Analysis in Python',
      'Supervised & Unsupervised Scikit-Learn ML Algorithms',
      'Production ML Model Deployment & Real-time AI APIs'
    ],
    tools: ['Python', 'Pandas', 'NumPy', 'Scikit-Learn', 'Statistics', 'Power BI'],
    courseId: '',
    order: 3,
    isActive: true,
  },
];

export const seedDefaultProgramsIfEmpty = async () => {
  const count = await ProgramOffer.countDocuments();
  if (count === 0) {
    await ProgramOffer.insertMany(DEFAULT_SEEDS);
  } else {
    // Backfill icon if missing on existing documents
    const existing = await ProgramOffer.find({ $or: [{ icon: { $exists: false } }, { icon: '' }, { icon: null }] });
    for (const doc of existing) {
      if (doc.shortTitle?.toLowerCase().includes('combo')) doc.icon = 'star';
      else if (doc.shortTitle?.toLowerCase().includes('analyst')) doc.icon = 'analytics';
      else if (doc.shortTitle?.toLowerCase().includes('engineering')) doc.icon = 'cloud';
      else if (doc.shortTitle?.toLowerCase().includes('science')) doc.icon = 'sparkles';
      else doc.icon = 'star';
      await doc.save();
    }
  }
};

export const getPrograms = async (filter = {}) => {
  await seedDefaultProgramsIfEmpty();
  return await ProgramOffer.find(filter).sort({ order: 1, createdAt: 1 });
};

export const getProgramById = async (id) => {
  return await ProgramOffer.findById(id);
};

export const createProgram = async (data) => {
  const program = new ProgramOffer(data);
  return await program.save();
};

export const updateProgram = async (id, data) => {
  return await ProgramOffer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

export const deleteProgram = async (id) => {
  return await ProgramOffer.findByIdAndDelete(id);
};

export const toggleProgramStatus = async (id) => {
  const program = await ProgramOffer.findById(id);
  if (!program) {
    throw new Error('Program not found');
  }
  program.isActive = !program.isActive;
  return await program.save();
};
