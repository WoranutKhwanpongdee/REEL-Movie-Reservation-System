"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Movie } from "@/types";
import { getMovies } from "@/lib/api";
import { MovieCard, TrailerModal } from "@/components/movies";
import {
  Play,
  Ticket,
  Star,
  Clock,
  Sparkles,
  Search,
  SlidersHorizontal,
  Flame,
  ChevronRight,
} from "lucide-react";

export default function HomePage() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [trailerModalOpen, setTrailerModalOpen] = useState(false);
  const [activeTrailerMovie, setActiveTrailerMovie] = useState<Movie | null>(
    null
  );

  useEffect(() => {
    async function fetchMoviesData() {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        console.error("Failed to load movies:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchMoviesData();
  }, []);

  const genres = [
    "All",
    "Sci-Fi",
    "Action",
    "Drama",
    "Horror",
    "Thriller",
  ];

  // Featured Movie (first featured or first in list)
  const featuredMovie =
    movies.find((m) => m.is_featured) || movies[0] || null;

  // Filtered movies
  const filteredMovies =
    selectedGenre === "All"
      ? movies
      : movies.filter((m) =>
          m.genre?.toLowerCase().includes(selectedGenre.toLowerCase())
        );

  const formatDuration = (mins?: number) => {
    if (!mins) return "";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  const handleOpenTrailer = (movie: Movie) => {
    setActiveTrailerMovie(movie);
    setTrailerModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-zinc-950 pb-20">
      {/* ── Hero Spotlight Section ────────────────────────────────────────── */}
      {featuredMovie && (
        <section className="relative w-full overflow-hidden border-b border-zinc-800/80 bg-zinc-950">
          {/* Backdrop Image */}
          <div className="absolute inset-0 h-full w-full">
            {featuredMovie.backdrop_url && (
              <img
                src={featuredMovie.backdrop_url}
                alt={featuredMovie.title}
                className="h-full w-full object-cover object-center opacity-40 scale-105 transition-all duration-1000"
              />
            )}
            {/* Dark Cinematic Gradients */}
            <div className="absolute inset-0 hero-side-gradient" />
            <div className="absolute inset-0 hero-gradient" />
          </div>

          {/* Hero Content */}
          <div className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8 lg:py-32">
            <div className="max-w-2xl space-y-4">
              {/* Badge */}
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1 rounded-full border border-red-500/30 bg-red-950/60 px-3 py-1 text-xs font-bold uppercase tracking-wider text-red-400 backdrop-blur-sm">
                  <Flame className="h-3.5 w-3.5 fill-red-400" />
                  Spotlight Premiere
                </span>
                <span className="rounded-full border border-zinc-800 bg-zinc-900/80 px-3 py-1 text-xs font-medium text-zinc-300">
                  Laser IMAX 70mm
                </span>
              </div>

              {/* Title */}
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white font-display leading-tight">
                {featuredMovie.title}
              </h1>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm font-medium text-zinc-300">
                {featuredMovie.rating && (
                  <div className="flex items-center gap-1 text-amber-400 font-bold">
                    <Star className="h-4 w-4 fill-amber-400" />
                    <span>{featuredMovie.rating.toFixed(1)}/10</span>
                  </div>
                )}
                <span>•</span>
                <span>{featuredMovie.genre}</span>
                <span>•</span>
                {featuredMovie.duration && (
                  <div className="flex items-center gap-1 text-zinc-400">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDuration(featuredMovie.duration)}</span>
                  </div>
                )}
                {featuredMovie.release_year && (
                  <>
                    <span>•</span>
                    <span className="text-zinc-400">
                      {featuredMovie.release_year}
                    </span>
                  </>
                )}
              </div>

              {/* Description */}
              <p className="max-w-xl text-xs sm:text-sm leading-relaxed text-zinc-400 line-clamp-3">
                {featuredMovie.description}
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-4">
                <Link
                  href={`/movies/${featuredMovie.id}`}
                  className="flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all hover:scale-[1.02]"
                >
                  <Ticket className="h-4 w-4" />
                  <span>Reserve Seats</span>
                </Link>

                {featuredMovie.trailer_url && (
                  <button
                    onClick={() => handleOpenTrailer(featuredMovie)}
                    className="flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/80 px-5 py-3 text-xs sm:text-sm font-semibold text-zinc-200 backdrop-blur-sm hover:border-zinc-500 hover:bg-zinc-800 transition-all"
                  >
                    <Play className="h-4 w-4 fill-zinc-200" />
                    <span>Watch Trailer</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── Experience Banners ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            {
              name: "Laser IMAX",
              desc: "12-channel spatial audio",
              tag: "Flagship",
            },
            {
              name: "Dolby Cinema",
              desc: "Dolby Vision + Atmos",
              tag: "Premium",
            },
            {
              name: "4DX Motion",
              desc: "Synchronized seats & effects",
              tag: "Immersive",
            },
            {
              name: "VIP Suites",
              desc: "Motorized recliners & dining",
              tag: "Luxury",
            },
          ].map((item) => (
            <div
              key={item.name}
              className="rounded-xl border border-zinc-800/80 bg-zinc-900/30 p-4 backdrop-blur-sm hover:border-zinc-700 transition-colors"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-zinc-200">
                  {item.name}
                </span>
                <span className="rounded bg-zinc-800 px-1.5 py-0.5 text-[9px] font-mono text-zinc-400">
                  {item.tag}
                </span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Movies Catalog Section ────────────────────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Section Header & Filters */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono flex items-center gap-2">
              <span>Now Showing</span>
              <span className="text-xs font-sans font-normal text-zinc-500">
                ({filteredMovies.length} titles)
              </span>
            </h2>
            <p className="text-xs text-zinc-400 mt-0.5">
              Select a movie to explore scheduled showtimes and reserved seating.
            </p>
          </div>

          {/* Genre Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-full px-3.5 py-1 text-xs font-medium transition-all whitespace-nowrap ${
                  selectedGenre === genre
                    ? "bg-red-600 text-white font-semibold shadow-sm"
                    : "border border-zinc-800 bg-zinc-900/60 text-zinc-400 hover:text-zinc-200 hover:border-zinc-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 pt-8 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-900 border border-zinc-800/60"
              />
            ))}
          </div>
        ) : filteredMovies.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <p className="text-sm font-medium text-zinc-400">
              No movies found for genre "{selectedGenre}".
            </p>
            <button
              onClick={() => setSelectedGenre("All")}
              className="mt-3 text-xs font-semibold text-red-500 hover:underline"
            >
              Reset Filter
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 pt-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      {/* ── Trailer Video Modal ───────────────────────────────────────────── */}
      {activeTrailerMovie && (
        <TrailerModal
          isOpen={trailerModalOpen}
          onClose={() => setTrailerModalOpen(false)}
          trailerUrl={activeTrailerMovie.trailer_url}
          movieTitle={activeTrailerMovie.title}
        />
      )}
    </div>
  );
}
