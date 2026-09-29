import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axiosInstance from "../../services/axiosConfig";

export interface ProvenResult {
  _id: string;
  studentName: string;
  company: string;
  salary: string;
  transitionTag: string;
  badge: string;
  image?: string;
  order: number;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProvenResultState {
  results: ProvenResult[];
  currentResult: ProvenResult | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ProvenResultState = {
  results: [],
  currentResult: null,
  loading: false,
  actionLoading: false,
  error: null,
  successMessage: null,
};

// FETCH ALL (ADMIN)
export const fetchProvenResults = createAsyncThunk(
  "provenResult/fetchProvenResults",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/proven-results/admin/all");
      return res.data?.data?.results || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// CREATE RESULT
export const createProvenResult = createAsyncThunk(
  "provenResult/createProvenResult",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/proven-results", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// UPDATE RESULT
export const updateProvenResult = createAsyncThunk(
  "provenResult/updateProvenResult",
  async ({ id, formData }: { id: string; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/proven-results/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// DELETE RESULT
export const deleteProvenResult = createAsyncThunk(
  "provenResult/deleteProvenResult",
  async (id: string, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/proven-results/${id}`);
      return id;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

// TOGGLE STATUS
export const toggleProvenResultStatus = createAsyncThunk(
  "provenResult/toggleProvenResultStatus",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.patch(`/proven-results/${id}/toggle`);
      return res.data?.data?.result;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const provenResultSlice = createSlice({
  name: "provenResult",
  initialState,
  reducers: {
    clearProvenResultMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
    setCurrentProvenResult: (state, action: PayloadAction<ProvenResult | null>) => {
      state.currentResult = action.payload;
    },
  },
  extraReducers: (builder) => {
    // FETCH
    builder
      .addCase(fetchProvenResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProvenResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchProvenResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // CREATE
    builder
      .addCase(createProvenResult.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createProvenResult.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          state.results.unshift(action.payload);
        }
        state.successMessage = "Proven placement result added successfully!";
      })
      .addCase(createProvenResult.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // UPDATE
    builder
      .addCase(updateProvenResult.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateProvenResult.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          const index = state.results.findIndex((r) => r._id === action.payload._id);
          if (index !== -1) {
            state.results[index] = action.payload;
          }
        }
        state.successMessage = "Placement result updated successfully!";
      })
      .addCase(updateProvenResult.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // DELETE
    builder
      .addCase(deleteProvenResult.pending, (state) => {
        state.actionLoading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteProvenResult.fulfilled, (state, action) => {
        state.actionLoading = false;
        state.results = state.results.filter((r) => r._id !== action.payload);
        state.successMessage = "Placement result deleted successfully!";
      })
      .addCase(deleteProvenResult.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });

    // TOGGLE
    builder
      .addCase(toggleProvenResultStatus.pending, (state) => {
        state.actionLoading = true;
      })
      .addCase(toggleProvenResultStatus.fulfilled, (state, action) => {
        state.actionLoading = false;
        if (action.payload) {
          const index = state.results.findIndex((r) => r._id === action.payload._id);
          if (index !== -1) {
            state.results[index] = action.payload;
          }
        }
        state.successMessage = `Status updated to ${action.payload?.isActive ? "Active" : "Inactive"}`;
      })
      .addCase(toggleProvenResultStatus.rejected, (state, action) => {
        state.actionLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearProvenResultMessages, setCurrentProvenResult } = provenResultSlice.actions;
export default provenResultSlice.reducer;
