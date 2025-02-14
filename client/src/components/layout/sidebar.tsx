import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  Settings,
  List,
  Layers
} from "lucide-react";

export function Sidebar() {
  return (
    <nav className="flex flex-col gap-2 p-4 border-r min-h-screen w-64">
      <Button variant="ghost" className="justify-start" asChild>
        <Link href="/">
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Dashboard
        </Link>
      </Button>

      <Button variant="ghost" className="justify-start" asChild>
        <Link href="/vocabulary">
          <BookOpen className="mr-2 h-4 w-4" />
          Vocabulary List
        </Link>
      </Button>

      <Button variant="ghost" className="justify-start" asChild>
        <Link href="/groups">
          <Layers className="mr-2 h-4 w-4" />
          Word Groups
        </Link>
      </Button>

      <Button variant="ghost" className="justify-start" asChild>
        <Link href="/study">
          <GraduationCap className="mr-2 h-4 w-4" />
          Study
        </Link>
      </Button>

      <Button variant="ghost" className="justify-start" asChild>
        <Link href="/settings">
          <Settings className="mr-2 h-4 w-4" />
          Settings
        </Link>
      </Button>
    </nav>
  );
}
