import dotenv from "dotenv";
import connectDB from "./config/db.js";
import Pista from "./models/Pista.js";

dotenv.config();

async function updateFutsalImages() {
  try {
    await connectDB();
    console.log("Conectado a la base de datos.");

    const result = await Pista.updateMany(
      { deporte: "Fútbol 5" },
      { $set: { imagen: "/futsal-court.png" } }
    );

    console.log(`Pistas de Fútbol 5 actualizadas: ${result.modifiedCount}`);
    process.exit(0);
  } catch (err) {
    console.error("Error:", err);
    process.exit(1);
  }
}

updateFutsalImages();
