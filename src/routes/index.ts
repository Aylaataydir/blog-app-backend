import { Router } from "express";


import authRoute from "./authRoute.js";
import userRoute from "./userRoute.js";
import categoryRoute from "./categoryRoute.js";
import blogRoute from "./blogRoute.js";
import commentRoute from "./commentRoute.js";

const router = Router();

router.use("/auth", authRoute);
router.use("/users", userRoute);
router.use("/categories", categoryRoute);
router.use("/blogs", blogRoute);
router.use("/comments", commentRoute);

export default router;




