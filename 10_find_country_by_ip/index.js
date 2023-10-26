const express = require("express");
const fs = require("fs");
const csv = require("csv-parser");

const PORT = 5000;
const app = express();
app.use(express.json());

app.get("/", async (req, res) => {
  const ip_v4 = req.headers["x-forwarded-for"];
  const decimal_ip = ipToDecimal(ip_v4);

  const stream = fs.createReadStream("./IP2LOCATION-LITE-DB1.CSV");
  const parser = csv();

  stream.pipe(parser).on("data", (data) => {
    if (+data.from < +decimal_ip && +decimal_ip < +data.to) {
      console.log(`${data.fullName} - ${ip_v4}`);
      stream.destroy();
    }
  });

  res.sendStatus(200);
});

function ipToDecimal(ip) {
  const octets = ip.split(".").map(Number);
  if (octets.length !== 4 || octets.some((octet) => octet < 0 || octet > 255)) {
    throw new Error("Invalid IP address format");
  }
  return (
    octets[0] * 256 ** 3 + octets[1] * 256 ** 2 + octets[2] * 256 + octets[3]
  );
}

app.listen(PORT, () => {
  console.log("Server started on port ", PORT);
});
