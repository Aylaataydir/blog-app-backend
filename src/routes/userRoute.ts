import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import { validateBody } from "../middlewares/validateBody.js";
import { list, read, update, updatePassword, deletee } from "../controllers/userController.js";
import { changePasswordSchema, updateUserSchema } from "../validations/user.validation.js";


const router = Router();
router.use(authentication);


router.route("/").get(list);
router.route("/:id").get(read).put(validateBody(updateUserSchema), update).delete(deletee);
router.route("/:id/password").put(validateBody(changePasswordSchema), updatePassword)

export default router;







