"use client";

import Link from "next/link";
import { Zap, Heart, Github, Twitter } from "lucide-react";

const footerLinks = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
      { label: "Focus Room", href: "/focus-room" },
      { label: "AI Assistant", href: "/ai-assistant" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    title: "Community",
    links: [
      { label: "Study Groups", href: "/social" },
      { label: "Leaderboards", href: "/gamification" },
      { label: "Blog", href: "#" },
      { label: "Discord", href: "#" },
      { label: "Events", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press Kit", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Documentation", href: "#" },
      { label: "API Reference", href: "#" },
      { label: "Status", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="relative border-t border-primary-500/10 bg-surface-950">
      <div className="absolute inset-0 grid-bg opacity-10" />
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 group mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-500 rounded-lg flex items-center justify-center shadow-lg">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold text-surface-100">
                Study<span className="gradient-text">Sprint</span>
              </span>
            </Link>
            <p className="text-sm text-surface-500 mb-6 max-w-xs leading-relaxed">
              The next-generation AI-powered gamified study ecosystem. Study smarter, achieve faster.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800/50 flex items-center justify-center text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800/50 flex items-center justify-center text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-lg bg-surface-800/50 flex items-center justify-center text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-all"
              >
                <Heart className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Link columns */}
          {footerLinks.map((column) => (
            <div key={column.title}>
              <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-4">
                {column.title}
              </h4>
              <ul className="space-y-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-500 hover:text-surface-300 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-surface-800/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-surface-600">
            &copy; {new Date().getFullYear()} StudySprint. All rights reserved.
          </p>
          <p className="text-xs text-surface-600 flex items-center gap-1">
            Built with <Heart className="w-3 h-3 text-rose-400" /> for students everywhere
          </p>
        </div>
      </div>
    </footer>
  );
}
