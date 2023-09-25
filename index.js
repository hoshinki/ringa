import { http } from "@ampt/sdk";
import express, { Router } from "express";

const app = express();

var outerServer="";
const ima = new Date().toLocaleString()+"xxx ";

const api = Router();

api.get("/hello", (req, res) => {

  console.log(req.socket.address().port.toString()+" rinima");
  return res.status(200).send({ message: ima+ outerServer});
});

api.get("/greet/:name", (req, res) => {
  const { name } = req.params;

  if (!name) {
    return res.status(400).send({ message: "Missing route param for `name`!" });
  }

  return res.status(200).send({ message: `Hello ${name}!` });
});

api.post("/submit", async (req, res) => {
  return res.status(200).send({
    body: req.body,
    message: "You just posted data",
  });
});

app.use("/api", api);

http.node.use(app);
