import { Router } from "express";
import {
  GetPublicJob,
  SubmitPublicApplication,
} from "../controllers/public/public.controller";
import { publicRateLimit } from "../middleware/publicRateLimit";

const route = Router();

route.get("/jobs/:token", publicRateLimit, GetPublicJob);
route.post("/jobs/:token/apply", publicRateLimit, SubmitPublicApplication);

export default route;
