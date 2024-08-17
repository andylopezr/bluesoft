import mongoose, { Schema, Document } from "mongoose"

export interface IAccount extends Document {
  _id: mongoose.Types.ObjectId
  accountNumber: string
  balance: number
  originCity: string
  customerId: mongoose.Types.ObjectId
  accountType: "savings" | "checking"
}

const AccountSchema: Schema = new Schema(
  {
    accountNumber: { type: String, required: true, unique: true },
    balance: { type: Number, required: true, default: 0 },
    originCity: { type: String, required: true },
    customerId: { type: Schema.Types.ObjectId, ref: "Customer", required: true },
    accountType: { type: String, enum: ["savings", "checking"], required: true },
  },
  { timestamps: true }
)

const Account = mongoose.model<IAccount>("Account", AccountSchema)

export default Account
