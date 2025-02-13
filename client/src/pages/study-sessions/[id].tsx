import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StudySession, WordReviewItem, Word } from "@shared/schema";

export default function StudySessionShow() {
  const { id } = useParams();

  const { data: session, isLoading } = useQuery<StudySession>({
    queryKey: [`/api/study_sessions/${id}`],
  });

  const { data: reviews } = useQuery<(WordReviewItem & { word: Word })[]>({
    queryKey: [`/api/study_sessions/${id}/words`],
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-6 w-full" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!session) return <div>Session not found</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Study Session {session.id}</h1>

      <Card>
        <CardHeader>
          <CardTitle>Session Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <div className="text-sm text-muted-foreground">Date</div>
            <div className="text-lg">
              {new Date(session.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <div className="text-sm text-muted-foreground">Group ID</div>
            <div className="text-lg">{session.groupId}</div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Word Reviews</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-right">Dari Word</TableHead>
                <TableHead>English Translation</TableHead>
                <TableHead className="text-right">Result</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reviews?.map((review) => (
                <TableRow key={review.id}>
                  <TableCell className="text-right font-medium">
                    {review.word.dariWord}
                  </TableCell>
                  <TableCell>{review.word.englishTranslation}</TableCell>
                  <TableCell className="text-right">
                    <span
                      className={
                        review.correct ? "text-green-600" : "text-red-600"
                      }
                    >
                      {review.correct ? "Correct" : "Incorrect"}
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
