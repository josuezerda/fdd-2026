import UserModel, { IUser } from "../models/user.js";
import { Types } from "mongoose";

interface UserRegistrationData {
  full_name: string;
  phone: string;
  email: string;
  gender: "Masculino" | "Femenino" | "Otro" | "Prefiero no decir";
  date_of_birth: string;
  age?: number;
  dni: string | number;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class UserServiceError extends Error {
  constructor(message: string, public statusCode: number = 400) {
    super(message);
    this.name = "UserServiceError";
  }
}

const registerUser = async (data: UserRegistrationData): Promise<ServiceResponse<IUser>> => {
  const { full_name, phone, email, gender, date_of_birth, age, dni } = data;

  if (!full_name || !phone || !email || !gender || !dni || !date_of_birth) {
    throw new UserServiceError("Todos los campos son requeridos", 400);
  }

  try {
    const existingPhone = await UserModel.findOne({ phone });
    if (existingPhone) throw new UserServiceError("📱 Este número ya está registrado", 409);

    const existingEmail = await UserModel.findOne({ email: email.toLowerCase() });
    if (existingEmail) throw new UserServiceError("📧 Este email ya está registrado", 409);

    const newUser = new UserModel({
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      gender,
      date_of_birth: date_of_birth.trim(),
      age,
      dni,
    });

    await newUser.save();
    return { success: true, data: newUser, message: "🎉 Usuario registrado exitosamente" };
  } catch (error) {
    if (error instanceof UserServiceError) throw error;
    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyPattern)[0];
      throw new UserServiceError(`📱 El ${field} ya está registrado`, 409);
    }
    throw new UserServiceError("❌ Error interno al registrar usuario", 500);
  }
};

const getUserInfo = async (phone: string): Promise<ServiceResponse<IUser | null>> => {
  if (!phone) throw new UserServiceError("El teléfono es requerido", 400);
  try {
    const user = await UserModel.findOne({ phone }).select("-__v");
    if (!user) return { success: false, data: null, message: "Usuario no encontrado" };
    return { success: true, data: user, message: "Usuario encontrado" };
  } catch (error) {
    throw new UserServiceError("Error al verificar el usuario", 500);
  }
};

export { registerUser, getUserInfo, UserServiceError };
