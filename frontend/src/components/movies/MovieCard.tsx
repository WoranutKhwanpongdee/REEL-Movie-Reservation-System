"use client";

import React from "react";
import Link from "next/link";
import { Movie } from "@/types";
import { Star, Clock, Ticket } from "lucide-react";

interface MovieCardProps {
  movie: Movie;
}

export default function MovieCard({ movie }: MovieCardProps) {
  const formatDuration = (mins?: number) => {
    if (!mins) return "";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return `${h}h ${m}m`;
  };

  return (
    <Link
      href={`/movies/${movie.id}`}
      className="group relative flex flex-col overflow-hidden rounded-xl border border-zinc-800/80 bg-zinc-900/40 transition-all duration-300 hover:-translate-y-1 hover:border-zinc-700 hover:shadow-xl hover:shadow-black/60"
    >
      {/* Poster Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-zinc-950">
        {movie.poster_url ? (
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-900 text-zinc-600">
            No Poster
          </div>
        )}

        {/* Rating Badge */}
        {movie.rating && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 rounded-md bg-black/80 backdrop-blur-md px-2 py-1 text-xs font-bold text-amber-400 border border-amber-500/20 shadow-md">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            <span>{movie.rating.toFixed(1)}</span>
          </div>
        )}

        {/* Featured Tag */}
        {movie.is_featured && (
          <div className="absolute top-2.5 left-2.5 rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase text-white shadow-sm">
            Featured
          </div>
        )}

        {/* Hover Overlay Button */}
        <div className="absolute inset-0 flex items-end p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-gradient-to-t from-black/90 via-black/40 to-transparent">
          <div className="w-full flex items-center justify-center gap-2 rounded-lg bg-red-600 py-2.5 text-xs font-bold text-white shadow-lg">
            <Ticket className="h-4 w-4" />
            <span>Book Tickets</span>
          </div>
        </div>
      </div>

      {/* Info Section */}
      <div className="flex flex-1 flex-col justify-between p-3.5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-medium text-zinc-400">
            <span>{movie.genre || "Cinema"}</span>
            {movie.release_year && (
              <>
                <span>•</span>
                <span>{movie.release_year}</span>
              </>
            )}
          </div>
          <h3 className="mt-1 font-display font-bold text-sm tracking-tight text-zinc-100 line-clamp-1 group-hover:text-red-400 transition-colors">
            {movie.title}
          </h3>
        </div>

        <div className="mt-2.5 flex items-center justify-between border-t border-zinc-800/60 pt-2 text-[11px] text-zinc-500 font-medium">
          {movie.duration ? (
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(movie.duration)}</span>
            </div>
          ) : (
            <div />
          )}
          <span className="font-mono text-zinc-400 text-[10px] uppercase">
            REEL CINEMA
          </span>
        </div>
      </div>
    </Link>
  );
}
