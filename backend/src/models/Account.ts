import mongoose, { Document, Schema } from "mongoose"

export interface IAccount extends Document {
  accountNumber: string
  balance: number
  originCity: string
  customerId: mongoose.Types.ObjectId
}

const AccountSchema: Schema = new Schema(
  {
    accountNumber: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    originCity: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
  },
  { timestamps: true }
)

export default mongoose.model<IAccount>("Account", AccountSchema)
