import { Link } from "@tanstack/react-router";
import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";

export function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Loader2 className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="mx-auto max-w-md py-20 text-center">
        <h2 className="text-2xl font-semibold">Potrebna je prijava</h2>
        <p className="mt-2 text-muted-foreground">
          Prijavite se da biste pristupili ovoj stranici.
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <Button asChild>
            <Link to="/login">Prijava</Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/register">Registracija</Link>
          </Button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
