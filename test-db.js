import mongoose from "mongoose";
import Pista from "./backend/src/models/Pista.js";
import dotenv from "dotenv";

dotenv.config({ path: "./backend/.env" });

const uri = "mongodb://localhost:27017/sportifyclub";

async function run() {
  await mongoose.connect(uri);
  const pistas = await Pista.find({}, "nombre deporte");
  console.log(pistas);
  process.exit(0);
}
run();
