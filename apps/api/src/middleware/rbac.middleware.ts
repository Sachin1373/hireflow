import { Request, Response, NextFunction } from "express";

export const checkRole = (allowedRoles: string[]) => {
  return (req: any, res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({
        message: "Access Denied: You do not have permission to perform this action",
      });
    }
    next();
  };
};

export const canCreateRoleMiddleware = (req: any, res: Response, next: NextFunction) => {
    const userRole = req.user.role;
    const { role } = req.body;

    if (userRole === "ADMIN") {
      return next();
    }

    if (userRole === "HR") {
      if (role === "REVIEWER" && req.user.permissions?.write) {
        return next();
      }
      return res.status(403).json({ message: "HR can only create Reviewers and requires write permission" });
    }

    return res.status(403).json({ message: "You do not have permission to create users" });
};
