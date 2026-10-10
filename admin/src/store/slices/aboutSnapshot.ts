import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface AboutSnapshotData {
  _id?: string;
  badgeText: string;
  headlinePrefix: string;
  headlineHighlight: string;
  paragraph1: string;
  paragraph2: string;
  bulletPoints: string[];
  primaryButtonText: string;
  primaryButtonLink: string;
  showPrimaryButton: boolean;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  showSecondaryButton: boolean;
  image: string;
  imageAlt: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface AboutSnapshotState {
  aboutSnapshot: AboutSnapshotData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

const DEFAULT_ABOUT_SNAPSHOT_STATE: AboutSnapshotData = {
  badgeText: "About Data Knowledge",
  headlinePrefix: "Empowering Learners with",
  headlineHighlight: "Real-World Skills.",
  paragraph1:
    "At Data Knowledge, our mission is to provide practical and industry-focused training in tools like SQL, Excel, Power BI, Tableau, Python, and Business Analysis. Our courses are designed to help learners gain real-world skills that companies actually look for in data analyst and data science roles.",
  paragraph2:
    "The training programs focus on hands-on learning, real-time projects, and step-by-step guidance so that students can confidently work on real business problems. Whether you are a beginner starting your data analytics journey or a working professional looking to upgrade your skills, our courses are structured to support your career growth.",
  bulletPoints: [
    "Hands-on training in SQL, Excel, Power BI, Tableau, Python & Business Analysis",
    "Learn from real industry experts with experience in Data Analytics, ML & AI",
    "Job-ready preparation with resume building, mock interviews & real-time projects",
    "Continuous project support, code reviews & personalized career mentorship",
  ],
  primaryButtonText: "Discover More About Us",
  primaryButtonLink: "/about-us",
  showPrimaryButton: true,
  secondaryButtonText: "Explore Courses",
  secondaryButtonLink: "/courses",
  showSecondaryButton: true,
  image: "/hero_section.png",
  imageAlt: "Data Knowledge Practical Learning",
  isActive: true,
};

const initialState: AboutSnapshotState = {
  aboutSnapshot: DEFAULT_ABOUT_SNAPSHOT_STATE,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};

// FETCH (ADMIN)
export const fetchAboutSnapshotAdmin = createAsyncThunk(
  "aboutSnapshot/fetchAboutSnapshotAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/about-snapshot/admin");
      return res.data?.data?.aboutSnapshot || DEFAULT_ABOUT_SNAPSHOT_STATE;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE (ADMIN)
export const updateAboutSnapshotAdmin = createAsyncThunk(
  "aboutSnapshot/updateAboutSnapshotAdmin",
  async (data: Partial<AboutSnapshotData>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/about-snapshot", data);
      return res.data?.data?.aboutSnapshot;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const aboutSnapshotSlice = createSlice({
  name: "aboutSnapshot",
  initialState,
  reducers: {
    clearAboutSnapshotMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAboutSnapshotAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAboutSnapshotAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.aboutSnapshot = {
            ...DEFAULT_ABOUT_SNAPSHOT_STATE,
            ...action.payload,
            bulletPoints: action.payload.bulletPoints || DEFAULT_ABOUT_SNAPSHOT_STATE.bulletPoints,
          };
        }
      })
      .addCase(fetchAboutSnapshotAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAboutSnapshotAdmin.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateAboutSnapshotAdmin.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.aboutSnapshot = {
            ...DEFAULT_ABOUT_SNAPSHOT_STATE,
            ...action.payload,
            bulletPoints: action.payload.bulletPoints || DEFAULT_ABOUT_SNAPSHOT_STATE.bulletPoints,
          };
        }
        state.successMessage = "About Snapshot section updated successfully!";
      })
      .addCase(updateAboutSnapshotAdmin.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearAboutSnapshotMessages } = aboutSnapshotSlice.actions;
export default aboutSnapshotSlice.reducer;
