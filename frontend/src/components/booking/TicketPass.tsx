"use client";

import React, { useState } from "react";
import { Booking } from "@/types";
import {
  Calendar,
  Clock,
  MapPin,
  Ticket,
  Printer,
  XCircle,
  Film,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";

interface TicketPassProps {
  bookings: Booking[];
  onCancel?: (reference: string) => void;
  isCancelling?: boolean;
}

export default function TicketPass({
  bookings,
  onCancel,
  isCancelling = false,
}: TicketPassProps) {
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  if (!bookings || bookings.length === 0) return null;

  const primary = bookings[0];
  const showtime = primary.showtime;
  const movie = showtime?.movie;
  const cinema = showtime?.cinema;
  const isCancelled = primary.status === "cancelled";

  // Calculate total
  const totalPrice = bookings.reduce((sum, b) => sum + b.total_price, 0);

  // Format date & time
  const dateObj = showtime ? new Date(showtime.start_time) : new Date();
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const seatList = bookings
    .map((b) => (b.seat ? `${b.seat.row}${b.seat.number}` : `#${b.seat_id}`))
    .join(", ");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900/90 shadow-2xl backdrop-blur-xl">
      {/* Top Poster Header */}
      <div className="relative h-36 w-full overflow-hidden bg-zinc-950">
        {movie?.backdrop_url ? (
          <img
            src={movie.backdrop_url}
            alt={movie.title}
            className="h-full w-full object-cover opacity-40 blur-[1px]"
          />
        ) : (
          <div className="h-full w-full bg-gradient-to-r from-red-900/30 to-zinc-900" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/60 to-transparent" />

        {/* Title on backdrop */}
        <div className="absolute bottom-3 left-4 right-4 flex items-end justify-between">
          <div>
            <span className="rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-bold tracking-wider text-white uppercase">
              {showtime?.format || "Standard"}
            </span>
            <h2 className="mt-1 font-bold text-lg text-white font-display leading-tight line-clamp-1">
              {movie?.title || "Movie Pass"}
            </h2>
          </div>
          <div
            className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider ${
              isCancelled
                ? "border border-red-500/30 bg-red-950/80 text-red-400"
                : "border border-emerald-500/30 bg-emerald-950/80 text-emerald-400"
            }`}
          >
            {isCancelled ? "Cancelled" : "Confirmed"}
          </div>
        </div>
      </div>

      {/* Main Ticket Body */}
      <div className="p-5 space-y-4 text-xs text-zinc-300">
        {/* Cinema & Reference Code */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
          <div>
            <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
              Cinema Location
            </p>
            <p className="font-semibold text-zinc-100 flex items-center gap-1 mt-0.5">
              <MapPin className="h-3.5 w-3.5 text-red-500 flex-shrink-0" />
              <span>{cinema?.name || "REEL Cinema"}</span>
            </p>
            <p className="text-[10px] text-zinc-500 ml-4.5">
              {cinema?.location || "Downtown"}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase font-mono tracking-wider text-zinc-500">
              Booking Ref
            </p>
            <p className="font-mono text-sm font-black text-red-400 tracking-wider">
              {primary.booking_reference}
            </p>
          </div>
        </div>

        {/* Showtime & Seats Grid */}
        <div className="grid grid-cols-2 gap-3 py-1">
          <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Calendar className="h-3.5 w-3.5 text-red-500" />
              <span className="text-[10px] uppercase font-medium">Date</span>
            </div>
            <p className="mt-1 font-semibold text-zinc-100">{formattedDate}</p>
          </div>

          <div className="rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-2.5">
            <div className="flex items-center gap-1.5 text-zinc-400">
              <Clock className="h-3.5 w-3.5 text-red-500" />
              <span className="text-[10px] uppercase font-medium">Showtime</span>
            </div>
            <p className="mt-1 font-semibold text-zinc-100">{formattedTime}</p>
          </div>

          <div className="col-span-2 rounded-lg border border-zinc-800/60 bg-zinc-950/50 p-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-zinc-400">
                <Ticket className="h-3.5 w-3.5 text-red-500" />
                <span className="text-[10px] uppercase font-medium">
                  Seats Reserved ({bookings.length})
                </span>
              </div>
              <span className="font-mono font-bold text-zinc-100 text-sm">
                {seatList}
              </span>
            </div>
          </div>
        </div>

        {/* Pricing Summary */}
        <div className="flex items-center justify-between border-t border-zinc-800/80 pt-3">
          <span className="text-zinc-400">Total Amount Paid</span>
          <span className="font-mono text-base font-bold text-white">
            ${totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {/* Perforated Divider */}
      <div className="relative flex items-center justify-between px-3 py-1">
        <div className="h-6 w-6 -ml-6 rounded-full bg-zinc-950 border-r border-zinc-800" />
        <div className="flex-1 border-b-2 border-dashed border-zinc-700/60 mx-2" />
        <div className="h-6 w-6 -mr-6 rounded-full bg-zinc-950 border-l border-zinc-800" />
      </div>

      {/* QR Code & Barcode Stub */}
      <div className="flex flex-col items-center bg-zinc-950/90 p-5 space-y-3">
        {/* SVG QR Code */}
        <div className="relative rounded-xl border border-zinc-800 bg-white p-2.5 shadow-inner">
          <svg
            className="h-28 w-28 text-black"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            {/* Top Left Corner */}
            <rect x="10" y="10" width="25" height="25" />
            <rect x="15" y="15" width="15" height="15" fill="white" />
            <rect x="18" y="18" width="9" height="9" />
            {/* Top Right Corner */}
            <rect x="65" y="10" width="25" height="25" />
            <rect x="70" y="15" width="15" height="15" fill="white" />
            <rect x="73" y="18" width="9" height="9" />
            {/* Bottom Left Corner */}
            <rect x="10" y="65" width="25" height="25" />
            <rect x="15" y="70" width="15" height="15" fill="white" />
            <rect x="18" y="73" width="9" height="9" />
            {/* Dynamic data blocks */}
            <rect x="42" y="12" width="6" height="6" />
            <rect x="52" y="12" width="6" height="6" />
            <rect x="42" y="24" width="6" height="12" />
            <rect x="52" y="30" width="6" height="6" />
            <rect x="12" y="42" width="6" height="6" />
            <rect x="24" y="42" width="12" height="6" />
            <rect x="42" y="42" width="16" height="16" />
            <rect x="65" y="42" width="6" height="12" />
            <rect x="78" y="42" width="10" height="6" />
            <rect x="12" y="54" width="12" height="6" />
            <rect x="30" y="54" width="6" height="6" />
            <rect x="72" y="54" width="16" height="6" />
            <rect x="42" y="65" width="6" height="12" />
            <rect x="54" y="65" width="12" height="6" />
            <rect x="72" y="65" width="6" height="6" />
            <rect x="84" y="65" width="6" height="12" />
            <rect x="42" y="82" width="12" height="6" />
            <rect x="60" y="78" width="6" height="12" />
            <rect x="72" y="82" width="18" height="6" />
          </svg>
        </div>

        <p className="font-mono text-[10px] tracking-widest text-zinc-500 uppercase">
          SCAN AT CINEMA TURNSTILE
        </p>

        {/* Action Buttons */}
        <div className="flex w-full items-center gap-2 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-1.5 rounded-lg border border-zinc-700 bg-zinc-800 py-2 text-xs font-semibold text-zinc-200 hover:bg-zinc-700 transition-colors"
          >
            <Printer className="h-3.5 w-3.5" />
            <span>Print Pass</span>
          </button>

          {!isCancelled && onCancel && (
            <button
              onClick={() => setShowCancelConfirm(true)}
              disabled={isCancelling}
              className="flex items-center justify-center gap-1.5 rounded-lg border border-red-500/40 bg-red-950/40 px-3 py-2 text-xs font-semibold text-red-400 hover:bg-red-900/60 transition-colors"
            >
              <XCircle className="h-3.5 w-3.5" />
              <span>Cancel</span>
            </button>
          )}
        </div>
      </div>

      {/* Cancellation Confirmation Modal */}
      {showCancelConfirm && (
        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/90 p-4 text-center">
          <div className="space-y-3 max-w-xs">
            <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-red-950 text-red-400 border border-red-800">
              <AlertTriangle className="h-5 w-5" />
            </div>
            <h4 className="font-bold text-sm text-zinc-100">
              Cancel Reservation?
            </h4>
            <p className="text-xs text-zinc-400">
              Are you sure you want to cancel booking{" "}
              <strong className="text-zinc-200">
                {primary.booking_reference}
              </strong>
              ? Your {bookings.length} seat(s) will be released immediately.
            </p>
            <div className="flex gap-2 pt-2">
              <button
                onClick={() => setShowCancelConfirm(false)}
                className="flex-1 rounded-lg border border-zinc-800 bg-zinc-900 py-2 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
              >
                Keep Ticket
              </button>
              <button
                onClick={() => {
                  setShowCancelConfirm(false);
                  onCancel?.(primary.booking_reference);
                }}
                className="flex-1 rounded-lg bg-red-600 py-2 text-xs font-bold text-white hover:bg-red-700"
              >
                Confirm Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
