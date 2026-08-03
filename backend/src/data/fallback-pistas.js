import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const fallbackFile = path.join(__dirname, "pistas.csv");

let cachedPistas = null;

const splitCsvLine = (line) => {
  const values = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];

    if (ch === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (ch === "," && !inQuotes) {
      values.push(current);
      current = "";
      continue;
    }

    current += ch;
  }

  values.push(current);
  return values;
};

const toBoolean = (value) => String(value).trim().toLowerCase() === "true";

const parseHorarios = (raw) => {
  if (!raw) return [];
  try {
    return JSON.parse(raw);
  } catch {
    return [];
  }
};

const mapCsvRowToPista = (row, index) => {
  const [
    nombre,
    deporte,
    precioHora,
    ubicacion,
    clubEmail,
    horariosDisponibles,
    iluminacion,
    superficie,
  ] = row;

  return {
    _id: `fallback-pista-${index + 1}`,
    nombre,
    deporte,
    precioHora: Number(precioHora),
    ubicacion,
    horariosDisponibles: parseHorarios(horariosDisponibles),
    iluminacion: toBoolean(iluminacion),
    superficie,
    imagen:
      "https://images.unsplash.com/photo-1554068865-24cecd4e34b8?w=800&q=80",
    club: {
      name: clubEmail ? clubEmail.split("@")[0] : "club",
      email: clubEmail || "",
    },
  };
};

export const getFallbackPistas = async () => {
  if (cachedPistas) return cachedPistas;

  const fileContents = await fs.readFile(fallbackFile, "utf-8");
  const lines = fileContents.split(/\r?\n/).filter(Boolean);

  if (lines.length <= 1) {
    cachedPistas = [];
    return cachedPistas;
  }

  const dataLines = lines.slice(1);
  cachedPistas = dataLines.map((line, index) =>
    mapCsvRowToPista(splitCsvLine(line), index),
  );

  return cachedPistas;
};
