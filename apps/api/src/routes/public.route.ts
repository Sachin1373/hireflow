import { Router } from "express";
import {
  GetPublicJob,
  SubmitPublicApplication,
  UploadPublicResume,
} from "../controllers/public/public.controller";
import { publicRateLimit } from "../middleware/publicRateLimit";
import { publicUpload } from "../middleware/publicUpload";

const route = Router();

route.get("/jobs/:token", publicRateLimit, GetPublicJob);
route.post("/jobs/:token/apply", publicRateLimit, SubmitPublicApplication);
route.post("/uploads/resume", publicRateLimit, publicUpload.single("file"), UploadPublicResume);

export default route;
