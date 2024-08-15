import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getAccounts, getAccountDetails } from "@/services/accountService"

export const fetchAccounts = createAsyncThunk("accounts/fetchAccounts", async () => {
  const response = await getAccounts()
  return response
})

export const fetchAccountDetails = createAsyncThunk("accounts/fetchAccountDetails", async (accountId) => {
  const response = await getAccountDetails(accountId)
  return response
})

const accountSlice = createSlice({
  name: "accounts",
  initialState: {
    list: [],
    currentAccount: null,
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccounts.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchAccounts.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchAccounts.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(fetchAccountDetails.fulfilled, (state, action) => {
        state.currentAccount = action.payload
      })
  },
})

export default accountSlice.reducer
