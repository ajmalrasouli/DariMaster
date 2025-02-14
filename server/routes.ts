import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertWordSchema, insertWordGroupSchema, insertStudySessionSchema, insertWordReviewSchema, insertWordsToGroupsSchema } from "@shared/schema";
import { db } from "./db";

export function registerRoutes(app: Express): Server {
  // Words
  app.get("/api/words", (_req, res) => {
    try {
      const words = db.prepare(`
        SELECT 
          w.*,
          COALESCE(r.correct_count, 0) as correct,
          COALESCE(r.incorrect_count, 0) as wrong
        FROM words w
        LEFT JOIN (
          SELECT 
            word_id,
            SUM(CASE WHEN correct = 1 THEN 1 ELSE 0 END) as correct_count,
            SUM(CASE WHEN correct = 0 THEN 1 ELSE 0 END) as incorrect_count
          FROM word_review_items
          GROUP BY word_id
        ) r ON w.id = r.word_id
      `).all();
      
      res.json(words);
    } catch (error) {
      console.error('Error fetching words:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get("/api/words/:id", (req, res) => {
    try {
      const word = db.prepare('SELECT * FROM words WHERE id = ?').get(req.params.id);
      if (!word) {
        return res.status(404).json({ error: 'Word not found' });
      }
      res.json(word);
    } catch (error) {
      console.error('Error fetching word:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/words", (req, res) => {
    try {
      const { dariWord, englishTranslation, pronunciation, exampleSentence } = req.body;
      const result = db.prepare(`
        INSERT INTO words (dari_word, english_translation, pronunciation, example_sentence)
        VALUES (?, ?, ?, ?)
      `).run(dariWord, englishTranslation, pronunciation, exampleSentence);
      
      res.status(201).json({
        id: result.lastInsertRowid,
        dariWord,
        englishTranslation,
        pronunciation,
        exampleSentence
      });
    } catch (error) {
      console.error('Error creating word:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  // Groups
  app.get("/api/groups", (_req, res) => {
    try {
      const groups = db.prepare(`
        SELECT 
          wg.*,
          COUNT(wtg.word_id) as word_count
        FROM word_groups wg
        LEFT JOIN words_to_groups wtg ON wg.id = wtg.group_id
        GROUP BY wg.id
      `).all();
      res.json(groups);
    } catch (error) {
      console.error('Error fetching groups:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.get("/api/groups/:id", (req, res) => {
    try {
      const group = db.prepare('SELECT * FROM word_groups WHERE id = ?').get(req.params.id);
      if (!group) {
        return res.status(404).json({ error: 'Group not found' });
      }
      res.json(group);
    } catch (error) {
      console.error('Error fetching group:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/groups", async (req, res) => {
    const parsed = insertWordGroupSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json(parsed.error);
    const group = await storage.createGroup(parsed.data);
    res.json(group);
  });

  // Words in Groups
  app.get("/api/groups/:id/words", (req, res) => {
    try {
      const words = db.prepare(`
        SELECT w.* 
        FROM words w
        JOIN words_to_groups wtg ON w.id = wtg.word_id
        WHERE wtg.group_id = ?
      `).all(req.params.id);
      res.json(words);
    } catch (error) {
      console.error('Error fetching group words:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });

  app.post("/api/groups/:groupId/words/:wordId", async (req, res) => {
    const parsed = insertWordsToGroupsSchema.safeParse({
      group_id: parseInt(req.params.groupId),
      word_id: parseInt(req.params.wordId)
    });
    if (!parsed.success) return res.status(400).json(parsed.error);
    const relation = await storage.addWordToGroup(parsed.data);
    res.json(relation);
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
    console.log('Received study session request:', req.body);
    
    // Transform groupId to group_id
    const requestData = {
      group_id: req.body.groupId ? Number(req.body.groupId) : null
    };
    
    const parsed = insertStudySessionSchema.safeParse(requestData);
    if (!parsed.success) {
      console.log('Validation error:', parsed.error);
      return res.status(400).json(parsed.error);
    }
    
    try {
      const session = await storage.createStudySession(parsed.data);
      res.json(session);
    } catch (error) {
      console.error('Error creating study session:', error);
      res.status(500).json({ message: 'Failed to create study session' });
    }
  });

  // Study Session Words
  app.get("/api/study_sessions/:id/words", async (req, res) => {
    const sessionId = parseInt(req.params.id);
    const session = await storage.getStudySession(sessionId);
    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const groupWords = await storage.getGroupWords(session.group_id!);
    const reviews = await storage.getWordReviews(sessionId);

    const wordsWithReviews = groupWords.map(word => {
      const review = reviews.find(r => r.word_id === word.id);
      return {
        ...word,
        review: review || null
      };
    });

    res.json(wordsWithReviews);
  });

  // Word Reviews
  app.post("/api/study_sessions/:id/words/:wordId/review", async (req, res) => {
    const parsed = insertWordReviewSchema.safeParse({
      ...req.body,
      word_id: parseInt(req.params.wordId),
      study_session_id: parseInt(req.params.id)
    });
    if (!parsed.success) return res.status(400).json(parsed.error);
    const review = await storage.createWordReview(parsed.data);
    res.json(review);
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
    const group = await storage.getGroup(lastSession.group_id!);
    const reviews = await storage.getWordReviews(lastSession.id);

    res.json({
      groupName: group?.name,
      date: lastSession.created_at,
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
      .map(s => new Date(s.created_at!).toDateString())
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

  // Add this new route
  app.get("/api/groups/:id/study_sessions", async (req, res) => {
    const groupId = parseInt(req.params.id);
    const sessions = await storage.getStudySessions();
    const groupSessions = sessions.filter(s => s.group_id === groupId);
    res.json(groupSessions);
  });

  const httpServer = createServer(app);
  return httpServer;
}