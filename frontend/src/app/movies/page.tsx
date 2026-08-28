"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Movie } from "@/types";
import { getMovies } from "@/lib/api";
import { MovieCard } from "@/components/movies";
import { Search, Filter, SlidersHorizontal, Film, ArrowUpDown } from "lucide-react";

function MoviesCatalogContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState<string>("All");
  const [sortBy, setSortBy] = useState<"rating" | "year" | "title">("rating");

  useEffect(() => {
    async function loadMovies() {
      try {
        const data = await getMovies();
        setMovies(data);
      } catch (err) {
        console.error("Failed to load catalog:", err);
      } finally {
        setLoading(false);
      }
    }
    loadMovies();
  }, []);

  const genres = [
    "All",
    "Sci-Fi",
    "Action",
    "Drama",
    "Horror",
    "Thriller",
  ];

  // Filtering
  let filtered = movies.filter((m) => {
    const matchesSearch =
      !searchQuery.trim() ||
      m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.director?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.cast?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.genre?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesGenre =
      selectedGenre === "All" ||
      m.genre?.toLowerCase().includes(selectedGenre.toLowerCase());

    return matchesSearch && matchesGenre;
  });

  // Sorting
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === "rating") {
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === "year") {
      return (b.release_year || 0) - (a.release_year || 0);
    }
    if (sortBy === "title") {
      return a.title.localeCompare(b.title);
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Page Title */}
        <div className="border-b border-zinc-800/80 pb-6">
          <div className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-600" />
            <span className="font-mono text-xs font-semibold uppercase tracking-wider text-red-500">
              REEL Program Catalog
            </span>
          </div>
          <h1 className="mt-1 text-2xl sm:text-4xl font-bold tracking-tight text-white font-mono">
            Explore All Movies
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-zinc-400">
            Browse our full repertoire of theatrical releases, special IMAX screenings, and upcoming events.
          </p>
        </div>

        {/* Filter Controls Bar */}
        <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-zinc-800/80 bg-zinc-900/40 p-4">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search by title, director, cast, genre..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-zinc-800 bg-zinc-950 py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-500 focus:border-red-600 focus:outline-none"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-zinc-500" />
          </div>

          {/* Genre Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 lg:pb-0">
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors whitespace-nowrap ${
                  selectedGenre === genre
                    ? "bg-red-600 text-white font-bold"
                    : "border border-zinc-800 bg-zinc-950 text-zinc-400 hover:text-white hover:border-zinc-700"
                }`}
              >
                {genre}
              </button>
            ))}
          </div>

          {/* Sort By Dropdown */}
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-zinc-500" />
            <span className="text-xs text-zinc-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="rounded-lg border border-zinc-800 bg-zinc-950 px-2.5 py-1.5 text-xs font-medium text-zinc-200 focus:border-red-600 focus:outline-none"
            >
              <option value="rating">Highest Rated</option>
              <option value="year">Release Year</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Results Counter */}
        <div className="mt-6 flex items-center justify-between text-xs text-zinc-500">
          <span>
            Showing <strong className="text-zinc-300">{filtered.length}</strong>{" "}
            movies
          </span>
          {(searchQuery || selectedGenre !== "All") && (
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedGenre("All");
              }}
              className="text-red-400 hover:underline"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* Grid Display */}
        {loading ? (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <div
                key={n}
                className="aspect-[2/3] animate-pulse rounded-xl bg-zinc-900 border border-zinc-800/60"
              />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="mt-12 flex flex-col items-center justify-center rounded-2xl border border-zinc-800/60 bg-zinc-900/20 py-20 text-center">
            <Film className="h-10 w-10 text-zinc-700 mb-3" />
            <h3 className="text-base font-bold text-zinc-200">
              No matching movies found
            </h3>
            <p className="mt-1 max-w-sm text-xs text-zinc-500">
              Try adjusting your search query or selecting a different genre filter.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4">
            {filtered.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MoviesCatalogPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-zinc-500 text-xs">
          Loading Catalog...
        </div>
      }
    >
      <MoviesCatalogContent />
    </Suspense>
  );
}
