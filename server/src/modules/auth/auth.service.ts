import bcrypt from "bcrypt";
import prisma from "../../config/prisma";
import { RegisterInput } from "./auth.validation";

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