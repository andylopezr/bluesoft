import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import { getTransactions, createTransaction } from "@/services/transactionService"

export const fetchTransactions = createAsyncThunk("transactions/fetchTransactions", async () => {
  const response = await getTransactions()
  return response
})

export const addTransaction = createAsyncThunk("transactions/addTransaction", async (transactionData) => {
  const response = await createTransaction(transactionData)
  return response
})

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.status = "loading"
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.status = "succeeded"
        state.list = action.payload
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.status = "failed"
        state.error = action.error.message
      })
      .addCase(addTransaction.fulfilled, (state, action) => {
        state.list.push(action.payload)
      })
  },
})

export default transactionSlice.reducer
