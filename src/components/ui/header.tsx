"use client";
import { Code2, LogIn, LogOut, Menu, UserPlus, X } from "lucide-react";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "./button";
import { signOut, useSession } from "next-auth/react";
import { useRouter, usePathname } from "next/navigation";
import { useToast } from "./use-toast";

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();
  const { data: session, status } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = status === "authenticated";
  const isLoading = status === "loading";

  if (isLoading) return null;

  const handleLogout = async () => {
    toast({
      title: "👋 Logout Successful!",
      description: "You've been logged out. See you soon! 👌",
      duration: 2000,
    });

    setTimeout(() => {
      signOut({ callbackUrl: "/login" });
    }, 2000);
  };

  const isAdminDashboard = pathname === "/ruler/dashboard";

  return (
    <header className="px-4 lg:px-6 h-14 flex items-center justify-between bg-white shadow-md">
      {/* Logo */}
      <Link className="flex items-center" href="/">
        <Code2 className="h-6 w-6" />
        <span className="ml-2 text-lg font-bold">DevJourney</span>
      </Link>

      {/* Mobile Menu Button (Hamburger) */}
      <div className="flex-1 flex justify-center md:hidden">
        <button onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-6">
        {!isAdminDashboard && (
          <>
            <NavLink href="/problems">Problems</NavLink>
            <NavLink href="/learn">Learn</NavLink>
            <NavLink href="/compete">Compete</NavLink>
            <NavLink href="/challenge">Challenge</NavLink>
            <NavLink href="/jobs">Jobs</NavLink>
          </>
        )}
      </nav>

      {/* Dashboard & Auth Buttons (Right Side on Desktop) */}
      <div className="flex items-center gap-4">
        {isLoggedIn && (
          <NavLink href="/dashboard" className="hidden md:block">
            Dashboard
          </NavLink>
        )}
        {isLoggedIn ? (
          <Button variant="ghost" onClick={handleLogout}>
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        ) : (
          <>
            <Button variant="ghost" onClick={() => router.push("/login")}>
              <LogIn className="h-4 w-4 mr-2" />
              Login
            </Button>
            <Button variant="ghost" onClick={() => router.push("/register")}>
              <UserPlus className="h-4 w-4 mr-2" />
              Register
            </Button>
          </>
        )}
      </div>

      {/* Mobile Dropdown Menu (Includes Dashboard Now) */}
      {menuOpen && (
        <div className="absolute top-16 left-0 w-full bg-white shadow-lg md:hidden">
          <div className="flex flex-col items-center gap-4 py-4">
            {!isAdminDashboard && (
              <>
                <NavLink href="/problems" onClick={() => setMenuOpen(false)}>Problems</NavLink>
                <NavLink href="/learn" onClick={() => setMenuOpen(false)}>Learn</NavLink>
                <NavLink href="/compete" onClick={() => setMenuOpen(false)}>Compete</NavLink>
                <NavLink href="/challenge" onClick={() => setMenuOpen(false)}>Challenge</NavLink>
                <NavLink href="/jobs" onClick={() => setMenuOpen(false)}>Jobs</NavLink>
              </>
            )}
            {isLoggedIn && <NavLink href="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</NavLink>}
          </div>
        </div>
      )}
    </header>
  );
}

const NavLink = ({ href, children, onClick, className = "" }) => (
  <Link
    href={href}
    className={`text-sm font-medium hover:underline underline-offset-4 ${className}`}
    onClick={onClick}
  >
    {children}
  </Link>
);
