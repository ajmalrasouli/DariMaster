import { pgTable, text, serial, integer, boolean, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const words = pgTable("words", {
  id: serial("id").primaryKey(),
  dariWord: text("dari_word").notNull(),
  englishTranslation: text("english_translation").notNull(),
  pronunciation: text("pronunciation").notNull(),
  exampleSentence: text("example_sentence").notNull()
});

export const wordGroups = pgTable("word_groups", {
  id: serial("id").primaryKey(),
  name: text("name").notNull()
});

// Add words_to_groups table for many-to-many relationship
export const wordsToGroups = pgTable("words_to_groups", {
  id: serial("id").primaryKey(),
  wordId: integer("word_id").references(() => words.id).notNull(),
  groupId: integer("group_id").references(() => wordGroups.id).notNull()
});

export const studySessions = pgTable("study_sessions", {
  id: serial("id").primaryKey(),
  groupId: integer("group_id").references(() => wordGroups.id),
  createdAt: timestamp("created_at").defaultNow()
});

export const studyActivities = pgTable("study_activities", {
  id: serial("id").primaryKey(),
  studySessionId: integer("study_session_id").references(() => studySessions.id),
  groupId: integer("group_id").references(() => wordGroups.id),
  createdAt: timestamp("created_at").defaultNow()
});

export const wordReviewItems = pgTable("word_review_items", {
  id: serial("id").primaryKey(),
  wordId: integer("word_id").references(() => words.id),
  studySessionId: integer("study_session_id").references(() => studySessions.id),
  correct: boolean("correct").notNull(),
  createdAt: timestamp("created_at").defaultNow()
});

export const insertWordSchema = createInsertSchema(words).pick({
  dariWord: true,
  englishTranslation: true,
  pronunciation: true,
  exampleSentence: true
});

export const insertWordGroupSchema = createInsertSchema(wordGroups).pick({
  name: true
});

export const insertWordsToGroupsSchema = createInsertSchema(wordsToGroups).pick({
  wordId: true,
  groupId: true
});

export const insertStudySessionSchema = createInsertSchema(studySessions).pick({
  groupId: true
});

export const insertWordReviewSchema = createInsertSchema(wordReviewItems).pick({
  wordId: true,
  studySessionId: true,
  correct: true
});

export type InsertWord = z.infer<typeof insertWordSchema>;
export type InsertWordGroup = z.infer<typeof insertWordGroupSchema>;
export type InsertWordsToGroups = z.infer<typeof insertWordsToGroupsSchema>;
export type InsertStudySession = z.infer<typeof insertStudySessionSchema>;
export type InsertWordReview = z.infer<typeof insertWordReviewSchema>;

export type Word = typeof words.$inferSelect;
export type WordGroup = typeof wordGroups.$inferSelect;
export type WordsToGroups = typeof wordsToGroups.$inferSelect;
export type StudySession = typeof studySessions.$inferSelect;
export type StudyActivity = typeof studyActivities.$inferSelect;
export type WordReviewItem = typeof wordReviewItems.$inferSelect;