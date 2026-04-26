import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { GetJobApplications } from "../controllers/applications/applications.controller";

const route = Router()

route.get('/job/:job_id/fetchAll', authenticateToken, GetJobApplications)



export default route;