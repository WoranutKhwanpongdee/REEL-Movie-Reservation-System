export interface Movie {
  id: number;
  title: string;
  description?: string;
  genre?: string;
  duration?: number; // minutes
  rating?: number;
  release_year?: number;
  poster_url?: string;
  backdrop_url?: string;
  trailer_url?: string;
  director?: string;
  cast?: string;
  is_featured: boolean;
}

export interface Cinema {
  id: number;
  name: string;
  location: string;
  description?: string;
  total_rows: number;
  seats_per_row: number;
}

export interface Showtime {
  id: number;
  movie_id: number;
  cinema_id: number;
  start_time: string;
  price: number;
  format: string; // Standard, IMAX, Dolby Atmos, 4DX
  movie?: Movie;
  cinema?: Cinema;
}

export interface Seat {
  id: number;
  showtime_id: number;
  row: string;
  number: number;
  is_booked: boolean;
}

export interface Booking {
  id: number;
  user_id: number;
  showtime_id: number;
  seat_id: number;
  status: "confirmed" | "cancelled";
  total_price: number;
  booking_reference: string;
  created_at: string;
  showtime?: Showtime;
  seat?: Seat;
}

export interface User {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  created_at?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface AdminStats {
  total_bookings: number;
  confirmed_bookings: number;
  cancelled_bookings: number;
  total_revenue: number;
  total_movies: number;
  total_users: number;
  total_cinemas: number;
  total_seats: number;
  booked_seats: number;
  occupancy_rate: number;
}
