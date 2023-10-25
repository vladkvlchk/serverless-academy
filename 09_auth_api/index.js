const express = require("express");
const cors = require("cors");
const router = require("./router");

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", router);

const start = async () => {
  try {
    //here I will connect to the db
    app.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  } catch (err) {
    console.error(err);
  }
};

start();