import mongoose, { Schema } from "mongoose"
import { IAccount } from "./Account"

export interface ICheckingAccount extends IAccount {
  overdraftLimit: number
}

const CheckingAccountSchema: Schema = new Schema({
  overdraftLimit: { type: Number, required: true, default: 0 },
})

export default mongoose.model<ICheckingAccount>("CheckingAccount", CheckingAccountSchema)
