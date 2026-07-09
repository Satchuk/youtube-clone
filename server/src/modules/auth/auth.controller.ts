import { Request, Response } from "express";
import { loginSchema, registerSchema } from "./auth.validation";
import { loginUser, registerUser } from "./auth.service";
import { AuthRequest } from "../../middleware/auth.middleware";
import prisma from "../../config/prisma";

export const register = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = registerSchema.parse(req.body);

    const user = await registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: {
        user,
      },
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const login = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const validatedData = loginSchema.parse(req.body);

    const result = await loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({
        success: false,
        message: error.message,
      });

      return;
    }

    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

export const getCurrentUser = async (
  req: AuthRequest,
  res: Response
): Promise<void> => {
  const user = await prisma.user.findUnique({
    where: {
      id: req.user!.userId,
    },
    select: {
      id: true,
      username: true,
      email: true,
      fullName: true,
      bio: true,
      avatarUrl: true,
      isVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    res.status(404).json({
      success: false,
      message: "User not found",
    });
    return;
  }

  res.status(200).json({
    success: true,
    data: {
      user,
    },
  });
};