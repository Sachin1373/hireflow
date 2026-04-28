import { Request, Response } from "express";
import {
  CreateUser,
  CheckUserExists,
  UpdateUser,
  GetOrgUsersRepo,
  DeleteUserRepo,
} from "../../repository/users/createUser";
import bcrypt from "bcrypt";
import { sendEmail } from "../../services/email/sendEmail";
import { inviteUserTemplate } from "../../services/email/templates/inviteUserTemplate";

export const CreateNewUser = async (req: any, res: Response) => {
  try {
    const { first_name, last_name, email, role, permissions } = req.body;
    const { org_id, id: created_by } = req.user;

    if (!first_name || !email || !role) {
      return res
        .status(400)
        .json({ message: "First name, email, role and password are required" });
    }

    const exists = await CheckUserExists(email);
    if (exists) {
      return res
        .status(409)
        .json({ message: "User with this email already exists" });
    }
    const tempPassword = Math.random().toString(36).slice(-8) + "@A1";

    const hashPassword = await bcrypt.hash(tempPassword, 10);

    const newUser = await CreateUser({
      first_name,
      last_name,
      email,
      role,
      password: hashPassword,
      org_id,
      created_by,
      permissions,
    });

    await sendEmail({
      to: email,
      subject: "Your HireFlow Account",
      html: inviteUserTemplate({
        firstName: first_name,
        email,
        tempPassword,
      }),
    });

    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error: any) {
    console.error("CreateNewUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const UpdateOrgUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { org_id } = req.user;
    const data = req.body;

    const updatedUser = await UpdateUser(id, org_id, data);

    if (!updatedUser) {
      return res
        .status(404)
        .json({ message: "User not found or nothing to update" });
    }

    res.json({
      success: true,
      data: updatedUser,
    });
  } catch (error: any) {
    console.error("UpdateOrgUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const GetOrgUsers = async (req: any, res: Response) => {
  try {
    const { org_id } = req.user;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || "";

    const result = await GetOrgUsersRepo(org_id, page, limit, search);

    res.json({
      success: true,
      data: result.users,
      pagination: {
        total: result.total,
        page: result.page,
        limit: result.limit,
      },
    });
  } catch (error: any) {
    console.error("GetOrgUsers error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const DeleteOrgUser = async (req: any, res: Response) => {
  try {
    const { id } = req.params;
    const { org_id, id: currentUserId } = req.user;

    if (id === currentUserId) {
      return res.status(400).json({ message: "You cannot delete yourself" });
    }

    const deleted = await DeleteUserRepo(id, org_id);

    if (!deleted) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error: any) {
    console.error("DeleteOrgUser error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
