import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";

import { supabase } from "@/lib/supabase";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserCard, type Profile } from "@/components/UserCard";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/users/")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Korisnici — CourseTrack" },
      { name: "description", content: "Spisak svih registrovanih polaznika u aplikaciji." },
      { property: "og:title", content: "Korisnici — CourseTrack" },
      { property: "og:description", content: "Spisak svih registrovanih polaznika." },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <UsersPage />
    </ProtectedRoute>
  ),
});

function UsersPage() {
  const query = useQuery({
    queryKey: ["profiles"],
    queryFn: async (): Promise<Profile[]> => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .order("full_name");
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Registrovani korisnici</h1>
      <p className="mt-2 text-muted-foreground">
        Kliknite na ime korisnika da vidite kurseve koje pohađa.
      </p>

      {query.isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-24 w-full rounded-xl" />
          ))}
        </div>
      ) : query.isError ? (
        <p className="mt-8 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          Došlo je do greške pri učitavanju korisnika.
        </p>
      ) : query.data!.length === 0 ? (
        <p className="mt-8 text-muted-foreground">Još uvek nema registrovanih korisnika.</p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {query.data!.map((profile) => (
            <UserCard key={profile.id} profile={profile} />
          ))}
        </div>
      )}
    </div>
  );
}
