import api from "./api"

export const getAccounts = async () => {
  try {
    const response = await api.get("/accounts")
    return response.data
  } catch (error) {
    console.error("Error fetching accounts:", error)
    throw error
  }
}

export const getAccountDetails = async (accountId) => {
  try {
    const response = await api.get(`/accounts/${accountId}`)
    return response.data
  } catch (error) {
    console.error("Error fetching account details:", error)
    throw error
  }
}
