import mongoose, { Document, Schema } from "mongoose"

export interface ITransaction extends Document {
  accountId: mongoose.Types.ObjectId
  amount: number
  type: "deposit" | "withdrawal"
  transactionCity: string
}

const TransactionSchema: Schema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    amount: { type: Number, required: true },
    type: { type: String, enum: ["deposit", "withdrawal"], required: true },
    transactionCity: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model<ITransaction>("Transaction", TransactionSchema)
