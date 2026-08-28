"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Booking } from "@/types";
import { getBookingsByReference, cancelBookingReference } from "@/lib/api";
import { TicketPass } from "@/components/booking";
import confetti from "canvas-confetti";
import { CheckCircle2, Ticket, Home, ArrowLeft } from "lucide-react";

export default function BookingConfirmationPage() {
  const params = useParams();
  const router = useRouter();
  const reference = params.reference as string;

  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadConfirmation() {
      if (!reference) return;
      try {
        const data = await getBookingsByReference(reference);
        setBookings(data);

        // Fire subtle celebration confetti
        try {
          confetti({
            particleCount: 50,
            spread: 60,
            origin: { y: 0.6 },
            colors: ["#e50914", "#ffffff", "#f59e0b"],
          });
        } catch {
          // ignore confetti on headless/unsupported
        }
      } catch (err: any) {
        console.error("Failed to load booking confirmation:", err);
        setError(err.message || "Failed to load booking confirmation");
      } finally {
        setLoading(false);
      }
    }
    loadConfirmation();
  }, [reference]);

  const handleCancelBooking = async (ref: string) => {
    setCancelling(true);
    try {
      const updated = await cancelBookingReference(ref);
      setBookings(updated);
    } catch (err: any) {
      alert(err.message || "Failed to cancel reservation");
    } finally {
      setCancelling(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
          <span className="font-mono text-xs text-zinc-500">Generating Digital Mobile Pass...</span>
        </div>
      </div>
    );
  }

  if (error || bookings.length === 0) {
    return (
      <div className="min-h-screen bg-zinc-950 flex flex-col items-center justify-center p-4 text-center">
        <h2 className="text-xl font-bold text-zinc-200">Ticket Not Found</h2>
        <p className="mt-2 text-xs text-zinc-500">
          We could not locate booking reference "{reference}".
        </p>
        <Link
          href="/"
          className="mt-4 rounded-lg bg-zinc-800 px-4 py-2 text-xs font-semibold text-white"
        >
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center space-y-6">
        {/* Success Icon & Header */}
        <div className="space-y-2">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-emerald-500/30 bg-emerald-950/40 text-emerald-400">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white font-mono">
            Reservation Confirmed!
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 max-w-md mx-auto">
            Your seats have been booked. Show your digital mobile QR code at the cinema turnstile.
          </p>
        </div>

        {/* Digital Ticket Pass Component */}
        <div className="pt-2 text-left">
          <TicketPass
            bookings={bookings}
            onCancel={handleCancelBooking}
            isCancelling={cancelling}
          />
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            href="/my-bookings"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Ticket className="h-4 w-4 text-red-500" />
            <span>Go to My Tickets</span>
          </Link>
          <Link
            href="/"
            className="flex items-center gap-1.5 rounded-xl border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-xs font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
          >
            <Home className="h-4 w-4 text-zinc-400" />
            <span>Back to Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
