const express = require("express");
const cors = require("cors");
const router = require("./router");
const { Pool } = require("pg");

const PORT = 5000;

const app = express();
app.use(cors());
app.use(express.json());

app.use("/", router);

const start = async () => {
  try {
    const pool = new Pool({
      user: '',
      host: '',
      database: '',
      password: '',
      port: '',
    })

    app.listen(PORT, () => {
      console.log("Server started on port ", PORT);
    });
  } catch (err) {
    console.error(err);
  }
};

start();