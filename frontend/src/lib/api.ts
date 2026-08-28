import {
  Movie,
  Cinema,
  Showtime,
  Seat,
  Booking,
  User,
  AuthResponse,
  AdminStats,
} from "@/types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

function getAuthHeader(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("reel_token");
  if (token) {
    return { Authorization: `Bearer ${token}` };
  }
  return {};
}

async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const headers = {
    "Content-Type": "application/json",
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorDetail = "An unexpected error occurred";
    try {
      const errorJson = await response.json();
      errorDetail = errorJson.detail || errorJson.message || errorDetail;
    } catch {
      errorDetail = `Request failed with status ${response.status}`;
    }
    throw new Error(errorDetail);
  }

  return response.json();
}

// ── Movies API ─────────────────────────────────────────────────────────────
export async function getMovies(params?: {
  search?: string;
  genre?: string;
  featured?: boolean;
}): Promise<Movie[]> {
  const query = new URLSearchParams();
  if (params?.search) query.append("search", params.search);
  if (params?.genre) query.append("genre", params.genre);
  if (params?.featured !== undefined)
    query.append("featured", String(params.featured));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return request<Movie[]>(`/api/movies${qs}`);
}

export async function getMovie(id: number): Promise<Movie> {
  return request<Movie>(`/api/movies/${id}`);
}

// ── Cinemas API ────────────────────────────────────────────────────────────
export async function getCinemas(): Promise<Cinema[]> {
  return request<Cinema[]>("/api/cinemas");
}

// ── Showtimes API ──────────────────────────────────────────────────────────
export async function getShowtimes(params?: {
  movie_id?: number;
  cinema_id?: number;
}): Promise<Showtime[]> {
  const query = new URLSearchParams();
  if (params?.movie_id) query.append("movie_id", String(params.movie_id));
  if (params?.cinema_id) query.append("cinema_id", String(params.cinema_id));

  const qs = query.toString() ? `?${query.toString()}` : "";
  return request<Showtime[]>(`/api/showtimes${qs}`);
}

export async function getShowtime(id: number): Promise<Showtime> {
  return request<Showtime>(`/api/showtimes/${id}`);
}

export async function getSeats(showtimeId: number): Promise<Seat[]> {
  return request<Seat[]>(`/api/showtimes/${showtimeId}/seats`);
}

// ── Bookings API ───────────────────────────────────────────────────────────
export async function createBooking(payload: {
  showtime_id: number;
  seat_ids?: number[];
  seat_id?: number;
}): Promise<Booking[]> {
  return request<Booking[]>("/api/bookings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function getMyBookings(): Promise<Booking[]> {
  return request<Booking[]>("/api/bookings/my");
}

export async function getBookingsByReference(
  reference: string
): Promise<Booking[]> {
  return request<Booking[]>(`/api/bookings/reference/${reference}`);
}

export async function cancelBooking(bookingId: number): Promise<Booking> {
  return request<Booking>(`/api/bookings/${bookingId}`, {
    method: "DELETE",
  });
}

export async function cancelBookingReference(
  reference: string
): Promise<Booking[]> {
  return request<Booking[]>(`/api/bookings/cancel-reference/${reference}`, {
    method: "POST",
  });
}

// ── Authentication API ─────────────────────────────────────────────────────
export async function loginApi(
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
}

export async function registerApi(
  name: string,
  email: string,
  password: string
): Promise<AuthResponse> {
  return request<AuthResponse>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
}

export async function getMeApi(): Promise<User> {
  return request<User>("/api/auth/me");
}

// ── Admin API ──────────────────────────────────────────────────────────────
export async function getAdminStats(): Promise<AdminStats> {
  return request<AdminStats>("/api/admin/stats");
}

export async function adminGetMovies(): Promise<Movie[]> {
  return request<Movie[]>("/api/admin/movies");
}

export async function adminCreateMovie(
  data: Partial<Movie>
): Promise<Movie> {
  return request<Movie>("/api/admin/movies", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function adminUpdateMovie(
  id: number,
  data: Partial<Movie>
): Promise<Movie> {
  return request<Movie>(`/api/admin/movies/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function adminDeleteMovie(
  id: number
): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/api/admin/movies/${id}`, {
    method: "DELETE",
  });
}

export async function adminGetCinemas(): Promise<Cinema[]> {
  return request<Cinema[]>("/api/admin/cinemas");
}

export async function adminCreateCinema(
  data: Partial<Cinema>
): Promise<Cinema> {
  return request<Cinema>("/api/admin/cinemas", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function adminUpdateCinema(
  id: number,
  data: Partial<Cinema>
): Promise<Cinema> {
  return request<Cinema>(`/api/admin/cinemas/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function adminDeleteCinema(
  id: number
): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/api/admin/cinemas/${id}`, {
    method: "DELETE",
  });
}

export async function adminGetShowtimes(): Promise<Showtime[]> {
  return request<Showtime[]>("/api/admin/showtimes");
}

export async function adminCreateShowtime(data: {
  movie_id: number;
  cinema_id: number;
  start_time: string;
  price: number;
  format: string;
}): Promise<Showtime> {
  return request<Showtime>("/api/admin/showtimes", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function adminUpdateShowtime(
  id: number,
  data: Partial<Showtime>
): Promise<Showtime> {
  return request<Showtime>(`/api/admin/showtimes/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function adminDeleteShowtime(
  id: number
): Promise<{ detail: string }> {
  return request<{ detail: string }>(`/api/admin/showtimes/${id}`, {
    method: "DELETE",
  });
}

export async function adminGetBookings(): Promise<Booking[]> {
  return request<Booking[]>("/api/admin/bookings");
}
