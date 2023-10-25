const { Router } = require("express");

const router = Router();

router.post("/auth/sign-in", (req, res) => {
  res.json({ message: "ok" });
});

router.post("/auth/sign-up", (req, res) => {
  res.json({ message: "ok" });
});

router.get("/me", (req, res) => {
  res.json({ message: "ok" });
});

module.exports = router;
