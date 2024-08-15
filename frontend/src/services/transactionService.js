import api from "./api"

export const getTransactions = async () => {
  try {
    const response = await api.get("/transactions")
    return response.data
  } catch (error) {
    console.error("Error fetching transactions:", error)
    throw error
  }
}

export const createTransaction = async (transactionData) => {
  try {
    const response = await api.post("/transactions", transactionData)
    return response.data
  } catch (error) {
    console.error("Error creating transaction:", error)
    throw error
  }
}
