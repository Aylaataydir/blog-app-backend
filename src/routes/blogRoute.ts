import { Router } from "express";
import authentication from "../middlewares/authentication.js";
import { validateBody } from "../middlewares/validateBody.js";
import { list, read,create, update, deletee, getLike, postLike } from "../controllers/blogController.js";
import { createBlogSchema, updateBlogSchema } from "../validations/blog.validation.js";



const router = Router();


router.route("/").get(list).post(authentication, validateBody(createBlogSchema), create);
router.route("/:id").get(authentication, read).put(authentication,validateBody(updateBlogSchema), update).delete(authentication, deletee);
router.route("/:id/getLike").get(authentication,getLike)
router.route("/:id/postLike").post(authentication,postLike)


export default router;
