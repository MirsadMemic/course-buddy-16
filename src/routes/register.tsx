import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";

import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/register")({
  ssr: false,
  head: () => ({
    meta: [
      { title: "Registracija — CourseTrack" },
      { name: "description", content: "Napravite CourseTrack nalog i prijavite se na kurseve." },
      { property: "og:title", content: "Registracija — CourseTrack" },
      { property: "og:description", content: "Napravite nalog i prijavite se na kurseve." },
    ],
  }),
  component: RegisterPage,
});

function RegisterPage() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setError(null);
    setInfo(null);

    if (fullName.trim().length < 3) {
      setError("Unesite ime i prezime (najmanje 3 karaktera).");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setError("Unesite ispravnu email adresu.");
      return;
    }
    if (password.length < 6) {
      setError("Lozinka mora imati najmanje 6 karaktera.");
      return;
    }
    if (password !== confirm) {
      setError("Lozinke se ne poklapaju.");
      return;
    }

    setLoading(true);
    const { data, error: signUpError } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        emailRedirectTo: window.location.origin,
        data: { full_name: fullName.trim() },
      },
    });
    setLoading(false);

    if (signUpError) {
      setError("Registracija nije uspela: " + signUpError.message);
      return;
    }

    if (data.session) {
      toast.success("Nalog je kreiran. Dobrodošli!");
      navigate({ to: "/courses" });
      return;
    }

    setInfo("Nalog je kreiran. Proverite email i potvrdite adresu da biste se prijavili.");
    toast.success("Registracija uspešna.");
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Registracija</CardTitle>
          <CardDescription>Kreirajte nalog da biste se prijavljivali na kurseve.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="fullName">Ime i prezime</Label>
              <Input
                id="fullName"
                value={fullName}
                maxLength={100}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Petar Petrović"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                maxLength={255}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="pera@primer.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Lozinka</Label>
              <Input
                id="password"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm">Potvrda lozinke</Label>
              <Input
                id="confirm"
                type="password"
                autoComplete="new-password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
              />
            </div>

            {error && (
              <p role="alert" className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                {error}
              </p>
            )}
            {info && (
              <p className="rounded-md bg-secondary p-3 text-sm text-secondary-foreground">{info}</p>
            )}

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? "Kreiranje naloga..." : "Registruj se"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-muted-foreground">
            Već imate nalog?{" "}
            <Link to="/login" className="font-medium text-primary underline-offset-4 hover:underline">
              Prijavite se
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
