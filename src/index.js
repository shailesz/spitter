const express = require("express");
const port = 3000;

const myRouter = require("./router/myRouter");

const app = express();

app.use(express.json());
app.use(myRouter);

app.listen(port, () => {
  console.log("Server up on port " + port);
});
