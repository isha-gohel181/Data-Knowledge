import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface PlacementStory {
  _id: string;
  studentName: string;
  role: string;
  company: string;
  companyBadge?: string;
  badge?: string;
  instagramUrl: string;
  thumbnail?: string;
  video?: string;
  handle?: string;
  likesCount?: string;
  caption?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PlacementStoryState {
  stories: PlacementStory[];
  currentStory: PlacementStory | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: PlacementStoryState = {
  stories: [],
  currentStory: null,
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

// FETCH ALL STORIES (ADMIN)
export const fetchPlacementStories = createAsyncThunk(
  "placementStory/fetchPlacementStories",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/placement-stories/admin/all");
      return res.data?.data?.stories || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// CREATE STORY
export const createPlacementStory = createAsyncThunk(
  "placementStory/createPlacementStory",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/placement-stories", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data?.data?.story;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE STORY
export const updatePlacementStory = createAsyncThunk(
  "placementStory/updatePlacementStory",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/placement-stories/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data?.data?.story;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DELETE STORY
export const deletePlacementStory = createAsyncThunk(
  "placementStory/deletePlacementStory",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/placement-stories/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// TOGGLE STATUS
export const togglePlacementStoryStatus = createAsyncThunk(
  "placementStory/togglePlacementStoryStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/placement-stories/${id}/toggle`);
      return res.data?.data?.story;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const placementStorySlice = createSlice({
  name: "placementStory",
  initialState,
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setCurrentStory: (state, action: PayloadAction<PlacementStory | null>) => {
      state.currentStory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchPlacementStories.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlacementStories.fulfilled, (state, action: PayloadAction<PlacementStory[]>) => {
        state.loading = false;
        state.stories = action.payload;
      })
      .addCase(fetchPlacementStories.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // CREATE
      .addCase(createPlacementStory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(createPlacementStory.fulfilled, (state, action: PayloadAction<PlacementStory>) => {
        state.actionLoading = false;
        state.stories.unshift(action.payload);
        state.successMessage = "Placement story added successfully!";
      })
      .addCase(createPlacementStory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      // UPDATE
      .addCase(updatePlacementStory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(updatePlacementStory.fulfilled, (state, action: PayloadAction<PlacementStory>) => {
        state.actionLoading = false;
        const updated = action.payload;
        state.stories = state.stories.map((s) => (s._id === updated._id ? updated : s));
        state.successMessage = "Placement story updated successfully!";
      })
      .addCase(updatePlacementStory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      // DELETE
      .addCase(deletePlacementStory.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
      })
      .addCase(deletePlacementStory.fulfilled, (state, action: PayloadAction<string>) => {
        state.actionLoading = false;
        state.stories = state.stories.filter((s) => s._id !== action.payload);
        state.successMessage = "Placement story deleted successfully!";
      })
      .addCase(deletePlacementStory.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      })
      // TOGGLE
      .addCase(togglePlacementStoryStatus.fulfilled, (state, action: PayloadAction<PlacementStory>) => {
        const updated = action.payload;
        state.stories = state.stories.map((s) => (s._id === updated._id ? updated : s));
      });
  },
});

export const { clearMessages, setCurrentStory } = placementStorySlice.actions;
export default placementStorySlice.reducer;
