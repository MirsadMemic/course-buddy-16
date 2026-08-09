import { createFileRoute, Link } from "@tanstack/react-router";
import { BookOpen, GraduationCap, ListChecks, Users } from "lucide-react";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export const Route = createFileRoute("/_authenticated/")({
  head: () => ({
    meta: [
      { title: "CourseTrack — Evidencija kurseva i polaznika" },
      {
        name: "description",
        content:
          "CourseTrack je jednostavna aplikacija za evidenciju kurseva i polaznika: prijavite se, izaberite kurseve i pratite polaznike.",
      },
      { property: "og:title", content: "CourseTrack — Evidencija kurseva i polaznika" },
      {
        property: "og:description",
        content: "Prijavite se, izaberite kurseve i pratite polaznike na jednom mestu.",
      },
    ],
  }),
  component: Home,
});

const tiles = [
  { to: "/courses", title: "Kursevi", text: "Pregledaj sve dostupne kurseve i prijavi se.", icon: BookOpen },
  { to: "/my-courses", title: "Moji kursevi", text: "Kursevi na koje si prijavljen.", icon: ListChecks },
  { to: "/users", title: "Korisnici", text: "Svi registrovani polaznici i njihovi kursevi.", icon: Users },
] as const;

function Home() {
  const { user, profile } = useAuth();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <section className="rounded-3xl border border-border bg-card p-8 shadow-sm sm:p-12">
        <span className="inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1 text-xs font-medium text-secondary-foreground">
          <GraduationCap className="size-3.5" /> MVP studentski projekat
        </span>
        <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-4xl">
          {user ? `Dobrodošli, ${profile?.full_name || user.email}` : "CourseTrack"}
        </h1>
        <p className="mt-3 max-w-2xl text-muted-foreground">
          Evidencija kurseva i polaznika. Registrujte se, pregledajte dostupne kurseve, prijavite se
          na one koji vas zanimaju i pratite ko sve pohađa koji kurs.
        </p>
        {!user && (
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/register">Registruj se</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/login">Prijava</Link>
            </Button>
          </div>
        )}
      </section>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tiles.map((tile) => (
          <Link key={tile.to} to={tile.to} className="group">
            <Card className="h-full transition-colors group-hover:border-primary/50">
              <CardHeader>
                <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
                  <tile.icon className="size-5" />
                </span>
                <CardTitle className="mt-3">{tile.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{tile.text}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
