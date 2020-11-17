import bodyParser from "body-parser";
import cors from "cors";
import mongoConnect from "./core/mongoConnect";
import routes from "./core/routes";
import serve from "./core/serve";
import express from "express";

if (process.env.NODE_ENV?.trim() !== "production") {
  require("dotenv").config();
}

const app = express();

app.use(cors());
app.use("/asset", express.static("./public"));
app.use(bodyParser.json());

routes(app);
mongoConnect();
const server = serve(app);

export default server;
