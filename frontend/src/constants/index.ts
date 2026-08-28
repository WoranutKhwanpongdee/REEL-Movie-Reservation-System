export const APP_CONFIG = {
  name: "REEL",
  tagline: "Dark Cinematic Movie Reservation System",
  description: "Experience the premier movie reservation system. Book Laser IMAX, Dolby Cinema, and Luxury VIP showtimes in real-time.",
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000",
} as const;

export const MOVIE_GENRES = [
  "All",
  "Action",
  "Sci-Fi",
  "Drama",
  "Horror",
  "Romance",
  "Comedy",
  "Thriller",
] as const;

export const CINEMA_FORMATS = [
  "Standard 2D",
  "IMAX Laser",
  "Dolby Cinema",
  "4DX Experience",
  "VIP Gold Class",
] as const;
