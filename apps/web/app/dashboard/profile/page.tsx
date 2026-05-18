"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { onAuthStateChanged, type User } from "firebase/auth";

import { auth } from "@/lib/firebase";

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (!currentUser) {
        router.replace("/login");
        return;
      }
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [router]);

  const providerNames = useMemo(() => {
    if (!user?.providerData?.length) {
      return "email/password";
    }
    const names = user.providerData
      .map((provider) => provider.providerId)
      .filter(Boolean);
    return names.length ? names.join(", ") : "email/password";
  }, [user]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#131313] text-[#e5e2e1] flex items-center justify-center">
        <p className="text-sm text-[#c0c9bb]">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const initials = (user.displayName || user.email || "User")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const fullName = user.displayName || "-";
  const username = user.email ? user.email.split("@")[0] : "-";

  return (
    <div className="min-h-screen bg-[#131313] text-[#e5e2e1] p-6 md:p-10">
      <div className="max-w-3xl mx-auto">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold">Profile</h1>
          <p className="text-sm text-[#8a9386]">
            Your Firebase account details.
          </p>
        </header>

        <div className="rounded-2xl border border-[#41493e] bg-[#1c1b1b] p-6">
          <div className="flex items-center gap-4 mb-6">
            {user.photoURL ? (
              <img
                src={user.photoURL}
                alt="Profile"
                className="h-14 w-14 rounded-full object-cover border border-[#41493e]"
              />
            ) : (
              <div className="h-14 w-14 rounded-full bg-[#1b5e20] text-[#e5e2e1] flex items-center justify-center text-lg font-semibold">
                {initials}
              </div>
            )}
            <div>
              <p className="text-lg font-semibold">
                {user.displayName || "Farmer"}
              </p>
              <p className="text-sm text-[#c0c9bb]">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="rounded-xl border border-[#2a2a2a] bg-[#201f1f] p-4">
              <p className="text-xs text-[#8a9386] uppercase tracking-widest">Full Name</p>
              <p className="mt-2 text-[#e5e2e1]">{fullName}</p>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#201f1f] p-4">
              <p className="text-xs text-[#8a9386] uppercase tracking-widest">Username</p>
              <p className="mt-2 text-[#e5e2e1]">{username}</p>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#201f1f] p-4">
              <p className="text-xs text-[#8a9386] uppercase tracking-widest">User ID</p>
              <p className="mt-2 break-all text-[#e5e2e1]">{user.uid}</p>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#201f1f] p-4">
              <p className="text-xs text-[#8a9386] uppercase tracking-widest">Provider</p>
              <p className="mt-2 text-[#e5e2e1]">{providerNames}</p>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#201f1f] p-4">
              <p className="text-xs text-[#8a9386] uppercase tracking-widest">Email Verified</p>
              <p className="mt-2 text-[#e5e2e1]">
                {user.emailVerified ? "Verified" : "Not verified"}
              </p>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#201f1f] p-4">
              <p className="text-xs text-[#8a9386] uppercase tracking-widest">Last Sign In</p>
              <p className="mt-2 text-[#e5e2e1]">
                {user.metadata.lastSignInTime || "-"}
              </p>
            </div>
            <div className="rounded-xl border border-[#2a2a2a] bg-[#201f1f] p-4">
              <p className="text-xs text-[#8a9386] uppercase tracking-widest">Created At</p>
              <p className="mt-2 text-[#e5e2e1]">
                {user.metadata.creationTime || "-"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
