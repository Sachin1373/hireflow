import { Router } from "express";

import { authenticateToken } from "../middleware/auth.middleware";
import { CreateJob } from "../controllers/jobs/jobs.controller";

const route = Router()

route.post('/create', authenticateToken, CreateJob)


export default route;