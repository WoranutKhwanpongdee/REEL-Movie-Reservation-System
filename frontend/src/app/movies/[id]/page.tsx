"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Movie, Showtime, Cinema } from "@/types";
import { getMovie, getShowtimes, getCinemas } from "@/lib/api";
import { TrailerModal } from "@/components/movies";
import {
  Star,
  Clock,
  Calendar,
  MapPin,
  Play,
  Ticket,
  ChevronLeft,
  Users,
  Film,
  Sparkles,
  Info,
} from "lucide-react";

export default function MovieDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const movieId = Number(params.id);

  const [movie, setMovie] = useState<Movie | null>(null);
  const [showtimes, setShowtimes] = useState<Showtime[]>([]);
  const [cinemas, setCinemas] = useState<Cinema[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDateOffset, setSelectedDateOffset] = useState<number>(0);
  const [selectedCinemaId, setSelectedCinemaId] = useState<number | "All">("All");
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      if (isNaN(movieId)) return;
      try {
        const [movieData, showtimesData, cinemasData] = await Promise.all([
          getMovie(movieId),
          getShowtimes({ movie_id: movieId }),
          getCinemas(),
        ]);
        setMovie(movieData);
        setShowtimes(showtimesData);
        setCinemas(cinemasData);
      } catch (err) {
        console.error("Failed to load movie details:", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [movieId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <span className="font-mono text-xs text-zinc-500">Loading Movie & Showtimes...</span>
        </div>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center text-center p-4">
        <h2 className="text-xl font-bold text-zinc-200">Movie Not Found</h2>
        <p className="mt-2 text-xs text-zinc-500">The requested movie could not be located in our catalog.</p>
        <Link
          href="/movies"
          className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-white hover:bg-zinc-700"
        >
          Back to Movies
        </Link>
      </div>
    );
  }

  // Format Duration
  const formatDuration = (mins?: number) => {
    if (!mins) return "";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  // Generate 7-day date tabs
  const now = new Date();
  const dateTabs = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(now.getDate() + i);
    return {
      offset: i,
      dateString: d.toISOString().split("T")[0],
      dayName: i === 0 ? "Today" : d.toLocaleDateString("en-US", { weekday: "short" }),
      monthDay: d.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    };
  });

  const activeDateString = dateTabs[selectedDateOffset].dateString;

  // Filter showtimes by selected date and optional cinema filter
  const dayShowtimes = showtimes.filter((st) => {
    const stDate = new Date(st.start_time).toISOString().split("T")[0];
    const matchesDate = stDate === activeDateString;
    const matchesCinema =
      selectedCinemaId === "All" || st.cinema_id === selectedCinemaId;
    return matchesDate && matchesCinema;
  });

  // Group showtimes by Cinema
  const cinemaGroups: { [cinemaId: number]: { cinema: Cinema; showtimes: Showtime[] } } = {};
  dayShowtimes.forEach((st) => {
    if (!cinemaGroups[st.cinema_id] && st.cinema) {
      cinemaGroups[st.cinema_id] = {
        cinema: st.cinema,
        showtimes: [],
      };
    }
    if (cinemaGroups[st.cinema_id]) {
      cinemaGroups[st.cinema_id].showtimes.push(st);
    }
  });

  // Sort showtimes by start_time
  Object.values(cinemaGroups).forEach((group) => {
    group.showtimes.sort(
      (a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
    );
  });

  return (
    <div className="min-h-screen bg-zinc-950 pb-24">
      {/* ── Backdrop Hero Header ─────────────────────────────────────────── */}
      <section className="relative w-full overflow-hidden border-b border-zinc-800/80 bg-zinc-950">
        {/* Backdrop Image */}
        <div className="absolute inset-0 h-full w-full">
          {movie.backdrop_url ? (
            <img
              src={movie.backdrop_url}
              alt={movie.title}
              className="h-full w-full object-cover object-center opacity-30 blur-[2px]"
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-r from-red-950/20 to-zinc-900" />
          )}
          <div className="absolute inset-0 hero-gradient" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Breadcrumb Back */}
          <Link
            href="/movies"
            className="inline-flex items-center gap-1 text-xs font-medium text-zinc-400 hover:text-white transition-colors mb-6"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Back to All Movies</span>
          </Link>

          <div className="flex flex-col gap-8 md:flex-row md:items-start">
            {/* Poster Card */}
            <div className="relative aspect-[2/3] w-48 sm:w-56 md:w-64 flex-shrink-0 overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
              {movie.poster_url ? (
                <img
                  src={movie.poster_url}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-zinc-600">
                  No Poster
                </div>
              )}
            </div>

            {/* Details */}
            <div className="flex-1 space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-md bg-red-600/90 px-2.5 py-1 text-xs font-bold text-white uppercase tracking-wider">
                  {movie.genre || "Cinema"}
                </span>
                {movie.rating && (
                  <div className="flex items-center gap-1 rounded-md border border-amber-500/30 bg-black/60 px-2.5 py-1 text-xs font-bold text-amber-400">
                    <Star className="h-3.5 w-3.5 fill-amber-400" />
                    <span>{movie.rating.toFixed(1)} / 10</span>
                  </div>
                )}
                {movie.release_year && (
                  <span className="rounded-md border border-zinc-800 bg-zinc-900/60 px-2.5 py-1 text-xs text-zinc-400">
                    {movie.release_year}
                  </span>
                )}
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white font-display leading-tight">
                {movie.title}
              </h1>

              {/* Quick stats row */}
              <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-zinc-400">
                {movie.duration && (
                  <div className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4 text-zinc-500" />
                    <span>{formatDuration(movie.duration)}</span>
                  </div>
                )}
                {movie.director && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-zinc-500">Director:</span>
                    <strong className="text-zinc-200">{movie.director}</strong>
                  </div>
                )}
              </div>

              {/* Synopsis */}
              <p className="max-w-3xl text-xs sm:text-sm leading-relaxed text-zinc-300">
                {movie.description}
              </p>

              {/* Cast */}
              {movie.cast && (
                <div className="pt-1">
                  <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                    Starring Cast
                  </span>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {movie.cast.split(",").map((actor) => (
                      <span
                        key={actor}
                        className="rounded-lg border border-zinc-800 bg-zinc-900/80 px-2.5 py-1 text-xs text-zinc-300"
                      >
                        {actor.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Trailer Action */}
              {movie.trailer_url && (
                <div className="pt-2">
                  <button
                    onClick={() => setTrailerModalOpen(true)}
                    className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/90 px-4 py-2.5 text-xs font-bold text-white hover:bg-zinc-800 transition-colors shadow-sm"
                  >
                    <Play className="h-4 w-4 fill-white" />
                    <span>Watch Theatrical Trailer</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Showtimes & Cinema Booking Stage ──────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <div className="border-b border-zinc-800/80 pb-4">
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
            <Ticket className="h-5 w-5 text-red-500" />
            <span>Select Showtime & Experience</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Choose your preferred date and cinema format to view interactive seat maps.
          </p>
        </div>

        {/* Date Selector Tabs */}
        <div className="mt-6 flex items-center gap-2 overflow-x-auto pb-2">
          {dateTabs.map((tab) => (
            <button
              key={tab.offset}
              onClick={() => setSelectedDateOffset(tab.offset)}
              className={`flex flex-col items-center rounded-xl px-4 py-2.5 min-w-[90px] border transition-all ${
                selectedDateOffset === tab.offset
                  ? "border-red-500 bg-red-600 text-white font-bold shadow-lg shadow-red-600/20"
                  : "border-zinc-800 bg-zinc-900/50 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200"
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider font-semibold opacity-80">
                {tab.dayName}
              </span>
              <span className="text-xs sm:text-sm font-bold mt-0.5 font-mono">
                {tab.monthDay}
              </span>
            </button>
          ))}
        </div>

        {/* Cinema Venues List with Showtimes */}
        <div className="mt-8 space-y-6">
          {Object.keys(cinemaGroups).length === 0 ? (
            <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-12 text-center">
              <Calendar className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
              <p className="text-sm font-semibold text-zinc-300">
                No showtimes available on {dateTabs[selectedDateOffset].monthDay}.
              </p>
              <p className="text-xs text-zinc-500 mt-1">
                Please select another date from the tabs above.
              </p>
            </div>
          ) : (
            Object.values(cinemaGroups).map(({ cinema, showtimes: cShowtimes }) => (
              <div
                key={cinema.id}
                className="overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-5 sm:p-6 backdrop-blur-sm"
              >
                {/* Cinema Venue Header */}
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/60 pb-4">
                  <div>
                    <h3 className="font-bold text-base sm:text-lg text-white font-mono flex items-center gap-2">
                      <span>{cinema.name}</span>
                    </h3>
                    <p className="flex items-center gap-1 text-xs text-zinc-400 mt-0.5">
                      <MapPin className="h-3 w-3 text-red-500" />
                      <span>{cinema.location}</span>
                    </p>
                  </div>
                  {cinema.description && (
                    <p className="text-[11px] text-zinc-500 max-w-md text-left sm:text-right">
                      {cinema.description}
                    </p>
                  )}
                </div>

                {/* Showtime Pills Grid */}
                <div className="mt-5">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-500 block mb-3">
                    Available Showtimes ({cShowtimes.length})
                  </span>
                  <div className="flex flex-wrap gap-3">
                    {cShowtimes.map((st) => {
                      const timeStr = new Date(st.start_time).toLocaleTimeString(
                        "en-US",
                        { hour: "2-digit", minute: "2-digit" }
                      );
                      const isImax = st.format === "IMAX";
                      const isDolby = st.format === "Dolby Atmos";

                      return (
                        <Link
                          key={st.id}
                          href={`/book/${st.id}`}
                          className={`group flex flex-col items-center justify-between rounded-xl border p-3 min-w-[130px] transition-all hover:scale-105 ${
                            isImax
                              ? "border-red-500/40 bg-zinc-900/90 hover:border-red-500 hover:bg-zinc-800 shadow-sm"
                              : isDolby
                              ? "border-amber-500/40 bg-zinc-900/90 hover:border-amber-500 hover:bg-zinc-800"
                              : "border-zinc-800 bg-zinc-900/80 hover:border-zinc-700 hover:bg-zinc-800"
                          }`}
                        >
                          <span className="font-mono text-base font-black text-zinc-100 group-hover:text-red-400">
                            {timeStr}
                          </span>
                          <div className="mt-2 flex w-full items-center justify-between gap-2 border-t border-zinc-800/80 pt-1.5 text-[10px]">
                            <span
                              className={`rounded px-1.5 py-0.5 font-bold uppercase ${
                                isImax
                                  ? "bg-red-950/80 text-red-400"
                                  : isDolby
                                  ? "bg-amber-950/80 text-amber-400"
                                  : "bg-zinc-800 text-zinc-400"
                              }`}
                            >
                              {st.format}
                            </span>
                            <span className="font-mono font-semibold text-zinc-300">
                              ${st.price.toFixed(2)}
                            </span>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* ── Trailer Video Modal ───────────────────────────────────────────── */}
      {movie.trailer_url && (
        <TrailerModal
          isOpen={trailerModalOpen}
          onClose={() => setTrailerModalOpen(false)}
          trailerUrl={movie.trailer_url}
          movieTitle={movie.title}
        />
      )}
    </div>
  );
}
