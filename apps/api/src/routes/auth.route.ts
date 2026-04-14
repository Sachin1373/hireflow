import { Router } from "express";
import { Login, RefreshToken, SignUp } from "../controllers/auth/auth.controller";

const route = Router()

route.post('/signup', SignUp)
route.post('/login', Login)
route.post('/refresh', RefreshToken)


export default route;