import { Router } from "express";
import { GetMe, Login, RefreshToken, SignUp } from "../controllers/auth/auth.controller";
import { authenticateToken } from "../middleware/auth.middleware";

const route = Router()

route.post('/signup', SignUp)
route.post('/login', Login)
route.post('/refresh', RefreshToken)
route.get('/me', authenticateToken, GetMe)


export default route;