import { Request, Response } from "express";
import { CheckUserExists, CreateUser, GetUserById } from "../../repository/users/createUser";
import { GetUserByEmail } from "../../repository/users/createUser";
import bcrypt from 'bcrypt'
import jwt from "jsonwebtoken";

export const SignUp = async (req: Request, res: Response) => {
  try {
    const { first_name, last_name, email, role, password } = req.body;

    if (!first_name || !email || !role || !password) {
      return res.status(400).json({
        message: "Please fill neccessary details",
      });
    }

    const userExists = await CheckUserExists(email)

    if(userExists){
        return res.status(500).json({
            message: 'User Already Exists'
    })
    }

    const hashPassword = await bcrypt.hash(password,10)

    const newUser = {
        first_name,
        last_name,
        email,
        role,
        password: hashPassword
    }

    const user = await CreateUser(newUser)

    res.status(201).json({
      success: true,
      message: 'User Created Successfully',
    });

  } catch (error:any) {
    console.error(error.message);
    res.status(400).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};


export const Login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const user = await GetUserByEmail(email);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid credentials",
      });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    const refreshToken = jwt.sign(
      {
        id: user.id,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      accessToken,
      user: {
        name : user.first_name,
        email: user.email,
        role: user.role,
      },
    });

  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};

export const RefreshToken = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        message: "No refresh token provided",
      });
    }

    const decoded = jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET as string
    ) as { id: string };

    const accessToken = jwt.sign(
      {
        id: decoded.id,
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "15m" }
    );

    // rotate refresh token
    const newRefreshToken = jwt.sign(
      {
        id: decoded.id,
      },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "7d" }
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    });

    return res.status(200).json({
      success: true,
      accessToken,
    });

  } catch (error: any) {
    console.error(error.message);

    return res.status(403).json({
      message: "Invalid or expired refresh token",
    });
  }
};

export const GetMe = async (req: any, res: Response) => {
  try {
    const userId = req.user.id;
    const user = await GetUserById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({
      success: true,
      user: {
        name: user.first_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error: any) {
    console.error(error.message);
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
    });
  }
};