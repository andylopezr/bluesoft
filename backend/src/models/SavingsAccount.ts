import mongoose, { Schema } from "mongoose"
import { IAccount } from "./Account"

export interface ISavingsAccount extends IAccount {
  interestRate: number
}

const SavingsAccountSchema: Schema = new Schema({
  interestRate: { type: Number, required: true, default: 0.01 },
})

export default mongoose.model<ISavingsAccount>("SavingsAccount", SavingsAccountSchema)
