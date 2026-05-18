"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Menu, Bell } from "lucide-react";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "@/lib/firebase";
interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const displayName = user?.displayName || user?.email || "Profile";
  const initials = (user?.displayName || user?.email || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="sticky top-0 z-30 h-16 bg-[#131313] border-b border-[#41493e] flex items-center justify-between px-4 lg:px-6">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-md text-[#c0c9bb] hover:bg-[#1c1b1b] hover:text-[#91d78a]"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3 ml-auto">
        <button className="relative p-2 rounded-full text-[#c0c9bb] hover:bg-[#1c1b1b] hover:text-[#91d78a]">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-[#91d78a]"></span>
        </button>
        <Link
          href="/dashboard/profile"
          className="flex items-center gap-2 rounded-full px-1.5 py-1 hover:bg-[#1c1b1b] transition-colors"
        >
          <div className="h-8 w-8 rounded-full bg-[#1b5e20] flex items-center justify-center text-[#e5e2e1] text-sm font-medium">
            {initials}
          </div>
          <span className="text-sm font-medium text-[#c0c9bb] hidden sm:inline-block">
            {displayName}
          </span>
        </Link>
      </div>
    </header>
  );
}