import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { GetJobApplications } from "../controllers/applications/applications.controller";

const route = Router()

route.get('/jobs/:job_id/applications', authenticateToken, GetJobApplications)



export default route;