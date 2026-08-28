"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Booking } from "@/types";
import { getMyBookings, cancelBookingReference } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { TicketPass } from "@/components/booking";
import {
  Ticket,
  Calendar,
  Clock,
  MapPin,
  XCircle,
  QrCode,
  User,
  Sparkles,
  ChevronRight,
  AlertCircle,
} from "lucide-react";

export default function MyBookingsPage() {
  const { user, openAuthModal } = useAuth();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"upcoming" | "cancelled">("upcoming");
  const [cancellingRef, setCancellingRef] = useState<string | null>(null);

  useEffect(() => {
    async function loadBookings() {
      if (!user) {
        setLoading(false);
        return;
      }
      try {
        const data = await getMyBookings();
        setBookings(data);
      } catch (err) {
        console.error("Failed to load user bookings:", err);
      } finally {
        setLoading(false);
      }
    }
    loadBookings();
  }, [user]);

  const handleCancel = async (reference: string) => {
    setCancellingRef(reference);
    try {
      await cancelBookingReference(reference);
      const updated = await getMyBookings();
      setBookings(updated);
    } catch (err: any) {
      alert(err.message || "Cancellation failed");
    } finally {
      setCancellingRef(null);
    }
  };

  if (!user && !loading) {
    return (
      <div className="min-h-screen bg-zinc-950 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-md rounded-2xl border border-zinc-800 bg-zinc-900/40 p-8 text-center space-y-4">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-950 text-red-400 border border-red-800">
            <Ticket className="h-6 w-6" />
          </div>
          <h2 className="text-xl font-bold text-white font-mono">Sign In Required</h2>
          <p className="text-xs text-zinc-400">
            Please sign in to access your digital mobile passes and booking history.
          </p>
          <div className="pt-2">
            <button
              onClick={openAuthModal}
              className="w-full rounded-xl bg-red-600 py-2.5 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm"
            >
              Sign In to REEL
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Group bookings by reference
  const groupedByRef: { [ref: string]: Booking[] } = {};
  bookings.forEach((b) => {
    if (!groupedByRef[b.booking_reference]) {
      groupedByRef[b.booking_reference] = [];
    }
    groupedByRef[b.booking_reference].push(b);
  });

  const orders = Object.values(groupedByRef);
  const upcomingOrders = orders.filter((order) => order[0]?.status === "confirmed");
  const cancelledOrders = orders.filter((order) => order[0]?.status === "cancelled");
  const displayedOrders = activeTab === "upcoming" ? upcomingOrders : cancelledOrders;

  return (
    <div className="min-h-screen bg-zinc-950 px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl space-y-8">
        {/* Profile / Page Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-zinc-800/80 pb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-zinc-400">
                Customer Portal
              </span>
            </div>
            <h1 className="mt-1 text-2xl sm:text-3xl font-bold tracking-tight text-white font-mono">
              My Digital Passes
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              Logged in as <strong className="text-zinc-200">{user?.name}</strong> ({user?.email})
            </p>
          </div>

          <Link
            href="/movies"
            className="flex items-center gap-1.5 rounded-xl bg-red-600 px-4 py-2 text-xs font-bold text-white hover:bg-red-700 transition-colors shadow-sm self-start sm:self-auto"
          >
            <Ticket className="h-3.5 w-3.5" />
            <span>Book More Movies</span>
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex rounded-xl bg-zinc-900 p-1 border border-zinc-800 max-w-sm">
          <button
            onClick={() => setActiveTab("upcoming")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === "upcoming"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Active Passes ({upcomingOrders.length})
          </button>
          <button
            onClick={() => setActiveTab("cancelled")}
            className={`flex-1 rounded-lg py-2 text-xs font-semibold transition-all ${
              activeTab === "cancelled"
                ? "bg-zinc-800 text-white shadow-sm"
                : "text-zinc-400 hover:text-zinc-200"
            }`}
          >
            Cancelled ({cancelledOrders.length})
          </button>
        </div>

        {/* List of Orders */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-red-600 border-t-transparent" />
            <span className="mt-3 font-mono text-xs text-zinc-500">Loading Passes...</span>
          </div>
        ) : displayedOrders.length === 0 ? (
          <div className="rounded-2xl border border-zinc-800/80 bg-zinc-900/20 p-12 text-center">
            <Ticket className="mx-auto h-8 w-8 text-zinc-600 mb-2" />
            <p className="text-sm font-semibold text-zinc-300">
              No {activeTab} passes found.
            </p>
            {activeTab === "upcoming" && (
              <Link
                href="/movies"
                className="mt-4 inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline"
              >
                Browse Now Showing Movies <ChevronRight className="h-3 w-3" />
              </Link>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {displayedOrders.map((order) => (
              <TicketPass
                key={order[0].booking_reference}
                bookings={order}
                onCancel={handleCancel}
                isCancelling={cancellingRef === order[0].booking_reference}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
