import { Router } from "express";
import { CreateReviewer, getAllReviewers, BulkUploadReviewers, DeleteReviewer, UpdateReviewer, SaveJobReviewers, getReviewerInterviewsController, updateInterviewStatusController } from "../controllers/reviewers/reviewers.controller";
import { getAssignedApplicatinsbyreviewer, getAssignedJobs, updateApplicationStatus } from "../controllers/reviewers/reviewerAssignments.controller";
import { authenticateToken } from "../middleware/auth.middleware";
import { upload } from "../middleware/upload";

const route = Router()

route.post('/create', authenticateToken, CreateReviewer)
route.patch('/:id', authenticateToken, UpdateReviewer)
route.get("/fetchAll", authenticateToken, getAllReviewers);
route.post("/bulk", authenticateToken, upload.single("file"), BulkUploadReviewers)
route.delete("/:id", authenticateToken, DeleteReviewer)
route.post("/job/:jobId", authenticateToken, SaveJobReviewers)

route.get("/assigned-jobs", authenticateToken, getAssignedJobs)
route.get("/assigned-applications/:jobId", authenticateToken, getAssignedApplicatinsbyreviewer)
route.patch("/applications/:applicationId/status", authenticateToken, updateApplicationStatus)
route.get("/assigned-interviews", authenticateToken, getReviewerInterviewsController)
route.patch("/interviews/:id/status", authenticateToken, updateInterviewStatusController);

export default route;