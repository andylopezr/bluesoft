import mongoose, { Document, Schema } from "mongoose"

export interface ITransaction extends Document {
  accountId: mongoose.Types.ObjectId
  amount: number
  type: "deposit" | "withdrawal"
  transactionCity: string
}

interface AmountValidatorProps {
  value: number
}

const TransactionSchema: Schema = new Schema(
  {
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (v: number): boolean {
          return v > 0
        },
        message: (props: AmountValidatorProps): string => `${props.value} is not a positive number!`,
      },
    },
    type: { type: String, enum: ["deposit", "withdrawal"], required: true },
    transactionCity: { type: String, required: true },
  },
  { timestamps: true }
)

export default mongoose.model<ITransaction>("Transaction", TransactionSchema)
