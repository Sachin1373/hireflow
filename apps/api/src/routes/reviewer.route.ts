import { Router } from "express";
import { CreateReviewer, getAllReviewers } from "../controllers/auth/reviewers.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const route = Router()

route.post('/create', authenticateToken, CreateReviewer)
route.get("/fetchAll", authenticateToken, getAllReviewers);


export default route;