import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface WhyChooseUsItem {
  _id?: string;
  title: string;
  desc: string;
  highlight: string;
  iconType: string;
  iconBg?: string;
  badgeBg?: string;
  order: number;
  isActive: boolean;
}

export interface WhyChooseUsData {
  _id?: string;
  badgeText: string;
  title: string;
  description: string;
  items: WhyChooseUsItem[];
  ctaTitle: string;
  ctaSubtitle: string;
  ctaButtonText: string;
  ctaButtonLink: string;
  showCtaBanner: boolean;
  isActive: boolean;
  updatedAt?: string;
}

export interface WhyChooseUsState {
  whyChooseUs: WhyChooseUsData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

const DEFAULT_WHY_CHOOSE_US_STATE: WhyChooseUsData = {
  badgeText: "The Data Knowledge Advantage",
  title: "Why Choose Us?",
  description:
    "Practical skills, industry-working mentors, and dedicated career placement support designed to get you hired.",
  items: [
    {
      title: "Industry Working Mentors",
      desc: "Learn from mentors who work in the industry and bring real-world experience to every session.",
      highlight: "Real-World Experience",
      iconType: "mentors",
      iconBg: "bg-blue-50 text-[#3498db] border-blue-200/80",
      badgeBg: "bg-blue-50 text-blue-700 border-blue-200",
      order: 1,
      isActive: true,
    },
    {
      title: "Daily Mock Interviews",
      desc: "Crack real interviews with daily scenario-based mock sessions.",
      highlight: "Scenario-Based Prep",
      iconType: "mock-interviews",
      iconBg: "bg-cyan-50 text-cyan-600 border-cyan-200/80",
      badgeBg: "bg-cyan-50 text-cyan-700 border-cyan-200",
      order: 2,
      isActive: true,
    },
    {
      title: "100% Placement Support",
      desc: "Resume building, Naukri optimization & interview cracking strategy.",
      highlight: "Career Acceleration",
      iconType: "placement-support",
      iconBg: "bg-emerald-50 text-emerald-600 border-emerald-200/80",
      badgeBg: "bg-emerald-50 text-emerald-700 border-emerald-200",
      order: 3,
      isActive: true,
    },
    {
      title: "Real-Time Projects",
      desc: "Work on 10+ industry-level projects with real datasets.",
      highlight: "10+ Live Datasets",
      iconType: "projects",
      iconBg: "bg-indigo-50 text-indigo-600 border-indigo-200/80",
      badgeBg: "bg-indigo-50 text-indigo-700 border-indigo-200",
      order: 4,
      isActive: true,
    },
    {
      title: "Lifetime Doubt Support",
      desc: "Get mentorship support even after course completion.",
      highlight: "Continuous Guidance",
      iconType: "doubt-support",
      iconBg: "bg-purple-50 text-purple-600 border-purple-200/80",
      badgeBg: "bg-purple-50 text-purple-700 border-purple-200",
      order: 5,
      isActive: true,
    },
    {
      title: "100% Knowledge Guarantee",
      desc: "Learn with confidence—we guarantee your understanding.",
      highlight: "Zero Compromise",
      iconType: "knowledge-guarantee",
      iconBg: "bg-amber-50 text-amber-600 border-amber-200/80",
      badgeBg: "bg-amber-50 text-amber-700 border-amber-200",
      order: 6,
      isActive: true,
    },
  ],
  ctaTitle: "Ready to start your data transformation?",
  ctaSubtitle: "Talk to our career advisors and get a personalized learning roadmap.",
  ctaButtonText: "Get Free Career Guidance",
  ctaButtonLink: "/contact",
  showCtaBanner: true,
  isActive: true,
};

const initialState: WhyChooseUsState = {
  whyChooseUs: DEFAULT_WHY_CHOOSE_US_STATE,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};

// FETCH (ADMIN)
export const fetchWhyChooseUsAdmin = createAsyncThunk(
  "whyChooseUs/fetchWhyChooseUsAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/why-choose-us/admin");
      return res.data?.data?.whyChooseUs || DEFAULT_WHY_CHOOSE_US_STATE;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE (ADMIN)
export const updateWhyChooseUsAdmin = createAsyncThunk(
  "whyChooseUs/updateWhyChooseUsAdmin",
  async (data: Partial<WhyChooseUsData>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/why-choose-us", data);
      return res.data?.data?.whyChooseUs;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const whyChooseUsSlice = createSlice({
  name: "whyChooseUs",
  initialState,
  reducers: {
    clearWhyChooseUsMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWhyChooseUsAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWhyChooseUsAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.whyChooseUs = {
            ...DEFAULT_WHY_CHOOSE_US_STATE,
            ...action.payload,
            items: action.payload.items || DEFAULT_WHY_CHOOSE_US_STATE.items,
          };
        }
      })
      .addCase(fetchWhyChooseUsAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateWhyChooseUsAdmin.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateWhyChooseUsAdmin.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.whyChooseUs = {
            ...DEFAULT_WHY_CHOOSE_US_STATE,
            ...action.payload,
            items: action.payload.items || DEFAULT_WHY_CHOOSE_US_STATE.items,
          };
        }
        state.successMessage = "Why Choose Us section updated successfully!";
      })
      .addCase(updateWhyChooseUsAdmin.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearWhyChooseUsMessages } = whyChooseUsSlice.actions;
export default whyChooseUsSlice.reducer;
