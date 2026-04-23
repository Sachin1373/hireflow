import { Router } from "express";
import { CreateReviewer, getAllReviewers, BulkUploadReviewers, DeleteReviewer, UpdateReviewer, SaveJobReviewers } from "../controllers/reviewers/reviewers.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";

const route = Router()

route.post('/create', authenticateToken, CreateReviewer)
route.patch('/:id', authenticateToken, UpdateReviewer)
route.get("/fetchAll", authenticateToken, getAllReviewers);
route.post("/bulk", authenticateToken, upload.single("file"), BulkUploadReviewers)
route.delete("/:id", authenticateToken, DeleteReviewer)
route.post("/job/:jobId", authenticateToken, SaveJobReviewers)


export default route;