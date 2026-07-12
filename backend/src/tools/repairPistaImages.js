import dotenv from "dotenv";
import connectDB from "../config/db.js";
import Pista from "../models/Pista.js";

dotenv.config();

const TARGET_NAMES = ["Pista 1", "Pista 28", "Pista 32", "Pista 39"];

const fallbackImages = {
  "Pádel": "https://images.unsplash.com/photo-1622163642998-1ea32b0bbc67?w=1400&q=80",
  "Tenis": "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=80",
  "Fútbol 5": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1400&q=80",
  "Fútbol": "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1400&q=80",
  "Baloncesto": "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=1400&q=80",
  "Voleibol": "https://images.unsplash.com/photo-1592656094267-764a45160876?w=1400&q=80",
  default: "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=1400&q=80",
};

const isPlaceholderImage = (url) =>
  typeof url === "string" &&
  (url.includes("via.placeholder.com") ||
    url.includes("placeholder.com") ||
    url.includes("picsum.photos"));

const isHttpUrl = (url) => typeof url === "string" && /^https?:\/\//i.test(url);

async function isReachable(url) {
  if (!isHttpUrl(url)) return false;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 6000);

  try {
    const headRes = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
    });

    if (headRes.ok) return true;

    if ([403, 405].includes(headRes.status)) {
      const getRes = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
      });
      return getRes.ok;
    }

    return false;
  } catch {
    return false;
  } finally {
    clearTimeout(timeout);
  }
}

async function repairPistaImages() {
  await connectDB();
  console.log("Conectado a MongoDB para reparar imágenes de pistas...");

  const pistas = await Pista.find({
    nombre: { $in: TARGET_NAMES },
    deporte: "Fútbol 5",
  });

  if (pistas.length === 0) {
    console.log("No se encontraron pistas objetivo de Fútbol 5 para reparar.");
    process.exit(0);
  }

  let fixed = 0;

  for (const pista of pistas) {
    const currentImage = pista.imagen;
    const fallback = fallbackImages[pista.deporte] || fallbackImages.default;

    const shouldReplaceBecauseFormat =
      !isHttpUrl(currentImage) || isPlaceholderImage(currentImage);

    let reachable = false;
    if (!shouldReplaceBecauseFormat) {
      reachable = await isReachable(currentImage);
    }

    if (shouldReplaceBecauseFormat || !reachable) {
      pista.imagen = fallback;
      await pista.save();
      fixed += 1;
      console.log(`Corregida ${pista.nombre}: ${currentImage || "(vacía)"} -> ${fallback}`);
    } else {
      console.log(`OK ${pista.nombre}: imagen accesible.`);
    }
  }

  console.log(`Proceso completado. Pistas corregidas: ${fixed}/${pistas.length}`);
  process.exit(0);
}

repairPistaImages().catch((error) => {
  console.error("Error reparando imágenes de pistas:", error.message);
  process.exit(1);
});
