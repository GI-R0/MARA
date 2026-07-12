/**
 * Obtiene la URL de imagen apropiada para una pista
 * Maneja URLs remotas, imágenes locales y fallbacks
 */
const defaultImages = {
  pádel: "/fallback-ball.svg",
  tenis: "/fallback-ball.svg",
  "fútbol 5": "/futsal-court.png",
  fútbol: "/futbol-user.jpg",
  baloncesto: "/fallback-ball.svg",
  voleibol: "/fallback-ball.svg",
  default: "/fallback-ball.svg",
};

export const getSportFallbackImage = (pistaOrDeporte) => {
  const deporte =
    typeof pistaOrDeporte === "string"
      ? pistaOrDeporte.toLowerCase()
      : (pistaOrDeporte?.deporte || "").toLowerCase();

  return defaultImages[deporte] || defaultImages.default;
};

export const getImageUrl = (pista) => {
  if (!pista) return "/fallback-ball.svg";

  // Si la pista tiene imagen
  if (pista.imagen) {
    const imagen = pista.imagen;

    // Detectar si es una imagen placeholder (no usar)
    const isPlaceholderImage = (url) =>
      typeof url === "string" &&
      (url.includes("via.placeholder.com") ||
        url.includes("placeholder.com") ||
        url.includes("picsum.photos"));

    // Si no es placeholder, devolver la imagen
    if (!isPlaceholderImage(imagen)) {
      return imagen;
    }
  }

  // Fallback basado en deporte
  return getSportFallbackImage(pista);
};
