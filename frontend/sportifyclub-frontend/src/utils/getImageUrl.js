const defaultImages = {
  pádel: "/fallback-ball.svg",
  tenis: "/fallback-ball.svg",
  "fútbol 5": "/futsal-court.png",
  fútbol: "/futbol-user.jpg",
  baloncesto: "/fallback-ball.svg",
  voleibol: "/fallback-ball.svg",
  default: "/fallback-ball.svg",
};

const isPlaceholderImage = (url) =>
  typeof url === "string" &&
  (url.includes("via.placeholder.com") || 
   url.includes("placeholder.com") || 
   url.includes("picsum.photos"));

export const getImageUrl = (pista) => {
  const deporte = (pista.deporte || "").toLowerCase();
  
  if (pista.imagen && !isPlaceholderImage(pista.imagen)) {
    return pista.imagen;
  }
  
  return defaultImages[deporte] || defaultImages.default;
};

export const getFallbackPath = () => "/fallback-ball.svg";
