import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/index";
import { UserModel } from "../../models/user.model";
import bcryptjs from "bcryptjs";

export interface TestUser {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: string;
}

export const createTestUser = async (userData: TestUser) => {
  // Hash password before saving
  const hashedPassword = await bcryptjs.hash(userData.password, 10);
  const userDataWithHashedPassword = {
    firstName: userData.firstName,
    lastName: userData.lastName,
    username: userData.username,
    email: userData.email,
    password: hashedPassword,
    role: userData.role || "user",
  };
  const user = await UserModel.create(userDataWithHashedPassword);
  return user;
};

export const generateToken = (userId: string, email: string, role: string = "user") => {
  return jwt.sign(
    { id: userId, email, role },
    JWT_SECRET,
    { expiresIn: "1d" }
  );
};

export const createUserAndToken = async (userData: TestUser) => {
  const user = await createTestUser(userData);
  const token = generateToken(String(user._id), user.email, userData.role || "user");
  return { user, token };
};

export const cleanupTestUser = async (email: string) => {
  await UserModel.deleteOne({ email });
};

export const cleanupTestUsers = async (emails: string[]) => {
  await UserModel.deleteMany({ email: { $in: emails } });
};
