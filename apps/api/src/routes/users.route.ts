import { Router } from "express";
import { CreateNewUser, GetOrgUsers, UpdateOrgUser, DeleteOrgUser } from "../controllers/users/users.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { canCreateRoleMiddleware } from "../middleware/rbac.middleware";

const router = Router();

router.post("/create", authenticateToken, canCreateRoleMiddleware, CreateNewUser);
router.patch("/:id", authenticateToken, UpdateOrgUser);
router.delete("/:id", authenticateToken, DeleteOrgUser);
router.get("/list", authenticateToken, GetOrgUsers);

export default router;
