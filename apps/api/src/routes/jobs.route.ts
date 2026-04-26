import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import {
  CreateJob,
  GetAllJobs,
  GetJob,
  UpdateJob,
  SaveJobReviewers,
  DeleteJob,
} from "../controllers/jobs/jobs.controller";
import { SaveFormFields, GetFormFields } from "../controllers/formFields/formFields.controller";

const route = Router()

route.post('/create', authenticateToken, CreateJob)
route.get('/list', authenticateToken, GetAllJobs)
route.get('/:id', authenticateToken, GetJob)
route.patch('/:id', authenticateToken, UpdateJob)
route.delete('/:id', authenticateToken, DeleteJob)
route.post('/:job_id/fields', authenticateToken, SaveFormFields)
route.get('/:job_id/fields', authenticateToken, GetFormFields)
route.post('/:job_id/reviewers', authenticateToken, SaveJobReviewers)

export default route;