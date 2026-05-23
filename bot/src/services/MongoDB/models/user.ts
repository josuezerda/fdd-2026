import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  full_name: string;
  email: string;
  phone: string;
  gender: "Masculino" | "Femenino" | "Otro" | "Prefiero no decir";
  date_of_birth: string;
  age?: number;
  dni: string | number;
}

const userSchema: Schema<IUser> = new Schema(
  {
    full_name: { type: String, required: true, trim: true, minlength: 2, maxlength: 100 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    phone: { type: String, required: true, unique: true, trim: true },
    dni: { type: String, required: true, unique: true, trim: true },
    gender: {
      type: String,
      required: true,
      enum: ["Masculino", "Femenino", "Otro", "Prefiero no decir"],
    },
    date_of_birth: { type: String, required: true, trim: true },
    age: { type: Number, required: false },
  },
  { timestamps: true }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
