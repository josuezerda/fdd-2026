import UserModel, { IUser } from "../models/user";
import { Types } from "mongoose";

interface UserRegistrationData {
  full_name: string;
  phone: string;
  email: string;
  gender: "Masculino" | "Femenino" | "Otro" | "Prefiero no decir";
  date_of_birth: string; // Nuevo campo
  age?: number; // opcional
  dni: string | number;
}

interface UserUpdateData {
  name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  date_of_birth?: string; // opcional para actualizar
  age?: number;
}

interface ServiceResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

class UserServiceError extends Error {
  constructor(
    message: string,
    public statusCode: number = 400
  ) {
    super(message);
    this.name = "UserServiceError";
  }
}

const registerUser = async (
  data: UserRegistrationData
): Promise<ServiceResponse<IUser>> => {
  const { full_name, phone, email, gender, date_of_birth, age, dni } = data;

  if (!full_name || !phone || !email || !gender || !dni || !date_of_birth) {
    throw new UserServiceError(
      "Nombre completo, teléfono, email, género, DNI y fecha de nacimiento son requeridos",
      400
    );
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new UserServiceError("Formato de email inválido", 400);
  }

  const validGenders = ["Masculino", "Femenino", "Otro", "Prefiero no decir"];
  if (!validGenders.includes(gender)) {
    throw new UserServiceError("Género no válido", 400);
  }

  if (age !== undefined && (age < 1 || age > 120)) {
    throw new UserServiceError("La edad debe estar entre 1 y 120 años", 400);
  }

  if (!dni) {
    throw new UserServiceError("DNI es requerido", 400);
  }

  try {
    const existingUserByPhone = await UserModel.findOne({ phone });
    if (existingUserByPhone) {
      throw new UserServiceError(
        "📱 Este número de teléfono ya está registrado",
        409
      );
    }

    const existingUserByEmail = await UserModel.findOne({
      email: email.toLowerCase(),
    });
    if (existingUserByEmail) {
      throw new UserServiceError("📧 Este email ya está registrado", 409);
    }

    const newUser = new UserModel({
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: email.toLowerCase().trim(),
      gender,
      date_of_birth: date_of_birth.trim(),
      age, // opcional
      dni,
    });

    await newUser.save();

    return {
      success: true,
      data: newUser,
      message: "🎉 Usuario registrado exitosamente",
    };
  } catch (error) {
    console.error("Error registering user:", error);

    if (error instanceof UserServiceError) {
      throw error;
    }

    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyPattern)[0];
      let friendlyField = field;

      switch (field) {
        case "phone":
          friendlyField = "número de teléfono";
          break;
        case "email":
          friendlyField = "email";
          break;
        default:
          friendlyField = field;
      }

      throw new UserServiceError(
        `📱 El ${friendlyField} ya está registrado`,
        409
      );
    }

    if ((error as any).name === "ValidationError") {
      const validationErrors = Object.values((error as any).errors).map(
        (err) => (err as any).message
      );
      throw new UserServiceError(
        `❌ Error de validación: ${validationErrors.join(", ")}`,
        400
      );
    }

    throw new UserServiceError("❌ Error interno al registrar usuario", 500);
  }
};

const getAllUsers = async (): Promise<ServiceResponse<IUser[]>> => {
  try {
    const users = await UserModel.find({})
      .select("-__v")
      .sort({ createdAt: -1 });

    return {
      success: true,
      data: users,
      message: `Se encontraron ${users.length} usuarios`,
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    throw new UserServiceError("Error al obtener usuarios", 500);
  }
};

const getUserInfo = async (
  phone: string
): Promise<ServiceResponse<IUser | null>> => {
  if (!phone) {
    throw new UserServiceError("El teléfono es requerido", 400);
  }

  try {
    const user = await UserModel.findOne({ phone }).select("-__v");

    if (!user) {
      return {
        success: false,
        data: null,
        message: "Usuario no encontrado",
      };
    }

    return {
      success: true,
      data: user,
      message: "Usuario encontrado",
    };
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    throw new UserServiceError("Error al verificar el usuario", 500);
  }
};

const getUserById = async (
  userId: string
): Promise<ServiceResponse<IUser | null>> => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new UserServiceError("ID de usuario inválido", 400);
  }

  try {
    const user = await UserModel.findById(userId).select("-__v");

    if (!user) {
      return {
        success: false,
        data: null,
        message: "Usuario no encontrado",
      };
    }

    return {
      success: true,
      data: user,
      message: "Usuario encontrado",
    };
  } catch (error) {
    console.error("Error al obtener usuario por ID:", error);
    throw new UserServiceError("Error al obtener usuario", 500);
  }
};

const updateUser = async (
  userId: string,
  updateData: UserUpdateData
): Promise<ServiceResponse<IUser | null>> => {
  if (!userId || !Types.ObjectId.isValid(userId)) {
    throw new UserServiceError("ID de usuario inválido", 400);
  }

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select("-__v");

    if (!updatedUser) {
      return {
        success: false,
        data: null,
        message: "Usuario no encontrado",
      };
    }

    return {
      success: true,
      data: updatedUser,
      message: "Usuario actualizado exitosamente",
    };
  } catch (error) {
    console.error("Error al actualizar usuario:", error);

    if ((error as any).code === 11000) {
      const field = Object.keys((error as any).keyPattern)[0];
      throw new UserServiceError(`El ${field} ya está registrado`, 409);
    }

    throw new UserServiceError("Error al actualizar usuario", 500);
  }
};

export {
  registerUser,
  getAllUsers,
  getUserInfo,
  getUserById,
  updateUser,
  UserServiceError,
  type UserRegistrationData,
  type UserUpdateData,
  type ServiceResponse,
};
