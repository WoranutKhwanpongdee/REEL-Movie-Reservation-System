"use client";

import React from "react";
import { Seat } from "@/types";
import { Check, Armchair, AlertCircle } from "lucide-react";

interface SeatMapProps {
  seats: Seat[];
  selectedSeatIds: number[];
  onToggleSeat: (seat: Seat) => void;
  maxSeats?: number;
  basePrice: number;
  format: string;
}

export default function SeatMap({
  seats,
  selectedSeatIds,
  onToggleSeat,
  maxSeats = 6,
  basePrice,
  format,
}: SeatMapProps) {
  // Group seats by row
  const rowGroups: { [row: string]: Seat[] } = {};
  seats.forEach((seat) => {
    if (!rowGroups[seat.row]) {
      rowGroups[seat.row] = [];
    }
    rowGroups[seat.row].push(seat);
  });

  // Sort rows alphabetically and seats by number
  const sortedRows = Object.keys(rowGroups).sort();
  sortedRows.forEach((row) => {
    rowGroups[row].sort((a, b) => a.number - b.number);
  });

  return (
    <div className="flex flex-col items-center w-full max-w-3xl mx-auto py-4">
      {/* Curved Screen */}
      <div className="w-full mb-10 px-4">
        <div className="cinema-screen" />
        <p className="mt-2 text-center text-[10px] font-mono uppercase tracking-[0.25em] text-zinc-500">
          Cinema Screen
        </p>
      </div>

      {/* Seat Grid */}
      <div className="flex flex-col gap-2.5 sm:gap-3 w-full px-2 sm:px-6 overflow-x-auto pb-4">
        {sortedRows.map((row) => {
          const isVipRow = ["E", "F", "G", "H"].includes(row);
          return (
            <div
              key={row}
              className="flex items-center justify-center gap-2 sm:gap-3 min-w-max"
            >
              {/* Left Row Identifier */}
              <span className="w-5 text-center font-mono text-xs font-bold text-zinc-500">
                {row}
              </span>

              {/* Row Seats */}
              <div className="flex items-center gap-1.5 sm:gap-2">
                {rowGroups[row].map((seat, index) => {
                  const isSelected = selectedSeatIds.includes(seat.id);
                  const isBooked = seat.is_booked;

                  // Split aisle after seat 4
                  const hasAisle = index === 3;

                  let seatStyle =
                    "border border-zinc-700 bg-zinc-800 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-700";
                  if (isBooked) {
                    seatStyle =
                      "border border-zinc-900 bg-zinc-900/60 text-zinc-700 cursor-not-allowed opacity-40";
                  } else if (isSelected) {
                    seatStyle =
                      "border border-red-500 bg-red-600 text-white font-bold shadow-lg shadow-red-600/30 scale-105";
                  } else if (isVipRow) {
                    seatStyle =
                      "border border-amber-500/40 bg-zinc-800/90 text-amber-300 hover:border-amber-400 hover:bg-zinc-700";
                  }

                  return (
                    <React.Fragment key={seat.id}>
                      <button
                        type="button"
                        disabled={isBooked}
                        onClick={() => onToggleSeat(seat)}
                        title={
                          isBooked
                            ? `Seat ${seat.row}${seat.number} (Booked)`
                            : `Seat ${seat.row}${seat.number} • $${basePrice.toFixed(2)}${
                                isVipRow ? " (VIP Row)" : ""
                              }`
                        }
                        className={`relative flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-md text-[10px] sm:text-xs font-medium transition-all duration-150 ${seatStyle}`}
                      >
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 stroke-[3]" />
                        ) : (
                          <span>{seat.number}</span>
                        )}
                      </button>

                      {hasAisle && (
                        <div className="w-3 sm:w-6" aria-hidden="true" />
                      )}
                    </React.Fragment>
                  );
                })}
              </div>

              {/* Right Row Identifier */}
              <span className="w-5 text-center font-mono text-xs font-bold text-zinc-500">
                {row}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-zinc-800/80 bg-zinc-900/50 px-6 py-3 text-xs text-zinc-400">
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-zinc-700 bg-zinc-800" />
          <span>Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-amber-500/40 bg-zinc-800 text-amber-400 flex items-center justify-center text-[9px] font-bold">
            ★
          </div>
          <span>VIP Row</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-red-500 bg-red-600 text-white flex items-center justify-center text-[9px] font-bold">
            ✓
          </div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded border border-zinc-900 bg-zinc-900/60 opacity-40" />
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}
