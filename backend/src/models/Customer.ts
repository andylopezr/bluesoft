import mongoose, { Schema, Document, Types } from "mongoose"
import bcrypt from "bcrypt"

export interface ICustomer extends Document {
  name: string
  email: string
  customerType: "persona_natural" | "empresa"
  password: string
  accounts: Types.ObjectId[]
  comparePassword(candidatePassword: string): Promise<boolean>
  createdAt: Date
  updatedAt: Date
}

const CustomerSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v: string) {
          return /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(v)
        },
        message: (props: any) => `${props.value} is not a valid email address!`,
      },
    },
    customerType: { type: String, enum: ["persona_natural", "empresa"], required: true },
    password: { type: String, required: true },
    accounts: [{ type: Schema.Types.ObjectId, ref: "Account" }],
  },
  { timestamps: true }
)

CustomerSchema.pre<ICustomer>("save", async function (next) {
  if (!this.isModified("password")) return next()

  try {
    const salt = await bcrypt.genSalt(10)
    this.password = await bcrypt.hash(this.password, salt)
    next()
  } catch (error) {
    next(error as Error)
  }
})

CustomerSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password)
}

CustomerSchema.statics.findByEmail = function (email: string) {
  return this.findOne({ email })
}

export default mongoose.model<ICustomer>("Customer", CustomerSchema)
