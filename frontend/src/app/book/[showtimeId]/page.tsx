"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Showtime, Seat, Booking } from "@/types";
import { getShowtime, getSeats, createBooking } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { SeatMap } from "@/components/booking";
import {
  ChevronLeft,
  Calendar,
  Clock,
  MapPin,
  Ticket,
  CreditCard,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Film,
  User,
} from "lucide-react";

export default function BookShowtimePage() {
  const params = useParams();
  const router = useRouter();
  const showtimeId = Number(params.showtimeId);
  const { user, openAuthModal } = useAuth();

  const [showtime, setShowtime] = useState<Showtime | null>(null);
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeatIds, setSelectedSeatIds] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadShowtimeAndSeats() {
      if (isNaN(showtimeId)) return;
      try {
        const [showtimeData, seatsData] = await Promise.all([
          getShowtime(showtimeId),
          getSeats(showtimeId),
        ]);
        setShowtime(showtimeData);
        setSeats(seatsData);
      } catch (err: any) {
        console.error("Failed to load showtime:", err);
        setError(err.message || "Failed to load showtime data");
      } finally {
        setLoading(false);
      }
    }
    loadShowtimeAndSeats();
  }, [showtimeId]);

  const handleToggleSeat = (seat: Seat) => {
    if (seat.is_booked) return;
    setError(null);

    if (selectedSeatIds.includes(seat.id)) {
      setSelectedSeatIds((prev) => prev.filter((id) => id !== seat.id));
    } else {
      if (selectedSeatIds.length >= 6) {
        setError("You can select a maximum of 6 seats per booking transaction.");
        return;
      }
      setSelectedSeatIds((prev) => [...prev, seat.id]);
    }
  };

  const handleCheckout = async () => {
    if (selectedSeatIds.length === 0) {
      setError("Please select at least one seat to proceed.");
      return;
    }

    if (!user) {
      openAuthModal();
      return;
    }

    setError(null);
    setBookingLoading(true);
    try {
      const createdBookings: Booking[] = await createBooking({
        showtime_id: showtimeId,
        seat_ids: selectedSeatIds,
      });

      if (createdBookings.length > 0) {
        const reference = createdBookings[0].booking_reference;
        router.push(`/booking/confirmation/${reference}`);
      }
    } catch (err: any) {
      setError(err.message || "Reservation failed. Please try again.");
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <span className="font-mono text-xs text-zinc-500">Loading Cinema Hall & Seat Layout...</span>
        </div>
      </div>
    );
  }

  if (!showtime) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-zinc-200">Showtime Not Found</h2>
        <Link
          href="/movies"
          className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-white"
        >
          Return to Movies
        </Link>
      </div>
    );
  }

  const movie = showtime.movie;
  const cinema = showtime.cinema;

  // Selected seats labels
  const selectedSeats = seats.filter((s) => selectedSeatIds.includes(s.id));
  const selectedLabels = selectedSeats
    .map((s) => `${s.row}${s.number}`)
    .join(", ");

  const subtotal = selectedSeatIds.length * showtime.price;
  const bookingFee = selectedSeatIds.length > 0 ? 1.5 : 0;
  const totalAmount = subtotal + bookingFee;

  const dateObj = new Date(showtime.start_time);
  const formattedDate = dateObj.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const formattedTime = dateObj.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Top Breadcrumb & Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-5">
          <div className="flex items-center gap-3">
            <Link
              href={movie ? `/movies/${movie.id}` : "/movies"}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-400 hover:text-white hover:border-zinc-700 transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-red-600/90 px-2 py-0.5 text-[10px] font-bold uppercase text-white font-mono">
                  {showtime.format}
                </span>
                <span className="text-xs text-zinc-400 font-medium">
                  {cinema?.name}
                </span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-mono">
                {movie?.title}
              </h1>
            </div>
          </div>

          {/* Quick Showtime Pills */}
          <div className="flex items-center gap-4 text-xs font-medium text-zinc-400 bg-zinc-900/60 border border-zinc-800/80 rounded-xl px-4 py-2 self-start sm:self-auto">
            <div className="flex items-center gap-1.5">
              <Calendar className="h-3.5 w-3.5 text-red-500" />
              <span>{formattedDate}</span>
            </div>
            <span>•</span>
            <div className="flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5 text-red-500" />
              <span className="font-mono text-zinc-200 font-bold">{formattedTime}</span>
            </div>
          </div>
        </div>

        {/* Main Grid: Seat Map & Order Summary */}
        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-12">
          {/* Left / Center: Interactive Seat Layout */}
          <div className="lg:col-span-8 overflow-hidden rounded-2xl border border-zinc-800/80 bg-zinc-900/30 p-4 sm:p-8 backdrop-blur-sm">
            <SeatMap
              seats={seats}
              selectedSeatIds={selectedSeatIds}
              onToggleSeat={handleToggleSeat}
              basePrice={showtime.price}
              format={showtime.format}
            />
          </div>

          {/* Right: Booking Summary & Checkout Drawer */}
          <div className="lg:col-span-4 space-y-4">
            <div className="sticky top-20 rounded-2xl border border-zinc-800/80 bg-zinc-900/60 p-5 backdrop-blur-xl shadow-xl space-y-5">
              <div className="border-b border-zinc-800/80 pb-3">
                <h3 className="font-bold text-sm text-white font-mono uppercase tracking-wider">
                  Reservation Summary
                </h3>
                <p className="text-[11px] text-zinc-500 mt-0.5">
                  Review selected seats before confirming
                </p>
              </div>

              {/* Error Banner */}
              {error && (
                <div className="flex items-start gap-2 rounded-xl border border-red-500/40 bg-red-950/40 p-3 text-xs text-red-300">
                  <AlertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Selected Seats List */}
              <div>
                <span className="text-[11px] uppercase font-mono tracking-wider text-zinc-400">
                  Selected Seats ({selectedSeatIds.length})
                </span>
                <div className="mt-2 min-h-[44px] rounded-xl border border-zinc-800 bg-zinc-950/70 p-3">
                  {selectedSeatIds.length === 0 ? (
                    <span className="text-xs text-zinc-600 italic">
                      Click any available seat on the hall map above
                    </span>
                  ) : (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedSeats.map((s) => (
                        <span
                          key={s.id}
                          className="rounded-md border border-red-500/40 bg-red-950/60 px-2 py-0.5 font-mono text-xs font-bold text-red-300"
                        >
                          {s.row}{s.number}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Price Calculation Breakdown */}
              <div className="space-y-2 border-t border-zinc-800/80 pt-4 text-xs">
                <div className="flex justify-between text-zinc-400">
                  <span>Tickets ({selectedSeatIds.length} × ${showtime.price.toFixed(2)})</span>
                  <span className="font-mono text-zinc-200">${subtotal.toFixed(2)}</span>
                </div>
                {selectedSeatIds.length > 0 && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Digital Concierge Fee</span>
                    <span className="font-mono text-zinc-200">${bookingFee.toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between border-t border-zinc-800/80 pt-3 font-bold text-sm">
                  <span className="text-white">Total Amount</span>
                  <span className="font-mono text-base text-red-400 font-black">
                    ${totalAmount.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Authentication Status / Guest notice */}
              {!user && (
                <div className="rounded-xl border border-zinc-800 bg-zinc-950 p-3 space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-zinc-300 font-semibold">
                    <User className="h-3.5 w-3.5 text-zinc-400" />
                    <span>Account Required</span>
                  </div>
                  <p className="text-[11px] text-zinc-400">
                    Sign in or create an account to reserve seats and generate your digital pass.
                  </p>
                </div>
              )}

              {/* Checkout Button */}
              <button
                type="button"
                disabled={selectedSeatIds.length === 0 || bookingLoading}
                onClick={handleCheckout}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-red-600 py-3 text-xs sm:text-sm font-bold text-white shadow-lg shadow-red-600/30 hover:bg-red-700 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {bookingLoading ? (
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                ) : (
                  <>
                    <CreditCard className="h-4 w-4" />
                    <span>
                      {user
                        ? `Confirm & Pay $${totalAmount.toFixed(2)}`
                        : "Sign In to Complete Booking"}
                    </span>
                  </>
                )}
              </button>

              <p className="text-center text-[10px] text-zinc-600 font-mono">
                Instant confirmation • Free cancellation up to showtime
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
