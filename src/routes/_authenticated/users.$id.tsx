import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Mail } from "lucide-react";

import { supabase } from "@/lib/supabase";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CourseCard, type Course } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/_authenticated/users/$id")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Detalji korisnika — CourseTrack" },
      { name: "description", content: "Podaci o polazniku i kursevi koje pohađa." },
      { property: "og:title", content: "Detalji korisnika — CourseTrack" },
      { property: "og:description", content: "Podaci o polazniku i kursevi koje pohađa." },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <UserDetailsPage />
    </ProtectedRoute>
  ),
});

function UserDetailsPage() {
  const { id } = Route.useParams();

  const profileQuery = useQuery({
    queryKey: ["profile", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("id, full_name, email")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const coursesQuery = useQuery({
    queryKey: ["user-courses", id],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("courses(id, title, description, instructor, duration)")
        .eq("user_id", id);
      if (error) throw error;
      return ((data ?? []) as unknown as { courses: Course | null }[])
        .map((row) => row.courses)
        .filter((course): course is Course => !!course);
    },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <Button asChild variant="ghost" size="sm" className="mb-6">
        <Link to="/users">
          <ArrowLeft className="size-4" /> Nazad na korisnike
        </Link>
      </Button>

      {profileQuery.isLoading ? (
        <Skeleton className="h-24 w-full rounded-xl" />
      ) : !profileQuery.data ? (
        <p className="rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          Korisnik nije pronađen.
        </p>
      ) : (
        <>
          <h1 className="text-3xl font-semibold tracking-tight">
            {profileQuery.data.full_name || "Bez imena"}
          </h1>
          <p className="mt-2 inline-flex items-center gap-2 text-muted-foreground">
            <Mail className="size-4" /> {profileQuery.data.email}
          </p>

          <h2 className="mt-10 text-xl font-semibold">Izabrani kursevi</h2>
          {coursesQuery.isLoading ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-56 w-full rounded-xl" />
              ))}
            </div>
          ) : coursesQuery.data && coursesQuery.data.length > 0 ? (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {coursesQuery.data.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          ) : (
            <p className="mt-4 rounded-xl border border-dashed border-border p-8 text-center text-muted-foreground">
              Korisnik trenutno nije prijavljen ni na jedan kurs.
            </p>
          )}
        </>
      )}
    </div>
  );
}
