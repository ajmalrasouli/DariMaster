import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  BookOpen,
  CheckCircle,
  Clock,
  Users,
  ArrowRight
} from "lucide-react";

interface LastStudySession {
  groupName: string;
  date: string;
  correct: number;
  total: number;
}

interface StudyProgress {
  totalWords: number;
  totalStudied: number;
  mastery: number;
}

interface QuickStats {
  successRate: number;
  totalSessions: number;
  activeGroups: number;
  streak: number;
}

export default function Dashboard() {
  const { data: lastSession } = useQuery<LastStudySession>({
    queryKey: ["/api/dashboard/last_study_session"]
  });

  const { data: progress } = useQuery<StudyProgress>({
    queryKey: ["/api/dashboard/study_progress"]
  });

  const { data: stats } = useQuery<QuickStats>({
    queryKey: ["/api/dashboard/quick-stats"]
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Link href="/study-sessions/create">
          <Button>
            Start Studying
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Success Rate</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.successRate ?? 0}%</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.totalSessions ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Groups</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.activeGroups ?? 0}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Study Streak</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.streak ?? 0} days</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={progress?.mastery ?? 0} className="mb-2" />
            <div className="text-sm text-muted-foreground">
              {progress?.totalStudied ?? 0} of {progress?.totalWords ?? 0} words studied
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Last Study Session</CardTitle>
          </CardHeader>
          <CardContent>
            {lastSession ? (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Group:</span>
                  <span className="font-medium">{lastSession.groupName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Score:</span>
                  <span className="font-medium">
                    {lastSession.correct}/{lastSession.total} correct
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">When:</span>
                  <span className="font-medium">
                    {new Date(lastSession.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center text-muted-foreground">
                No study sessions yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}