const express = require("express");

const PORT = 5000;
const HOST = process.env.HOST || "http://localhost:" + PORT;

const app = express();
app.use(express.json());

app.get("/hello", (req, res) => {
  res.send("hello");
});

app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
