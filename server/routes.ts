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
