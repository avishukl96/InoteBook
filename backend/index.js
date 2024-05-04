const connectToMongo = require("./db");
const express = require("express");

connectToMongo();

const app = express();
const port = 3000;

app.get("/", (req, res) => {
  res.send("First API - Hello World!");
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
