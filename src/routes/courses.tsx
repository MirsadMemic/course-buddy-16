import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { useAuth } from "@/hooks/useAuth";
import { CourseCard, type Course } from "@/components/CourseCard";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export const Route = createFileRoute("/courses")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Dostupni kursevi — CourseTrack" },
      { name: "description", content: "Pregled svih dostupnih kurseva i prijava na kurs." },
      { property: "og:title", content: "Dostupni kursevi — CourseTrack" },
      { property: "og:description", content: "Pregled svih dostupnih kurseva i prijava na kurs." },
    ],
  }),
  component: CoursesPage,
});

function CoursesPage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const coursesQuery = useQuery({
    queryKey: ["courses"],
    queryFn: async (): Promise<Course[]> => {
      const { data, error } = await supabase
        .from("courses")
        .select("id, title, description, instructor, duration")
        .order("title");
      if (error) throw error;
      return data ?? [];
    },
  });

  const enrollmentsQuery = useQuery({
    queryKey: ["enrollments", user?.id],
    enabled: !!user,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from("enrollments")
        .select("course_id")
        .eq("user_id", user!.id);
      if (error) throw error;
      return (data ?? []).map((row) => row.course_id);
    },
  });

  const enroll = useMutation({
    mutationFn: async (courseId: string) => {
      const { error } = await supabase
        .from("enrollments")
        .insert({ user_id: user!.id, course_id: courseId });
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Uspešno ste se prijavili na kurs.");
      queryClient.invalidateQueries({ queryKey: ["enrollments"] });
    },
    onError: (error: Error) => toast.error("Greška pri prijavi: " + error.message),
  });

  const enrolled = new Set(enrollmentsQuery.data ?? []);

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Dostupni kursevi</h1>
      <p className="mt-2 text-muted-foreground">
        Izaberite kurs koji želite da pohađate i prijavite se jednim klikom.
      </p>

      {coursesQuery.isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <Skeleton key={i} className="h-56 w-full rounded-xl" />
          ))}
        </div>
      ) : coursesQuery.isError ? (
        <p className="mt-8 rounded-md bg-destructive/10 p-4 text-sm text-destructive">
          Došlo je do greške pri učitavanju kurseva.
        </p>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {coursesQuery.data!.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              action={
                !user ? (
                  <p className="text-sm text-muted-foreground">Prijavite se da biste upisali kurs.</p>
                ) : enrolled.has(course.id) ? (
                  <p className="inline-flex items-center gap-2 text-sm font-medium text-primary">
                    <CheckCircle2 className="size-4" /> Već ste prijavljeni
                  </p>
                ) : (
                  <Button
                    className="w-full"
                    disabled={enroll.isPending}
                    onClick={() => enroll.mutate(course.id)}
                  >
                    {enroll.isPending && enroll.variables === course.id ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : null}
                    Prijavi se na kurs
                  </Button>
                )
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
