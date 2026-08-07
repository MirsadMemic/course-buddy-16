import { BookOpen, Clock, User2 } from "lucide-react";
import type { ReactNode } from "react";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

export type Course = {
  id: string;
  title: string;
  description: string;
  instructor: string;
  duration: string;
};

export function CourseCard({ course, action }: { course: Course; action?: ReactNode }) {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <span className="flex size-10 items-center justify-center rounded-xl bg-secondary text-secondary-foreground">
          <BookOpen className="size-5" />
        </span>
        <CardTitle className="mt-3 text-lg">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="text-sm leading-relaxed text-muted-foreground">{course.description}</p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <User2 className="size-4" /> {course.instructor}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4" /> {course.duration}
          </span>
        </div>
      </CardContent>
      {action ? <CardFooter>{action}</CardFooter> : null}
    </Card>
  );
}
