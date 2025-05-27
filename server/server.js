import express from "express";
import dotenv from "dotenv";
import connectToDB from "./database/db.js";

const app = express();
dotenv.config();
const port = process.env.port || 4000;
app.use(express.json());

connectToDB();

app.listen(port, () => {
  console.log(`server indisponivel ${port}`);
});
