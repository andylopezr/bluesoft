import mongoose, { Schema } from "mongoose"
import { IAccount } from "./Account"

export interface ICheckingAccount extends IAccount {
  overdraftLimit: number
}

interface OverdraftLimitValidatorProps {
  value: number
}

const CheckingAccountSchema: Schema = new Schema({
  overdraftLimit: {
    type: Number,
    required: true,
    default: 0,
    validate: {
      validator: function (v: number): boolean {
        return v >= 0
      },
      message: (props: OverdraftLimitValidatorProps): string =>
        `${props.value} is not a valid overdraft limit. It must be non-negative.`,
    },
  },
})

export default mongoose.model<ICheckingAccount>("CheckingAccount", CheckingAccountSchema)
