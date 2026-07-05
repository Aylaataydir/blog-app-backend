import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import { validateBody } from "../middlewares/validateBody.js";
import { list, read,create, update, deletee } from "../controllers/categoryController.js";
import { categorySchema } from "../validations/category.validation.js";


const router = Router();


router.route("/").get(list).post(authentication, validateBody(categorySchema), create);
router.route("/:id").get(read).put(authentication,validateBody(categorySchema), update).delete(authentication, deletee);


export default router;
