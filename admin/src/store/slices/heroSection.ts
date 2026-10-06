import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface HeroSectionData {
  _id?: string;
  headlinePrefix: string;
  headlineHighlight: string;
  description: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  showPrimaryButton: boolean;
  secondaryButtonText: string;
  secondaryButtonAction: "consultation_modal" | "custom_link";
  secondaryButtonLink: string;
  showSecondaryButton: boolean;
  mentorImage: string;
  mentorImageAlt: string;
  badgeText?: string;
  isActive: boolean;
  updatedAt?: string;
}

export interface HeroSectionState {
  hero: HeroSectionData;
  loading: boolean;
  saving: boolean;
  error: string | null;
  successMessage: string | null;
}

const DEFAULT_HERO_STATE: HeroSectionData = {
  headlinePrefix: "Master Practical Data Analytics,",
  headlineHighlight: "Data Science, ML & AI",
  description:
    "At Data Knowledge, our mission is to provide practical and industry-focused training in tools like SQL, Excel, Power BI, Tableau, Python, and Business Analysis. Gain real-world skills that companies actually look for in data analyst and data science roles.",
  primaryButtonText: "Explore Programs",
  primaryButtonLink: "/courses",
  showPrimaryButton: true,
  secondaryButtonText: "Book Consultation",
  secondaryButtonAction: "consultation_modal",
  secondaryButtonLink: "",
  showSecondaryButton: true,
  mentorImage: "/data_knowlege/mentor/mentore_2.png",
  mentorImageAlt: "Data Knowledge Mentors",
  badgeText: "",
  isActive: true,
};

const initialState: HeroSectionState = {
  hero: DEFAULT_HERO_STATE,
  loading: false,
  saving: false,
  error: null,
  successMessage: null,
};

// FETCH HERO CONFIG (ADMIN)
export const fetchHeroSectionAdmin = createAsyncThunk(
  "heroSection/fetchHeroSectionAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/hero-section/admin");
      return res.data?.data?.hero || DEFAULT_HERO_STATE;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE HERO CONFIG (ADMIN)
export const updateHeroSectionAdmin = createAsyncThunk(
  "heroSection/updateHeroSectionAdmin",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put("/hero-section", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data?.data?.hero;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const heroSectionSlice = createSlice({
  name: "heroSection",
  initialState,
  reducers: {
    clearHeroMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    updateHeroField: (state, action) => {
      state.hero = { ...state.hero, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchHeroSectionAdmin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHeroSectionAdmin.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.hero = { ...DEFAULT_HERO_STATE, ...action.payload };
        }
      })
      .addCase(fetchHeroSectionAdmin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Update
      .addCase(updateHeroSectionAdmin.pending, (state) => {
        state.saving = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateHeroSectionAdmin.fulfilled, (state, action) => {
        state.saving = false;
        if (action.payload) {
          state.hero = { ...DEFAULT_HERO_STATE, ...action.payload };
        }
        state.successMessage = "Hero section updated successfully!";
      })
      .addCase(updateHeroSectionAdmin.rejected, (state, action) => {
        state.saving = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearHeroMessages, updateHeroField } = heroSectionSlice.actions;
export default heroSectionSlice.reducer;
