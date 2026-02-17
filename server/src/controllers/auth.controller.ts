import type { Request, Response, NextFunction } from "express";
import bcrypt from "bcrypt";
import { prisma } from "../config/database.js";
import passport from "passport";

export const signup = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and Password Required" });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    req.login(user, (err) => {
      if (err) {
        return res.status(500).json({ error: "Login failed after signup" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.status(201).json({ user: userWithoutPassword });
    });
  } catch (error) {
    console.error("Signup error:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

export const login = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate("local", (err: any, user: any, info: any) => {
    if (err) {
      return res.status(500).json({ error: "Server error" });
    }

    if (!user) {
      return res
        .status(401)
        .json({ error: info.message || "Invalid credentials" });
    }

    req.login(user, (err) => {
      if (err) {
        console.error("DETAILED LOGIN ERROR:", err); 
        return res
          .status(500)
          .json({ error: "Login failed", details: err.message });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json({ user: userWithoutPassword });
    });
  })(req, res, next);
};

export const logout = (req: Request, res: Response) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ error: "Logout failed" });
    }
  });

  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: "Session destruction failed" });
    }

    res.json({ message: "Logged Out Successfuly" });
  });
};

export const checkAuth = (req: Request, res: Response) => {
  if (req.user) {
    const { password: _, ...userWithoutPassword } = req.user as any;
    res.json({ user: userWithoutPassword });
  } else {
    res.status(401).json({ error: "Not authenticated" });
  }
};
