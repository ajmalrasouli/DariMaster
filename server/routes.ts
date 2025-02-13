import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWordSchema, insertWordGroupSchema, insertStudySessionSchema, insertWordReviewSchema } from "@shared/schema";

export function registerRoutes(app: Express): Server {
  // Words
  app.get("/api/words", async (_req, res) => {
    const words = await storage.getWords();
    res.json(words);
  });

  app.get("/api/words/:id", async (req, res) => {
    const word = await storage.getWord(parseInt(req.params.id));
    if (!word) return res.status(404).json({ message: "Word not found" });
    res.json(word);
  });

  app.post("/api/words", async (req, res) => {
    const parsed = insertWordSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const word = await storage.createWord(parsed.data);
    res.json(word);
  });

  // Groups
  app.get("/api/groups", async (_req, res) => {
    const groups = await storage.getGroups();
    res.json(groups);
  });

  app.get("/api/groups/:id", async (req, res) => {
    const group = await storage.getGroup(parseInt(req.params.id));
    if (!group) return res.status(404).json({ message: "Group not found" });
    res.json(group);
  });

  app.post("/api/groups", async (req, res) => {
    const parsed = insertWordGroupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const group = await storage.createGroup(parsed.data);
    res.json(group);
  });

  // Study Sessions
  app.get("/api/study_sessions", async (_req, res) => {
    const sessions = await storage.getStudySessions();
    res.json(sessions);
  });

  app.get("/api/study_sessions/:id", async (req, res) => {
    const session = await storage.getStudySession(parseInt(req.params.id));
    if (!session) return res.status(404).json({ message: "Session not found" });
    res.json(session);
  });

  app.post("/api/study_sessions", async (req, res) => {
    const parsed = insertStudySessionSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const session = await storage.createStudySession(parsed.data);
    res.json(session);
  });

  // Word Reviews
  app.post("/api/study_sessions/:id/words/:wordId/review", async (req, res) => {
    const parsed = insertWordReviewSchema.safeParse({
      ...req.body,
      wordId: parseInt(req.params.wordId),
      studySessionId: parseInt(req.params.id)
    });
    if (!parsed.success) return res.status(400).json(parsed.error);
    const review = await storage.createWordReview(parsed.data);
    res.json(review);
  });

  app.get("/api/study_sessions/:id/words", async (req, res) => {
    const reviews = await storage.getWordReviews(parseInt(req.params.id));
    res.json(reviews);
  });

  // Stats
  app.get("/api/words/:id/stats", async (req, res) => {
    const stats = await storage.getWordStats(parseInt(req.params.id));
    res.json(stats);
  });

  // Add new dashboard routes
  app.get("/api/dashboard/last_study_session", async (_req, res) => {
    const sessions = await storage.getStudySessions();
    if (sessions.length === 0) {
      return res.json(null);
    }

    const lastSession = sessions[sessions.length - 1];
    const group = await storage.getGroup(lastSession.groupId!);
    const reviews = await storage.getWordReviews(lastSession.id);

    res.json({
      groupName: group?.name,
      date: lastSession.createdAt,
      correct: reviews.filter(r => r.correct).length,
      total: reviews.length
    });
  });

  app.get("/api/dashboard/study_progress", async (_req, res) => {
    const words = await storage.getWords();
    const reviews = await Promise.all(
      words.map(word => storage.getWordStats(word.id))
    );

    const totalWords = words.length;
    const totalStudied = reviews.filter(stats =>
      stats.correct + stats.incorrect > 0
    ).length;

    const totalReviews = reviews.reduce(
      (sum, stats) => sum + stats.correct + stats.incorrect,
      0
    );
    const correctReviews = reviews.reduce(
      (sum, stats) => sum + stats.correct,
      0
    );

    const mastery = totalReviews > 0
      ? Math.round((correctReviews / totalReviews) * 100)
      : 0;

    res.json({
      totalWords,
      totalStudied,
      mastery
    });
  });

  app.get("/api/dashboard/quick-stats", async (_req, res) => {
    const sessions = await storage.getStudySessions();
    const groups = await storage.getGroups();

    // Calculate success rate across all reviews
    let totalCorrect = 0;
    let totalReviews = 0;

    for (const session of sessions) {
      const reviews = await storage.getWordReviews(session.id);
      totalCorrect += reviews.filter(r => r.correct).length;
      totalReviews += reviews.length;
    }

    const successRate = totalReviews > 0
      ? Math.round((totalCorrect / totalReviews) * 100)
      : 0;

    // Calculate study streak (consecutive days with sessions)
    const sessionDates = sessions
      .map(s => new Date(s.createdAt!).toDateString())
      .sort()
      .filter((date, i, arr) => arr.indexOf(date) === i);

    let streak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 86400000).toDateString();

    if (sessionDates.includes(today) || sessionDates.includes(yesterday)) {
      streak = 1;
      let checkDate = new Date(Date.now() - 86400000);

      while (sessionDates.includes(checkDate.toDateString())) {
        streak++;
        checkDate = new Date(checkDate.getTime() - 86400000);
      }
    }

    res.json({
      successRate,
      totalSessions: sessions.length,
      activeGroups: groups.length,
      streak
    });
  });

  // Reset
  app.post("/api/reset_history", async (_req, res) => {
    await storage.resetHistory();
    res.json({ message: "History reset successfully" });
  });

  app.post("/api/full_reset", async (_req, res) => {
    await storage.resetAll();
    res.json({ message: "Full reset completed successfully" });
  });

  const httpServer = createServer(app);
  return httpServer;
}