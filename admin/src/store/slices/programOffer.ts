import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface ProgramOffer {
  _id: string;
  title: string;
  shortTitle: string;
  badge: string;
  icon?: string;
  highlights: string[];
  tools: string[];
  courseId?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProgramOfferState {
  programs: ProgramOffer[];
  currentProgram: ProgramOffer | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ProgramOfferState = {
  programs: [],
  currentProgram: null,
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

// FETCH ALL (ADMIN)
export const fetchProgramsAdmin = createAsyncThunk(
  "programOffer/fetchProgramsAdmin",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/programs-offer/admin/all");
      return res.data?.data?.programs || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// CREATE PROGRAM
export const createProgram = createAsyncThunk(
  "programOffer/createProgram",
  async (data: Partial<ProgramOffer>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/programs-offer", data);
      return res.data?.data?.program;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE PROGRAM
export const updateProgram = createAsyncThunk(
  "programOffer/updateProgram",
  async ({ id, data }: { id: string; data: Partial<ProgramOffer> }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/programs-offer/${id}`, data);
      return res.data?.data?.program;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DELETE PROGRAM
export const deleteProgram = createAsyncThunk(
  "programOffer/deleteProgram",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/programs-offer/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// TOGGLE STATUS
export const toggleProgramStatus = createAsyncThunk(
  "programOffer/toggleProgramStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/programs-offer/${id}/toggle`);
      return res.data?.data?.program;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const programOfferSlice = createSlice({
  name: "programOffer",
  initialState,
  reducers: {
    clearProgramOfferMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setCurrentProgram: (state, action: PayloadAction<ProgramOffer | null>) => {
      state.currentProgram = action.payload;
    },
  },
  extraReducers: (builder) => {
    // FETCH ADMIN
    builder.addCase(fetchProgramsAdmin.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchProgramsAdmin.fulfilled, (state, action) => {
      state.loading = false;
      state.programs = action.payload;
    });
    builder.addCase(fetchProgramsAdmin.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // CREATE
    builder.addCase(createProgram.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(createProgram.fulfilled, (state, action) => {
      state.actionLoading = false;
      if (action.payload) {
        state.programs.push(action.payload);
      }
      state.successMessage = "Program track created successfully!";
    });
    builder.addCase(createProgram.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // UPDATE
    builder.addCase(updateProgram.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(updateProgram.fulfilled, (state, action) => {
      state.actionLoading = false;
      if (action.payload) {
        const index = state.programs.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.programs[index] = action.payload;
        }
      }
      state.successMessage = "Program track updated successfully!";
    });
    builder.addCase(updateProgram.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // DELETE
    builder.addCase(deleteProgram.pending, (state) => {
      state.actionLoading = true;
      state.error = null;
      state.successMessage = null;
    });
    builder.addCase(deleteProgram.fulfilled, (state, action) => {
      state.actionLoading = false;
      state.programs = state.programs.filter((p) => p._id !== action.payload);
      state.successMessage = "Program track deleted successfully!";
    });
    builder.addCase(deleteProgram.rejected, (state, action) => {
      state.actionLoading = false;
      state.error = action.payload as string;
    });

    // TOGGLE STATUS
    builder.addCase(toggleProgramStatus.pending, (state) => {
      state.error = null;
    });
    builder.addCase(toggleProgramStatus.fulfilled, (state, action) => {
      if (action.payload) {
        const index = state.programs.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) {
          state.programs[index] = action.payload;
        }
      }
      state.successMessage = `Program ${action.payload?.isActive ? "activated" : "deactivated"}!`;
    });
    builder.addCase(toggleProgramStatus.rejected, (state, action) => {
      state.error = action.payload as string;
    });
  },
});

export const { clearProgramOfferMessages, setCurrentProgram } = programOfferSlice.actions;
export default programOfferSlice.reducer;
