import { Link, useNavigate } from "@tanstack/react-router";
import { GraduationCap, LogOut, Menu } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const linkClass =
  "rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground";

export function Navbar() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  async function handleSignOut() {
    await signOut();
    toast.success("Uspešno ste se odjavili.");
    navigate({ to: "/login" });
  }

  const items = user
    ? [
        { to: "/", label: "Home" },
        { to: "/courses", label: "Kursevi" },
        { to: "/my-courses", label: "Moji kursevi" },
        { to: "/users", label: "Korisnici" },
      ]
    : [];

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-card/85 backdrop-blur">
      <nav className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link to="/" className="flex items-center gap-2 font-semibold tracking-tight">
          <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <GraduationCap className="size-5" />
          </span>
          <span className="text-lg">CourseTrack</span>
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <Link
              key={item.to}
              to={item.to}
              activeOptions={{ exact: item.to === "/" }}
              activeProps={{ className: "bg-accent text-accent-foreground" }}
              className={linkClass}
            >
              {item.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          {user ? (
            <>
              <span className="max-w-[180px] truncate text-sm text-muted-foreground">
                {profile?.full_name || user.email}
              </span>
              <Button variant="outline" size="sm" onClick={handleSignOut}>
                <LogOut className="size-4" /> Logout
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" size="sm">
                <Link to="/login">Login</Link>
              </Button>
              <Button asChild size="sm">
                <Link to="/register">Register</Link>
              </Button>
            </>
          )}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Meni"
          onClick={() => setOpen((v) => !v)}
        >
          <Menu className="size-5" />
        </Button>
      </nav>

      <div className={cn("border-t border-border/70 px-4 py-3 md:hidden", open ? "block" : "hidden")}>
        <div className="flex flex-col gap-1">
          {items.map((item) => (
            <Link key={item.to} to={item.to} className={linkClass} onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
          {user ? (
            <Button variant="outline" size="sm" className="mt-2" onClick={handleSignOut}>
              <LogOut className="size-4" /> Logout
            </Button>
          ) : (
            <div className="mt-2 flex gap-2">
              <Button asChild variant="outline" size="sm" className="flex-1">
                <Link to="/login" onClick={() => setOpen(false)}>
                  Login
                </Link>
              </Button>
              <Button asChild size="sm" className="flex-1">
                <Link to="/register" onClick={() => setOpen(false)}>
                  Register
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
