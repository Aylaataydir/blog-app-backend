import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import { validateBody } from "../middlewares/validateBody.js";
import { list, read,create, update, deletee } from "../controllers/commentController.js";
import { createCommentSchema, updateCommentSchema } from "../validations/comment.validation.js";


const router = Router();

router.use(authentication)

router.route("/").get(list).post(validateBody(createCommentSchema), create);
router.route("/:id").get(read).put(validateBody(updateCommentSchema), update).delete(deletee);


export default router;