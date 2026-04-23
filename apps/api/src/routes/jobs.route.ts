import { Router } from "express";

import { authenticateToken } from "../middleware/auth.middleware";
import { CreateJob, GetAllJobs } from "../controllers/jobs/jobs.controller";

const route = Router()

route.post('/create', authenticateToken, CreateJob)
route.get('/list', authenticateToken, GetAllJobs)

export default route;