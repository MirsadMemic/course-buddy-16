import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { CourseCard, type Course } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/my-courses")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Moji kursevi — CourseTrack" },
      { name: "description", content: "Kursevi na koje ste prijavljeni i opcija odjave sa kursa." },
      { property: "og:title", content: "Moji kursevi — CourseTrack" },
      { property: "og:description", content: "Kursevi na koje ste prijavljeni." },
    ],
  }),
  component: () => (
    <ProtectedRoute>
      <MyCoursesPage />
    </ProtectedRoute>
  ),
});

type EnrollmentRow = { id: string; completed_at: string | null; courses: Course | null };

function MyCoursesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["my-enrollments", user?.id],
    queryFn: async (): Promise<EnrollmentRow[]> => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("id, completed_at, courses(id, title, description, instructor, duration)")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as unknown as EnrollmentRow[];
    },
  });

  const unenroll = useMutation({
    mutationFn: async (enrollmentId: string) => {
      const { error } = await supabase.from("enrollments").delete().eq("id", enrollmentId);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Odjavljeni ste sa kursa.");
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error: Error) => toast.error("Greška pri odjavi: " + error.message),
  });

  const toggleComplete = useMutation({
    mutationFn: async ({ id, completed }: { id: string; completed: boolean }) => {
      const { error } = await supabase
        .from("enrollments")
        .update({ completed_at: completed ? new Date().toISOString() : null })
        .eq("id", id);
      if (error) throw error;
      return completed;
    },
    onSuccess: (completed) => {
      toast.success(completed ? "Kurs je označen kao završen." : "Oznaka završetka je uklonjena.");
      queryClient.invalidateQueries({ queryKey: ["my-enrollments"] });
    },
    onError: (error: Error) => toast.error("Greška: " + error.message),
  });


  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Moji kursevi</h1>
      <p className="mt-2 text-muted-foreground">Pregled kurseva na koje ste se prijavili.</p>

      {query.isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : query.isError ? (
        <p className="mt-8 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          Došlo je do greške pri učitavanju vaših kurseva.
        </p>
      ) : query.data!.length === 0 ? (
        <div className="mt-8 rounded-xl border border-dashed border-border p-10 text-center">
          <p className="text-muted-foreground">Trenutno niste prijavljeni ni na jedan kurs.</p>
          <Button asChild className="mt-4">
            <Link to="/courses">Pogledaj kurseve</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {query.data!.map((row) =>
            row.courses ? (
              <CourseCard
                key={row.id}
                course={row.courses}
                action={
                  <div className="flex w-full flex-col gap-2">
                    {row.completed_at ? (
                      <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                        <CheckCircle2 className="size-4" /> Kurs završen
                      </p>
                    ) : null}
                    <Button
                      className="w-full"
                      variant={row.completed_at ? "secondary" : "default"}
                      disabled={toggleComplete.isPending}
                      onClick={() =>
                        toggleComplete.mutate({ id: row.id, completed: !row.completed_at })
                      }
                    >
                      {row.completed_at ? "Poništi završetak" : "Označi kao završen"}
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      disabled={unenroll.isPending}
                      onClick={() => unenroll.mutate(row.id)}
                    >
                      Odjavi se sa kursa
                    </Button>
                  </div>
                }

              />
            ) : null,
          )}
        </div>
      )}
    </div>
  );
}
