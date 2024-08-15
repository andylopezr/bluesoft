import { configureStore } from "@reduxjs/toolkit"
import accountReducer from "./accountSlice"
import transactionReducer from "./transactionSlice"

export const store = configureStore({
  reducer: {
    accounts: accountReducer,
    transactions: transactionReducer,
  },
})
