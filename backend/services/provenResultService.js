import ProvenResult from '../models/ProvenResult.js';

const defaultSeedResults = [
  {
    studentName: 'Puja Kumari',
    company: 'ITC INFOTECH',
    salary: 'Salary: 12 LPA',
    transitionTag: 'PLACED IN 83 DAYS',
    badge: '★ SUCCESS STORY',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop',
    order: 1,
    isActive: true,
  },
  {
    studentName: 'Rushikesh Tawre',
    company: 'IPG MEDIABRANDS',
    salary: 'Salary: 10 LPA',
    transitionTag: 'NON-TECH TO TECH TRANSITION',
    badge: '★ SUCCESS STORY',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=688&auto=format&fit=crop',
    order: 2,
    isActive: true,
  },
  {
    studentName: 'Abhishek Bhole',
    company: 'L&T',
    salary: 'Placed in 90 Days',
    transitionTag: 'MECHANICAL TO DATA ANALYST',
    badge: '★ SUCCESS STORY',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=688&auto=format&fit=crop',
    order: 3,
    isActive: true,
  },
  {
    studentName: 'Deepshi Soami',
    company: 'TCS & CGI',
    salary: 'Salary: 15 LPA',
    transitionTag: 'NON-TECH TO TECH TRANSITION',
    badge: '★ SUCCESS STORY',
    image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=688&auto=format&fit=crop',
    order: 4,
    isActive: true,
  },
  {
    studentName: 'Neha Mane',
    company: 'JP MORGAN',
    salary: 'Salary: 4 LPA',
    transitionTag: 'CS TO DATA ANALYST',
    badge: '★ SUCCESS STORY',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=688&auto=format&fit=crop',
    order: 5,
    isActive: true,
  },
  {
    studentName: 'Suraj Deshmukh',
    company: 'ACCENTURE',
    salary: 'Salary: 13.5 LPA',
    transitionTag: 'NON-IT TO DATA ENGINEER',
    badge: '★ SUCCESS STORY',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?q=80&w=688&auto=format&fit=crop',
    order: 6,
    isActive: true,
  },
  {
    studentName: 'Ananya Gupta',
    company: 'GOOGLE PARTNER',
    salary: 'Salary: 18 LPA',
    transitionTag: 'PLACED IN 60 DAYS',
    badge: '★ SUCCESS STORY',
    image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?q=80&w=688&auto=format&fit=crop',
    order: 7,
    isActive: true,
  },
  {
    studentName: 'Kunal Verma',
    company: 'PWC',
    salary: 'Salary: 11 LPA',
    transitionTag: 'BCOM TO DATA ANALYST',
    badge: '★ SUCCESS STORY',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=688&auto=format&fit=crop',
    order: 8,
    isActive: true,
  }
];

export const createProvenResult = async (data) => {
  const result = new ProvenResult(data);
  return await result.save();
};

export const getProvenResults = async (filter = {}) => {
  const count = await ProvenResult.countDocuments();
  if (count === 0) {
    try {
      await ProvenResult.insertMany(defaultSeedResults);
    } catch (e) {
      console.error('Error seeding default proven results:', e);
    }
  }
  return await ProvenResult.find(filter).sort({ order: 1, createdAt: -1 });
};

export const getProvenResultById = async (id) => {
  return await ProvenResult.findById(id);
};

export const updateProvenResult = async (id, data) => {
  return await ProvenResult.findByIdAndUpdate(id, data, { new: true });
};

export const deleteProvenResult = async (id) => {
  return await ProvenResult.findByIdAndDelete(id);
};

export const toggleProvenResultStatus = async (id) => {
  const item = await ProvenResult.findById(id);
  if (!item) return null;
  item.isActive = !item.isActive;
  return await item.save();
};
