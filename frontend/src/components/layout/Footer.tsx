import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full border-t border-zinc-800/80 bg-zinc-950 text-zinc-400">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-2">
            <Link href="/" className="flex items-center group">
              <Image
                src="/logo.png"
                alt="REEL Cinema Logo"
                width={150}
                height={38}
                className="h-9 w-auto object-contain transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="max-w-md text-xs leading-relaxed text-zinc-500">
              The premier cinematic experience. Book seats in Laser IMAX,
              Dolby Cinema, and Luxury VIP Suites with real-time seat reservation
              and instant digital mobile passes.
            </p>
            <div className="flex flex-wrap gap-2 pt-1">
              {["Laser IMAX 70mm", "Dolby Atmos", "4DX Motion", "VIP Lounges"].map(
                (fmt) => (
                  <span
                    key={fmt}
                    className="rounded border border-zinc-800 bg-zinc-900/60 px-2 py-0.5 text-[10px] font-mono text-zinc-400"
                  >
                    {fmt}
                  </span>
                )
              )}
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Explore
            </h4>
            <ul className="mt-3 space-y-2 text-xs">
              <li>
                <Link href="/" className="hover:text-white transition-colors">
                  Now Showing
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="hover:text-white transition-colors"
                >
                  All Movies & Catalog
                </Link>
              </li>
              <li>
                <Link
                  href="/my-bookings"
                  className="hover:text-white transition-colors"
                >
                  My Digital Tickets
                </Link>
              </li>
              <li>
                <Link
                  href="/admin"
                  className="hover:text-red-400 transition-colors"
                >
                  Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Locations & Support */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-200">
              Cinemas
            </h4>
            <ul className="mt-3 space-y-2 text-xs text-zinc-500">
              <li>Grand Horizon IMAX – New York</li>
              <li>Dolby Cinema West – Los Angeles</li>
              <li>VIP Lounge & Suites – Chicago</li>
              <li className="pt-2 text-[11px] text-zinc-600">
                24/7 Digital Concierge Support
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between border-t border-zinc-800/80 pt-6 sm:flex-row text-xs text-zinc-600">
          <p>© {new Date().getFullYear()} REEL Cinema Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 font-mono text-[11px]">
            Dark Cinematic Minimal Reservation
          </p>
        </div>
      </div>
    </footer>
  );
}
