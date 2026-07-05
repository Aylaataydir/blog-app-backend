
import { createUserSchema, loginSchema } from '../validations/user.validation.js';
import { Router } from "express";
import { validateBody } from '../middlewares/validateBody.js'
import { login, register, logout, refresh } from '../controllers/authController.js'
import authentication from '../middlewares/authentication.js';



const router = Router();

router.post("/login",validateBody(loginSchema), login);
router.post("/register", validateBody(createUserSchema), register);
router.post("/logout", authentication, logout);
router.post("/refresh", refresh);


export default router;