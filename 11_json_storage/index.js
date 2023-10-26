const express = require("express");

const PORT = 5000;

const app = express();
app.use(express.json());

const storage = new Map();

app.get("/:json_path", (req, res) => {
  const data = storage.get(req.params.json_path);
  if(!data) res.status(404).send("The store is empty. Try another path or post something here.")
  res.json(data);
});

app.post("/:json_path", (req, res) => {
  const data = req.body;
  storage.set(req.params.json_path, data);
  res.sendStatus(200);
});

app.listen(PORT, () => console.log("Server started on port ", PORT));
