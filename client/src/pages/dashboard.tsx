import React from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
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
    <div className="container mx-auto py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <Link href="/study">
          <Button>Start Studying</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Success Rate</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.successRate || 0}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.totalSessions || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Groups</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.activeGroups || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Study Streak</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">{stats?.streak || 0} days</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>Study Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <p className="text-sm text-gray-500">Words Studied</p>
                <p className="text-lg font-bold">
                  {progress?.totalStudied || 0} / {progress?.totalWords || 0}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Mastery Level</p>
                <p className="text-lg font-bold">{progress?.mastery || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
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