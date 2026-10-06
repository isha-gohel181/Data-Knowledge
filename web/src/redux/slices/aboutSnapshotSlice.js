import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const BASE_URL = import.meta.env.VITE_BASE_URL || 'http://localhost:5000';

const DEFAULT_ABOUT_SNAPSHOT = {
  badgeText: 'About Data Knowledge',
  headlinePrefix: 'Empowering Learners with',
  headlineHighlight: 'Real-World Skills.',
  paragraph1:
    'At Data Knowledge, our mission is to provide practical and industry-focused training in tools like SQL, Excel, Power BI, Tableau, Python, and Business Analysis. Our courses are designed to help learners gain real-world skills that companies actually look for in data analyst and data science roles.',
  paragraph2:
    'The training programs focus on hands-on learning, real-time projects, and step-by-step guidance so that students can confidently work on real business problems. Whether you are a beginner starting your data analytics journey or a working professional looking to upgrade your skills, our courses are structured to support your career growth.',
  bulletPoints: [
    'Hands-on training in SQL, Excel, Power BI, Tableau, Python & Business Analysis',
    'Learn from real industry experts with experience in Data Analytics, ML & AI',
    'Job-ready preparation with resume building, mock interviews & real-time projects',
    'Continuous project support, code reviews & personalized career mentorship',
  ],
  primaryButtonText: 'Discover More About Us',
  primaryButtonLink: '/about-us',
  showPrimaryButton: true,
  secondaryButtonText: 'Explore Courses',
  secondaryButtonLink: '/courses',
  showSecondaryButton: true,
  image: '/hero_section.png',
  imageAlt: 'Data Knowledge Practical Learning',
  isActive: true,
};

export const fetchAboutSnapshot = createAsyncThunk(
  'aboutSnapshot/fetchAboutSnapshot',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${BASE_URL}/about-snapshot`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch About Snapshot data');
      }

      const data = await response.json();
      return data?.data?.aboutSnapshot || DEFAULT_ABOUT_SNAPSHOT;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const aboutSnapshotSlice = createSlice({
  name: 'aboutSnapshot',
  initialState: {
    data: DEFAULT_ABOUT_SNAPSHOT,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutSnapshot.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutSnapshot.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.data = { ...DEFAULT_ABOUT_SNAPSHOT, ...action.payload };
        }
      })
      .addCase(fetchAboutSnapshot.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default aboutSnapshotSlice.reducer;
