import { Router } from "express"
import { createUserSchema, loginSchema } from "~/db/userSchema.js"
import { validateData } from "../../middlewares/validationMiddleware.js"
import { loginUser, registerUser } from "~/controllers/auth/index.js"

const router = Router()

router.post("/register", validateData(createUserSchema), registerUser)
router.post("/login", validateData(loginSchema), loginUser)

export default router
