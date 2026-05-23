import mongoose, { Document, Schema, Model } from "mongoose";

export interface IUser extends Document {
  full_name: string;
  email: string;
  phone: string;
  gender: "Masculino" | "Femenino" | "Otro" | "Prefiero no decir";
  date_of_birth: string; // Nuevo campo
  age?: number; // opcional
  dni: string | number;
}

const userSchema: Schema<IUser> = new Schema(
  {
    full_name: {
      type: String,
      required: [true, "El nombre completo es requerido"],
      trim: true,
      minlength: [2, "El nombre debe tener al menos 2 caracteres"],
      maxlength: [100, "El nombre no puede exceder 100 caracteres"],
    },
    email: {
      type: String,
      required: [true, "El email es requerido"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor ingresa un email válido",
      ],
    },
    phone: {
      type: String,
      required: [true, "El teléfono es requerido"],
      unique: true,
      trim: true,
    },
    dni: {
      type: String,
      required: [true, "El DNI es requerido"],
      unique: true,
      trim: true,
    },
    gender: {
      type: String,
      required: [true, "El género es requerido"],
      enum: {
        values: ["Masculino", "Femenino", "Otro", "Prefiero no decir"],
        message:
          "Género no válido. Debe ser: Masculino, Femenino, Otro o Prefiero no decir",
      },
    },
    date_of_birth: {
      type: String,
      required: [true, "La fecha de nacimiento es requerida"],
      trim: true,
    },
    age: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;
