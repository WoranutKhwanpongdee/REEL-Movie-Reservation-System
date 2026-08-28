"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  AdminStats,
  Movie,
  Cinema,
  Showtime,
  Booking,
} from "@/types";
import {
  getAdminStats,
  adminGetMovies,
  adminCreateMovie,
  adminUpdateMovie,
  adminDeleteMovie,
  adminGetCinemas,
  adminGetShowtimes,
  adminCreateShowtime,
  adminDeleteShowtime,
  adminGetBookings,
} from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import {
  ShieldCheck,
  Film,
  Calendar,
  Ticket,
  DollarSign,
  TrendingUp,
  Users,
  Plus,
  Trash2,
  Edit2,
  Sparkles,
  MapPin,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
} from "lucide-react";

export default function AdminDashboardPage() {
  const { user, openAuthModal } = useAuth();

  const [stats, setStats] = useState<AdminStats | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState<
    "overview" | "movies" | "showtimes" | "cinemas" | "bookings"
  >("overview");

  // Movie Modal States
  const [movieModalOpen, setMovieModalOpen] = useState(false);
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [movieForm, setMovieForm] = useState<Partial<Movie>>({
    title: "",
    genre: "Action",
    duration: 120,
    rating: 8.0,
    release_year: 2024,
    director: "",
    cast: "",
    description: "",
    poster_url: "",
    backdrop_url: "",
    trailer_url: "",
    is_featured: false,
  });

  // Showtime Modal States
  const [showtimeModalOpen, setShowtimeModalOpen] = useState(false);
  const [showtimeForm, setShowtimeForm] = useState({
    movie_id: 0,
    cinema_id: 0,
    start_time: new Date().toISOString().slice(0, 16),
    price: 18.0,
    format: "Standard",
  });

  const [bookingSearch, setBookingSearch] = useState("");

  const refreshAllData = async () => {
    if (!user?.is_admin) return;
    setLoading(true);
    try {
      const [statsData, moviesData, cinemasData, showtimesData, bookingsData] =
        await Promise.all([
          getAdminStats(),
          adminGetMovies(),
          adminGetCinemas(),
          adminGetShowtimes(),
          adminGetBookings(),
        ]);
      setStats(statsData);
      setMovies(moviesData);
      setCinemas(cinemasData);
      setShowtimes(showtimesData);
      setBookings(bookingsData);

      if (moviesData.length > 0 && cinemasData.length > 0) {
        setShowtimeForm((prev) => ({
          ...prev,
          movie_id: moviesData[0].id,
          cinema_id: cinemasData[0].id,
        }));
      }
    } catch (err) {
      console.error("Admin data load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.is_admin) {
      refreshAllData();
    } else {
      setLoading(false);
    }
  }, [user]);

  // Handle Movie Add / Edit
  const handleSaveMovie = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingMovie) {
        await adminUpdateMovie(editingMovie.id, movieForm);
      } else {
        await adminCreateMovie(movieForm);
      }
      setMovieModalOpen(false);
      setEditingMovie(null);
      refreshAllData();
    } catch (err: any) {
      alert(err.message || "Failed to save movie");
    }
  };

  const handleDeleteMovie = async (id: number) => {
    if (confirm("Are you sure you want to delete this movie? All associated showtimes will also be removed.")) {
      try {
        await adminDeleteMovie(id);
        refreshAllData();
      } catch (err: any) {
        alert(err.message || "Failed to delete movie");
      }
    }
  };

  // Handle Showtime Add
  const handleSaveShowtime = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await adminCreateShowtime({
        ...showtimeForm,
        movie_id: Number(showtimeForm.movie_id),
        cinema_id: Number(showtimeForm.cinema_id),
        price: Number(showtimeForm.price),
      });
      setShowtimeModalOpen(false);
      refreshAllData();
    } catch (err: any) {
      alert(err.message || "Failed to create showtime");
    }
  };

  const handleDeleteShowtime = async (id: number) => {
    if (confirm("Delete this showtime?")) {
      try {
        await adminDeleteShowtime(id);
        refreshAllData();
      } catch (err: any) {
        alert(err.message || "Failed to delete showtime");
      }
    }
  };

  // If not admin, show restricted screen
  if (!user?.is_admin && !loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-950 text-red-400 border border-red-800">
            <ShieldCheck className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-mono">
            Admin Access Restricted
          </h2>
          <p className="text-xs text-zinc-400">
            You must be signed in with administrative privileges to manage movies, showtimes, and view revenue analytics.
          </p>
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={openAuthModal}
              className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              Sign In as Admin
            </button>
            <Link
              href="/"
              className="w-full rounded-xl border border-zinc-800 bg-zinc-900 py-2 text-xs font-semibold text-zinc-300 hover:bg-zinc-800 text-center"
            >
              Return to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Filter Bookings
  const filteredBookings = bookings.filter(
    (b) =>
      !bookingSearch.trim() ||
      b.booking_reference.toLowerCase().includes(bookingSearch.toLowerCase()) ||
      b.showtime?.movie?.title.toLowerCase().includes(bookingSearch.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Top Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-red-400">
                REEL Executive CMS
              </span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              Management Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={refreshAllData}
              className="flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 transition-colors"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {/* ── Key Metrics Cards ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Total Revenue</span>
              <DollarSign className="h-4 w-4 text-emerald-400" />
            </div>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-white">
              ${stats?.total_revenue.toFixed(2) || "0.00"}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">From confirmed tickets</p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Occupancy Rate</span>
              <TrendingUp className="h-4 w-4 text-amber-400" />
            </div>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-white">
              {stats?.occupancy_rate || 0}%
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              {stats?.booked_seats || 0} / {stats?.total_seats || 0} seats booked
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Bookings</span>
              <Ticket className="h-4 w-4 text-red-400" />
            </div>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-white">
              {stats?.total_bookings || 0}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">
              {stats?.confirmed_bookings || 0} confirmed • {stats?.cancelled_bookings || 0} cancelled
            </p>
          </div>

          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4 sm:p-5">
            <div className="flex items-center justify-between text-zinc-400">
              <span className="text-xs font-semibold uppercase tracking-wider">Movies Active</span>
              <Film className="h-4 w-4 text-sky-400" />
            </div>
            <p className="mt-2 font-mono text-2xl sm:text-3xl font-bold text-white">
              {stats?.total_movies || 0}
            </p>
            <p className="mt-1 text-[11px] text-zinc-500">Across {stats?.total_cinemas || 0} venue screens</p>
          </div>
        </div>

        {/* ── Navigation Tabs ───────────────────────────────────────────── */}
        <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800 overflow-x-auto">
          {[
            { id: "overview", label: "Overview" },
            { id: "movies", label: `Movies (${movies.length})` },
            { id: "showtimes", label: `Showtimes (${showtimes.length})` },
            { id: "cinemas", label: `Cinemas (${cinemas.length})` },
            { id: "bookings", label: `Live Bookings (${bookings.length})` },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`rounded-lg px-4 py-2 text-xs font-semibold whitespace-nowrap transition-all ${
                activeTab === t.id
                  ? "bg-zinc-800 text-white shadow-sm"
                  : "text-zinc-400 hover:text-zinc-200"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB: Overview ─────────────────────────────────────────────── */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Quick Actions Card */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 space-y-4">
              <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                Management Quick Actions
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setEditingMovie(null);
                    setMovieForm({
                      title: "",
                      genre: "Action",
                      duration: 120,
                      rating: 8.0,
                      release_year: 2024,
                      director: "",
                      cast: "",
                      description: "",
                      poster_url: "",
                      backdrop_url: "",
                      trailer_url: "",
                      is_featured: false,
                    });
                    setMovieModalOpen(true);
                  }}
                  className="flex items-center gap-2 rounded-xl border border-red-500/30 bg-red-950/40 p-4 text-xs font-bold text-red-300 hover:bg-red-900/60 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>Add New Movie</span>
                </button>

                <button
                  onClick={() => setShowtimeModalOpen(true)}
                  className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-800/80 p-4 text-xs font-bold text-zinc-200 hover:bg-zinc-700 transition-colors"
                >
                  <Calendar className="h-4 w-4 text-amber-400" />
                  <span>Schedule Showtime</span>
                </button>
              </div>
            </div>

            {/* Venues Summary */}
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-6 space-y-3">
              <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                Active Cinema Venues
              </h3>
              <div className="space-y-2">
                {cinemas.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center justify-between rounded-xl border border-zinc-800/60 bg-zinc-950/50 p-3 text-xs"
                  >
                    <div>
                      <span className="font-bold text-zinc-200">{c.name}</span>
                      <p className="text-[11px] text-zinc-500">{c.location}</p>
                    </div>
                    <span className="font-mono text-zinc-400">
                      {c.total_rows * c.seats_per_row} seats ({c.total_rows}×{c.seats_per_row})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── TAB: Movies ──────────────────────────────────────────────── */}
        {activeTab === "movies" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white font-mono uppercase">
                All Movies ({movies.length})
              </h3>
              <button
                onClick={() => {
                  setEditingMovie(null);
                  setMovieForm({
                    title: "",
                    genre: "Action",
                    duration: 120,
                    rating: 8.0,
                    release_year: 2024,
                    director: "",
                    cast: "",
                    description: "",
                    poster_url: "",
                    backdrop_url: "",
                    trailer_url: "",
                    is_featured: false,
                  });
                  setMovieModalOpen(true);
                }}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Movie</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/30">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="border-b border-zinc-800 bg-zinc-900/80 font-mono uppercase text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Movie</th>
                    <th className="px-4 py-3">Genre</th>
                    <th className="px-4 py-3">Duration</th>
                    <th className="px-4 py-3">Rating</th>
                    <th className="px-4 py-3">Featured</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {movies.map((m) => (
                    <tr key={m.id} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3 flex items-center gap-3">
                        <img
                          src={m.poster_url || ""}
                          alt=""
                          className="h-10 w-7 rounded object-cover bg-zinc-800"
                        />
                        <div>
                          <strong className="text-zinc-100">{m.title}</strong>
                          <p className="text-[11px] text-zinc-500">{m.director}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3">{m.genre}</td>
                      <td className="px-4 py-3 font-mono">{m.duration} mins</td>
                      <td className="px-4 py-3 font-mono text-amber-400 font-bold">
                        ★ {m.rating?.toFixed(1)}
                      </td>
                      <td className="px-4 py-3">
                        {m.is_featured ? (
                          <span className="rounded bg-red-950/80 px-2 py-0.5 font-bold text-red-400 text-[10px]">
                            YES
                          </span>
                        ) : (
                          <span className="text-zinc-600 text-[10px]">NO</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingMovie(m);
                            setMovieForm(m);
                            setMovieModalOpen(true);
                          }}
                          className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-white"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteMovie(m.id)}
                          className="rounded p-1 text-zinc-400 hover:bg-red-950 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: Showtimes ───────────────────────────────────────────── */}
        {activeTab === "showtimes" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-sm text-white font-mono uppercase">
                Active Showtimes ({showtimes.length})
              </h3>
              <button
                onClick={() => setShowtimeModalOpen(true)}
                className="flex items-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-red-700"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Schedule Showtime</span>
              </button>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/30">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="border-b border-zinc-800 bg-zinc-900/80 font-mono uppercase text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Movie</th>
                    <th className="px-4 py-3">Cinema Venue</th>
                    <th className="px-4 py-3">Start Time</th>
                    <th className="px-4 py-3">Format</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {showtimes.slice(0, 50).map((st) => (
                    <tr key={st.id} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3 font-semibold text-zinc-100">
                        {st.movie?.title || `#${st.movie_id}`}
                      </td>
                      <td className="px-4 py-3">{st.cinema?.name || `#${st.cinema_id}`}</td>
                      <td className="px-4 py-3 font-mono">
                        {new Date(st.start_time).toLocaleString()}
                      </td>
                      <td className="px-4 py-3">
                        <span className="rounded bg-zinc-800 px-2 py-0.5 font-bold text-zinc-300 text-[10px]">
                          {st.format}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        ${st.price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteShowtime(st.id)}
                          className="rounded p-1 text-zinc-400 hover:bg-red-950 hover:text-red-400"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── TAB: Cinemas ─────────────────────────────────────────────── */}
        {activeTab === "cinemas" && (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {cinemas.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-sm text-white font-mono">{c.name}</h4>
                  <span className="rounded bg-red-950/80 px-2 py-0.5 text-[10px] font-bold text-red-400">
                    {c.total_rows * c.seats_per_row} Seats
                  </span>
                </div>
                <p className="text-xs text-zinc-400">{c.location}</p>
                <p className="text-[11px] text-zinc-500">{c.description}</p>
                <div className="border-t border-zinc-800/60 pt-2 text-[11px] font-mono text-zinc-400">
                  Hall Grid: {c.total_rows} Rows × {c.seats_per_row} Seats/Row
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── TAB: Live Bookings Ledger ────────────────────────────────── */}
        {activeTab === "bookings" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h3 className="font-bold text-sm text-white font-mono uppercase">
                Customer Bookings Ledger ({filteredBookings.length})
              </h3>
              <div className="relative w-64">
                <input
                  type="text"
                  placeholder="Search reference or movie..."
                  value={bookingSearch}
                  onChange={(e) => setBookingSearch(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 py-1.5 pl-8 pr-3 text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-red-600"
                />
                <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-zinc-500" />
              </div>
            </div>

            <div className="overflow-x-auto rounded-2xl border border-zinc-800/80 bg-zinc-900/30">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead className="border-b border-zinc-800 bg-zinc-900/80 font-mono uppercase text-zinc-400">
                  <tr>
                    <th className="px-4 py-3">Reference</th>
                    <th className="px-4 py-3">Movie & Venue</th>
                    <th className="px-4 py-3">Seat</th>
                    <th className="px-4 py-3">Price</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-4 py-3">Booked Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/60">
                  {filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-zinc-900/50">
                      <td className="px-4 py-3 font-mono font-bold text-red-400">
                        {b.booking_reference}
                      </td>
                      <td className="px-4 py-3">
                        <strong className="text-zinc-100">{b.showtime?.movie?.title}</strong>
                        <p className="text-[11px] text-zinc-500">{b.showtime?.cinema?.name}</p>
                      </td>
                      <td className="px-4 py-3 font-mono">
                        {b.seat ? `${b.seat.row}${b.seat.number}` : `#${b.seat_id}`}
                      </td>
                      <td className="px-4 py-3 font-mono font-bold text-white">
                        ${b.total_price.toFixed(2)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                            b.status === "confirmed"
                              ? "bg-emerald-950/80 text-emerald-400"
                              : "bg-red-950/80 text-red-400"
                          }`}
                        >
                          {b.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 font-mono text-zinc-500">
                        {new Date(b.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* ── Add / Edit Movie Modal ─────────────────────────────────────── */}
      {movieModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setMovieModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white font-mono">
              {editingMovie ? "Edit Movie" : "Add New Movie to Repertoire"}
            </h3>

            <form onSubmit={handleSaveMovie} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Movie Title</label>
                  <input
                    type="text"
                    required
                    value={movieForm.title || ""}
                    onChange={(e) => setMovieForm({ ...movieForm, title: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Genre</label>
                  <input
                    type="text"
                    required
                    value={movieForm.genre || ""}
                    onChange={(e) => setMovieForm({ ...movieForm, genre: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Duration (minutes)</label>
                  <input
                    type="number"
                    value={movieForm.duration || 120}
                    onChange={(e) => setMovieForm({ ...movieForm, duration: Number(e.target.value) })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Rating (0 - 10)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={movieForm.rating || 8.0}
                    onChange={(e) => setMovieForm({ ...movieForm, rating: Number(e.target.value) })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Release Year</label>
                  <input
                    type="number"
                    value={movieForm.release_year || 2024}
                    onChange={(e) => setMovieForm({ ...movieForm, release_year: Number(e.target.value) })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-zinc-400 mb-1">Director</label>
                  <input
                    type="text"
                    value={movieForm.director || ""}
                    onChange={(e) => setMovieForm({ ...movieForm, director: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                  />
                </div>
                <div>
                  <label className="block text-zinc-400 mb-1">Cast (comma separated)</label>
                  <input
                    type="text"
                    value={movieForm.cast || ""}
                    onChange={(e) => setMovieForm({ ...movieForm, cast: e.target.value })}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                  />
                </div>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Poster Image URL</label>
                <input
                  type="text"
                  value={movieForm.poster_url || ""}
                  onChange={(e) => setMovieForm({ ...movieForm, poster_url: e.target.value })}
                  placeholder="https://image.tmdb.org/..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Backdrop Image URL</label>
                <input
                  type="text"
                  value={movieForm.backdrop_url || ""}
                  onChange={(e) => setMovieForm({ ...movieForm, backdrop_url: e.target.value })}
                  placeholder="https://image.tmdb.org/..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">YouTube Trailer URL</label>
                <input
                  type="text"
                  value={movieForm.trailer_url || ""}
                  onChange={(e) => setMovieForm({ ...movieForm, trailer_url: e.target.value })}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Synopsis / Description</label>
                <textarea
                  rows={3}
                  value={movieForm.description || ""}
                  onChange={(e) => setMovieForm({ ...movieForm, description: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featured"
                  checked={movieForm.is_featured || false}
                  onChange={(e) => setMovieForm({ ...movieForm, is_featured: e.target.checked })}
                  className="rounded border-zinc-700 bg-zinc-900 text-red-600"
                />
                <label htmlFor="featured" className="text-zinc-300 font-medium">
                  Feature in Home Page Spotlight Banner
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setMovieModalOpen(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-zinc-400 hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
                >
                  Save Movie
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Schedule Showtime Modal ────────────────────────────────────── */}
      {showtimeModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowtimeModalOpen(false)}
          />
          <div className="relative z-10 w-full max-w-md rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-white font-mono">
              Schedule New Showtime
            </h3>

            <form onSubmit={handleSaveShowtime} className="space-y-3 text-xs">
              <div>
                <label className="block text-zinc-400 mb-1">Movie</label>
                <select
                  value={showtimeForm.movie_id}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, movie_id: Number(e.target.value) })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                >
                  {movies.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Cinema Venue</label>
                <select
                  value={showtimeForm.cinema_id}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, cinema_id: Number(e.target.value) })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                >
                  {cinemas.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Format</label>
                <select
                  value={showtimeForm.format}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, format: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                >
                  <option value="Standard">Standard 2D</option>
                  <option value="IMAX">Laser IMAX 70mm</option>
                  <option value="Dolby Atmos">Dolby Cinema Atmos</option>
                  <option value="4DX">4DX Motion</option>
                </select>
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Start Date & Time</label>
                <input
                  type="datetime-local"
                  required
                  value={showtimeForm.start_time}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, start_time: e.target.value })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                />
              </div>

              <div>
                <label className="block text-zinc-400 mb-1">Ticket Price ($)</label>
                <input
                  type="number"
                  step="0.5"
                  required
                  value={showtimeForm.price}
                  onChange={(e) => setShowtimeForm({ ...showtimeForm, price: Number(e.target.value) })}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-2 text-zinc-100"
                />
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setShowtimeModalOpen(false)}
                  className="rounded-lg border border-zinc-800 px-4 py-2 text-zinc-400 hover:bg-zinc-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-red-600 px-4 py-2 font-bold text-white hover:bg-red-700"
                >
                  Create Showtime
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
