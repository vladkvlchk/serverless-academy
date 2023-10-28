const express = require("express");
const fs = require("fs");

const PORT = 5000;

const app = express();
app.use(express.json());

app.get("/:json_path", (req, res) => {
  try {
    const data = require(`./db/${req.params.json_path}.json`);
    res.json(data);
  } catch (e) {
    res.status(404).send('Empty');
    console.log(e);
  }
});

app.post("/:json_path", (req, res) => {
  try {
    fs.writeFileSync(
      `./db/${req.params.json_path}.json`,
      JSON.stringify(req.body),
      "utf-8"
    );
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500);
    console.log(e);
  }
});

app.listen(PORT, () => console.log("Server started on port ", PORT));
