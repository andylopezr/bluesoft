import mongoose, { Document, Schema } from "mongoose"

export interface ICustomer extends Document {
  name: string
  email: string
  accounts: mongoose.Types.ObjectId[]
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  },
  { timestamps: true }
)

export default mongoose.model<ICustomer>("Customer", CustomerSchema)
