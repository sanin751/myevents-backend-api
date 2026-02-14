import { UserRepository } from "../repository/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { CLIENT_URL, JWT_SECRET } from "../config";
import { HttpError } from "../error/http-error";
import { sendEmail } from "../config/email";

let userRepository = new UserRepository();

export class UserService{
  async createUser(data:CreateUserDTO) {
    const emailCheck = await userRepository.getUserByEmail(data.email);

    if(emailCheck) {
      throw new HttpError(403,"Email already in use"); 
    }

    const hashedPassword = await bcryptjs.hash(data.password, 10);
    data.password = hashedPassword;
    const newUser = await userRepository.createUser(data);

    return newUser;
  }

  async loginUser(data: LoginUserDTO){
    const user = await userRepository.getUserByEmail(data.email);
    console.log("Servidce", user);
    if(!user) {
      throw new HttpError(404,"No user found")
    }

    const validPassword = await bcryptjs.compare(data.password, user.password);
    if(!validPassword){
      throw new HttpError(401,"Invalid Credentials")
    }

    const payload = {
      id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    }

    const token = jwt.sign(payload, JWT_SECRET, {expiresIn: "30d"});
    return {token, user};
  }
 async updateUser(userId: string, updateData: Partial<UpdateUserDTO>){
        if(updateData.password){
            const hashedPassword = await bcryptjs.hash(updateData.password, 10);
            updateData.password = hashedPassword;
        }
        const updatedUser = await userRepository.updateUser(userId, updateData);
        if(!updatedUser){
            throw new HttpError(404, "User not found");
        }
        return updatedUser;
    }
    async getUserById(userId: string){
        const user = await userRepository.getUserById(userId);
        if(!user){
            throw new HttpError(404, "User not found");
        }
        return user;
    }

    async sendResetPasswordEmail(email?: string) {
    if (!email) {
      throw new HttpError(400, "Email is required");
    }
    console.log(email);
    const user = await userRepository.getUserByEmail(email);
    if (!user){
      throw new HttpError(404, "User not found");
    }
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });
    const resetLink = `${CLIENT_URL}/reset-password?token=${token}`;
    const html = `<p>Click <a href="${resetLink}">here</a> to reset your password. This link will expire in 1 hour.</p>`;
    await sendEmail(user.email, "Password Reset", html);
    return user;
  }

  async resetPassword(token?: string, newPassword?: string) {
        try {
            if (!token || !newPassword) {
                throw new HttpError(400, "Token and new password are required");
            }
            const decoded: any = jwt.verify(token, JWT_SECRET);
            const userId = decoded.id;
            const user = await userRepository.getUserById(userId);
            if (!user) {
                throw new HttpError(404, "User not found");
            }
            const hashedPassword = await bcryptjs.hash(newPassword, 10);
            await userRepository.updateUser(userId, { password: hashedPassword });
            return user;
        } catch (error) {
            throw new HttpError(400, "Invalid or expired token");
        }
    }
}