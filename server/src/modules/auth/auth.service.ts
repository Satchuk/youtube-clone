import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import jwt from "jsonwebtoken";
import {
  LoginInput,
  RegisterInput,
} from "./auth.validation"; 

export const registerUser = async (data: RegisterInput) => {
  const existingUser = await prisma.user.findFirst({
    where: {
      OR: [
        { email: data.email },
        { username: data.username },
      ],
    },
  });

  if (existingUser) {
    throw new Error("Email or username already exists");
  }

  const passwordHash = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      username: data.username,
      email: data.email,
      passwordHash,
      fullName: data.fullName,
    },

    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      createdAt: true,
    },
  });

  return user;
};

export const loginUser = async (data: LoginInput) => {
  const user = await prisma.user.findUnique({
    where: {
      email: data.email,
    },
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(
    data.password,
    user.passwordHash
  );

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  const accessToken = jwt.sign(
    {
      userId: user.id,
      email: user.email,
    },
    process.env.JWT_ACCESS_SECRET as string,
    {
      expiresIn: "15m",
    }
  );

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
    },
    accessToken,
  };
};