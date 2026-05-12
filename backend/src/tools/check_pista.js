import mongoose from "mongoose";
import dotenv from "dotenv";
import Pista from "../models/Pista.js";

dotenv.config();

const mongoUri =
  process.env.MONGODB_URI ||
  process.env.MONGO_URI ||
  "mongodb://127.0.0.1:27017/sportify";

const check = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Conectado a DB");

    const pista = await Pista.findOne({ nombre: "Pista 2" });
    console.log("Pista 2 encontrada:", pista);

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

check();
