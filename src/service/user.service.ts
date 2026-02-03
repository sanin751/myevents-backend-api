import { UserRepository } from "../repository/user.repository";
import { CreateUserDTO, LoginUserDTO, UpdateUserDTO } from "../dtos/user.dto";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config";
import { HttpError } from "../error/http-error";

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
}