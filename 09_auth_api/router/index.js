const { Router } = require("express");
const authMiddleware = require("../middlewares/auth-middleware");
const userController = require("../controllers/user-controller");

const router = Router();

router.post("/auth/sign-in", userController.signIn);
router.post("/auth/sign-up", userController.signUp);

router.get("/me", authMiddleware, userController.getMe);

module.exports = router;
