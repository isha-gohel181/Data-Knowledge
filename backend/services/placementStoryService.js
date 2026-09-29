import PlacementStory from '../models/PlacementStory.js';

const defaultSeedStories = [
  {
    studentName: 'Jana',
    role: 'Data Analyst',
    company: 'Johnson & Johnson',
    companyBadge: 'Product Base Company',
    badge: 'Data Analyst - In Just 40 Days',
    instagramUrl: 'https://www.instagram.com/reel/C3_sample1/',
    thumbnail: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=688&auto=format&fit=crop',
    handle: 'learn.with.rushikesh',
    likesCount: '103 likes',
    caption: 'Congratulations Jana on transitioning to Johnson & Johnson as Data Analyst in just 40 days! 💐',
    order: 1,
    isActive: true,
  },
  {
    studentName: 'Ms Sharada',
    role: 'Data Analyst',
    company: 'TESCO',
    companyBadge: 'Fortune 500 Retail',
    badge: 'Selected in 45 Days',
    instagramUrl: 'https://www.instagram.com/reel/C3_sample2/',
    thumbnail: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=688&auto=format&fit=crop',
    handle: 'learn.with.rushikesh',
    likesCount: '48 likes',
    caption: 'Big congrats to Ms Sharada on landing her Data Analyst role at TESCO! 🌟',
    order: 2,
    isActive: true,
  },
  {
    studentName: 'Aditya',
    role: 'Data Analyst',
    company: 'CROSS COUNTRY',
    companyBadge: 'Global Tech & Analytics',
    badge: 'Data Analyst in Just 90 Days',
    instagramUrl: 'https://www.instagram.com/reel/C3_sample3/',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=688&auto=format&fit=crop',
    handle: 'learn.with.rushikesh',
    likesCount: '32 likes',
    caption: 'Congratulations Aditya! Selected as Data Analyst at Cross Country in 90 days. 🚀',
    order: 3,
    isActive: true,
  },
  {
    studentName: 'Rohan Sharma',
    role: 'Business Intelligence Analyst',
    company: 'PwC',
    companyBadge: 'Big 4 Consulting',
    badge: 'Non-Tech to Tech Transition',
    instagramUrl: 'https://www.instagram.com/reel/C3_sample4/',
    thumbnail: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=688&auto=format&fit=crop',
    handle: 'learn.with.rushikesh',
    likesCount: '185 likes',
    caption: 'Rohan transitioned from mechanical engineering to BI Analyst at PwC! 🔥',
    order: 4,
    isActive: true,
  },
  {
    studentName: 'Sneha Patel',
    role: 'Data Engineer',
    company: 'Deloitte',
    companyBadge: 'Enterprise Tech',
    badge: '140% Salary Hike',
    instagramUrl: 'https://www.instagram.com/reel/C3_sample5/',
    thumbnail: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=688&auto=format&fit=crop',
    handle: 'learn.with.rushikesh',
    likesCount: '240 likes',
    caption: 'From Excel beginner to Snowflake & SQL Data Engineer at Deloitte. 💼',
    order: 5,
    isActive: true,
  }
];

export const createPlacementStory = async (data) => {
  const story = new PlacementStory(data);
  return await story.save();
};

export const getPlacementStories = async (filter = {}) => {
  const count = await PlacementStory.countDocuments();
  if (count === 0) {
    try {
      await PlacementStory.insertMany(defaultSeedStories);
    } catch (e) {
      console.error('Error seeding default stories:', e);
    }
  }
  return await PlacementStory.find(filter).sort({ order: 1, createdAt: -1 });
};

export const getPlacementStoryById = async (id) => {
  return await PlacementStory.findById(id);
};

export const updatePlacementStory = async (id, data) => {
  return await PlacementStory.findByIdAndUpdate(id, data, { new: true });
};

export const deletePlacementStory = async (id) => {
  return await PlacementStory.findByIdAndDelete(id);
};

export const togglePlacementStoryStatus = async (id) => {
  const story = await PlacementStory.findById(id);
  if (!story) return null;
  story.isActive = !story.isActive;
  return await story.save();
};
