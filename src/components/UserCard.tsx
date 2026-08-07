import { Link } from "@tanstack/react-router";
import { Mail } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export type Profile = {
  id: string;
  full_name: string;
  email: string;
};

function initials(name: string, email: string) {
  const source = name.trim() || email;
  return source
    .split(/[\s@.]+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

export function UserCard({ profile }: { profile: Profile }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4">
        <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-secondary-foreground">
          {initials(profile.full_name, profile.email)}
        </span>
        <div className="min-w-0">
          <Link
            to="/users/$id"
            params={{ id: profile.id }}
            className="block truncate font-medium text-primary underline-offset-4 hover:underline"
          >
            {profile.full_name || "Bez imena"}
          </Link>
          <span className="mt-1 flex items-center gap-1.5 truncate text-sm text-muted-foreground">
            <Mail className="size-3.5 shrink-0" /> {profile.email}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
